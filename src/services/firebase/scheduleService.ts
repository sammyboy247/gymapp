import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  runTransaction,
  Timestamp,
  getDocs,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { Schedule, Booking, UserProfile } from '@/types';

// Listener for schedule updates within a date range with optional session type filter
const getSchedules = (
  startDate: Date,
  endDate: Date,
  callback: (schedules: Schedule[]) => void,
  sessionTypeFilter?: string | null
) => {
  console.log(`Fetching schedules from ${startDate.toISOString()} to ${endDate.toISOString()}`);
  let q = query(
    collection(db, 'schedules'),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate)),
    orderBy('startTime', 'asc')
  );

  // Note: Firestore doesn't allow multiple where clauses with orderBy on different fields
  // If we need session type filtering, we'll filter in memory after retrieval
  return onSnapshot(q, querySnapshot => {
    let schedules = querySnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Schedule)
    );

    // Apply session type filter if provided
    if (sessionTypeFilter) {
      schedules = schedules.filter(s => s.sessionType === sessionTypeFilter);
    }
    console.log(`Fetched ${schedules.length} schedules.`);
    callback(schedules);
  });
};

// Get a single session by ID
const getSessionById = async (sessionId: string): Promise<Schedule | null> => {
  const docRef = doc(db, 'schedules', sessionId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Schedule;
  }
  return null;
};

// Book a session for a user
const bookSession = async (sessionId: string, userId: string, programId: string): Promise<string> => {
  // Check for double booking BEFORE transaction (queries don't work well inside transactions)
  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    where('sessionId', '==', sessionId),
    where('status', '==', 'active')
  );
  const userBookingSnap = await getDocs(bookingsQuery);
  if (!userBookingSnap.empty) {
    throw new Error('You are already booked for this session.');
  }

  const sessionRef = doc(db, 'schedules', sessionId);
  const bookingRef = doc(collection(db, 'bookings'));

  await runTransaction(db, async (transaction) => {
    const sessionDoc = await transaction.get(sessionRef);
    if (!sessionDoc.exists()) {
      throw new Error('Session does not exist!');
    }

    const session = sessionDoc.data() as Schedule;
    if (session.spotsRemaining <= 0) {
      throw new Error('This session is full!');
    }

    transaction.update(sessionRef, {
      spotsRemaining: session.spotsRemaining - 1,
    });

    transaction.set(bookingRef, {
      id: bookingRef.id,
      userId,
      sessionId,
      programId,
      bookedAt: Timestamp.now(),
      status: 'active',
    });
  });

  return bookingRef.id;
};

// Cancel a booking
const cancelBooking = async (bookingId: string, sessionId: string, userId: string): Promise<void> => {
  const bookingRef = doc(db, 'bookings', bookingId);
  const sessionRef = doc(db, 'schedules', sessionId);

  await runTransaction(db, async (transaction) => {
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists() || bookingDoc.data().userId !== userId) {
      throw new Error('Booking not found or you do not have permission to cancel it.');
    }

    const sessionDoc = await transaction.get(sessionRef);
    if (!sessionDoc.exists()) {
      // Handle case where session was deleted after booking
      console.warn("Session not found, but proceeding to cancel booking.");
      transaction.update(bookingRef, { status: 'cancelled' });
      return;
    }

    const session = sessionDoc.data() as Schedule;
    transaction.update(sessionRef, {
      spotsRemaining: session.spotsRemaining + 1,
    });
    transaction.update(bookingRef, { status: 'cancelled' });
  });
};

// Get all bookings for a user
const getUserBookings = (userId: string, callback: (bookings: Booking[]) => void) => {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId), where('status', '==', 'active'));
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Booking)
    );
    callback(bookings);
  });
};

// Check session capacity without booking
const checkSessionCapacity = async (sessionId: string): Promise<{ capacity: number; spotsRemaining: number }> => {
    const session = await getSessionById(sessionId);
    if (!session) {
        throw new Error("Session not found");
    }
    return {
        capacity: session.capacity,
        spotsRemaining: session.spotsRemaining,
    };
};

// Get all bookings for a specific session (for roster view)
const getSessionBookings = async (sessionId: string): Promise<Booking[]> => {
    const q = query(
        collection(db, "bookings"),
        where("sessionId", "==", sessionId),
        where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

// Get bookings for a list of friends
const getFriendBookings = (friendIds: string[], callback: (bookings: Booking[]) => void) => {
  if (friendIds.length === 0) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'bookings'), where('userId', 'in', friendIds), where('status', '==', 'active'));

  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Booking)
    );
    callback(bookings);
  });
};

