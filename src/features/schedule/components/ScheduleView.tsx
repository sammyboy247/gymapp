import React, { useState, useEffect } from 'react';
import { scheduleService } from '@/services/firebase/scheduleService';
import { getFriendsWithActivitySharing } from '@/services/firebase/friendService';
import type { Schedule, Booking, UserProfile } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { BookingModal } from './BookingModal';
import { FriendActivityBadge } from './FriendActivityBadge';
import { SessionCardSkeleton } from './SessionCardSkeleton';

export const ScheduleView: React.FC = () => {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [friendActivityMap, setFriendActivityMap] = useState<Record<string, UserProfile[]>>({});
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
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
      },
      filter.sessionType === 'all' ? null : filter.sessionType
    );

    if (userId) {
      const unsubscribeBookings = scheduleService.getUserBookings(userId, setUserBookings);
      return () => {
        unsubscribeSchedules();
        unsubscribeBookings();
      };
    }

    return () => {
      unsubscribeSchedules();
    };
  }, [filter.startDate, filter.endDate, filter.sessionType, userId]);

  // Load friend activity for each session (privacy-first: only friends with activity sharing enabled)
  useEffect(() => {
    if (!userId || schedules.length === 0) {
      return;
    }

    const loadFriendActivity = async () => {
      try {
        // Get friends who have activity sharing enabled
        const friendIds = await getFriendsWithActivitySharing(userId);

        if (friendIds.length === 0) {
          setFriendActivityMap({});
          return;
        }

        // Load friend activity for each session
        const activityMap: Record<string, UserProfile[]> = {};

        for (const session of schedules) {
          const friendsInSession = await scheduleService.getFriendActivityForSession(
            session.id,
            friendIds
          );
          if (friendsInSession.length > 0) {
            activityMap[session.id] = friendsInSession;
          }
        }

        setFriendActivityMap(activityMap);
      } catch (err) {
        console.error('Error loading friend activity:', err);
      }
    };

    loadFriendActivity();
  }, [userId, schedules]);

  const handleSessionClick = (session: Schedule) => {
    if (session.spotsRemaining > 0 || isUserBooked(session.id)) {
      setSelectedSession(session);
    }
  };

  const isUserBooked = (sessionId: string) => {
    return userBookings.some(booking => booking.sessionId === sessionId);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upcoming Classes</h2>

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
            <option value="Morning Strength">Morning Strength</option>
            <option value="Lunch HIIT">Lunch HIIT</option>
            <option value="Evening CrossFit">Evening CrossFit</option>
            <option value="Morning Yoga">Morning Yoga</option>
          </select>
        </div>
      </div>

      {bookingError && <p className="text-red-500">{bookingError}</p>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SessionCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map(session => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session)}
              className={`p-4 border rounded-lg transition-colors ${
                isUserBooked(session.id)
                  ? 'bg-blue-100 border-blue-500'
                  : session.spotsRemaining > 0
                  ? 'cursor-pointer hover:bg-zinc-100 border-gray-300'
                  : 'bg-zinc-200 text-zinc-500 border-gray-200'
              }`}
            >
              <h3 className="font-bold text-lg">{session.sessionType}</h3>
              <p className="text-sm text-gray-600">
                {session.startTime.toDate().toLocaleDateString()} at{' '}
                {session.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm text-gray-600">Coach: {session.coachName}</p>
              <p className="text-sm text-gray-600">
                Spots: {session.spotsRemaining} / {session.capacity}
              </p>
              {session.location && <p className="text-sm text-gray-500">📍 {session.location}</p>}
              {isUserBooked(session.id) && (
                <p className="text-blue-600 font-semibold mt-2">✓ Booked</p>
              )}
              <FriendActivityBadge friends={friendActivityMap[session.id] || []} />
            </div>
          ))}
        </div>
      )}

      {!loading && schedules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No classes scheduled for the selected period.
        </div>
      )}

      {selectedSession && (
        <BookingModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          userBookings={userBookings}
          setUserBookings={setUserBookings}
          setBookingError={setBookingError}
        />
      )}
    </div>
  );
};
