# Phase 3 Quick Start Guide

**Created:** 2025-11-10  
**Purpose:** Fast reference for initiating Phase 3 feature implementation

---

## 🚀 Ready to Start? Here's What to Do

### Step 1: Start First Jules Task (TASK-036)

Copy and run this command:

```bash
jules new "Implement the schedule booking system for GymApp with the following requirements:

CONTEXT:
- Location: src/features/schedule/
- Use existing Firebase services (scheduleService.ts)
- Follow feature-driven architecture
- Reference types in src/types/index.ts

FEATURES TO IMPLEMENT:

1. SCHEDULE VIEW COMPONENT (src/features/schedule/components/ScheduleView.tsx)
   - Display schedule as a calendar/list view
   - Show session details: time, type, coach, capacity, spots remaining
   - Filter by date range and session type
   - Real-time updates from Firestore
   - Highlight sessions user is booked into
   - Show friend activity (if privacy settings allow)
   - Click to open BookingModal

2. BOOKING MODAL COMPONENT (src/features/schedule/components/BookingModal.tsx)
   - Display selected session details
   - Show current booking status
   - Program selection dropdown:
     * Default session program
     * User's assigned personal programs (if any)
   - Book button (disabled if full or already booked)
   - Cancel booking button (if already booked)
   - Confirm/Cancel actions
   - Error handling and loading states

3. SCHEDULE SERVICE UPDATES (src/services/firebase/scheduleService.ts)
   - getSchedules(startDate, endDate, filters) - with real-time listener
   - getSessionById(sessionId)
   - bookSession(sessionId, userId, programId)
   - cancelBooking(bookingId, sessionId, userId)
   - getUserBookings(userId)
   - checkSessionCapacity(sessionId)
   - getSessionBookings(sessionId) - for roster view

4. FIRESTORE OPERATIONS:
   - Query schedules collection with date range
   - Transaction for booking (ensure capacity not exceeded)
   - Update spots_remaining atomically
   - Create booking document in bookings collection
   - Handle concurrent bookings safely

5. TYPES TO ADD (src/types/index.ts):
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

REQUIREMENTS:
- Use Firestore transactions for bookings
- Implement optimistic UI updates
- Show clear error messages
- Handle edge cases (session full, double booking)
- Use Tailwind CSS for styling
- Add loading skeletons
- Make responsive for mobile

FILES TO CREATE/MODIFY:
- src/features/schedule/components/ScheduleView.tsx (rewrite)
- src/features/schedule/components/BookingModal.tsx (rewrite)
- src/services/firebase/scheduleService.ts (add functions)
- src/types/index.ts (add types)

VERIFICATION:
- User can view schedule
- User can book available sessions
- User can cancel their bookings
- Program selection works
- Capacity enforced correctly
- Real-time updates work"
```

**Expected Output:** Session ID (e.g., 2889372153784130901)

---

### Step 2: Monitor Progress (Wait 5+ Minutes)

```bash
# Check all sessions
jules remote list --session

# Check specific session
jules remote status --session [YOUR_SESSION_ID]
```

**Expected Duration:** 60-90 minutes

---

### Step 3: Integrate Results (When Complete)

```powershell
# Pull changes
jules remote pull --session [YOUR_SESSION_ID] --apply

# Verify files
cd d:\dev\gymApp
Test-Path src\features\schedule\components\ScheduleView.tsx
Test-Path src\features\schedule\components\BookingModal.tsx

# Build
npm run build

# Commit
git add .
git commit -m "feat: implement schedule booking system

- Add ScheduleView with calendar display
- Implement BookingModal with program selection
- Add schedule service Firestore operations
- Support booking, canceling, capacity checks
- Add real-time updates
- Include Schedule and Booking types

Implements core PoC booking workflow."

git push origin main
```

---

## 📋 Subsequent Tasks

After TASK-036 completes, proceed with:

1. **TASK-037** - Admin Schedule Management (45-60 min)
2. **TASK-038** - Program Creation & Assignment (45-60 min)
3. **TASK-039** - Privacy-First Friend System (60-75 min)
4. **TASK-040** - Friend Activity Display (30-45 min)
5. **TASK-041** - Profile Enhancements (30-45 min)

**See `.dev-pipeline/tasklist.md` for detailed instructions for each task.**

---

## 🎯 Quick Reference

| What | Where |
|------|-------|
| Full task details | `.dev-pipeline/tasklist.md` (TASK-036 to TASK-041) |
| Integration steps | `.dev-pipeline/tasklist.md` (TASK-042 to TASK-047) |
| Current status | `.dev-pipeline/STATUS-REPORT.md` |
| Next actions | `.dev-pipeline/ACTION-QUEUE.md` |
| Workflow spec | `.dev-pipeline/MULTI-AGENT-WORKFLOW-SPECIFICATION.md` |

---

## ⚠️ Important Notes

- Wait **minimum 5 minutes** between Jules status checks
- Always run `npm run build` before committing
- Update STATUS-REPORT.md after each integration
- **Never run `npm run dev`** in Gemini CLI (hangs indefinitely)

---

## 🚦 Status Indicators

When checking Jules status:
- `in progress` → Still working, wait longer
- `complete` → Ready to pull and integrate
- `failed` → Check logs with `jules remote logs --session [ID]`

---

**Ready to go! Start with Step 1 above. 🚀**
