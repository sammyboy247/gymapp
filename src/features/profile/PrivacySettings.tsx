import React from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/firebase/userService';

export const PrivacySettings: React.FC = () => {
  const { user, userProfile, setUserProfile } = useAuthStore();
  const [isSharing, setIsSharing] = React.useState(userProfile?.shareActivity ?? false);

  const handleToggle = async () => {
    if (user?.uid) {
      const newSharingStatus = !isSharing;
      setIsSharing(newSharingStatus);
      try {
        await userService.updateActivitySharing(user.uid, newSharingStatus);
        if (userProfile) {
          setUserProfile({ ...userProfile, shareActivity: newSharingStatus });
        }
        toast.success(newSharingStatus ? 'Activity sharing enabled' : 'Activity sharing disabled');
      } catch (error: any) {
        // Rollback on error
        setIsSharing(!newSharingStatus);
        toast.error(error.message || 'Failed to update privacy settings');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
      <div className="flex items-center justify-between">
        <label htmlFor="activity-sharing" className="mr-2">
          Share my activity with friends
        </label>
        <input type="checkbox" id="activity-sharing" checked={isSharing} onChange={handleToggle} />
      </div>
    </div>
  );
};
