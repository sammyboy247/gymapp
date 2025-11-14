import React, { useState, useEffect } from 'react';
import { scheduleService } from '@/services/firebase/scheduleService';
import type { Schedule } from '@/types';
import SessionFormModal from './SessionFormModal';
import RosterModal from './RosterModal';
import { Plus, Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import moment from 'moment';

export const ScheduleManager: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);

  // Fetch schedules on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch schedules for the next 30 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // Set up real-time listener
      const unsubscribe = scheduleService.getSchedules(startDate, endDate, (fetchedSchedules) => {
        setSchedules(fetchedSchedules);
        setIsLoading(false);
      });

      // Return cleanup function
      return unsubscribe;
    } catch (err) {
      setError('Failed to fetch schedules.');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedSchedule(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (schedule: Schedule) => {
    if (window.confirm(`Are you sure you want to delete the session "${schedule.sessionType}" on ${moment(schedule.startTime.toDate()).format('MMM D, h:mm a')}?`)) {
      try {
        await scheduleService.deleteSchedule(schedule.id);
        // Real-time listener will update the list automatically
      } catch (err) {
        setError('Failed to delete schedule.');
        console.error(err);
      }
    }
  };

  const handleViewRoster = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsRosterModalOpen(true);
  };

  const handleFormSave = () => {
    // Real-time listener will update the list automatically
    setIsFormModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Manage Schedule</h2>
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Schedule</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Session
        </button>
      </div>

      {error && (
        <div className="text-red-500 p-3 bg-red-100 rounded-lg flex items-center text-sm mb-4">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {schedules.length === 0 ? (
        <div className="border border-zinc-200 rounded-lg p-8 flex items-center justify-center">
          <p className="text-zinc-500">No schedules found. Create your first session to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coach
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.sessionType}</div>
                    {schedule.description && (
                      <div className="text-sm text-gray-500">{schedule.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {moment(schedule.startTime.toDate()).format('MMM D, YYYY')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(schedule.startTime.toDate()).format('h:mm a')} - {moment(schedule.endTime.toDate()).format('h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.coachName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.spotsRemaining} / {schedule.capacity} available
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          schedule.spotsRemaining === 0
                            ? 'bg-red-500'
                            : schedule.spotsRemaining < schedule.capacity * 0.3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(schedule.spotsRemaining / schedule.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewRoster(schedule)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Roster"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Session Form Modal */}
      <SessionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        schedule={selectedSchedule}
        onSave={handleFormSave}
      />

      {/* Roster Modal */}
      {selectedSchedule && (
        <RosterModal
          isOpen={isRosterModalOpen}
          onClose={() => setIsRosterModalOpen(false)}
          schedule={selectedSchedule}
        />
      )}
    </div>
  );
};
