# GymApp - Action Queue

**Last Updated:** 2025-11-10
**Priority:** HIGH - Ready to Execute Phase 3

---

## 🎯 IMMEDIATE ACTIONS REQUIRED

### ✅ COMPLETED TODAY
1. ✅ Dev server verified working by human
2. ✅ Phase 3 feature tasks defined (15 tasks)
3. ✅ STATUS-REPORT.md updated
4. ✅ Jules tasks positioned at top of list for asynchronous execution

---

## 🚀 NEXT ACTIONS - Phase 3 Feature Implementation

### Priority 1: START JULES TASK-036 (Schedule Booking System)
**Who:** Gemini CLI or Human  
**What:** Initiate Jules session for core booking workflow  
**Why:** Foundation feature for entire PoC - must be implemented first

**Command:**
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

**After Execution:**
- Note the session ID returned by Jules
- Wait minimum 5 minutes before checking status
- Proceed to Priority 2

---

### Priority 2: MONITOR JULES SESSION
**Who:** Gemini CLI  
**What:** Check Jules progress and wait for completion  
**When:** After 5+ minutes from session start

**Commands:**
```bash
# Check all sessions
jules remote list --session

# Check specific session status
jules remote status --session [SESSION_ID]

# When status shows "complete", proceed to Priority 3
```

**Expected Duration:** 60-90 minutes for TASK-036

---

### Priority 3: INTEGRATE JULES RESULTS (TASK-042)
**Who:** Gemini CLI  
**What:** Pull changes and verify implementation

**Commands:**
```powershell
# Pull and apply changes
jules remote pull --session [SESSION_ID] --apply

# Verify changes
cd d:\dev\gymApp
git status
git diff

# Verify expected files
Test-Path src\features\schedule\components\ScheduleView.tsx
Test-Path src\features\schedule\components\BookingModal.tsx
Test-Path src\services\firebase\scheduleService.ts

# Build verification
npm run build

# If successful, commit
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

# Update status
# Edit .dev-pipeline\STATUS-REPORT.md
# Mark TASK-036 and TASK-042 as COMPLETE
```

---

### Priority 4: CONTINUE WITH REMAINING JULES TASKS
**Who:** Gemini CLI + Jules  
**What:** Execute TASK-037 through TASK-041 in sequence or parallel

**Sequence:**
1. TASK-037 - Admin Schedule Management (depends on TASK-036 types)
2. TASK-038 - Program Creation & Assignment (builds on TASK-037)
3. TASK-039 - Privacy-First Friend System (independent, can run in parallel)
4. TASK-040 - Friend Activity Display (depends on TASK-036 + TASK-039)
5. TASK-041 - Profile Enhancements (depends on TASK-038 + TASK-039)

**Recommended Approach:**
- Start TASK-037 after TASK-036 complete
- While TASK-037 runs, can start TASK-039 (friend system) in parallel
- Follow same integration pattern for each

---

### Priority 5: FINALIZE PHASE 3
**Who:** Gemini CLI  
**What:** Complete remaining coordination tasks

**Tasks:**
- TASK-048 - Phase 3 Checkpoint
- TASK-049 - Create Firestore Rules
- TASK-050 - Update README Documentation

---

## 📋 TASK REFERENCE

**See:** `.dev-pipeline/tasklist.md` for complete task details

**Phase 3 Summary:**
- 6 Jules implementation tasks (TASK-036 to TASK-041)
- 9 Gemini coordination tasks (TASK-042 to TASK-050)
- Estimated total time: 6-8 hours

---

## ⚠️ CRITICAL REMINDERS

### For Gemini CLI:
1. ⏰ Wait minimum 5 minutes before checking Jules status
2. 🚫 NEVER run `npm run dev` (hangs indefinitely - see GEMINI-STANDING-ORDERS.md)
3. ✅ Always run `npm run build` before committing
4. 📝 Update STATUS-REPORT.md after each major task
5. 🔄 Use `jules remote list --session` to check progress

### For Jules Tasks:
- Each task has detailed instructions in tasklist.md
- Follow the exact file structure specified
- All tasks use TypeScript + Tailwind CSS
- Reference existing service layer and types
- Implement proper error handling

---

## 🎯 SUCCESS CRITERIA

Phase 3 will be complete when:
- ✅ All 6 Jules features implemented
- ✅ All features integrated and committed
- ✅ All builds pass
- ✅ Firestore rules created
- ✅ Documentation updated
- ✅ STATUS-REPORT.md shows Phase 3 COMPLETE

---

## 📊 CURRENT STATE

**Phase:** 3 - Feature Implementation  
**Status:** READY TO BEGIN  
**Next Task:** TASK-036 (Schedule Booking System)  
**Blocking Issues:** None  
**Build Status:** ✅ Passing  
**Dev Server:** ✅ Verified Working  

**All systems GO for Phase 3 execution! 🚀**

---

**Last Updated:** 2025-11-10
