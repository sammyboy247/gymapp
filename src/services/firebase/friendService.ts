import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  runTransaction,
  Timestamp,
  or,
} from 'firebase/firestore';
import { db } from '../firebase'; // Adjust this import to your firebase config
import type {
  PublicUserData,
  FriendRequest,
  Friendship,
  UserProfile,
} from '@/types';

const usersCollection = collection(db, 'users');
const friendRequestsCollection = collection(db, 'friendRequests');
const friendshipsCollection = collection(db, 'friendships');

// Search for a user by their exact Friend ID
export const searchByFriendId = async (
  friendId: string,
): Promise<PublicUserData | null> => {
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
export const sendFriendRequest = async (
  fromUserId: string,
  toUserId: string,
): Promise<void> => {
  if (fromUserId === toUserId) {
    throw new Error("You can't send a friend request to yourself.");
  }

  const batch = writeBatch(db);

  // 1. Create a new friend request document
  const friendRequestRef = doc(friendRequestsCollection);
  const newRequest: FriendRequest = {
    id: friendRequestRef.id,
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: Timestamp.now(),
  };
  batch.set(friendRequestRef, newRequest);

  // 2. Update the sender's profile
  const fromUserRef = doc(usersCollection, fromUserId);
  batch.update(fromUserRef, {
    friendRequestsSent: [
      ...(await getDoc(fromUserRef)
        .then(doc => doc.data()?.friendRequestsSent)
        .catch(() => [])),
      friendRequestRef.id,
    ],
  });

  // 3. Update the receiver's profile
  const toUserRef = doc(usersCollection, toUserId);
  batch.update(toUserRef, {
    friendRequestsReceived: [
      ...(await getDoc(toUserRef)
        .then(doc => doc.data()?.friendRequestsReceived)
        .catch(() => [])),
      friendRequestRef.id,
    ],
  });

  await batch.commit();
};

// Accept a friend request
export const acceptFriendRequest = async (
  requestId: string,
): Promise<void> => {
  const requestRef = doc(friendRequestsCollection, requestId);

  await runTransaction(db, async transaction => {
    const requestDoc = await transaction.get(requestRef);
    if (!requestDoc.exists()) {
      throw new Error('Friend request not found.');
    }

    const request = requestDoc.data() as FriendRequest;
    if (request.status !== 'pending') {
      throw new Error('This request has already been responded to.');
    }

    const { fromUserId, toUserId } = request;

    // 1. Update the friend request status
    transaction.update(requestRef, {
      status: 'accepted',
      respondedAt: Timestamp.now(),
    });

    // 2. Create a new friendship document
    const friendshipRef = doc(friendshipsCollection);
    const newFriendship: Friendship = {
      id: friendshipRef.id,
      user1Id: fromUserId,
      user2Id: toUserId,
      createdAt: Timestamp.now(),
      user1ShareActivity: true, // Default sharing to true
      user2ShareActivity: true,
    };
    transaction.set(friendshipRef, newFriendship);

    // 3. Add friend to both users' friend lists and remove requests
    const fromUserRef = doc(usersCollection, fromUserId);
    const toUserRef = doc(usersCollection, toUserId);

    const fromUserDoc = await transaction.get(fromUserRef);
    const toUserDoc = await transaction.get(toUserRef);

    if (!fromUserDoc.exists() || !toUserDoc.exists()) {
      throw new Error('One or both users not found.');
    }

    const fromUserData = fromUserDoc.data() as UserProfile;
    const toUserData = toUserDoc.data() as UserProfile;

    transaction.update(fromUserRef, {
      friends: [...fromUserData.friends, toUserId],
      friendRequestsSent: fromUserData.friendRequestsSent.filter(
        id => id !== requestId,
      ),
    });

    transaction.update(toUserRef, {
      friends: [...toUserData.friends, fromUserId],
      friendRequestsReceived: toUserData.friendRequestsReceived.filter(
        id => id !== requestId,
      ),
    });
  });
};

// Deny a friend request
export const denyFriendRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(friendRequestsCollection, requestId);
  const requestDoc = await getDoc(requestRef);

  if (!requestDoc.exists()) {
    throw new Error('Friend request not found.');
  }
  const { fromUserId, toUserId } = requestDoc.data() as FriendRequest;

  const batch = writeBatch(db);

  // 1. Update request status to 'denied'
  batch.update(requestRef, {
    status: 'denied',
    respondedAt: Timestamp.now(),
  });

  // 2. Remove request from both users' profiles
  const fromUserRef = doc(usersCollection, fromUserId);
  const toUserRef = doc(usersCollection, toUserId);
  const fromUserData = (await getDoc(fromUserRef)).data() as UserProfile;
  const toUserData = (await getDoc(toUserRef)).data() as UserProfile;

  batch.update(fromUserRef, {
    friendRequestsSent: fromUserData.friendRequestsSent.filter(
      id => id !== requestId,
    ),
  });
  batch.update(toUserRef, {
    friendRequestsReceived: toUserData.friendRequestsReceived.filter(
      id => id !== requestId,
    ),
  });

  await batch.commit();
};

// Cancel a sent friend request
export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  // This can be the same logic as denying, just initiated by the sender
  await denyFriendRequest(requestId);
};

