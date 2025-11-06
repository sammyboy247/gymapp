import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { Schedule, Booking } from '../../types';

interface ScheduleService {
  getSchedules: () => Promise<Schedule[]>;
  bookSession: (booking: Booking) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

export const scheduleService: ScheduleService = {
  getSchedules: async () => {
    const schedulesCol = collection(db, 'schedules');
    const scheduleSnapshot = await getDocs(schedulesCol);
    const scheduleList = scheduleSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Schedule[];
    return scheduleList;
  },

  bookSession: async (booking) => {
    const bookingRef = doc(db, 'bookings', booking.id);
    await setDoc(bookingRef, booking);
  },

  cancelBooking: async (bookingId) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  },
};
