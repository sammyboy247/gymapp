import React from 'react';
import { Link } from 'react-router-dom';
import { ScheduleManager } from '@/features/admin/components/ScheduleManager';
import { ProgramManager } from '@/features/admin/components/ProgramManager';
import { Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/gym-settings"
          className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Settings size={18} className="mr-2" />
          Gym Settings
        </Link>
      </div>
      <div className="space-y-8">
        <ScheduleManager />
        <ProgramManager />
      </div>
    </div>
  );
};

export default AdminPage;