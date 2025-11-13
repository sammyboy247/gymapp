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
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { Schedule, Booking } from '@/types';

// Listener for schedule updates within a date range
const getSchedules = (
  startDate: Date,
  endDate: Date,
  callback: (schedules: Schedule[]) => void
) => {
  const q = query(
    collection(db, 'schedules'),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate))
  );

  return onSnapshot(q, querySnapshot => {
    const schedules = querySnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Schedule)
    );
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

    // Check for double booking
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      where('status', '==', 'active')
    );
    const userBookingSnap = await getDocs(bookingsQuery);
    if (!userBookingSnap.isEmpty) {
      throw new Error('You are already booked for this session.');
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

export const scheduleService = {
  getSchedules,
  getSessionById,
  bookSession,
  cancelBooking,
  getUserBookings,
  checkSessionCapacity,
  getSessionBookings,
  getFriendBookings,
};