import { Timestamp } from 'firebase/firestore';

// User types
export type UserRole = 'member' | 'coach' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  friendId: string;
  shareActivity: boolean;
  friends: string[];
  friendRequestsSent: string[];
  friendRequestsReceived: string[];
}

// Schedule types
export interface Schedule {
  id: string;
  name: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  maxCapacity: number;
  bookedUserIds: string[];
  coachId: string;
  programName: string;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  bookedAt: Timestamp;
  programAssignedId: string;
}

export interface ProgramAssignment {
  id: string;
  userId: string;
  programId: string;
  assignedBy: string;
  assignedAt: Timestamp;
}

// Social types
export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  requestedAt: Timestamp;
  status: 'pending' | 'accepted' | 'declined';
}

// Admin types
export interface Program {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Timestamp;
}
