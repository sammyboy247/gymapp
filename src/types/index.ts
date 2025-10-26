// PoC Types based on gym_app_project_spec.md

export interface UserProfile {
  uid: string;
  email: string | null;
  realName: string;
  friendId: string; // The public-facing, non-personal ID (e.g., FitnessFan72)
  role: 'member' | 'admin' | 'coach';
  assignedProgramIds?: string[];
}

export interface GymSession {
  id: string;
  title: string;
  type: string; // e.g., "Spin", "Yoga", "HIIT"
  startTime: number; // Firestore Timestamp (as number)
  endTime: number; // Firestore Timestamp (as number)
  roomId: string;
  coachId: string;
}

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  sessionTitle: string;
  startTime: number;
  // Program selection from PoC spec
  selectedProgramId: string; // 'generic' or a specific program ID
}

export interface Program {
  id: string;
  title: string;
  description: string;
  // A simple list of exercise descriptions for the PoC
  exercises: Array<{ name: string; details: string }>;
}
