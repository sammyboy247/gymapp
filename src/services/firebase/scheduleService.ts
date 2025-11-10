import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config';
import type { Schedule, Booking } from '@/types';

const getSchedules = async (): Promise<Schedule[]> => {
  const querySnapshot = await getDocs(collection(db, 'schedules'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
};

const bookSession = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'bookings'), booking);
  return docRef.id;
};

const cancelBooking = async (bookingId: string): Promise<void> => {
  await deleteDoc(doc(db, 'bookings', bookingId));
};

export const scheduleService = {
  getSchedules,
  bookSession,
  cancelBooking,
};