// Get friend activity for a specific session (returns array of friend user profiles)
const getFriendActivityForSession = async (sessionId: string, friendIds: string[]): Promise<UserProfile[]> => {
  if (friendIds.length === 0) {
    return [];
  }

  // Get bookings for this session by friends
  const q = query(
    collection(db, 'bookings'),
    where('sessionId', '==', sessionId),
    where('userId', 'in', friendIds),
    where('status', '==', 'active')
  );

  const bookingsSnapshot = await getDocs(q);
  const friendUserIds = bookingsSnapshot.docs.map(doc => (doc.data() as Booking).userId);

  if (friendUserIds.length === 0) {
    return [];
  }

  // ✅ OPTIMIZED: Parallel reads instead of sequential
  const userPromises = friendUserIds.map(userId =>
    getDoc(doc(db, 'users', userId))
  );
  const userDocs = await Promise.all(userPromises);

  return userDocs
    .filter(doc => doc.exists())
    .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
};

// ADMIN FUNCTIONS

// Create a new schedule session
const createSchedule = async (scheduleData: Omit<Schedule, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'schedules'), scheduleData);
  return docRef.id;
};

// Update an existing schedule session
const updateSchedule = async (sessionId: string, updates: Partial<Schedule>): Promise<void> => {
  const scheduleRef = doc(db, 'schedules', sessionId);
  await updateDoc(scheduleRef, updates);
};

// Delete a schedule session
const deleteSchedule = async (sessionId: string): Promise<void> => {
  // Note: UI should check for active bookings before calling this.
  const scheduleRef = doc(db, 'schedules', sessionId);
  await deleteDoc(scheduleRef);
};

// Bulk delete multiple schedules
const bulkDeleteSchedules = async (sessionIds: string[]): Promise<void> => {
  const batch = writeBatch(db);
  sessionIds.forEach(id => {
    const scheduleRef = doc(db, 'schedules', id);
    batch.delete(scheduleRef);
  });
  await batch.commit();
};

// Extended booking type with member details for roster display
interface RosterItem extends Booking {
  memberDisplayName: string;
  memberEmail: string;
}

// Get session roster with member details
const getSessionRoster = async (sessionId: string): Promise<RosterItem[]> => {
  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('sessionId', '==', sessionId),
    where('status', '==', 'active')
  );
  const bookingSnapshot = await getDocs(bookingsQuery);
  const bookings = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

  if (bookings.length === 0) {
    return [];
  }

  const userIds = [...new Set(bookings.map(b => b.userId))];

  // Fetch user documents by document ID (parallel reads for performance)
  const userPromises = userIds.map(userId => getDoc(doc(db, 'users', userId)));
  const userDocs = await Promise.all(userPromises);

  // Create map of userId -> UserProfile
  const userMap = new Map(
    userDocs
      .filter(doc => doc.exists())
      .map(doc => [doc.id, { id: doc.id, ...doc.data() } as UserProfile])
  );

  return bookings.map(booking => {
    const user = userMap.get(booking.userId);
    return {
      ...booking,
      memberDisplayName: user?.displayName || 'Unknown',
      memberEmail: user?.email || 'Unknown',
    };
  });
};

// Admin: Add a member to a session
const adminAddBooking = async (sessionId: string, userId: string, programId: string): Promise<string> => {
  const scheduleRef = doc(db, 'schedules', sessionId);
  const bookingsColRef = collection(db, 'bookings');

  let bookingId = '';

  await runTransaction(db, async (transaction) => {
    const scheduleDoc = await transaction.get(scheduleRef);
    if (!scheduleDoc.exists()) {
      throw new Error("Session not found!");
    }

    const scheduleData = scheduleDoc.data() as Schedule;
    if (scheduleData.spotsRemaining <= 0) {
      throw new Error("Session is full!");
    }

    // Decrement spots
    transaction.update(scheduleRef, { spotsRemaining: scheduleData.spotsRemaining - 1 });

    // Create booking
    const newBooking: Omit<Booking, 'id'> = {
      userId,
      sessionId,
      programId,
      bookedAt: Timestamp.now(),
      status: 'active',
    };
    const newBookingRef = doc(bookingsColRef);
    transaction.set(newBookingRef, newBooking);
    bookingId = newBookingRef.id;
  });

  return bookingId;
};

// Admin: Remove a member from a session
const adminRemoveBooking = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(db, 'bookings', bookingId);

  await runTransaction(db, async (transaction) => {
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists()) {
      throw new Error("Booking not found!");
    }

    const bookingData = bookingDoc.data() as Booking;
    const scheduleRef = doc(db, 'schedules', bookingData.sessionId);

    const scheduleDoc = await transaction.get(scheduleRef);
    if (scheduleDoc.exists()) {
       const scheduleData = scheduleDoc.data() as Schedule;
       // Increment spots
       transaction.update(scheduleRef, { spotsRemaining: scheduleData.spotsRemaining + 1 });
    }

    // Delete booking
    transaction.delete(bookingRef);
  });
};

export const scheduleService = {
  // User-facing functions
  getSchedules,
  getSessionById,
  bookSession,
  cancelBooking,
  getUserBookings,
  checkSessionCapacity,
  getSessionBookings,
  getFriendBookings,
  getFriendActivityForSession,
  // Admin functions
  createSchedule,
  updateSchedule,
  deleteSchedule,
  bulkDeleteSchedules,
  getSessionRoster,
  adminAddBooking,
  adminRemoveBooking,
};