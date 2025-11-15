import type { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  friendId: string;
  shareActivity: boolean;
  friends: string[];
  friendRequestsSent: string[];
  friendRequestsReceived: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type UserRole = 'member' | 'coach' | 'admin';

// Schedule types
export interface Schedule {
  id: string;
  sessionType: string;
  startTime: Timestamp;
  endTime: Timestamp;
  coachId: string;
  coachName: string;
  capacity: number;
  spotsRemaining: number;
  defaultProgramId?: string;
  location?: string;
  description?: string;
}

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  programId: string;
  bookedAt: Timestamp;
  status: 'active' | 'cancelled';
}

export interface ProgramAssignment {
  id: string;
  programId: string;
  userId: string;
  assignedBy: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Social types
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'denied';
  createdAt: Timestamp;
  respondedAt?: Timestamp;
}

export interface FriendRequestWithRecipientData extends FriendRequest {
  recipientData: PublicUserData;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Timestamp;
  user1ShareActivity: boolean;
  user2ShareActivity: boolean;
}

export interface PublicUserData {
    userId: string;
    displayName: string;
    friendId: string;
}


// Admin types
export interface Program {
  id: string;
  name: string;
  description: string;
  type: 'strength' | 'cardio' | 'hybrid' | 'flexibility' | 'other';
  durationWeeks?: number;
  exercises?: string[]; // Simple list for PoC
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
}