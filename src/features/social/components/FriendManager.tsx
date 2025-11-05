import React from 'react';
// This component handles the Friend ID search and double-opt-in (PoC Spec 2.3.2)
export const FriendManager: React.FC = () => {
  // TODO:
  // 1. Implement an input to search for a 'friendId'
  // 2. On search, check for a user with that ID
  // 3. Send a "friend request" (e.g., write to a /friendRequests subcollection)
  // 4. Display pending incoming requests with "Accept" / "Deny" buttons
  // 5. List all accepted friends
    
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
      <div className="border border-zinc-200 rounded-lg p-4 min-h-[150px] flex items-center justify-center">
        <p className="text-zinc-500">[Friend list and 'Add Friend' UI placeholder]</p>
      </div>
    </div>
  );
};