// Remove a friend
export const removeFriend = async (
  currentUserId: string,
  friendUserId: string,
): Promise<void> => {
  await runTransaction(db, async transaction => {
    // 1. Find the friendship document
    const friendshipQuery = query(
      friendshipsCollection,
      or(
        where('user1Id', '==', currentUserId),
        where('user2Id', '==', currentUserId),
      ),
    );
    const friendshipSnapshot = await getDocs(friendshipQuery);
    const friendshipDoc = friendshipSnapshot.docs.find(
      doc =>
        (doc.data().user1Id === currentUserId &&
          doc.data().user2Id === friendUserId) ||
        (doc.data().user1Id === friendUserId &&
          doc.data().user2Id === currentUserId),
    );

    if (!friendshipDoc) {
      throw new Error('Friendship not found.');
    }

    // 2. Delete the friendship document
    transaction.delete(friendshipDoc.ref);

    // 3. Remove friend from each user's friend list
    const currentUserRef = doc(usersCollection, currentUserId);
    const friendUserRef = doc(usersCollection, friendUserId);

    const currentUserDoc = await transaction.get(currentUserRef);
    const friendUserDoc = await transaction.get(friendUserRef);

    if (!currentUserDoc.exists() || !friendUserDoc.exists()) {
      throw new Error('One or both users not found.');
    }

    const currentUserData = currentUserDoc.data() as UserProfile;
    const friendUserData = friendUserDoc.data() as UserProfile;

    transaction.update(currentUserRef, {
      friends: currentUserData.friends.filter(id => id !== friendUserId),
    });
    transaction.update(friendUserRef, {
      friends: friendUserData.friends.filter(id => id !== currentUserId),
    });
  });
};

// Get a user's friends with their public data
export const getUserFriends = async (
  userId: string,
): Promise<PublicUserData[]> => {
  const userRef = doc(usersCollection, userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data() as UserProfile;
  const friendIds = userData.friends;

  if (friendIds.length === 0) {
    return [];
  }

  const friendsQuery = query(usersCollection, where('__name__', 'in', friendIds));
  const friendsSnapshot = await getDocs(friendsQuery);

  return friendsSnapshot.docs.map(doc => {
    const friendData = doc.data() as UserProfile;
    return {
      userId: doc.id,
      displayName: friendData.displayName,
      friendId: friendData.friendId,
    };
  });
};

// Get pending friend requests (sent and received)
export const getPendingRequests = async (
  userId: string,
): Promise<{ sent: FriendRequest[]; received: FriendRequest[] }> => {
  const userRef = doc(usersCollection, userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return { sent: [], received: [] };
  }

  const userData = userDoc.data() as UserProfile;

  const sentRequests: FriendRequest[] = [];
  if (userData.friendRequestsSent.length > 0) {
    const sentQuery = query(
      friendRequestsCollection,
      where('__name__', 'in', userData.friendRequestsSent),
    );
    const sentSnapshot = await getDocs(sentQuery);
    sentSnapshot.forEach(doc => {
      sentRequests.push(doc.data() as FriendRequest);
    });
  }

  const receivedRequests: FriendRequest[] = [];
  if (userData.friendRequestsReceived.length > 0) {
    const receivedQuery = query(
      friendRequestsCollection,
      where('__name__', 'in', userData.friendRequestsReceived),
    );
    const receivedSnapshot = await getDocs(receivedQuery);
    receivedSnapshot.forEach(doc => {
      receivedRequests.push(doc.data() as FriendRequest);
    });
  }

  return { sent: sentRequests, received: receivedRequests };
};

// Update activity sharing status with a friend
export const updateActivitySharing = async (
  currentUserId: string,
  friendUserId: string,
  share: boolean,
): Promise<void> => {
  const friendshipQuery = query(
    friendshipsCollection,
    or(
      where('user1Id', '==', currentUserId),
      where('user2Id', '==', currentUserId),
    ),
  );
  const friendshipSnapshot = await getDocs(friendshipQuery);
  const friendshipDoc = friendshipSnapshot.docs.find(
    doc =>
      (doc.data().user1Id === currentUserId &&
        doc.data().user2Id === friendUserId) ||
      (doc.data().user1Id === friendUserId &&
        doc.data().user2Id === currentUserId),
  );

  if (!friendshipDoc) {
    throw new Error('Friendship not found.');
  }

  const friendship = friendshipDoc.data() as Friendship;
  const updateData: Partial<Friendship> =
    friendship.user1Id === currentUserId
      ? { user1ShareActivity: share }
      : { user2ShareActivity: share };

  await writeBatch(db).update(friendshipDoc.ref, updateData).commit();
};

// Get friends who are sharing their activity with the current user
export const getFriendsWithActivitySharing = async (
  userId: string,
): Promise<PublicUserData[]> => {
  const friendshipsQuery = query(
    friendshipsCollection,
    or(where('user1Id', '==', userId), where('user2Id', '==', userId)),
  );

  const friendshipsSnapshot = await getDocs(friendshipsQuery);
  const sharingFriendIds: string[] = [];

  friendshipsSnapshot.forEach(doc => {
    const fs = doc.data() as Friendship;
    if (fs.user1Id === userId && fs.user2ShareActivity) {
      sharingFriendIds.push(fs.user2Id);
    } else if (fs.user2Id === userId && fs.user1ShareActivity) {
      sharingFriendIds.push(fs.user1Id);
    }
  });

  if (sharingFriendIds.length === 0) {
    return [];
  }

  const friendsQuery = query(
    usersCollection,
    where('__name__', 'in', sharingFriendIds),
  );
  const friendsSnapshot = await getDocs(friendsQuery);

  return friendsSnapshot.docs.map(doc => {
    const friendData = doc.data() as UserProfile;
    return {
      userId: doc.id,
      displayName: friendData.displayName,
      friendId: friendData.friendId,
    };
  });
};