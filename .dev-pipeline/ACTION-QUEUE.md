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

### Priority 1: INITIATE JULES TASKS (Phase 3 Feature Implementation)
**Who:** Gemini CLI  
**What:** Initiate Jules sessions for all pending feature implementation tasks.  
**Why:** To kickstart core PoC feature development.

**Instructions:**
Execute the following `jules new` commands for each task. After each command, note the returned session ID and update the corresponding task in `tasklist.md` with the session ID and status `IN_PROGRESS`.

**TASK-036: Implement Schedule Booking System (REQUIRES_RE_RUN)**
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

**TASK-037: Implement Admin Schedule Management (REQUIRES_RE_RUN)**
```bash
jules new "Implement admin schedule management for GymApp:

CONTEXT:
- Location: src/features/admin/
- Admin/Coach roles only
- Use scheduleService.ts
- Must show session rosters

FEATURES TO IMPLEMENT:

1. SCHEDULE MANAGER COMPONENT (src/features/admin/components/ScheduleManager.tsx)
   - Calendar view of all sessions
   - Create new session button → opens SessionFormModal
   - Click session to edit → opens SessionFormModal with data
   - View roster button → opens RosterModal
   - Delete session with confirmation
   - Bulk delete for past sessions
   - Filter and search

2. SESSION FORM MODAL (src/features/admin/components/SessionFormModal.tsx)
   - Form fields:
     * Session type (dropdown)
     * Date and time (date picker)
     * Duration
     * Coach selection (dropdown of coaches)
     * Capacity (number input)
     * Default program (optional)
     * Location
     * Description
   - Validation
   - Create/Update modes
   - Save to Firestore

3. ROSTER MODAL (src/features/admin/components/RosterModal.tsx)
   - List all members booked into selected session
   - Show: member name, program selected, booking time
   - Manual add member (search by name/Friend ID)
   - Remove booking (with confirmation)
   - Export roster (CSV)
   - Real-time updates

4. SCHEDULE SERVICE ADDITIONS (src/services/firebase/scheduleService.ts):
   - createSchedule(scheduleData)
   - updateSchedule(sessionId, updates)
   - deleteSchedule(sessionId)
   - bulkDeleteSchedules(sessionIds)
   - getSessionRoster(sessionId) - returns bookings with user details
   - adminAddBooking(sessionId, userId, programId)
   - adminRemoveBooking(bookingId)

REQUIREMENTS:
- Only admin/coach can access
- Validate all inputs
- Prevent deletion of sessions with bookings (or confirm)
- Show loading states
- Error handling
- Use Lucide React icons
- Mobile responsive

FILES TO CREATE/MODIFY:
- src/features/admin/components/ScheduleManager.tsx (rewrite)
- src/features/admin/components/SessionFormModal.tsx (new)
- src/features/admin/components/RosterModal.tsx (new)
- src/services/firebase/scheduleService.ts (add admin functions)

VERIFICATION:
- Admin can create sessions
- Admin can edit sessions
- Admin can delete sessions
- Admin can view rosters
- Admin can manually add/remove bookings"
```

