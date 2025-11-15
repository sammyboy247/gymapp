import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  runTransaction,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, PublicUserData, FriendRequest, Friendship, FriendRequestWithRecipientData } from '@/types';

const usersCollection = collection(db, 'users');
const friendRequestsCollection = collection(db, 'friendRequests');
const friendshipsCollection = collection(db, 'friendships');

// Search for a user by their exact friendId
export const searchByFriendId = async (friendId: string): Promise<PublicUserData | null> => {
  const q = query(usersCollection, where('friendId', '==', friendId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data() as UserProfile;

  return {
    userId: userDoc.id,
    displayName: userData.displayName,
    friendId: userData.friendId,
  };
};

// Send a friend request
export const sendFriendRequest = async (fromUserId: string, toUserId: string) => {
  const batch = writeBatch(db);

  const fromUserRef = doc(usersCollection, fromUserId);
  batch.update(fromUserRef, { friendRequestsSent: arrayUnion(toUserId) });

  const toUserRef = doc(usersCollection, toUserId);
  batch.update(toUserRef, { friendRequestsReceived: arrayUnion(fromUserId) });

  const newRequestRef = doc(friendRequestsCollection);
  batch.set(newRequestRef, {
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  await batch.commit();
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string, fromUserId: string, toUserId: string) => {
  await runTransaction(db, async (transaction) => {
    const requestRef = doc(friendRequestsCollection, requestId);
    const fromUserRef = doc(usersCollection, fromUserId);
    const toUserRef = doc(usersCollection, toUserId);

    transaction.update(requestRef, { status: 'accepted', respondedAt: serverTimestamp() });

    transaction.update(fromUserRef, {
      friendRequestsSent: arrayRemove(toUserId),
      friends: arrayUnion(toUserId),
    });

    transaction.update(toUserRef, {
      friendRequestsReceived: arrayRemove(fromUserId),
      friends: arrayUnion(fromUserId),
    });

    const newFriendshipRef = doc(friendshipsCollection);
    transaction.set(newFriendshipRef, {
      user1Id: fromUserId,
      user2Id: toUserId,
      createdAt: serverTimestamp(),
      user1ShareActivity: false,
      user2ShareActivity: false,
    });
  });
};

// Deny a friend request
export const denyFriendRequest = async (requestId: string, fromUserId: string, toUserId: string) => {
  const batch = writeBatch(db);

  const requestRef = doc(friendRequestsCollection, requestId);
  batch.update(requestRef, { status: 'denied', respondedAt: serverTimestamp() });

  const fromUserRef = doc(usersCollection, fromUserId);
  batch.update(fromUserRef, { friendRequestsSent: arrayRemove(toUserId) });

  const toUserRef = doc(usersCollection, toUserId);
  batch.update(toUserRef, { friendRequestsReceived: arrayRemove(fromUserId) });

  await batch.commit();
};

// Cancel a sent friend request
export const cancelFriendRequest = async (requestId: string, fromUserId: string, toUserId: string) => {
  const batch = writeBatch(db);

  const requestRef = doc(friendRequestsCollection, requestId);
  batch.delete(requestRef);

  const fromUserRef = doc(usersCollection, fromUserId);
  batch.update(fromUserRef, { friendRequestsSent: arrayRemove(toUserId) });

  const toUserRef = doc(usersCollection, toUserId);
  batch.update(toUserRef, { friendRequestsReceived: arrayRemove(fromUserId) });

  await batch.commit();
};

// Remove a friend
export const removeFriend = async (userId: string, friendId: string) => {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(usersCollection, userId);
    const friendRef = doc(usersCollection, friendId);

    transaction.update(userRef, { friends: arrayRemove(friendId) });
    transaction.update(friendRef, { friends: arrayRemove(userId) });

    const friendshipQuery = query(
      friendshipsCollection,
      where('user1Id', 'in', [userId, friendId]),
      where('user2Id', 'in', [userId, friendId])
    );
    const friendshipSnapshot = await getDocs(friendshipQuery);
    friendshipSnapshot.forEach((doc) => {
      transaction.delete(doc.ref);
    });
  });
};

// Get user's friends with their public data
export const getUserFriends = async (userId: string): Promise<PublicUserData[]> => {
  const userRef = doc(usersCollection, userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserProfile;

  if (!userData.friends || userData.friends.length === 0) {
    return [];
  }

  const friendsQuery = query(usersCollection, where('__name__', 'in', userData.friends));
  const friendsSnapshot = await getDocs(friendsQuery);

  return friendsSnapshot.docs.map((doc) => {
    const friendData = doc.data() as UserProfile;
    return {
      userId: doc.id,
      displayName: friendData.displayName,
      friendId: friendData.friendId,
    };
  });
};

// Get pending friend requests
export const getPendingRequests = async (
  userId: string
): Promise<{
  sent: FriendRequestWithRecipientData[];
  received: FriendRequestWithRecipientData[];
}> => {
  const sentQuery = query(
    friendRequestsCollection,
    where('fromUserId', '==', userId),
    where('status', '==', 'pending')
  );
  const receivedQuery = query(
    friendRequestsCollection,
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );

  const [sentSnapshot, receivedSnapshot] = await Promise.all([
    getDocs(sentQuery),
    getDocs(receivedQuery),
  ]);

  const sent = await Promise.all(
    sentSnapshot.docs.map(async (docSnapshot) => {
      const request = { id: docSnapshot.id, ...docSnapshot.data() } as FriendRequest;
      const recipientDoc = await getDoc(doc(usersCollection, request.toUserId));
      const recipientData = recipientDoc.data() as UserProfile;
      return {
        ...request,
        recipientData: {
          userId: recipientDoc.id,
          displayName: recipientData.displayName,
          friendId: recipientData.friendId,
        },
      };
    })
  );

  const received = await Promise.all(
    receivedSnapshot.docs.map(async (docSnapshot) => {
      const request = { id: docSnapshot.id, ...docSnapshot.data() } as FriendRequest;
      const senderDoc = await getDoc(doc(usersCollection, request.fromUserId));
      const senderData = senderDoc.data() as UserProfile;
      return {
        ...request,
        recipientData: {
          userId: senderDoc.id,
          displayName: senderData.displayName,
          friendId: senderData.friendId,
        },
      };
    })
  );

  return { sent, received };
};

// Update activity sharing status
export const updateActivitySharing = async (userId: string, friendId: string, share: boolean) => {
  const friendshipQuery = query(
    friendshipsCollection,
    where('user1Id', 'in', [userId, friendId]),
    where('user2Id', 'in', [userId, friendId])
  );
  const friendshipSnapshot = await getDocs(friendshipQuery);
  const friendshipDoc = friendshipSnapshot.docs[0];

  if (friendshipDoc) {
    const friendshipData = friendshipDoc.data() as Friendship;
    const updateField = friendshipData.user1Id === userId ? 'user1ShareActivity' : 'user2ShareActivity';

    const batch = writeBatch(db);
    batch.update(friendshipDoc.ref, { [updateField]: share });
    await batch.commit();
  }
};

// Get friends who are sharing their activity
export const getFriendsWithActivitySharing = async (userId: string): Promise<string[]> => {
  const userRef = doc(usersCollection, userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as UserProfile;

  if (!userData.friends || userData.friends.length === 0) {
    return [];
  }

  const friendshipsQuery1 = query(friendshipsCollection, where('user1Id', '==', userId), where('user2ShareActivity', '==', true));
  const friendshipsQuery2 = query(friendshipsCollection, where('user2Id', '==', userId), where('user1ShareActivity', '==', true));

  const [snapshot1, snapshot2] = await Promise.all([
    getDocs(friendshipsQuery1),
    getDocs(friendshipsQuery2),
  ]);

  const friendIds = new Set<string>();
  snapshot1.forEach((doc) => friendIds.add((doc.data() as Friendship).user2Id));
  snapshot2.forEach((doc) => friendIds.add((doc.data() as Friendship).user1Id));

  return Array.from(friendIds);
};
