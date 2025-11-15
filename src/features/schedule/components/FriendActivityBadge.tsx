import React, { useState } from 'react';
import { Users } from 'lucide-react';
import type { UserProfile } from '@/types';

interface FriendActivityBadgeProps {
  friends: UserProfile[];
}

export const FriendActivityBadge: React.FC<FriendActivityBadgeProps> = ({ friends }) => {
  const [expanded, setExpanded] = useState(false);

  if (friends.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Users className="w-4 h-4 mr-1" />
        <span className="font-medium">
          {friends.length} {friends.length === 1 ? 'friend' : 'friends'} attending
        </span>
      </button>

      {expanded && (
        <div className="mt-2 ml-5 p-2 bg-blue-50 rounded-md">
          <ul className="space-y-1">
            {friends.map((friend) => (
              <li key={friend.id} className="text-sm text-gray-700">
                • {friend.displayName || friend.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
