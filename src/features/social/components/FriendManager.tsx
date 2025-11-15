import React, { useState } from 'react';
import { FriendSearch } from './FriendSearch';
import { FriendList } from './FriendList';
import { FriendRequests } from './FriendRequests';
import { useAuthStore } from '@/store/authStore';

export const FriendManager: React.FC = () => {
  const { userProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('friends');
  const [friendsUpdated, setFriendsUpdated] = useState(false);
  const [requestsUpdated, setRequestsUpdated] = useState(false);

  const handleFriendRequestSent = () => {
    setRequestsUpdated((prev) => !prev);
  };

  const handleRequestsUpdated = () => {
    setFriendsUpdated((prev) => !prev);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
      <p className="mb-4">
        Your Friend ID:{' '}
        <span className="font-mono bg-gray-200 px-2 py-1 rounded">{userProfile?.friendId}</span>
      </p>

      <div className="mb-4">
        <FriendSearch onFriendRequestSent={handleFriendRequestSent} />
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('friends')}
            className={`${
              activeTab === 'friends'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Requests
          </button>
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'friends' && <FriendList friendsUpdated={friendsUpdated} />}
        {activeTab === 'requests' && (
          <FriendRequests onRequestsUpdated={handleRequestsUpdated} requestsUpdated={requestsUpdated} />
        )}
      </div>
    </div>
  );
};