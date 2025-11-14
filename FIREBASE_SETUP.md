# Firebase Setup Guide for GymApp

This guide will help you set up Firebase, configure security rules, and seed test data for the GymApp.

---

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created (already done: `gymapp-85740`)
- `.env` file with Firebase credentials (already configured)

---

## Step 1: Authenticate with Firebase

```bash
# Login to Firebase
firebase login

# Verify you're authenticated
firebase projects:list

# Set the current project
firebase use gymapp-85740
```

---

## Step 2: Deploy Firestore Security Rules

The project now includes comprehensive security rules with role-based access control.

### Security Rules Overview:

**Users Collection:**
- ✅ Any authenticated user can read user profiles
- ✅ Users can create and update their own profile
- ✅ Only admins can delete users

**Schedules Collection:**
- ✅ Any authenticated user can view schedules
- 🔒 Only admins/coaches can create/edit/delete sessions

**Bookings Collection:**
- ✅ Users can view and manage their own bookings
- 🔒 Admins/coaches can view all bookings

**Programs Collection:**
- ✅ Any authenticated user can view programs
- 🔒 Only admins/coaches can create/edit/delete programs

**Friend Requests & Friendships:**
- ✅ Privacy-first: Users only see their own data
- ✅ Users control activity sharing preferences

### Deploy Rules:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules
```

---

## Step 3: Set Up Firebase Admin SDK (for seeding)

To run the seed script, you need Firebase Admin SDK credentials.

### Option A: Using Emulator (Recommended for Development)

```bash
# Start Firestore emulator
firebase emulators:start --only firestore,auth

# In another terminal, run seed script with emulator
export FIRESTORE_EMULATOR_HOST="localhost:8080"
export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
npm run seed
```

### Option B: Using Production (with Service Account)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `gymapp-85740`
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in project root
6. Add to `.gitignore` (already configured)

Update `scripts/seedFirestore.ts` line 25:
```typescript
import serviceAccount from '../serviceAccountKey.json';

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});
```

---

## Step 4: Install Dependencies for Seed Script

```bash
# Install Firebase Admin SDK
npm install firebase-admin dotenv

# Install TypeScript execution tool
npm install -D ts-node @types/node
```

---

## Step 5: Add Seed Script to package.json

Add this to the `scripts` section of `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node scripts/seedFirestore.ts",
    "seed:emulator": "FIRESTORE_EMULATOR_HOST=localhost:8080 FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 ts-node scripts/seedFirestore.ts"
  }
}
```

---

## Step 6: Run Seed Script

```bash
# Seed production database
npm run seed

# OR seed emulator (recommended for development)
npm run seed:emulator
```

### What Gets Created:

**Test Users (Firebase Auth + Firestore):**
- `admin@gymapp.com` / `Admin123!` (admin role)
- `coach@gymapp.com` / `Coach123!` (coach role)
- `member1@gymapp.com` / `Member123!` (member role)
- `member2@gymapp.com` / `Member123!` (member role)

**Programs (3 total):**
- Beginner Strength (8 weeks, strength)
- HIIT Cardio Blast (4 weeks, cardio)
- Functional Fitness (12 weeks, hybrid)

**Schedules (4 total):**
- Morning Strength (Today 6-7 AM)
- Lunch HIIT (Today 12-1 PM)
- Evening CrossFit (Tomorrow 6-7 PM)
- Morning Yoga (Day after tomorrow 7-8 AM)

**Bookings (3 total):**
- Member1 booked into Morning Strength
- Member1 booked into Lunch HIIT
- Member2 booked into Morning Strength

---

## Step 7: Run the Application

```bash
# Start development server
npm run dev

# App will be available at:
# http://localhost:5173
```

---

## Step 8: Test the Application

### Login as Admin:
1. Navigate to `http://localhost:5173/login`
2. Login with: `admin@gymapp.com` / `Admin123!`
3. Navigate to `/admin` route
4. You should see the **ScheduleManager** with 4 upcoming sessions
5. Test features:
   - ✅ View session table with capacity indicators
   - ✅ Click "Create Session" to add new session
   - ✅ Click "View Roster" to see members (2 bookings on Morning Strength)
   - ✅ Click "Edit" to modify session
   - ✅ Click "Delete" to remove session (with confirmation)
   - ✅ Export roster to CSV