**TASK-038: Implement Program Creation & Assignment (REQUIRES_RE_RUN)**
```bash
jules new "Implement program management for GymApp:

CONTEXT:
- Location: src/features/admin/
- Programs assigned by coaches to members
- Members select program when booking
- Programs referenced in types/index.ts

FEATURES TO IMPLEMENT:

1. PROGRAM MANAGER COMPONENT (src/features/admin/components/ProgramManager.tsx)
   - List all programs (searchable/filterable)
   - Create program button → opens ProgramFormModal
   - Edit program → opens ProgramFormModal
   - Delete program (check if assigned first)
   - Assign program to member → opens AssignProgramModal
   - View assignments

2. PROGRAM FORM MODAL (src/features/admin/components/ProgramFormModal.tsx)
   - Form fields:
     * Program name
     * Description
     * Program type (strength, cardio, hybrid, etc.)
     * Duration (weeks)
     * Exercises (simple list for PoC)
     * Active/Inactive toggle
   - Create/Update modes
   - Validation

3. ASSIGN PROGRAM MODAL (src/features/admin/components/AssignProgramModal.tsx)
   - Search member by name or Friend ID
   - Display member info
   - Select program from dropdown
   - Set assignment dates (start, end)
   - Add notes
   - Submit assignment

4. PROGRAM SERVICE (src/services/firebase/programService.ts) - NEW FILE:
   - createProgram(programData)
   - updateProgram(programId, updates)
   - deleteProgram(programId)
   - getPrograms() - all programs
   - getProgramById(programId)
   - assignProgram(programId, userId, startDate, endDate, notes)
   - unassignProgram(assignmentId)
   - getUserPrograms(userId) - get user's active programs
   - getProgramAssignments(programId) - who has this program

5. TYPES TO ADD (src/types/index.ts):
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

REQUIREMENTS:
- Admin/Coach only access
- Programs must be active to assign
- Member can have multiple active programs
- Show in booking modal dropdown
- Validation on all forms
- Error handling

FILES TO CREATE/MODIFY:
- src/features/admin/components/ProgramManager.tsx (rewrite)
- src/features/admin/components/ProgramFormModal.tsx (new)
- src/features/admin/components/AssignProgramModal.tsx (new)
- src/services/firebase/programService.ts (new)
- src/types/index.ts (add types)
- src/features/schedule/components/BookingModal.tsx (add program selection)

VERIFICATION:
- Admin can create programs
- Admin can assign to members
- Members see programs in booking modal
- Can select program when booking"
```

**TASK-039: Implement Privacy-First Friend System (READY_FOR_JULES)**
```bash
jules new "Implement privacy-first friend system for GymApp:

CONTEXT:
- Location: src/features/social/
- Friend ID is ONLY searchable identifier
- Double opt-in: request → accept/deny
- Activity sharing is opt-in per user
- Reference types/index.ts

FEATURES TO IMPLEMENT:

1. FRIEND MANAGER COMPONENT (src/features/social/components/FriendManager.tsx)
   - Display user's Friend ID prominently (copy button)
   - Search bar: "Search by Friend ID"
   - Send friend request button (after search)
   - Tabs:
     * Friends (confirmed friendships)
     * Pending Sent (requests user sent)
     * Pending Received (requests user received)
   - Accept/Deny buttons for received requests
   - Remove friend (with confirmation)
   - Activity sharing toggle per user

2. FRIEND SEARCH (src/features/social/components/FriendSearch.tsx)
   - Input for exact Friend ID match
   - Search button
   - Display found user (name, Friend ID only - no other info)
   - Send request button
   - Handle not found case
   - Privacy notice

3. FRIEND LIST (src/features/social/components/FriendList.tsx)
   - List confirmed friends
   - Show friend name, Friend ID
   - Activity sharing status indicator
   - Remove friend button
   - Empty state message

4. FRIEND REQUESTS (src/features/social/components/FriendRequests.tsx)
   - Separate sections for sent/received
   - Show requester/recipient info
   - Accept/Deny buttons (received)
   - Cancel button (sent)
   - Request date

5. FRIEND SERVICE (src/services/firebase/friendService.ts) - NEW FILE:
   - searchByFriendId(friendId) - returns public user data only
   - sendFriendRequest(fromUserId, toUserId)
   - acceptFriendRequest(requestId)
   - denyFriendRequest(requestId)
   - cancelFriendRequest(requestId)
   - removeFriend(friendshipId)
   - getUserFriends(userId)
   - getPendingRequests(userId, type: 'sent' | 'received')
   - updateActivitySharing(userId, friendId, shareActivity: boolean)
   - getFriendsWithActivitySharing(userId) - for schedule view

6. TYPES TO ADD (src/types/index.ts):
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'denied';
  createdAt: Timestamp;
  respondedAt?: Timestamp;
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

FIRESTORE STRUCTURE:
friendRequests/
  {requestId}: { fromUserId, toUserId, status, createdAt }

friendships/
  {friendshipId}: { user1Id, user2Id, createdAt, sharing settings }

REQUIREMENTS:
- NEVER expose email or real names in search
- Only Friend ID is searchable
- Double opt-in required
- Activity sharing OFF by default
- Clear privacy messaging
- Real-time updates for requests
- Validate Friend ID format

FILES TO CREATE/MODIFY:
- src/features/social/components/FriendManager.tsx (rewrite)
- src/features/social/components/FriendSearch.tsx (new)
- src/features/social/components/FriendList.tsx (new)
- src/features/social/components/FriendRequests.tsx (new)
- src/services/firebase/friendService.ts (new)
- src/types/index.ts (add types)

VERIFICATION:
- Can search only by Friend ID
- Can send friend requests
- Can accept/deny requests
- Activity sharing toggles work
- Privacy maintained"
```

