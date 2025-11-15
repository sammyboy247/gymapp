import React, { useEffect, useState } from 'react';
import { getUserFriends, removeFriend, updateActivitySharing } from '@/services/firebase/friendService';
import { useAuthStore } from '@/store/authStore';
import type { PublicUserData } from '@/types';

interface FriendListProps {
  friendsUpdated: boolean;
}

export const FriendList: React.FC<FriendListProps> = ({ friendsUpdated }) => {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState<PublicUserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    if (!user) return;
    setLoading(true);
    const userFriends = await getUserFriends(user.uid);
    setFriends(userFriends);
    setLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, [user, friendsUpdated]);

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    await removeFriend(user.uid, friendId);
    fetchFriends();
  };

  const handleShareActivityToggle = async (friendId: string, share: boolean) => {
    if (!user) return;
    await updateActivitySharing(user.uid, friendId, share);
    // We can add a visual cue for this, but for now, it's a silent update.
  };

  if (loading) {
    return <p>Loading friends...</p>;
  }

  return (
    <div>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.userId} className="flex justify-between items-center p-2 border-b">
              <div>
                <p className="font-semibold">{friend.displayName}</p>
                <p className="text-sm text-gray-500">{friend.friendId}</p>
              </div>
              <div className="flex items-center">
                <label className="mr-2">
                  <input
                    type="checkbox"
                    onChange={(e) => handleShareActivityToggle(friend.userId, e.target.checked)}
                    className="mr-1"
                  />
                  Share Activity
                </label>
                <button onClick={() => handleRemoveFriend(friend.userId)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no friends yet. Add some!</p>
      )}
    </div>
  );
};
