# Seed Data Guide - GymApp PoC

**Created:** 2025-11-15
**Task:** TASK-056 - Create Demo/Seed Data Script
**Status:** ✅ COMPLETE

---

## Overview

The enhanced seed data script (`scripts/seedData.ts`) populates Firestore with realistic demo data for testing and demonstrations.

### What It Creates

| Data Type | Quantity | Details |
|-----------|----------|---------|
| **Users** | 30 total | 2 admins, 3 coaches, 25 members |
| **Programs** | 8 programs | Various types (strength, cardio, hybrid, flexibility) |
| **Schedules** | 70 sessions | 2 weeks of future sessions (5 per day) |
| **Bookings** | ~35 bookings | Realistic patterns, some sessions at/near capacity |
| **Social Data** | 10 + 5 | 10 friendships + 5 pending friend requests |

---

## Usage

### Prerequisites

1. **Service Account Key**
   - File: `serviceAccountKey.json` in project root
   - Contains Firebase Admin SDK credentials
   - Required for authentication

2. **Environment Variables**
   - `.env` file with Firebase configuration
   - `VITE_FIREBASE_*` variables

### Commands

**Standard Seed (Idempotent):**
```bash
npm run seed:demo
```
- Prompts for confirmation
- Skips existing users
- Safe to run multiple times

**Auto-Confirm (No Prompts):**
```bash
npm run seed:demo -- -y
```
- Automatically confirms without prompting
- Useful for CI/CD pipelines

**Clear and Reseed:**
```bash
npm run seed:demo:clear
```
- ⚠️ **DANGER:** Deletes ALL existing data
- Clears users, schedules, programs, bookings, friend requests
- Prompts for confirmation (use `--clear -y` to skip)

---

## Generated Test Accounts

### Admins (2)
```
Email:    admin@gymapp.com
Password: Admin123!
Role:     admin
Friend ID: ADM00001

Email:    admin2@gymapp.com
Password: Admin123!
Role:     admin
Friend ID: ADM00002
```

### Coaches (3)
```
Email:    coach1@gymapp.com
Password: Coach123!
Name:     Coach Sarah
Friend ID: CCH00001

Email:    coach2@gymapp.com
Password: Coach123!
Name:     Coach Mike
Friend ID: CCH00002

Email:    coach3@gymapp.com
Password: Coach123!
Name:     Coach Emily
Friend ID: CCH00003
```

### Members (25)
```
Email:    member1@gymapp.com to member25@gymapp.com
Password: Member123!
Names:    Realistic first + last names (e.g., Emma Smith, Liam Johnson)
Friend IDs: MEM00001 to MEM00025
Activity Sharing: ~67% enabled (varies by user)
```

---

## Generated Data Details

### Programs (8)

1. **Beginner Strength Foundation** (8 weeks, strength)
2. **HIIT Cardio Blast** (4 weeks, cardio)
3. **Functional Fitness Pro** (12 weeks, hybrid)
4. **Advanced Olympic Lifting** (16 weeks, strength)
5. **Mobility & Recovery** (6 weeks, flexibility)
6. **CrossFit Fundamentals** (8 weeks, hybrid)
7. **Endurance Builder** (10 weeks, cardio)
8. **Powerlifting Program** (12 weeks, strength) - INACTIVE

### Schedules (70 sessions over 2 weeks)

**Daily Schedule Pattern:**
- **Morning:** 6 AM, 7 AM, 8 AM (3 sessions)
- **Evening:** 5 PM, 6 PM (2 sessions)
- **Total:** 5 sessions per day × 14 days = 70 sessions

**Session Types:**
- Morning Strength
- Lunch HIIT
- Evening CrossFit
- Morning Yoga
- Evening Spin
- Functional Fitness
- Olympic Lifting
- Mobility & Recovery

**Locations:**
- Main Gym
- Studio A
- Studio B
- Outdoor Area

**Capacities:**
- Morning sessions: 10, 15, 20 spots
- Evening sessions: 12, 15 spots

**Special Cases:**
- First morning session (today 6 AM): 5 bookings (8/12 spots remaining)
- Second evening session (today 6 PM): FULL (0 spots remaining)

### Bookings (~35)