**TASK-040: Implement Friend Activity in Schedule View (READY_FOR_JULES)**
```bash
jules new "Add friend activity to schedule view for GymApp:

CONTEXT:
- Enhance existing ScheduleView component
- Show friend bookings on schedule
- Respect privacy: only show if BOTH users share activity
- Use existing friendService and scheduleService

FEATURES TO IMPLEMENT:

1. SCHEDULE VIEW UPDATES (src/features/schedule/components/ScheduleView.tsx)
   - Add friend activity section to each session card
   - Show avatars/names of friends booked in
   - "3 friends attending" indicator
   - Hover/click to see friend names
   - Empty state: "None of your friends are attending"
   - Only visible if user has friends with sharing ON

2. FRIEND ACTIVITY BADGE (src/features/schedule/components/FriendActivityBadge.tsx)
   - Small component showing friend info
   - Friend count bubble
   - Expandable list on click
   - Icons using Lucide React

3. SCHEDULE SERVICE UPDATES (src/services/firebase/scheduleService.ts):
   - getFriendActivityForSession(sessionId, userId) - returns friends booked
   - This should:
     * Get user's friends with activity sharing ON
     * Check which of those friends are booked into session
     * Return array of friend names/IDs

4. FRIEND SERVICE ADDITION (src/services/firebase/friendService.ts):
   - getFriendsWithActivitySharing(userId) - returns list of friend IDs

REQUIREMENTS:
- Respect privacy (both must share)
- Performance: don't query for every session
- Batch operations where possible
- Subtle UI (don't overwhelm schedule)
- Mobile friendly
- Real-time updates

FILES TO CREATE/MODIFY:
- src/features/schedule/components/ScheduleView.tsx (modify)
- src/features/schedule/components/FriendActivityBadge.tsx (new)
- src/services/firebase/scheduleService.ts (add function)
- src/services/firebase/friendService.ts (add function)

VERIFICATION:
- Friend activity shows on sessions
- Only shows when both share activity
- Updates in real-time
- Performance is acceptable
- UI is clear and not cluttered"
```

