import React, { useEffect, useState } from 'react';
import { getPendingRequests, acceptFriendRequest, denyFriendRequest, cancelFriendRequest } from '@/services/firebase/friendService';
import { useAuthStore } from '@/store/authStore';
import type { FriendRequestWithRecipientData } from '@/types';

interface FriendRequestsProps {
  onRequestsUpdated: () => void;
  requestsUpdated: boolean;
}

export const FriendRequests: React.FC<FriendRequestsProps> = ({ onRequestsUpdated, requestsUpdated }) => {
  const { user } = useAuthStore();
  const [sentRequests, setSentRequests] = useState<FriendRequestWithRecipientData[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestWithRecipientData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    const { sent, received } = await getPendingRequests(user.uid);
    setSentRequests(sent);
    setReceivedRequests(received);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user, requestsUpdated]);

  const handleAccept = async (request: FriendRequestWithRecipientData) => {
    await acceptFriendRequest(request.id, request.fromUserId, request.toUserId);
    onRequestsUpdated();
    fetchRequests();
  };

  const handleDeny = async (request: FriendRequestWithRecipientData) => {
    await denyFriendRequest(request.id, request.fromUserId, request.toUserId);
    fetchRequests();
  };

  const handleCancel = async (request: FriendRequestWithRecipientData) => {
    await cancelFriendRequest(request.id, request.fromUserId, request.toUserId);
    fetchRequests();
  };

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Received Requests</h3>
      {receivedRequests.length > 0 ? (
        <ul>
          {receivedRequests.map((req) => (
            <li key={req.id} className="flex justify-between items-center p-2 border-b">
              <span>{req.recipientData.displayName}</span>
              <div>
                <button onClick={() => handleAccept(req)} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">
                  Accept
                </button>
                <button onClick={() => handleDeny(req)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No incoming friend requests.</p>
      )}

      <h3 className="text-lg font-semibold mt-4 mb-2">Sent Requests</h3>
      {sentRequests.length > 0 ? (
        <ul>
          {sentRequests.map((req) => (
            <li key={req.id} className="flex justify-between items-center p-2 border-b">
              <span>{req.recipientData.displayName}</span>
              <button onClick={() => handleCancel(req)} className="bg-gray-500 text-white px-3 py-1 rounded-md">
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No outgoing friend requests.</p>
      )}
    </div>
  );
};