**Realistic Patterns:**
- 5 members booked into first morning session (today 6 AM)
- 12 members booked into evening session (today 6 PM) - FULL
- Random bookings across next 20 sessions
- Varies by member (some heavy users, some light users)

### Social Data

**Friendships (10):**
- Member 1 ↔ Member 6
- Member 2 ↔ Member 7
- Member 3 ↔ Member 8
- Member 4 ↔ Member 9
- Member 5 ↔ Member 10
- (and 5 more pairs)

**Pending Friend Requests (5):**
- Member 11 → Member 16
- Member 12 → Member 17
- Member 13 → Member 18
- Member 14 → Member 19
- Member 15 → Member 20

**Activity Sharing:**
- Enabled for ~67% of members (17 out of 25)
- Can be toggled in user profile settings

---

## Testing Scenarios

### Scenario 1: Member Booking Flow
1. Login as `member1@gymapp.com`
2. Navigate to Schedule
3. View upcoming sessions
4. Click on available session
5. Select program from dropdown
6. Click "Book Session"
7. Verify booking appears with checkmark
8. Test cancellation

### Scenario 2: Friend System
1. Login as `member1@gymapp.com`
2. Navigate to Social/Profile
3. Search for friend by ID: `MEM00010`
4. Send friend request
5. Login as `member10@gymapp.com`
6. Accept friend request
7. Verify friendship in both profiles
8. Book same session
9. Verify friend activity badge shows

### Scenario 3: Admin Workflow
1. Login as `admin@gymapp.com`
2. Navigate to Admin Dashboard
3. View all schedules (70 sessions)
4. Click "Create Session"
5. Fill form with new session details
6. Save and verify in list
7. Click roster icon on full session (today 6 PM)
8. View 12 booked members
9. Export roster to CSV

### Scenario 4: Coach Program Management
1. Login as `coach1@gymapp.com`
2. Navigate to Admin → Programs
3. View existing 8 programs
4. Create new program
5. Assign to member
6. Login as member
7. Verify program appears in "My Programs"

### Scenario 5: Capacity Testing
1. Login as any member
2. Navigate to Schedule
3. Find today's 6 PM session (FULL - 0 spots)
4. Click on full session
5. Verify "Book Session" button is disabled
6. Verify UI shows "Session Full" or similar

### Scenario 6: Friend Activity Privacy
1. Login as `member1@gymapp.com` (shares activity)
2. Navigate to Profile → Privacy Settings
3. Toggle "Share Activity" OFF
4. Login as friend (`member6@gymapp.com`)
5. Book same session
6. Verify friend badge does NOT show member1
7. Toggle back ON
8. Verify friend badge now shows member1

---

## Script Features

### ✅ Idempotent Operation
- Safe to run multiple times
- Checks if users already exist
- Skips existing records gracefully
- No duplicate data created

### ✅ Confirmation Prompts
- Asks before seeding
- Extra warning for `--clear` flag
- Can be bypassed with `-y` flag

### ✅ Progress Logging
- Clear status updates during execution
- Shows what's being created
- Displays errors if any occur
- Final summary with counts

### ✅ Data Relationships
- Programs linked to coaches who created them
- Schedules linked to coaches and programs
- Bookings linked to users, sessions, and programs
- Friendships bidirectional
- Friend requests unidirectional

### ✅ Realistic Data
- Varied session types and times
- Different capacity levels
- Some sessions full, some empty, some partial
- Mix of booking patterns
- Realistic friend connections
- Privacy settings varied

---

## Troubleshooting

### Error: "serviceAccountKey.json not found"
**Solution:**
1. Download service account key from Firebase Console
2. Project Settings → Service Accounts → Generate New Private Key
3. Save as `serviceAccountKey.json` in project root
4. **DO NOT commit this file to Git** (already in .gitignore)

### Error: "auth/email-already-exists"
**Expected Behavior:** Script will log "⏭️ Exists: email@example.com" and continue

**If you want fresh data:** Run with `--clear` flag
```bash
npm run seed:demo:clear
```

### Error: "Failed to create all required users"
**Solution:**
1. Check Firebase Authentication is enabled in console
2. Verify Email/Password provider is enabled
3. Check service account has correct permissions
4. Run with `--clear` to reset

### Sessions Not Showing in App
**Check:**
1. Date range - sessions are for next 2 weeks from today
2. Firestore rules deployed: `firebase deploy --only firestore:rules`
3. User logged in with correct credentials
4. Browser console for errors

