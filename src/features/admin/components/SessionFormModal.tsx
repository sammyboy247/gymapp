import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import { scheduleService } from '@/services/firebase/scheduleService';
import type { Schedule, UserProfile } from '@/types';
import { X, AlertCircle } from 'lucide-react';

import "react-datepicker/dist/react-datepicker.css";

// Register British English locale for dd/mm/yyyy format
registerLocale('en-GB', enGB);

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onSave: () => void;
}

const SessionFormModal: React.FC<SessionFormModalProps> = ({ isOpen, onClose, schedule, onSave }) => {
  const [formData, setFormData] = useState<Partial<Omit<Schedule, 'startTime' | 'endTime'> & { startTime: Date; endTime: Date }>>({});
  const [coaches, setCoaches] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData({
        ...schedule,
        startTime: schedule.startTime.toDate(),
        endTime: schedule.endTime.toDate(),
      });
    } else {
      setFormData({
        sessionType: '',
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        coachId: '',
        coachName: '',
        capacity: 10,
        spotsRemaining: 10,
        location: '',
        description: '',
      });
    }

    // In a real app, you'd fetch this from a userService
    const mockCoaches: UserProfile[] = [
      {
        id: 'coach1',
        displayName: 'Coach Alice',
        email: 'alice@gym.com',
        role: 'coach',
        friendId: 'coach-a',
        shareActivity: true,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'coach2',
        displayName: 'Coach Bob',
        email: 'bob@gym.com',
        role: 'coach',
        friendId: 'coach-b',
        shareActivity: true,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
    ];
    setCoaches(mockCoaches);

  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value, 10) : value }));
    if (name === 'capacity') {
      setFormData(prev => ({...prev, spotsRemaining: parseInt(value,10)}));
    }
     if (name === 'coachId') {
      const selectedCoach = coaches.find(c => c.id === value);
      setFormData(prev => ({ ...prev, coachName: selectedCoach?.displayName || '' }));
    }
  };

  const handleDateChange = (name: 'startTime' | 'endTime', date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.sessionType || !formData.coachId || !formData.capacity) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
    }

    try {
      const dataToSave = {
        ...formData,
        startTime: Timestamp.fromDate(formData.startTime as Date),
        endTime: Timestamp.fromDate(formData.endTime as Date),
      };

      if (schedule && schedule.id) {
        await scheduleService.updateSchedule(schedule.id, dataToSave);
        toast.success('Session updated successfully');
      } else {
        await scheduleService.createSchedule(dataToSave as Omit<Schedule, 'id'>);
        toast.success('Session created successfully');
      }
      onSave();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save session. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">{schedule ? 'Edit Session' : 'Create New Session'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Type</label>
            <input type="text" name="sessionType" value={formData.sessionType || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <DatePicker
                selected={formData.startTime || new Date()}
                onChange={(date) => handleDateChange('startTime', date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                locale="en-GB"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <DatePicker
                selected={formData.endTime || new Date()}
                onChange={(date) => handleDateChange('endTime', date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                locale="en-GB"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Coach</label>
                <select name="coachId" value={formData.coachId || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                <option value="" disabled>Select a coach</option>
                {coaches.map(coach => (
                    <option key={coach.id} value={coach.id}>{coach.displayName}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>

          {error && (
            <div className="text-red-500 p-3 bg-red-100 rounded-lg flex items-center text-sm">
                <AlertCircle size={18} className="mr-2" />
                {error}
            </div>
           )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
              {isLoading ? 'Saving...' : 'Save Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFormModal;
