import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { scheduleService } from '@/services/firebase/scheduleService';
import { userService } from '@/services/firebase/userService';
import type { Schedule, Booking, ProgramAssignment } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface BookingModalProps {
  session: Schedule;
  userBookings: Booking[];
  setUserBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setBookingError: (error: string | null) => void;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  session,
  userBookings,
  setUserBookings,
  setBookingError,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [selectedProgramId, setSelectedProgramId] = useState<string>(session.defaultProgramId || 'default');
  const [userPrograms, setUserPrograms] = useState<ProgramAssignment[]>([]);

  useEffect(() => {
    if (user) {
      userService.getUserPrograms(user.uid).then(setUserPrograms);
    }
  }, [user]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBooking = async () => {
    if (!user) return;

    // Optimistic UI update
    const tempBooking: Booking = {
      id: `temp-${Date.now()}`,
      sessionId: session.id,
      userId: user.uid,
      programId: selectedProgramId,
      bookedAt: { toDate: () => new Date() } as any, // Temporary timestamp
      status: 'active',
    };

    setUserBookings(prev => [...prev, tempBooking]);
    onClose();

    try {
      await scheduleService.bookSession(session.id, user.uid, selectedProgramId);
      toast.success('Session booked successfully!');
      setBookingError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to book session';
      setBookingError(`Booking failed: ${errorMessage}. Please try again.`);
      toast.error(errorMessage);
      // Rollback optimistic update
      setUserBookings(prev => prev.filter(b => b.id !== tempBooking.id));
    }
  };

  const handleCancelBooking = async () => {
    if (!user) return;

    const bookingToCancel = userBookings.find(b => b.sessionId === session.id);
    if (!bookingToCancel) return;

    // Optimistic UI update
    const originalBookings = userBookings;
    setUserBookings(prev => prev.filter(b => b.id !== bookingToCancel.id));
    onClose();

    try {
      await scheduleService.cancelBooking(bookingToCancel.id, session.id, user.uid);
      toast.success('Booking cancelled successfully');
      setBookingError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel booking';
      setBookingError(`Cancellation failed: ${errorMessage}. Please try again.`);
      toast.error(errorMessage);
      // Rollback optimistic update
      setUserBookings(originalBookings);
    }
  };

  const isBooked = userBookings.some(b => b.sessionId === session.id);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="booking-modal-title" className="text-2xl font-bold mb-4">{session.sessionType}</h2>
        <p className="text-gray-700">{session.startTime.toDate().toLocaleString()}</p>
        <p className="text-gray-700">Coach: {session.coachName}</p>
        <p className="text-gray-700">Spots Remaining: {session.spotsRemaining} / {session.capacity}</p>
        {session.location && <p className="text-gray-700">Location: {session.location}</p>}
        {session.description && <p className="text-gray-600 mt-2 text-sm">{session.description}</p>}

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

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 rounded bg-zinc-200 hover:bg-zinc-300">
            Close
          </button>
          {!isBooked ? (
            <button
              onClick={handleBooking}
              disabled={session.spotsRemaining <= 0}
              className="py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              Book Session
            </button>
          ) : (
            <button
              onClick={handleCancelBooking}
              className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
