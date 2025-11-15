import React, { useState } from 'react';
import { searchByFriendId, sendFriendRequest } from '@/services/firebase/friendService';
import type { PublicUserData } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface FriendSearchProps {
  onFriendRequestSent: () => void;
}

export const FriendSearch: React.FC<FriendSearchProps> = ({ onFriendRequestSent }) => {
  const [friendId, setFriendId] = useState('');
  const [searchResult, setSearchResult] = useState<PublicUserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useAuthStore();

  const handleSearch = async () => {
    if (!friendId.trim()) {
      setError('Please enter a Friend ID.');
      return;
    }
    setError(null);
    setSearchResult(null);

    try {
      const result = await searchByFriendId(friendId.trim());
      if (result) {
        setSearchResult(result);
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('An error occurred while searching.');
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult || !user) return;

    setIsRequesting(true);
    try {
      await sendFriendRequest(user.uid, searchResult.userId);
      setSearchResult(null);
      setFriendId('');
      onFriendRequestSent();
    } catch (err) {
      setError('Failed to send friend request.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          placeholder="Enter Friend ID"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {searchResult && (
        <div className="mt-4 p-4 border rounded-md flex justify-between items-center">
          <div>
            <p className="font-semibold">{searchResult.displayName}</p>
            <p className="text-sm text-gray-500">{searchResult.friendId}</p>
          </div>
          <button
            onClick={handleSendRequest}
            disabled={isRequesting}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            {isRequesting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      )}
    </div>
  );
};
