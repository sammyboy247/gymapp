import React, { useState, useEffect } from 'react';
import { scheduleService } from '@/services/firebase/scheduleService';
import type { Schedule, Booking } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { BookingModal } from './BookingModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const ScheduleView: React.FC = () => {
  const { user, userProfile } = useAuthStore();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [friendBookings, setFriendBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Schedule | null>(null);
  const [filter, setFilter] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    sessionType: 'all',
  });

  const userId = user?.uid;

  useEffect(() => {
    setLoading(true);
    const unsubscribeSchedules = scheduleService.getSchedules(
      filter.startDate,
      filter.endDate,
      (newSchedules) => {
        setSchedules(newSchedules);
        setLoading(false);
      }
    );

    if (userId) {
      const unsubscribeBookings = scheduleService.getUserBookings(userId, setUserBookings);
      const unsubscribeFriendBookings = scheduleService.getFriendBookings(userProfile?.friends || [], setFriendBookings);
      return () => {
        unsubscribeSchedules();
        unsubscribeBookings();
        unsubscribeFriendBookings();
      };
    }

    return () => {
      unsubscribeSchedules();
    };
  }, [filter.startDate, filter.endDate, userId]);

  const handleSessionClick = (session: Schedule) => {
    if (session.spotsRemaining > 0 && !isUserBooked(session.id)) {
      setSelectedSession(session);
    }
  };

  const isUserBooked = (sessionId: string) => {
    return userBookings.some(booking => booking.sessionId === sessionId);
  };

  const filteredSchedules = schedules.filter(
    schedule => filter.sessionType === 'all' || schedule.sessionType === filter.sessionType
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Classes</h2>

      {/* Filter Controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">
            Session Type
          </label>
          <select
            id="sessionType"
            name="sessionType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filter.sessionType}
            onChange={e => setFilter({ ...filter, sessionType: e.target.value })}
          >
            <option value="all">All</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map(session => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session)}
              className={`p-4 border rounded-lg ${
                isUserBooked(session.id)
                  ? 'bg-blue-100 border-blue-500'
                  : session.spotsRemaining > 0
                  ? 'cursor-pointer hover:bg-zinc-100'
                  : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              <h3 className="font-bold">{session.sessionType}</h3>
              <p>{new Date(session.startTime.seconds * 1000).toLocaleString()}</p>
              <p>Coach: {session.coachName}</p>
              <p>
                Spots: {session.spotsRemaining} / {session.capacity}
              </p>
              {isUserBooked(session.id) && (
                <p className="text-blue-600 font-semibold mt-2">Booked</p>
              )}
              {friendBookings.some(b => b.sessionId === session.id) && (
                <p className="text-green-600 font-semibold mt-2">Friend is going</p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <BookingModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          userBookings={userBookings}
        />
      )}
    </div>
  );
};