**TASK-041: Enhance User Profile with Programs & Settings (READY_FOR_JULES)**
```bash
jules new "Enhance user profile page for GymApp:

CONTEXT:
- Location: src/pages/ProfilePage.tsx and src/features/auth/
- Show user's assigned programs
- Privacy settings
- Friend management integration

FEATURES TO IMPLEMENT:

1. USER PROFILE DETAILS UPDATE (src/features/auth/UserProfileDetails.tsx)
   - Current: name, email, role, Friend ID
   - Add sections:
     * My Programs (show assigned programs with dates)
     * Activity Sharing (global toggle)
     * Account settings (change display name)

2. MY PROGRAMS SECTION (src/features/auth/components/MyPrograms.tsx) - NEW
   - List active program assignments
   - Show: program name, assigned by, dates
   - View program details button
   - "No programs assigned" empty state

3. PROGRAM DETAILS MODAL (src/features/auth/components/ProgramDetailsModal.tsx) - NEW
   - Display full program info
   - Exercises list
   - Duration, type
   - Notes from coach
   - Close button

4. PRIVACY SETTINGS (src/features/auth/components/PrivacySettings.tsx) - NEW
   - Global activity sharing toggle
   - Explanation of what's shared
   - Link to friend management

5. USER SERVICE UPDATES (src/services/firebase/userService.ts):
   - getUserPrograms(userId) - get assigned programs
   - updateActivitySharing(userId, shareActivity: boolean)
   - updateDisplayName(userId, newName: string)

REQUIREMENTS:
- Clean, organized layout
- Show active vs completed programs
- Privacy controls prominent
- Mobile responsive
- Real-time updates

FILES TO CREATE/MODIFY:
- src/features/auth/UserProfileDetails.tsx (enhance)
- src/features/auth/components/MyPrograms.tsx (new)
- src/features/auth/components/ProgramDetailsModal.tsx (new)
- src/features/auth/components/PrivacySettings.tsx (new)
- src/services/firebase/userService.ts (add functions)
- src/pages/ProfilePage.tsx (restructure layout)

VERIFICATION:
- User sees assigned programs
- Can toggle activity sharing
- Can update display name
- Layout is organized"
```

**After Execution:**
- Note the session ID returned by Jules for each task.
- Update the corresponding task in `tasklist.md` with the session ID and status `IN_PROGRESS`.
- Wait minimum 5 minutes before checking status of any session.
- Proceed to Priority 2.

---



### Priority 2: MONITOR JULES SESSIONS
**Who:** Gemini CLI  
**What:** Check Jules progress for all initiated sessions and wait for completion.  
**When:** After 5+ minutes from session start (for each session).

**Commands:**
```bash
# Check all active sessions
jules remote list --session

# Check specific session status
jules remote status --session [SESSION_ID]

# When status shows "complete" for a session, proceed to Priority 3 for that session.
```

**Expected Duration:** 30-90 minutes per task.

---

### Priority 3: INTEGRATE JULES RESULTS (for a specific task)
**Who:** Gemini CLI  
**What:** Pull changes, install dependencies, verify build, and commit implementation for a completed Jules task.

**Commands:**
```powershell
# Pull and apply changes for the completed session
jules remote pull --session [SESSION_ID] --apply

# Install any new dependencies
npm install

# Verify changes
cd d:\dev\gymApp
git status
git diff

# Run build verification
npm run build

# If successful, commit (use appropriate commit message for the task)
git add .
git commit -m "feat: implement [TASK_DESCRIPTION_HERE]

- [Bullet point summary of changes]

Implements core PoC [FEATURE_AREA] workflow."

git push origin main

# Update status
# Edit .dev-pipeline\STATUS-REPORT.md
# Mark the specific TASK and its corresponding Gemini Verification Task as COMPLETE
# Edit .dev-pipeline\tasklist.md to update the task status to COMPLETE
```

---

### Priority 4: CONTINUE WITH REMAINING JULES TASKS
**Who:** Gemini CLI + Jules  
**What:** Execute remaining Jules tasks (TASK-037 through TASK-041) in sequence or parallel, following the integration pattern.

**Recommended Approach:**
- Start TASK-037 (Admin Schedule Management) after TASK-036 (Schedule Booking) is fully integrated.
- While TASK-037 is running, consider starting TASK-039 (Privacy-First Friend System) as it is largely independent.
- Follow the same integration pattern (Priority 3) for each completed Jules task.
- Dependent tasks should only be initiated once their prerequisites are fully integrated.

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
**Next Task:** Initiate Jules Tasks (Priority 1)  
**Blocking Issues:** None  
**Build Status:** ✅ Passing  
**Dev Server:** ✅ Verified Working  

**All systems GO for Phase 3 execution! 🚀**

---

**Last Updated:** 2025-11-10
