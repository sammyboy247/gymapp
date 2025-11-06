import React from 'react';  
import { ScheduleManager } from '@/features/admin/components/ScheduleManager';  
import { ProgramManager } from '@/features/admin/components/ProgramManager';

export const AdminPage: React.FC = () => {  
  return (  
    <div>  
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>  
      <div className="space-y-8">  
        <ScheduleManager />  
        <ProgramManager />  
      </div>  
    </div>  
  );  
};