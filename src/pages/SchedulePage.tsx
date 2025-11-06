import React from 'react';
import { ScheduleView } from '@/features/schedule/components/ScheduleView';

export const SchedulePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
      <ScheduleView />
    </div>
  );
};