import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
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
  // Simply create the friend request document
  // No need to update user arrays - we query from friendRequests collection
  const newRequestRef = doc(friendRequestsCollection);
  await setDoc(newRequestRef, {
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string, fromUserId: string, toUserId: string) => {
  await runTransaction(db, async (transaction) => {
    const requestRef = doc(friendRequestsCollection, requestId);

    // Update request status to accepted
    transaction.update(requestRef, { status: 'accepted', respondedAt: serverTimestamp() });

    // Create friendship document
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
  // Simply update the request status to denied
  const requestRef = doc(friendRequestsCollection, requestId);
  await setDoc(requestRef, { status: 'denied', respondedAt: serverTimestamp() }, { merge: true });
};

// Cancel a sent friend request
export const cancelFriendRequest = async (requestId: string, fromUserId: string, toUserId: string) => {
  // Simply delete the friend request document
  const requestRef = doc(friendRequestsCollection, requestId);
  await deleteDoc(requestRef);
};

// Remove a friend
export const removeFriend = async (userId: string, friendId: string) => {
  // Find and delete the friendship document
  // Query for friendship where either user1Id or user2Id matches both users
  const q1 = query(
    friendshipsCollection,
    where('user1Id', '==', userId),
    where('user2Id', '==', friendId)
  );
  const q2 = query(
    friendshipsCollection,
    where('user1Id', '==', friendId),
    where('user2Id', '==', userId)
  );

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const friendshipDoc = snapshot1.docs[0] || snapshot2.docs[0];
  if (friendshipDoc) {
    await deleteDoc(friendshipDoc.ref);
  }
};

// Get user's friends with their public data
export const getUserFriends = async (userId: string): Promise<PublicUserData[]> => {
  // Query friendships where user is either user1 or user2
  const q1 = query(friendshipsCollection, where('user1Id', '==', userId));
  const q2 = query(friendshipsCollection, where('user2Id', '==', userId));

  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  // Combine both queries and extract friend IDs
  const friendIds: string[] = [];
  snapshot1.docs.forEach((doc) => {
    const friendship = doc.data() as Friendship;
    friendIds.push(friendship.user2Id);
  });
  snapshot2.docs.forEach((doc) => {
    const friendship = doc.data() as Friendship;
    friendIds.push(friendship.user1Id);
  });

  if (friendIds.length === 0) {
    return [];
  }

  // Fetch friend user documents
  const friendsQuery = query(usersCollection, where('__name__', 'in', friendIds));
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
