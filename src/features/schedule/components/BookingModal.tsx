import React, { useState, useEffect } from 'react';
import { scheduleService } from '@/services/firebase/scheduleService';
import { userService } from '@/services/firebase/userService';
import type { Schedule, Booking, ProgramAssignment } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface BookingModalProps {
  session: Schedule;
  userBookings: Booking[];
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ session, userBookings, onClose }) => {
  const { user } = useAuthStore();
  const [selectedProgramId, setSelectedProgramId] = useState<string>(session.defaultProgramId || 'default');
  const [userPrograms, setUserPrograms] = useState<ProgramAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      userService.getUserPrograms(user.uid).then(setUserPrograms);
    }
  }, [user]);

  const handleBooking = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await scheduleService.bookSession(session.id, user.uid, selectedProgramId);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const booking = userBookings.find(b => b.sessionId === session.id);
      if (booking) {
        await scheduleService.cancelBooking(booking.id, session.id, user.uid);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBooked = userBookings.some(b => b.sessionId === session.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{session.sessionType}</h2>
        <p>{new Date(session.startTime.seconds * 1000).toLocaleString()}</p>
        <p>Coach: {session.coachName}</p>
        <p>Spots Remaining: {session.spotsRemaining}</p>

        {!isBooked && (
          <div className="mt-4">
            <label htmlFor="program-select" className="block mb-2 font-semibold">
              Select Program:
            </label>
            <select
              id="program-select"
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="default">Default Program</option>
              {userPrograms.map(p => (
                <option key={p.id} value={p.programId}>
                  {p.programId}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded bg-zinc-200 hover:bg-zinc-300">
            Close
          </button>
          {!isBooked ? (
            <button
              onClick={handleBooking}
              disabled={loading || session.spotsRemaining <= 0}
              className="py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? <LoadingSpinner /> : 'Book Session'}
            </button>
          ) : (
            <button
              onClick={handleCancelBooking}
              disabled={loading}
              className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
            >
              {loading ? <LoadingSpinner /> : 'Cancel Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};