### Friend Activity Not Showing
**Check:**
1. Both users have `shareActivity: true`
2. Users are actually friends (check Firestore `friends` array)
3. Both users booked same session
4. Privacy toggle working in UI

---

## Data Cleanup

### Clear All Seed Data
```bash
npm run seed:demo:clear
```

This will delete:
- All 30 test users (Auth + Firestore)
- All 8 programs
- All 70 schedules
- All ~35 bookings
- All friend connections and requests

**⚠️ WARNING:** Cannot be undone. Only use in development.

### Manual Cleanup
If script fails partway through, manually clean up in Firebase Console:
1. **Authentication** → Delete test users
2. **Firestore** → Delete documents from collections:
   - users
   - schedules
   - programs
   - bookings
   - friendRequests
   - programAssignments

---

## Next Steps

After seeding data:

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Login** with any test account (see above)

3. **Test Features:**
   - Member booking flow
   - Friend system
   - Admin schedule management
   - Program assignment
   - Privacy settings

4. **Run Lighthouse Audit**
   - Should score > 90 after performance optimizations

5. **Manual Testing**
   - Test on mobile devices
   - Test with screen reader
   - Test keyboard navigation
   - Test in different browsers

---

## Verification Checklist

After running seed script:

- [ ] All 30 users created in Firebase Auth
- [ ] All 30 user profiles in Firestore `users` collection
- [ ] All 8 programs in `programs` collection
- [ ] All 70 schedules in `schedules` collection
- [ ] ~35 bookings in `bookings` collection
- [ ] 10 friendships in user `friends` arrays
- [ ] 5 pending requests in `friendRequests` collection
- [ ] Can login as admin, coach, member
- [ ] Schedule page shows 70 sessions (may need to scroll/change date range)
- [ ] Admin page shows all sessions in table
- [ ] Programs page shows 8 programs (7 active, 1 inactive)
- [ ] Friend activity badges show on sessions where friends are booked
- [ ] First morning session shows 5 bookings
- [ ] Second evening session shows 12 bookings (FULL)

---

## Statistics

**Total Firestore Documents Created:** ~185
- users: 30
- programs: 8
- schedules: 70
- bookings: ~35
- friendRequests: 5
- programAssignments: 0 (can be created through UI)

**Total Firebase Auth Users:** 30

**Time to Seed:** ~30-45 seconds

**Estimated Firestore Reads (if querying all):** ~185
**Estimated Firestore Writes:** ~185

---

## Comparison to Original Seed Script

| Feature | `seedFirestore.ts` (Original) | `seedData.ts` (Enhanced) |
|---------|-------------------------------|--------------------------|
| Users | 4 (1 admin, 1 coach, 2 members) | 30 (2 admins, 3 coaches, 25 members) |
| Programs | 3 | 8 |
| Schedules | 4 (4 days) | 70 (14 days, 5 per day) |
| Bookings | 3 | ~35 (realistic patterns) |
| Social Data | None | 10 friendships + 5 pending requests |
| Clear/Reset | No | Yes (`--clear` flag) |
| Confirmation Prompt | No | Yes (can skip with `-y`) |
| Progress Logging | Basic | Detailed with counts |
| Idempotent | Partially | Fully idempotent |
| Realistic Data | Basic | Very realistic |

---

## Future Enhancements (Optional)

### Phase 2 Features (Not Implemented Yet)
- [ ] Program assignments (coach assigns program to member)
- [ ] Historical data (past sessions, completed workouts)
- [ ] User profile photos (placeholder images)
- [ ] Coach bios and specializations
- [ ] Session notes/descriptions from coaches
- [ ] Member attendance history
- [ ] Streak tracking data
- [ ] Waitlist functionality
- [ ] Recurring schedules (template-based)

### Advanced Seeding Options (Not Implemented Yet)
- [ ] Configurable quantities (via CLI flags)
- [ ] Date range selection
- [ ] Specific role counts
- [ ] Import from CSV
- [ ] Export current data to JSON

---

**Script Status:** ✅ COMPLETE
**Task Status:** ✅ TASK-056 COMPLETE
**Documentation:** This file

For questions or issues, refer to the script comments or check Firebase Console for actual data state.