### Login as Coach:
1. Login with: `coach@gymapp.com` / `Coach123!`
2. Access `/admin` route (coaches have admin access)
3. Test same features as admin

### Login as Member:
1. Login with: `member1@gymapp.com` / `Member123!`
2. Navigate to `/schedule` route
3. View available sessions
4. Book into sessions
5. View own bookings
6. Navigate to `/profile` route
7. **Cannot** access `/admin` route (role-based protection)

---

## Firestore Collections Structure

Your Firestore database will have these collections:

```
gymapp-85740 (Firestore Database)
├── users/
│   ├── {uid} (UserProfile documents)
│   │   ├── id: string
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── role: 'admin' | 'coach' | 'member'
│   │   ├── friendId: string
│   │   ├── shareActivity: boolean
│   │   ├── friends: string[]
│   │   ├── friendRequestsSent: string[]
│   │   ├── friendRequestsReceived: string[]
│   │   ├── createdAt: Timestamp
│   │   └── updatedAt: Timestamp
│
├── schedules/
│   ├── {scheduleId} (Schedule documents)
│   │   ├── sessionType: string
│   │   ├── startTime: Timestamp
│   │   ├── endTime: Timestamp
│   │   ├── coachId: string
│   │   ├── coachName: string
│   │   ├── capacity: number
│   │   ├── spotsRemaining: number
│   │   ├── defaultProgramId?: string
│   │   ├── location?: string
│   │   └── description?: string
│
├── bookings/
│   ├── {bookingId} (Booking documents)
│   │   ├── userId: string
│   │   ├── sessionId: string
│   │   ├── programId: string
│   │   ├── bookedAt: Timestamp
│   │   └── status: 'active' | 'cancelled'
│
├── programs/
│   ├── {programId} (Program documents)
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── type: 'strength' | 'cardio' | 'hybrid' | 'flexibility' | 'other'
│   │   ├── durationWeeks?: number
│   │   ├── exercises?: string[]
│   │   ├── isActive: boolean
│   │   ├── createdBy: string
│   │   └── createdAt: Timestamp
│
├── programAssignments/
│   └── {assignmentId} (ProgramAssignment documents)
│
├── friendRequests/
│   └── {requestId} (FriendRequest documents)
│
└── friendships/
    └── {friendshipId} (Friendship documents)
```

---

## Troubleshooting

### "Permission denied" errors:
- ✅ Check Firestore rules are deployed
- ✅ Verify user is authenticated
- ✅ Confirm user has correct role in Firestore `users` collection

### Seed script fails:
- ✅ Ensure Firebase Admin SDK is installed
- ✅ Check service account key is valid
- ✅ Verify project ID matches in .env

### No data showing in app:
- ✅ Run seed script first
- ✅ Check browser console for errors
- ✅ Verify Firestore connection in Network tab

### Rules deployment fails:
- ✅ Run `firebase login` first
- ✅ Verify `firebase use gymapp-85740` is set
- ✅ Check rules syntax is valid

---

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit service account keys** to git
   - Already in `.gitignore` as `serviceAccountKey.json`

2. **Use environment variables** for sensitive data
   - Firebase config uses `import.meta.env.VITE_*` variables

3. **Deploy production rules** before going live
   - Current rules expire: Never (production-ready)
   - Previous rules expired: December 6, 2025 (development only)

4. **Test security rules** before deployment
   - Use Firebase Emulator Suite for testing

5. **Rotate API keys** if exposed
   - Firebase Console > Project Settings > General > Web API Key

---

## Next Steps

After setup is complete:

1. ✅ Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. ✅ Seed database: `npm run seed`
3. ✅ Run dev server: `npm run dev`
4. ✅ Login and test all features
5. ⏭️ Continue with remaining tasks (TASK-038, TASK-039, etc.)
6. ⏭️ Build for production: `npm run build`
7. ⏭️ Deploy to Firebase Hosting: `firebase deploy`

---

## Additional Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

**Generated with Claude Code** - Your Firebase setup is now complete! 🚀
