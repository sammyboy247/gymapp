import React, { useState, useEffect, useCallback } from 'react';
import { scheduleService } from '@/services/firebase/scheduleService';
import type { Schedule, Booking } from '@/types';
import { X, Trash2, UserPlus, AlertCircle, Download } from 'lucide-react';
import moment from 'moment';

interface RosterItem extends Booking {
  memberDisplayName: string;
  memberEmail: string;
}

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
}

const RosterModal: React.FC<RosterModalProps> = ({ isOpen, onClose, schedule }) => {
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionRoster = await scheduleService.getSessionRoster(schedule.id);
      setRoster(sessionRoster);
    } catch (err) {
      setError('Failed to fetch roster.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [schedule.id]);

  useEffect(() => {
    if (isOpen) {
      fetchRoster();
    }
  }, [isOpen, fetchRoster]);

  const handleRemoveBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to remove this member from the session?')) {
      try {
        await scheduleService.adminRemoveBooking(bookingId);
        fetchRoster(); // Refresh the roster
      } catch (err) {
        setError('Failed to remove booking.');
        console.error(err);
      }
    }
  };

  // Mock function for adding a member. A real implementation would involve a user search feature.
  const handleAddMember = async () => {
    const userId = prompt("Enter User ID to add:");
    if (userId) {
       try {
        // Assuming a default program for simplicity
        await scheduleService.adminAddBooking(schedule.id, userId, 'default_program');
        fetchRoster();
      } catch (err: any) {
        setError(err.message || 'Failed to add member.');
        console.error(err);
      }
    }
  };

  const exportToCSV = () => {
    const headers = "Member Name,Email,Booking Time\n";
    const rows = roster.map(r =>
        `"${r.memberDisplayName}","${r.memberEmail}","${moment(r.bookedAt.toDate()).format('YYYY-MM-DD HH:mm')}"`
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roster_${schedule.sessionType}_${moment(schedule.startTime.toDate()).format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-2">Roster for {schedule.sessionType}</h2>
        <p className="text-sm text-gray-500 mb-4">
            {moment(schedule.startTime.toDate()).format('MMMM Do YYYY, h:mm a')}
        </p>

        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
                <button onClick={handleAddMember} className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600">
                    <UserPlus size={18} className="mr-2" /> Add Member
                </button>
                <button onClick={exportToCSV} className="flex items-center bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600">
                    <Download size={18} className="mr-2" /> Export CSV
                </button>
            </div>
        </div>

        {error && (
            <div className="text-red-500 p-3 bg-red-100 rounded-lg flex items-center text-sm mb-4">
                <AlertCircle size={18} className="mr-2" />
                {error}
            </div>
        )}

        <div className="overflow-y-auto">
          {isLoading ? (
            <p>Loading roster...</p>
          ) : roster.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Time</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roster.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.memberDisplayName}</div>
                        <div className="text-sm text-gray-500">{booking.memberEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(booking.bookedAt.toDate()).format('MMM D, h:mm a')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleRemoveBooking(booking.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-8 text-gray-500">No members have booked this session yet.</p>
          )}
        </div>

        <div className="flex justify-end mt-6 border-t pt-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default RosterModal;
