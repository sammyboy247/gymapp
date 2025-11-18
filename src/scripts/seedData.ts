/**
 * Seed Data Script for GymApp
 *
 * Populates Firestore with realistic test data for development and testing.
 *
 * Usage:
 *   npm run seed
 *
 * Environment:
 *   Requires Firebase credentials in .env file
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase config from environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper to generate dates
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const setTime = (date: Date, hours: number, minutes: number = 0): Date => {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Test user data
const TEST_USERS = [
  {
    email: 'admin@gymapp.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    role: 'admin' as const,
    friendId: 'Admin0001'
  },
  {
    email: 'coach@gymapp.com',
    password: 'Coach123!',
    displayName: 'Coach Alice',
    role: 'coach' as const,
    friendId: 'CoachA001'
  },
  {
    email: 'coach2@gymapp.com',
    password: 'Coach123!',
    displayName: 'Coach Bob',
    role: 'coach' as const,
    friendId: 'CoachB001'
  },
  {
    email: 'member1@gymapp.com',
    password: 'Member123!',
    displayName: 'John Smith',
    role: 'member' as const,
    friendId: 'User1234'
  },
  {
    email: 'member2@gymapp.com',
    password: 'Member123!',
    displayName: 'Sarah Johnson',
    role: 'member' as const,
    friendId: 'User5678'
  },
  {
    email: 'member3@gymapp.com',
    password: 'Member123!',
    displayName: 'Mike Davis',
    role: 'member' as const,
    friendId: 'User9012'
  },
  {
    email: 'member4@gymapp.com',
    password: 'Member123!',
    displayName: 'Emily Brown',
    role: 'member' as const,
    friendId: 'User3456'
  },
  {
    email: 'member5@gymapp.com',
    password: 'Member123!',
    displayName: 'David Wilson',
    role: 'member' as const,
    friendId: 'User7890'
  }
];

// Program data
const PROGRAMS = [
  {
    name: 'Beginner Strength',
    description: 'Full-body strength training program for beginners. Focuses on compound movements and proper form.',
    type: 'strength',
    difficulty: 'beginner',
    durationWeeks: 8,
    workouts: [
      { name: 'Upper Body A', exercises: ['Bench Press', 'Rows', 'Shoulder Press'] },
      { name: 'Lower Body A', exercises: ['Squats', 'Deadlifts', 'Lunges'] },
      { name: 'Upper Body B', exercises: ['Pull-ups', 'Dips', 'Bicep Curls'] }
    ]
  },
  {
    name: 'HIIT Cardio',
    description: 'High-intensity interval training for fat loss and cardiovascular fitness.',
    type: 'cardio',
    difficulty: 'intermediate',
    durationWeeks: 6,
    workouts: [
      { name: 'Interval Sprint', exercises: ['Sprints', 'Burpees', 'Mountain Climbers'] },
      { name: 'Circuit Training', exercises: ['Jump Rope', 'Box Jumps', 'Battle Ropes'] }
    ]
  },
  {
    name: 'Advanced Powerlifting',
    description: 'Progressive overload program focused on the big three: squat, bench, deadlift.',
    type: 'strength',
    difficulty: 'advanced',
    durationWeeks: 12,
    workouts: [
      { name: 'Heavy Squat Day', exercises: ['Back Squat', 'Front Squat', 'Leg Press'] },
      { name: 'Heavy Bench Day', exercises: ['Bench Press', 'Incline Press', 'Close-grip Bench'] },
      { name: 'Heavy Deadlift Day', exercises: ['Conventional Deadlift', 'Romanian Deadlift', 'Deficit Pulls'] }
    ]
  },
  {
    name: 'Yoga & Mobility',
    description: 'Improve flexibility, balance, and recovery with yoga-based movements.',
    type: 'flexibility',
    difficulty: 'beginner',
    durationWeeks: 4,
    workouts: [
      { name: 'Morning Flow', exercises: ['Sun Salutations', 'Warrior Poses', 'Forward Folds'] },
      { name: 'Evening Stretch', exercises: ['Hip Openers', 'Spinal Twists', 'Savasana'] }
    ]
  },
  {
    name: 'Olympic Lifting',
    description: 'Technical program for Olympic lifts: snatch and clean & jerk.',
    type: 'olympic',
    difficulty: 'advanced',
    durationWeeks: 10,
    workouts: [
      { name: 'Snatch Technique', exercises: ['Snatch', 'Overhead Squat', 'Snatch Pull'] },
      { name: 'Clean & Jerk Technique', exercises: ['Clean', 'Front Squat', 'Jerk'] }
    ]
  }
];

// Session types
const SESSION_TYPES = [
  'CrossFit',
  'HIIT',
  'Strength Training',
  'Olympic Lifting',
  'Yoga',
  'Spin Class',
  'Boxing',
  'Powerlifting'
];

async function main() {
  console.log('🌱 Starting seed data process...\n');

  try {
    // Check if data already exists
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (!usersSnapshot.empty) {
      console.log('⚠️  Warning: Database already contains users.');
      console.log('   This script will add additional test data.');
      console.log('   To start fresh, manually delete collections in Firebase Console.\n');
    }

    // Step 1: Create test users
    console.log('👥 Creating test users...');
    const userIds: { [email: string]: string } = {};

    for (const userData of TEST_USERS) {
      try {
        // Check if user already exists in Firestore
        const existingUsers = await getDocs(collection(db, 'users'));
        const existing = existingUsers.docs.find(doc => doc.data().email === userData.email);

        if (existing) {
          console.log(`   ✓ User ${userData.email} already exists (using existing)`);
          userIds[userData.email] = existing.id;
          continue;
        }

        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        const userId = userCredential.user.uid;
        userIds[userData.email] = userId;

        // Create Firestore user profile
        await setDoc(doc(db, 'users', userId), {
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          friendId: userData.friendId,
          shareActivity: true,
          friends: [],
          friendRequestsSent: [],
          friendRequestsReceived: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });

        console.log(`   ✓ Created ${userData.role}: ${userData.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`   ⚠️  Auth user ${userData.email} already exists (skipping auth, adding profile)`);
          // Try to add Firestore profile anyway with generated ID
          const existingUsers = await getDocs(collection(db, 'users'));
          const existing = existingUsers.docs.find(doc => doc.data().email === userData.email);
          if (existing) {
            userIds[userData.email] = existing.id;
          }
        } else {
          console.error(`   ✗ Error creating ${userData.email}:`, error.message);
        }
      }
    }

    console.log(`\n✓ User creation complete (${Object.keys(userIds).length} users)\n`);

    // Step 2: Create programs
    console.log('📋 Creating training programs...');
    const programIds: string[] = [];

    for (const program of PROGRAMS) {
      const docRef = await addDoc(collection(db, 'programs'), {
        ...program,
        createdBy: userIds['coach@gymapp.com'] || 'coach1',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      programIds.push(docRef.id);
      console.log(`   ✓ Created program: ${program.name}`);
    }

    console.log(`\n✓ Program creation complete (${programIds.length} programs)\n`);

    // Step 3: Assign programs to members
    console.log('🎯 Assigning programs to members...');
    const memberEmails = TEST_USERS.filter(u => u.role === 'member').map(u => u.email);

    for (let i = 0; i < memberEmails.length; i++) {
      const memberEmail = memberEmails[i];
      const memberId = userIds[memberEmail];

      if (!memberId) continue;

      // Assign 1-2 programs per member
      const assignedProgramIds = programIds.slice(i % programIds.length, (i % programIds.length) + 2);

      for (const programId of assignedProgramIds) {
        await addDoc(collection(db, 'programAssignments'), {
          userId: memberId,
          programId: programId,
          assignedBy: userIds['coach@gymapp.com'] || 'coach1',
          assignedAt: Timestamp.now(),
          status: 'active'
        });
      }

      console.log(`   ✓ Assigned ${assignedProgramIds.length} programs to ${memberEmail}`);
    }

    console.log('\n✓ Program assignment complete\n');

    // Step 4: Create schedules (2 weeks of sessions)
    console.log('📅 Creating gym sessions...');
    const scheduleIds: string[] = [];
    const today = new Date();
    const coachEmails = TEST_USERS.filter(u => u.role === 'coach').map(u => u.email);

    // Create sessions for next 14 days
    for (let day = 0; day < 14; day++) {
      const sessionDate = addDays(today, day);

      // Morning session (6 AM)
      const morningSession = {
        sessionType: SESSION_TYPES[day % SESSION_TYPES.length],
        startTime: Timestamp.fromDate(setTime(sessionDate, 6, 0)),
        endTime: Timestamp.fromDate(setTime(sessionDate, 7, 0)),
        coachId: userIds[coachEmails[0]] || 'coach1',
        coachName: TEST_USERS.find(u => u.email === coachEmails[0])?.displayName || 'Coach Alice',
        capacity: 12,
        spotsRemaining: 12,
        location: 'Main Gym Floor',
        description: 'High-energy morning session to start your day strong.',
        defaultProgramId: programIds[0]
      };

      const morningRef = await addDoc(collection(db, 'schedules'), morningSession);
      scheduleIds.push(morningRef.id);

      // Evening session (6 PM)
      const eveningSession = {
        sessionType: SESSION_TYPES[(day + 1) % SESSION_TYPES.length],
        startTime: Timestamp.fromDate(setTime(sessionDate, 18, 0)),
        endTime: Timestamp.fromDate(setTime(sessionDate, 19, 30)),
        coachId: userIds[coachEmails[1]] || 'coach2',
        coachName: TEST_USERS.find(u => u.email === coachEmails[1])?.displayName || 'Coach Bob',
        capacity: 15,
        spotsRemaining: 15,
        location: 'Studio 1',
        description: 'Perfect after-work session for all skill levels.',
        defaultProgramId: programIds[1]
      };

      const eveningRef = await addDoc(collection(db, 'schedules'), eveningSession);
      scheduleIds.push(eveningRef.id);

      if (day % 5 === 0) {
        console.log(`   ✓ Created sessions for day ${day + 1}...`);
      }
    }

    console.log(`\n✓ Schedule creation complete (${scheduleIds.length} sessions)\n`);

    // Step 5: Create bookings (realistic distribution)
    console.log('🎫 Creating bookings...');
    let bookingCount = 0;

    for (let i = 0; i < scheduleIds.length; i++) {
      const scheduleId = scheduleIds[i];

      // Book 40-80% of spots for each session
      const bookingPercentage = 0.4 + Math.random() * 0.4;
      const sessionCapacity = i % 2 === 0 ? 12 : 15; // Morning = 12, Evening = 15
      const bookingsToCreate = Math.floor(sessionCapacity * bookingPercentage);

      // Randomly select members to book
      const availableMembers = memberEmails.filter(e => userIds[e]);
      const selectedMembers = availableMembers
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(bookingsToCreate, availableMembers.length));

      for (const memberEmail of selectedMembers) {
        const memberId = userIds[memberEmail];

        // Get a random assigned program for this member
        const memberProgramId = programIds[Math.floor(Math.random() * Math.min(2, programIds.length))];

        await addDoc(collection(db, 'bookings'), {
          userId: memberId,
          sessionId: scheduleId,
          programId: memberProgramId,
          bookedAt: Timestamp.now(),
          status: 'active'
        });

        bookingCount++;
      }

      // Update spotsRemaining for this session
      const sessionRef = doc(db, 'schedules', scheduleId);
      await setDoc(sessionRef, {
        spotsRemaining: sessionCapacity - selectedMembers.length
      }, { merge: true });
    }

    console.log(`\n✓ Booking creation complete (${bookingCount} bookings)\n`);

    // Step 6: Create friend relationships
    console.log('👫 Creating friend connections...');
    let friendshipCount = 0;

    // Create a few friendships between members
    const friendPairs = [
      ['member1@gymapp.com', 'member2@gymapp.com'],
      ['member2@gymapp.com', 'member3@gymapp.com'],
      ['member4@gymapp.com', 'member5@gymapp.com'],
      ['member1@gymapp.com', 'member4@gymapp.com']
    ];

    for (const [email1, email2] of friendPairs) {
      const userId1 = userIds[email1];
      const userId2 = userIds[email2];

      if (!userId1 || !userId2) continue;

      // Create friendship document
      await addDoc(collection(db, 'friendships'), {
        users: [userId1, userId2],
        [`${userId1}_shareActivity`]: true,
        [`${userId2}_shareActivity`]: true,
        createdAt: Timestamp.now()
      });

      friendshipCount++;
      console.log(`   ✓ Created friendship: ${email1} ↔ ${email2}`);
    }

    console.log(`\n✓ Friend connection complete (${friendshipCount} friendships)\n`);

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 Seed data complete!\n');
    console.log('Summary:');
    console.log(`  • ${Object.keys(userIds).length} users created`);
    console.log(`  • ${programIds.length} programs created`);
    console.log(`  • ${scheduleIds.length} sessions created (14 days)`);
    console.log(`  • ${bookingCount} bookings created`);
    console.log(`  • ${friendshipCount} friendships created\n`);
    console.log('Test Accounts:');
    console.log('  • admin@gymapp.com / Admin123!');
    console.log('  • coach@gymapp.com / Coach123!');
    console.log('  • member1@gymapp.com / Member123!');
    console.log('  • member2@gymapp.com / Member123!');
    console.log('  • ... (5 total members)\n');
    console.log('Ready for testing! 🚀');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed script
main();
