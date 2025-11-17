import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type { Program, ProgramAssignment } from '@/types';

const programsCollection = collection(db, 'programs');
const assignmentsCollection = collection(db, 'programAssignments');

export const programService = {
  createProgram: async (programData: Omit<Program, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(programsCollection, {
      ...programData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  updateProgram: async (programId: string, programData: Partial<Program>) => {
    const programDoc = doc(db, 'programs', programId);
    await updateDoc(programDoc, programData);
  },

  deleteProgram: async (programId: string) => {
    const programDoc = doc(db, 'programs', programId);
    await deleteDoc(programDoc);
  },

  getPrograms: async (): Promise<Program[]> => {
    console.log('Fetching programs...');
    const snapshot = await getDocs(programsCollection);
    const programs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Program));
    console.log(`Fetched ${programs.length} programs.`);
    return programs;
  },

  getProgram: async (programId: string): Promise<Program | null> => {
    const programDoc = await getDoc(doc(db, 'programs', programId));
    if (programDoc.exists()) {
      return { id: programDoc.id, ...programDoc.data() } as Program;
    }
    return null;
  },

  assignProgram: async (assignmentData: Omit<ProgramAssignment, 'id' | 'assignedAt'>) => {
    const docRef = await addDoc(assignmentsCollection, {
      ...assignmentData,
      assignedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  getProgramAssignments: async (programId: string): Promise<ProgramAssignment[]> => {
    const q = query(assignmentsCollection, where('programId', '==', programId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProgramAssignment));
  },
};
