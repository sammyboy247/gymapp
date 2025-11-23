/**
 * Firestore Seed Data Script
 *
 * This script populates the Firestore database with test data for development.
 *
 * Prerequisites:
 * 1. Firebase Admin SDK credentials (service account JSON)
 * 2. Firebase project configured in .env
 *
 * Usage:
 *   npm run seed
 *
 * Or with ts-node:
 *   npx ts-node scripts/seedFirestore.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config();

// Load service account key
const serviceAccountPath = join(process.cwd(), 'gymapp-85740-firebase-adminsdk-fbsvc-eae62211c8.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore(app);
const auth = getAuth(app);

// Test user credentials (for Firebase Auth)
const TEST_USERS = [
  {
    email: 'admin@gymapp.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    role: 'admin' as const,
    friendId: 'ADMIN001',
  },
  {
    email: 'coach@gymapp.com',
    password: 'Coach123!',
    displayName: 'Coach Sarah',
    role: 'coach' as const,
    friendId: 'COACH001',
  },
  {
    email: 'member1@gymapp.com',
    password: 'Member123!',
    displayName: 'John Doe',
    role: 'member' as const,
    friendId: 'MEM12345',
  },
  {
    email: 'member2@gymapp.com',
    password: 'Member123!',
    displayName: 'Jane Smith',
    role: 'member' as const,
    friendId: 'MEM67890',
  },
];

async function seedUsers() {
  console.log('🔄 Seeding users...');

  const userIds: Record<string, string> = {};

  for (const testUser of TEST_USERS) {
    try {
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email: testUser.email,
        password: testUser.password,
        displayName: testUser.displayName,
      });

      userIds[testUser.email] = userRecord.uid;

      // Create Firestore user profile
      await db.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        email: testUser.email,
        displayName: testUser.displayName,
        role: testUser.role,
        friendId: testUser.friendId,
        shareActivity: true,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`  ✅ Created user: ${testUser.email} (${testUser.role})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`  ⏭️  User already exists: ${testUser.email}`);
        // Get existing user
        const existingUser = await auth.getUserByEmail(testUser.email);
        userIds[testUser.email] = existingUser.uid;
      } else {
        console.error(`  ❌ Error creating user ${testUser.email}:`, error.message);
      }
    }
  }

  return userIds;
}

async function seedPrograms(coachId: string) {
  console.log('\n🔄 Seeding programs...');

  const programs = [
    {
      name: 'Beginner Strength',
      description: 'Foundation strength training program for beginners',
      type: 'strength' as const,
      durationWeeks: 8,
      exercises: ['Squats', 'Deadlifts', 'Bench Press', 'Rows', 'Overhead Press'],
      isActive: true,
      createdBy: coachId,
      createdAt: Timestamp.now(),
    },
    {
      name: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for cardiovascular fitness',
      type: 'cardio' as const,
      durationWeeks: 4,
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Sprints'],
      isActive: true,
      createdBy: coachId,
      createdAt: Timestamp.now(),
    },
    {
      name: 'Functional Fitness',
      description: 'Hybrid program combining strength and conditioning',
      type: 'hybrid' as const,
      durationWeeks: 12,
      exercises: ['Kettlebell Swings', 'Box Jumps', 'Wall Balls', 'Rowing', 'Pull-ups'],
      isActive: true,
      createdBy: coachId,
      createdAt: Timestamp.now(),
    },
  ];

  const programIds: string[] = [];

  for (const program of programs) {
    const docRef = await db.collection('programs').add(program);
    programIds.push(docRef.id);
    console.log(`  ✅ Created program: ${program.name}`);
  }

  return programIds;
}

async function seedSchedules(coachId: string, coachName: string, programIds: string[]) {
  console.log('\n🔄 Seeding schedules...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedules = [
    // Today
    {
      sessionType: 'Morning Strength',
      startTime: Timestamp.fromDate(new Date(today.getTime() + 6 * 3600000)), // 6 AM
      endTime: Timestamp.fromDate(new Date(today.getTime() + 7 * 3600000)), // 7 AM
      coachId,
      coachName,
      capacity: 12,
      spotsRemaining: 8,
      defaultProgramId: programIds[0],
      location: 'Main Gym',
      description: 'Foundation strength training session',
    },
    {
      sessionType: 'Lunch HIIT',
      startTime: Timestamp.fromDate(new Date(today.getTime() + 12 * 3600000)), // 12 PM
      endTime: Timestamp.fromDate(new Date(today.getTime() + 13 * 3600000)), // 1 PM
      coachId,
      coachName,
      capacity: 15,
      spotsRemaining: 15,
      defaultProgramId: programIds[1],
      location: 'Studio A',
      description: 'High-intensity cardio session',
    },
    // Tomorrow
    {
      sessionType: 'Evening CrossFit',
      startTime: Timestamp.fromDate(new Date(today.getTime() + 24 * 3600000 + 18 * 3600000)), // Tomorrow 6 PM
      endTime: Timestamp.fromDate(new Date(today.getTime() + 24 * 3600000 + 19 * 3600000)), // Tomorrow 7 PM
      coachId,
      coachName,
      capacity: 10,
      spotsRemaining: 10,
      defaultProgramId: programIds[2],
      location: 'Main Gym',
      description: 'Functional fitness and conditioning',
    },
    // Day after tomorrow
    {
      sessionType: 'Morning Yoga',
      startTime: Timestamp.fromDate(new Date(today.getTime() + 48 * 3600000 + 7 * 3600000)), // Day after tomorrow 7 AM
      endTime: Timestamp.fromDate(new Date(today.getTime() + 48 * 3600000 + 8 * 3600000)), // 8 AM
      coachId,
      coachName,
      capacity: 20,
      spotsRemaining: 20,
      location: 'Studio B',
      description: 'Flexibility and mindfulness session',
    },
  ];

  const scheduleIds: string[] = [];

  for (const schedule of schedules) {
    const docRef = await db.collection('schedules').add(schedule);
    scheduleIds.push(docRef.id);
    console.log(`  ✅ Created schedule: ${schedule.sessionType} (${schedule.startTime.toDate().toLocaleString()})`);
  }

  return scheduleIds;
}

async function seedBookings(memberIds: string[], scheduleIds: string[], programIds: string[]) {
  console.log('\n🔄 Seeding bookings...');

  // Member 1 books first two sessions
  const bookings = [
    {
      userId: memberIds[0],
      sessionId: scheduleIds[0],
      programId: programIds[0],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    },
    {
      userId: memberIds[0],
      sessionId: scheduleIds[1],
      programId: programIds[1],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    },
    // Member 2 books first session
    {
      userId: memberIds[1],
      sessionId: scheduleIds[0],
      programId: programIds[0],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    },
  ];

  for (const booking of bookings) {
    await db.collection('bookings').add(booking);
    console.log(`  ✅ Created booking for session ${booking.sessionId.substring(0, 8)}...`);
  }
}

async function main() {
  console.log('🚀 Starting Firestore seed process...\n');

  try {
    // Seed users
    const userIds = await seedUsers();

    const adminId = userIds['admin@gymapp.com'];
    const coachId = userIds['coach@gymapp.com'];
    const member1Id = userIds['member1@gymapp.com'];
    const member2Id = userIds['member2@gymapp.com'];

    if (!adminId || !coachId || !member1Id || !member2Id) {
      throw new Error('Failed to create all required users');
    }

    // Seed programs
    const programIds = await seedPrograms(coachId);

    // Seed schedules
    const scheduleIds = await seedSchedules(coachId, 'Coach Sarah', programIds);

    // Seed bookings
    await seedBookings([member1Id, member2Id], scheduleIds, programIds);

    console.log('\n✅ Seed process completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Admin:   admin@gymapp.com / Admin123!');
    console.log('  Coach:   coach@gymapp.com / Coach123!');
    console.log('  Member1: member1@gymapp.com / Member123!');
    console.log('  Member2: member2@gymapp.com / Member123!');
    console.log('\n🔗 Next steps:');
    console.log('  1. Deploy Firestore rules: firebase deploy --only firestore:rules');
    console.log('  2. Run dev server: npm run dev');
    console.log('  3. Login with any test account above');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

main();
