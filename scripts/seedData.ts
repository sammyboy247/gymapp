/**
 * Enhanced Firestore Seed Data Script (TASK-056)
 *
 * Creates realistic demo data for testing and demonstrations.
 *
 * Features:
 * - 20-30 test users with various roles
 * - 2 weeks of future sessions
 * - 5-10 workout programs
 * - Realistic booking patterns
 * - Friend connections and requests
 * - Idempotent operation
 * - Option to clear existing data
 *
 * Prerequisites:
 * 1. Firebase Admin SDK credentials (serviceAccountKey.json)
 * 2. Firebase project configured in .env
 *
 * Usage:
 *   npm run seed
 *   npm run seed -- --clear  (clears data first)
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

// Load service account key
const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore(app);
const auth = getAuth(app);

// Configuration
const CLEAR_DATA = process.argv.includes('--clear');
const AUTO_CONFIRM = process.argv.includes('--yes') || process.argv.includes('-y');

// First names pool
const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael',
  'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery',
];

// Last names pool
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
];

// Session types
const SESSION_TYPES = [
  'Morning Strength',
  'Lunch HIIT',
  'Evening CrossFit',
  'Morning Yoga',
  'Evening Spin',
  'Functional Fitness',
  'Olympic Lifting',
  'Mobility & Recovery',
];

// Locations
const LOCATIONS = ['Main Gym', 'Studio A', 'Studio B', 'Outdoor Area'];

// Generate unique Friend ID
function generateFriendId(role: string, index: number): string {
  const prefix = role === 'admin' ? 'ADM' : role === 'coach' ? 'CCH' : 'MEM';
  return `${prefix}${String(index).padStart(5, '0')}`;
}

// Generate test users
function generateUsers() {
  const users = [];

  // 2 Admins
  users.push({
    email: 'admin@gymapp.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    role: 'admin' as const,
    friendId: generateFriendId('admin', 1),
    shareActivity: true,
  });
  users.push({
    email: 'admin2@gymapp.com',
    password: 'Admin123!',
    displayName: 'Sarah Admin',
    role: 'admin' as const,
    friendId: generateFriendId('admin', 2),
    shareActivity: true,
  });

  // 3 Coaches
  const coachNames = ['Coach Sarah', 'Coach Mike', 'Coach Emily'];
  for (let i = 0; i < 3; i++) {
    users.push({
      email: `coach${i + 1}@gymapp.com`,
      password: 'Coach123!',
      displayName: coachNames[i],
      role: 'coach' as const,
      friendId: generateFriendId('coach', i + 1),
      shareActivity: true,
    });
  }

  // 25 Members
  for (let i = 0; i < 25; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    users.push({
      email: `member${i + 1}@gymapp.com`,
      password: 'Member123!',
      displayName: `${firstName} ${lastName}`,
      role: 'member' as const,
      friendId: generateFriendId('member', i + 1),
      shareActivity: i % 3 !== 0, // ~67% share activity
    });
  }

  return users;
}

// Confirmation prompt
async function confirm(message: string): Promise<boolean> {
  if (AUTO_CONFIRM) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Clear all data
async function clearData() {
  console.log('🗑️  Clearing existing data...');

  const collections = ['users', 'schedules', 'programs', 'bookings', 'friendRequests', 'programAssignments'];

  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`  ✅ Cleared ${collectionName} (${snapshot.size} documents)`);
  }

  // Clear Firebase Auth users
  console.log('  🔄 Clearing Firebase Auth users...');
  const listUsersResult = await auth.listUsers(1000);
  for (const userRecord of listUsersResult.users) {
    try {
      await auth.deleteUser(userRecord.uid);
    } catch (error) {
      console.log(`    ⏭️  Skipped user ${userRecord.email}`);
    }
  }
  console.log(`  ✅ Cleared Auth users (${listUsersResult.users.length} users)`);
}

// Seed users
async function seedUsers() {
  console.log('\n👥 Seeding users...');

  const users = generateUsers();
  const userIds: Record<string, string> = {};

  for (const testUser of users) {
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
        shareActivity: testUser.shareActivity,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`  ✅ Created: ${testUser.email.padEnd(30)} | ${testUser.role.padEnd(8)} | ${testUser.friendId}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        const existingUser = await auth.getUserByEmail(testUser.email);
        userIds[testUser.email] = existingUser.uid;
        console.log(`  ⏭️  Exists: ${testUser.email}`);
      } else {
        console.error(`  ❌ Error: ${testUser.email}:`, error.message);
      }
    }
  }

  return { userIds, totalUsers: users.length };
}

// Seed programs
async function seedPrograms(coachIds: string[]) {
  console.log('\n💪 Seeding programs...');

  const programs = [
    {
      name: 'Beginner Strength Foundation',
      description: 'Perfect for those new to strength training. Focuses on form and fundamental movements.',
      type: 'strength' as const,
      durationWeeks: 8,
      exercises: ['Squats', 'Deadlifts', 'Bench Press', 'Rows', 'Overhead Press'],
      isActive: true,
      createdBy: coachIds[0],
      createdAt: Timestamp.now(),
    },
    {
      name: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn and cardiovascular fitness.',
      type: 'cardio' as const,
      durationWeeks: 4,
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Sprints'],
      isActive: true,
      createdBy: coachIds[1],
      createdAt: Timestamp.now(),
    },
    {
      name: 'Functional Fitness Pro',
      description: 'Hybrid program combining strength and conditioning for real-world fitness.',
      type: 'hybrid' as const,
      durationWeeks: 12,
      exercises: ['Kettlebell Swings', 'Box Jumps', 'Wall Balls', 'Rowing', 'Pull-ups'],
      isActive: true,
      createdBy: coachIds[0],
      createdAt: Timestamp.now(),
    },
    {
      name: 'Advanced Olympic Lifting',
      description: 'Master the clean, jerk, and snatch with expert coaching.',
      type: 'strength' as const,
      durationWeeks: 16,
      exercises: ['Clean', 'Jerk', 'Snatch', 'Front Squat', 'Overhead Squat'],
      isActive: true,
      createdBy: coachIds[2],
      createdAt: Timestamp.now(),
    },
    {
      name: 'Mobility & Recovery',
      description: 'Flexibility, mobility, and active recovery program.',
      type: 'flexibility' as const,
      durationWeeks: 6,
      exercises: ['Dynamic Stretching', 'Foam Rolling', 'Yoga Flows', 'Mobility Drills'],
      isActive: true,
      createdBy: coachIds[1],
      createdAt: Timestamp.now(),
    },
    {
      name: 'CrossFit Fundamentals',
      description: 'Learn the basics of CrossFit methodology and movements.',
      type: 'hybrid' as const,
      durationWeeks: 8,
      exercises: ['Thrusters', 'Pull-ups', 'Box Jumps', 'Rowing', 'Double-unders'],
      isActive: true,
      createdBy: coachIds[2],
      createdAt: Timestamp.now(),
    },
    {
      name: 'Endurance Builder',
      description: 'Build cardiovascular endurance through progressive training.',
      type: 'cardio' as const,
      durationWeeks: 10,
      exercises: ['Running', 'Cycling', 'Swimming', 'Rowing', 'Jump Rope'],
      isActive: true,
      createdBy: coachIds[0],
      createdAt: Timestamp.now(),
    },
    {
      name: 'Powerlifting Program',
      description: 'Focused on the big three: squat, bench, deadlift.',
      type: 'strength' as const,
      durationWeeks: 12,
      exercises: ['Squat', 'Bench Press', 'Deadlift', 'Accessory Work'],
      isActive: false, // One inactive program
      createdBy: coachIds[1],
      createdAt: Timestamp.now(),
    },
  ];

  const programIds: string[] = [];

  for (const program of programs) {
    const docRef = await db.collection('programs').add(program);
    programIds.push(docRef.id);
    console.log(`  ✅ Created: ${program.name.padEnd(35)} | ${program.type.padEnd(12)} | ${program.durationWeeks}w`);
  }

  return programIds;
}

// Seed schedules (2 weeks)
async function seedSchedules(coachIds: string[], coachNames: string[], programIds: string[]) {
  console.log('\n📅 Seeding schedules (2 weeks)...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedules = [];
  const scheduleIds: string[] = [];

  // Generate 2 weeks of sessions
  for (let day = 0; day < 14; day++) {
    const dayDate = new Date(today.getTime() + day * 24 * 3600000);

    // Morning sessions (6 AM, 7 AM, 8 AM)
    for (let slot = 0; slot < 3; slot++) {
      const coachIndex = (day + slot) % coachIds.length;
      const sessionTypeIndex = (day * 3 + slot) % SESSION_TYPES.length;
      const programIndex = sessionTypeIndex % programIds.length;
      const locationIndex = slot % LOCATIONS.length;

      const startHour = 6 + slot;
      const capacity = 10 + (slot * 5); // 10, 15, 20

      schedules.push({
        sessionType: SESSION_TYPES[sessionTypeIndex],
        startTime: Timestamp.fromDate(new Date(dayDate.getTime() + startHour * 3600000)),
        endTime: Timestamp.fromDate(new Date(dayDate.getTime() + (startHour + 1) * 3600000)),
        coachId: coachIds[coachIndex],
        coachName: coachNames[coachIndex],
        capacity,
        spotsRemaining: capacity - (day === 0 && slot === 0 ? 5 : 0), // First session has some bookings
        defaultProgramId: programIds[programIndex],
        location: LOCATIONS[locationIndex],
        description: `Join ${coachNames[coachIndex]} for an energizing ${SESSION_TYPES[sessionTypeIndex]} session.`,
      });
    }

    // Evening sessions (5 PM, 6 PM)
    for (let slot = 0; slot < 2; slot++) {
      const coachIndex = (day + slot + 1) % coachIds.length;
      const sessionTypeIndex = (day * 2 + slot + 3) % SESSION_TYPES.length;
      const programIndex = sessionTypeIndex % programIds.length;
      const locationIndex = (slot + 2) % LOCATIONS.length;

      const startHour = 17 + slot;
      const capacity = 12 + (slot * 3); // 12, 15

      schedules.push({
        sessionType: SESSION_TYPES[sessionTypeIndex],
        startTime: Timestamp.fromDate(new Date(dayDate.getTime() + startHour * 3600000)),
        endTime: Timestamp.fromDate(new Date(dayDate.getTime() + (startHour + 1) * 3600000)),
        coachId: coachIds[coachIndex],
        coachName: coachNames[coachIndex],
        capacity,
        spotsRemaining: day === 0 && slot === 1 ? 0 : capacity, // One full session
        defaultProgramId: programIds[programIndex],
        location: LOCATIONS[locationIndex],
        description: `Evening ${SESSION_TYPES[sessionTypeIndex]} with ${coachNames[coachIndex]}.`,
      });
    }
  }

  // Batch write for efficiency
  let count = 0;
  for (const schedule of schedules) {
    const docRef = await db.collection('schedules').add(schedule);
    scheduleIds.push(docRef.id);
    count++;

    if (count <= 5 || count % 10 === 0) {
      console.log(`  ✅ Created: ${schedule.sessionType.padEnd(25)} | ${schedule.startTime.toDate().toLocaleDateString().padEnd(12)} | ${schedule.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
  }

  console.log(`  📊 Total: ${scheduleIds.length} sessions created`);
  return scheduleIds;
}

// Seed bookings
async function seedBookings(memberIds: string[], scheduleIds: string[], programIds: string[]) {
  console.log('\n🎫 Seeding bookings...');

  const bookings = [];

  // First 10 members book first session (Morning Strength today at 6 AM)
  for (let i = 0; i < 5; i++) {
    bookings.push({
      userId: memberIds[i],
      sessionId: scheduleIds[0],
      programId: programIds[0],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    });
  }

  // Fill up second evening session (6 PM today)
  for (let i = 5; i < 17; i++) {
    bookings.push({
      userId: memberIds[i],
      sessionId: scheduleIds[4], // Evening session
      programId: programIds[1],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    });
  }

  // Random bookings for other sessions
  for (let i = 0; i < 15; i++) {
    const memberIndex = Math.floor(Math.random() * memberIds.length);
    const scheduleIndex = Math.floor(Math.random() * Math.min(scheduleIds.length, 20)); // First 20 sessions
    const programIndex = Math.floor(Math.random() * programIds.length);

    bookings.push({
      userId: memberIds[memberIndex],
      sessionId: scheduleIds[scheduleIndex],
      programId: programIds[programIndex],
      bookedAt: Timestamp.now(),
      status: 'active' as const,
    });
  }

  // Batch write
  for (const booking of bookings) {
    await db.collection('bookings').add(booking);
  }

  console.log(`  ✅ Created ${bookings.length} bookings`);
}

// Seed social data (friends and requests)
async function seedSocialData(memberIds: string[]) {
  console.log('\n👫 Seeding social data...');

  let friendshipsCreated = 0;
  let requestsCreated = 0;

  // Create friendships between random members
  for (let i = 0; i < 10; i++) {
    const user1Index = i;
    const user2Index = (i + 5) % memberIds.length;

    const user1Id = memberIds[user1Index];
    const user2Id = memberIds[user2Index];

    // Add to friends array for both users
    await db.collection('users').doc(user1Id).update({
      friends: FieldValue.arrayUnion(user2Id),
    });
    await db.collection('users').doc(user2Id).update({
      friends: FieldValue.arrayUnion(user1Id),
    });

    friendshipsCreated++;
  }

  // Create pending friend requests
  for (let i = 0; i < 5; i++) {
    const fromIndex = i + 10;
    const toIndex = (i + 15) % memberIds.length;

    await db.collection('friendRequests').add({
      fromUserId: memberIds[fromIndex],
      toUserId: memberIds[toIndex],
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    requestsCreated++;
  }

  console.log(`  ✅ Created ${friendshipsCreated} friendships`);
  console.log(`  ✅ Created ${requestsCreated} pending friend requests`);
}

// Main execution
async function main() {
  console.log('🚀 GymApp Enhanced Seed Data Script (TASK-056)\n');
  console.log('📊 This will create:');
  console.log('   • 30 users (2 admins, 3 coaches, 25 members)');
  console.log('   • 8 workout programs');
  console.log('   • 70 sessions over 2 weeks (5 per day)');
  console.log('   • ~35 realistic bookings');
  console.log('   • Friend connections and pending requests\n');

  if (CLEAR_DATA) {
    console.log('⚠️  WARNING: --clear flag detected. All existing data will be deleted!\n');
    const shouldClear = await confirm('⚠️  Are you sure you want to clear all data?');
    if (!shouldClear) {
      console.log('❌ Seed process cancelled.');
      process.exit(0);
    }
    await clearData();
  } else {
    const shouldProceed = await confirm('📝 Proceed with seeding data?');
    if (!shouldProceed) {
      console.log('❌ Seed process cancelled.');
      process.exit(0);
    }
  }

  try {
    // Seed users
    const { userIds, totalUsers } = await seedUsers();

    // Get admin, coach, and member IDs
    const adminIds = [userIds['admin@gymapp.com'], userIds['admin2@gymapp.com']];
    const coachIds = [
      userIds['coach1@gymapp.com'],
      userIds['coach2@gymapp.com'],
      userIds['coach3@gymapp.com'],
    ];
    const coachNames = ['Coach Sarah', 'Coach Mike', 'Coach Emily'];
    const memberIds = Array.from({ length: 25 }, (_, i) => userIds[`member${i + 1}@gymapp.com`]);

    // Verify all IDs exist
    if (!coachIds.every(id => id) || !memberIds.every(id => id)) {
      throw new Error('Failed to create all required users');
    }

    // Seed programs
    const programIds = await seedPrograms(coachIds);

    // Seed schedules
    const scheduleIds = await seedSchedules(coachIds, coachNames, programIds);

    // Seed bookings
    await seedBookings(memberIds, scheduleIds, programIds);

    // Seed social data
    await seedSocialData(memberIds);

    console.log('\n✅ Seed process completed successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('   Admin:    admin@gymapp.com / Admin123!');
    console.log('   Admin:    admin2@gymapp.com / Admin123!');
    console.log('   Coach:    coach1@gymapp.com / Coach123!');
    console.log('   Coach:    coach2@gymapp.com / Coach123!');
    console.log('   Coach:    coach3@gymapp.com / Coach123!');
    console.log('   Members:  member1-25@gymapp.com / Member123!\n');
    console.log('📊 Data Summary:');
    console.log(`   Users:     ${totalUsers}`);
    console.log(`   Programs:  ${programIds.length}`);
    console.log(`   Sessions:  ${scheduleIds.length}`);
    console.log(`   Bookings:  ~35`);
    console.log(`   Friends:   10 connections + 5 pending requests\n`);
    console.log('🔗 Next steps:');
    console.log('   1. npm run dev');
    console.log('   2. Login with any test account above');
    console.log('   3. Test booking, social, and admin features\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

main();
