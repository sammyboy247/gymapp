import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/firebase/userService';

export const UserProfileDetails: React.FC = () => {
  const { user, userProfile, setUserProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(userProfile?.displayName || '');
  }, [userProfile]);

  const handleSave = async () => {
    if (user?.uid && userProfile && displayName !== userProfile.displayName) {
      try {
        setError(null);
        await userService.updateDisplayName(user.uid, displayName);
        setUserProfile({ ...userProfile, displayName });
        toast.success('Display name updated successfully');
        setIsEditing(false);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update display name';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(err);
      }
    }
  };

  if (!userProfile) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Details</h2>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="font-bold">Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="ml-2 border rounded p-1"
            />
          ) : (
            <span className="ml-2">{displayName}</span>
          )}
          <button onClick={() => setIsEditing(!isEditing)} className="ml-4 text-blue-500">
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button onClick={handleSave} className="ml-2 bg-green-500 text-white px-2 py-1 rounded">
              Save
            </button>
          )}
        </div>
        <p>
          <strong>Email:</strong> {userProfile.email || 'Not provided'}
        </p>
        <p>
          <strong>Role:</strong> {userProfile.role}
        </p>
        <div className="mt-4 p-3 bg-zinc-100 rounded">
          <strong>My Public Friend ID:</strong>
          <span className="font-mono text-blue-600 ml-2">{userProfile.friendId}</span>
          <p className="text-sm text-zinc-600 mt-1">Share this ID with friends to connect.</p>
        </div>
      </div>
    </div>
  );
};