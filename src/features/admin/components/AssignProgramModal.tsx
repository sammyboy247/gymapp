import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Program, UserProfile, ProgramAssignment } from '@/types';
import { programService } from '@/services/firebase/programService';
import { userService } from '@/services/firebase/userService';
import { Timestamp } from 'firebase/firestore';

const assignmentSchema = z.object({
  userId: z.string().min(1, 'Member is required'),
  programId: z.string().min(1, 'Program is required'),
  startDate: z.string().min(1, 'Start date is required'),
  notes: z.string().optional(),
});

interface Props {
  onClose: () => void;
  onAssign: (assignment: ProgramAssignment) => void;
}

export const AssignProgramModal: React.FC<Props> = ({ onClose, onAssign }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(assignmentSchema),
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      const fetchedPrograms = await programService.getPrograms();
      setPrograms(fetchedPrograms);
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm) {
        const fetchedUsers = await userService.searchUsers(searchTerm);
        setUsers(fetchedUsers);
      } else {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  const onSubmit = async (data: any) => {
    const assignmentData = {
      ...data,
      startDate: Timestamp.fromDate(new Date(data.startDate)),
    };
    const newAssignmentId = await programService.assignProgram(assignmentData);
    onAssign({ ...assignmentData, id: newAssignmentId });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Assign Program</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Search Member</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Search by name or email"
            />
          </div>
          {users.length > 0 && (
            <div className="mb-4 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {user.displayName} ({user.email})
                </div>
              ))}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Member</label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <select {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Select a member</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.displayName}</option>
                  ))}
                </select>
              )}
            />
            {errors.userId && <p className="text-red-500 text-xs mt-1">{String(errors.userId.message)}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Program</label>
            <Controller
              name="programId"
              control={control}
              render={({ field }) => (
                <select {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Select a program</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>{program.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.programId && <p className="text-red-500 text-xs mt-1">{String(errors.programId.message)}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  value={field.value || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              )}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{String(errors.startDate.message)}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <textarea {...field} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />}
            />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
