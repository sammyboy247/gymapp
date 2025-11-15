import React from 'react';
import { FriendManager } from '@/features/social/components/FriendManager';

const SocialPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <FriendManager />
    </div>
  );
};

export default SocialPage;
