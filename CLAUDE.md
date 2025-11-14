# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GymApp is a Proof of Concept (PoC) gym membership application with social features, built as a foundation for a future B2B SaaS platform. The PoC validates core booking/scheduling workflows, admin management, and privacy-first social features.

**Current Status:** Active development, PoC phase

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Routing:** React Router DOM v6
- **Backend:** Firebase (Authentication, Firestore)
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation

## Development Commands

### Core Commands
```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Type check (no dedicated command - run build to verify)
npm run build
```

### Firebase Commands
```bash
# Deploy to Firebase App Hosting
firebase deploy --only apphosting

# View Firestore rules
cat firestore.rules

# View Firestore indexes
cat firestore.indexes.json
```

## Environment Setup

Required environment variables in `.env`:
```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""
```

## Architecture

### Feature-Driven Structure

The codebase follows a **feature-driven architecture** where code is organized by domain feature, not by type:

```
src/
├── components/        # Shared UI components (layout, common)
├── features/          # Domain-specific features
│   ├── auth/         # Authentication, ProtectedRoute
│   ├── schedule/     # Schedule viewing, booking
│   ├── admin/        # Admin management (schedules, programs)
│   ├── social/       # Friend management
│   └── programs/     # Program-related features
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Top-level page components
├── services/         # External service abstractions
│   └── firebase/     # Firebase service layer
├── store/            # Zustand stores
└── types/            # TypeScript type definitions
```

### Service Abstraction Pattern

**CRITICAL:** All Firebase operations MUST go through service files in `src/services/firebase/`. Components should NEVER directly import Firebase functions.

**Available Services:**
- `authService` - Sign in/out, get current user
- `userService` - User profile CRUD operations
- `scheduleService` - Session booking, cancellation, roster views
- `programService` - Program management
- `friendService` - Friend requests, friendships

**Example:**
```typescript
// ❌ WRONG - Direct Firebase import in component
import { getDoc, doc } from 'firebase/firestore';

// ✅ CORRECT - Use service layer
import { scheduleService } from '@/services/firebase/scheduleService';
```

### Authentication Flow

Authentication is handled through a Canvas environment integration with fallback support:

1. **Canvas Environment:** Expects global variables `__app_id` and `__initial_auth_token`
2. **Local Development:** Falls back to anonymous sign-in if globals are unavailable
3. **Auth Hook:** `useAuthInit()` initializes Firebase auth listener in `App.tsx`
4. **Auth Store:** Zustand store maintains `user` (Firebase User), `userProfile` (Firestore UserProfile), and `authReady` state

**Protected Routes:** Use `<ProtectedRoute>` component with optional `allowedRoles` prop for role-based access control.

### State Management

**Zustand Store (`authStore`):**
- Minimal global state for authentication
- Stores: `user`, `userProfile`, `authReady`
- Do NOT overuse - prefer local component state for feature-specific data

### Firestore Data Model

**Collections:**
- `users/{userId}` - User profile documents
- `schedules/{scheduleId}` - Gym session schedules
- `bookings/{bookingId}` - User bookings with `userId`, `sessionId`, `programId`
- `programs/{programId}` - Training programs
- `programAssignments/{assignmentId}` - Program assignments to users
- `friendRequests/{requestId}` - Friend request documents
- `friendships/{friendshipId}` - Confirmed friendships

**Key Pattern:** Most services use real-time listeners (`onSnapshot`) for live updates.

## Key Features

### PoC Scope (Implemented/In Progress)

1. **Authentication:** Custom token sign-in with Canvas integration
2. **Schedule Viewing:** Members view available sessions with date range filtering
3. **Booking System:** Book/cancel sessions with capacity tracking and program selection
4. **Admin Management:** Create schedules, manage programs, view rosters
5. **Social Features:** Privacy-first friend system using unique `friendId` (double opt-in)
6. **User Profiles:** Display user info with shareable `friendId`

### Privacy-First Social Model

- Users identified by unique, non-personal `friendId` (e.g., "User7234")
- Add friends by exact `friendId` search only (no name/email search)
- Double opt-in required: request → accept/deny
- Activity sharing is optional and controlled per-user via `shareActivity` flag

## Development Patterns

### Import Alias

Use `@/` for all imports from `src/`:
```typescript
import { useAuthStore } from '@/store/authStore';
import { scheduleService } from '@/services/firebase/scheduleService';
import type { UserProfile } from '@/types';
```

### Styling

- **Tailwind CSS v4** for all styling
- Use `cn()` utility from `@/lib/utils` to merge class names:
  ```typescript
  import { cn } from '@/lib/utils';
  <div className={cn("base-class", isActive && "active-class")} />
  ```

### TypeScript

- **Strict mode enabled** - all types must be explicit
- Type definitions in `src/types/index.ts`
- Use Firebase `Timestamp` type for dates in Firestore documents

### Component Patterns

**Page Components:** Located in `src/pages/`, compose features
**Feature Components:** Located in `src/features/{feature}/components/`
**Layout Components:** Located in `src/components/layout/`

## Common Gotchas

1. **Firebase Timestamps:** Firestore returns `Timestamp` objects, not JavaScript `Date`. Use `.toDate()` to convert.
2. **Canvas Globals:** `__app_id` and `__initial_auth_token` are only available in Canvas environment. Code should handle their absence gracefully.
3. **Real-time Listeners:** Services return unsubscribe functions - always clean up in `useEffect`:
   ```typescript
   useEffect(() => {
     const unsubscribe = scheduleService.getSchedules(start, end, null, setSchedules);
     return () => unsubscribe();
   }, [start, end]);
   ```
4. **Protected Routes:** Nested `<ProtectedRoute>` components enable role-based access. Admin routes use `allowedRoles={['admin', 'coach']}`.

## Future Scope (Not Yet Implemented)

Features outlined in `GymApp.md` Part 2 are out of scope for PoC:
- Personal goal tracking and streaks
- Modular onboarding engine
- Event management
- E-commerce/merchandise
- Service marketplace
- Native mobile apps

Placeholder directories exist in `src/features/` for future expansion (goals, events, store).

## Multi-Agent Workflow

This project uses a **collaborative multi-agent development workflow** where different AI agents work together to deliver features efficiently. Understanding this workflow is critical for effective development.

### Agent Hierarchy

```
┌─────────────────────────────────────────────┐
│   CLAUDE / CLAUDE CODE (Architects)         │
│   - High-level planning & strategy          │
│   - Feature design & specifications         │
│   - Interactive development & debugging     │
│   - Code review & quality decisions         │
└──────────────┬──────────────────────────────┘
               │ Strategic Direction
               ▼
┌─────────────────────────────────────────────┐
│   GEMINI CLI (Information Coordinator)      │
│   - Quick information retrieval             │
│   - Agent instruction & coordination        │
│   - Status monitoring & verification        │
│   - Git operations & checkpoints            │
└──────────────┬──────────────────────────────┘
               │ Task Instructions
               ▼
┌─────────────────────────────────────────────┐
│   JULES (Asynchronous Implementation)       │
│   - Complex multi-file implementations      │
│   - Broad context code generation           │
│   - Architecture-wide refactoring           │
│   - Asynchronous remote execution           │
└─────────────────────────────────────────────┘
```

### The `.dev-pipeline/` Communication Hub

The `.dev-pipeline/` directory is the **central nervous system** of the workflow:

**Purpose:**
- Persistent communication hub between agents
- Maintains project state across sessions
- Tracks task progress and agent handoffs
- Stores strategic documents and action queues

**Key Files:**
- `ACTION-QUEUE.md` - Immediate next actions and priorities
- `GEMINI-CONTINUE-INSTRUCTIONS.md` - Recovery instructions for Gemini
- `STATUS-REPORT.md` - Current project state and metrics
- `tasklist.md` - Detailed task breakdowns with agent assignments
- `MULTI-AGENT-WORKFLOW-SPECIFICATION.md` - Complete workflow documentation
- `GEMINI-STANDING-ORDERS.md` - Critical constraints for Gemini CLI
- `QUICK-START-PHASE3.md` - Fast reference for current phase

**Note:** This directory is excluded from version control via `.gitignore` to prevent pollution of git history with agent coordination artifacts.

### When to Use Each Agent

| Task Type | Use This Agent | Reason |
|-----------|---------------|---------|
| "How does the auth flow work?" | Claude Code | Interactive exploration and explanation |
| "Fix this TypeScript error" | Claude Code | Quick, focused fix with immediate feedback |
| "Review this PR code" | Claude Code | Code review and quality assessment |
| "Refactor this component" | Claude Code | Interactive refactoring with discussion |
| "Search for all API endpoints" | Gemini CLI | Large-scale codebase search |
| "Execute tasks from pipeline" | Gemini CLI | Automated task coordination |
| "Run git operations" | Gemini CLI | Git commits, status, checkpoints |
| "Implement 5+ file feature" | Jules | Complex, async implementation |
| "Build entire admin system" | Jules | Broad context, multi-file scaffolding |
| "Architecture-wide refactor" | Jules | Large-scale code changes |

### Claude Code's Role

**Claude Code** (this tool) serves as an **interactive architect and executor** with unique capabilities:

**Strengths:**
- **Interactive Development:** Real-time conversation during coding
- **Precise Edits:** Surgical changes to specific files
- **Code Review:** Detailed analysis and feedback
- **Debugging:** Step-by-step problem solving
- **Architectural Decisions:** Design discussions and trade-off analysis
- **Quick Fixes:** Immediate resolution of focused issues

**Best Used For:**
- Bug fixes and troubleshooting
- Small to medium refactoring (1-5 files)
- Code review and quality improvements
- Architectural guidance and design decisions
- TypeScript/linting error resolution
- Adding tests or documentation
- Answering "how does this work?" questions

**When NOT to Use:**
- Large multi-file implementations (use Jules)
- Automated task execution from pipeline (use Gemini)
- Long-running server processes
- Tasks requiring asynchronous cloud execution

### Task Handoff Patterns

**From Gemini to Claude Code:**
- Gemini encounters interactive debugging need
- Gemini documents in ACTION-QUEUE.md
- Human invokes Claude Code for specific issue
- Claude Code completes work and updates relevant files
- Gemini can resume pipeline execution

**From Jules to Claude Code:**
- Jules completes implementation
- Claude Code reviews the PR/changes
- Claude Code provides feedback or makes adjustments
- Changes committed and workflow continues

**Claude Code to Gemini:**
- Claude Code completes focused work
- Gemini picks up for broader pipeline execution
- Status updated in `.dev-pipeline/STATUS-REPORT.md`

### Workflow Integration

**Current Project Phase:** Phase 3 - Feature Implementation
- 35/50 tasks complete
- Jules tasks for complex features (booking system, admin UI, social features)
- Gemini tasks for integration and verification
- Claude Code available for review, fixes, and architectural guidance

**See `.dev-pipeline/MULTI-AGENT-WORKFLOW-SPECIFICATION.md` for complete workflow documentation.**

## Working with Jules CLI

**Jules** is Google's autonomous coding agent that executes complex implementations asynchronously in cloud VMs. Understanding how to work effectively with Jules is critical for this project's workflow.

### Jules Best Practices

#### 1. Task Specification Quality

**High-quality Jules tasks include:**
- **Clear Dependencies:** Document which tasks must complete first
- **File Scope:** State exact file count and modification scope ("creates 3 new files, modifies 2 existing")
- **Component Requirements:** Specify UI features with detail (loading states, error handling, responsive design)
- **Service Layer Needs:** List required service functions with signatures
- **Type Definitions:** Specify TypeScript types needed
- **Validation Rules:** Define form validation and error messages
- **Firebase Operations:** Detail Firestore collections, queries, and transactions

**Example Good Task Specification:**
```
Implement schedule booking system:
- Creates: BookingModal.tsx, uses existing ScheduleView.tsx
- Modifies: scheduleService.ts (add bookSession, cancelBooking functions)
- Types: Add Booking interface to types/index.ts
- Firestore: Use transactions for bookSession to prevent double-booking
- Validation: Check capacity before booking, show clear error if full
- UI: Loading spinner during booking, success/error toast messages
- Mobile responsive with Tailwind CSS
```

#### 2. Integration Workflow

**After Jules completes a session:**

```bash
# 1. Check Jules status
jules remote list --session

# 2. Pull the session (review changes first)
jules remote pull --session [SESSION_ID]

# 3. Try to apply (may fail if local changes occurred)
jules remote pull --session [SESSION_ID] --apply

# 4. If apply fails, manually integrate valuable changes
# Review the diff, extract improvements, apply them carefully

# 5. Verify all expected files exist
# Use Glob or Read to check each file Jules created

# 6. Run build verification
npm run build

# 7. Test key functionality
npm run dev
# Manually test the new feature

# 8. Commit with descriptive message
git add -A
git commit -m "feat: [description]"

# 9. Update STATUS-REPORT.md with completion
```

#### 3. Parallel Execution

**Jules can run multiple sessions simultaneously:**

```bash
# Identify independent tasks from tasklist.md
# Tasks with no dependencies can run in parallel

# Example: These can run together
jules remote new --repo . --session "Implement schedule booking system..."
jules remote new --repo . --session "Implement friend system..."

# Check all running sessions
jules remote list --session
```

**Benefits:**
- Faster development (2-3 features in same timeframe)
- Better resource utilization
- Reduced waiting time

**Caution:**
- Don't run dependent tasks in parallel
- May create merge conflicts if editing same files
- Coordinate with team to avoid duplicate work

#### 4. Firestore Transaction Patterns

**Jules tasks often require Firestore transactions for data integrity:**

```typescript
// Pattern for capacity-limited bookings
const bookSession = async (sessionId: string, userId: string) => {
  await runTransaction(db, async (transaction) => {
    const sessionRef = doc(db, 'schedules', sessionId);
    const sessionDoc = await transaction.get(sessionRef);

    // Check capacity within transaction
    if (sessionDoc.data().spotsRemaining <= 0) {
      throw new Error('Session is full');
    }

    // Update atomically
    transaction.update(sessionRef, {
      spotsRemaining: sessionDoc.data().spotsRemaining - 1
    });

    transaction.set(doc(collection(db, 'bookings')), {
      userId,
      sessionId,
      bookedAt: serverTimestamp(),
    });
  });
};
```

**Why transactions:**
- Prevents race conditions (multiple users booking last spot)
- Ensures data consistency
- Automatic rollback on error

#### 5. Real-Time Listener Patterns

**Jules implements real-time features using Firestore listeners:**

```typescript
// Pattern from Jules implementations
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'schedules'), where('startTime', '>=', today)),
    (snapshot) => {
      const schedules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSchedules(schedules);
    }
  );

  // Always clean up listeners
  return () => unsubscribe();
}, [dependencies]);
```

**Best practices:**
- Always return cleanup function
- Minimize listener scope (use where clauses)
- Handle loading and error states
- Debounce rapid updates if needed

#### 6. Error Handling & UX

**Jules tasks emphasize user experience:**

- **Loading States:** Show spinners/skeletons during async operations
- **Error Messages:** Clear, actionable error text (not technical Firebase errors)
- **Optimistic UI:** Update UI immediately, rollback on error
- **Edge Cases:** Handle offline, slow networks, race conditions
- **Validation:** Client-side validation before Firebase operations

**Example:**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleBooking = async () => {
  setLoading(true);
  setError(null);
  try {
    await scheduleService.bookSession(sessionId, userId);
    // Optimistic update
    setUserBookings([...userBookings, newBooking]);
  } catch (err) {
    setError('Unable to book session. Please try again.');
    // Rollback optimistic update if needed
  } finally {
    setLoading(false);
  }
};
```

#### 7. Common Jules Integration Issues

**Problem:** `jules remote pull --session [ID] --apply` fails with patch errors

**Solution:**
- Local codebase has diverged from Jules' starting point
- Manually review the diff: `jules remote pull --session [ID] > session.diff`
- Extract valuable improvements and apply them manually
- This happened with sessions 17192703439224119445, 1813635457888636822, 4612389176397979767

**Problem:** TypeScript errors after Jules integration

**Common fixes:**
- Add `type` keyword to imports: `import type { Program } from '@/types'`
- Fix timestamp conversions: Use `Timestamp.fromDate()` for form inputs
- Update form field types to match HTML input requirements
- Remove unused imports and variables

**Problem:** Build passes but feature doesn't work

**Debug steps:**
1. Check Firebase console for data structure
2. Verify service functions are exported
3. Check component imports are correct
4. Look for console errors in browser
5. Verify environment variables are set

**Problem:** 🚨 **CRITICAL - Initiating duplicate Jules sessions for already-completed work**

**What Happened (Real Example from 2025-11-14):**
- Tasks 036, 037, 038 were completed by Jules 8-19 hours prior
- Work was sitting in completed Jules sessions waiting to be pulled
- New Jules session was initiated for TASK-036 **without checking** existing sessions
- Result: Duplicate work, wasted time, potential merge conflicts

**Root Cause:**
- Did not check `jules remote list --session` before starting new work
- Assumed tasks needed to be done without verifying completion status
- Local codebase had some files but not all (partial integration confusion)

**Prevention - ALWAYS CHECK BEFORE STARTING NEW JULES WORK:**

```bash
# 1. MANDATORY: List all Jules sessions for this repo
jules remote list --session | grep "sammyboy247/gymapp"

# 2. Check for recently completed sessions (last 24 hours)
jules remote list --session | grep -E "(Completed|Planning|Running)" | head -10

# 3. For each COMPLETED session, check what task it was
jules remote pull --session [SESSION_ID] 2>&1 | head -20

# 4. Check what files the session created
jules remote pull --session [SESSION_ID] 2>&1 | grep "^diff --git"

# 5. ONLY THEN initiate new work if truly needed
```

**When to Pull Instead of Re-initiate:**
- Session shows "Completed" status
- Session was created within last 24-48 hours
- Task description matches your current task
- Files from session don't exist locally or are placeholders

**Red Flags That Work May Already Be Done:**
- ✅ Dependencies are already installed (e.g., react-big-calendar for admin schedule)
- ✅ Some files exist locally (e.g., ProgramManager.tsx) but are functional
- ✅ Related Jules sessions completed recently
- ✅ Build is passing but features seem incomplete

**Correct Recovery Process:**
1. Stop/cancel any duplicate sessions if possible
2. Pull all completed sessions: `jules remote pull --session [ID] --apply`
3. If apply fails, manually integrate: `jules remote pull --session [ID] > session.diff`
4. Review what's missing vs what's in Jules sessions
5. Only create NEW Jules session if significant work remains

**Impact of This Mistake:**
- ⏱️ Wasted 60-90 minutes of Jules cloud VM time
- 💰 Unnecessary compute costs
- 🔀 Potential merge conflicts between duplicate implementations
- ⏳ Delayed project progress
- 😵 Confusion about which implementation is correct

**This is now documented as CONSTRAINT-007 in GEMINI-STANDING-ORDERS.md**

#### 8. Task Dependencies & Sequencing

**Document dependencies clearly:**

```markdown
TASK-036: Implement Schedule Booking
- Dependencies: None (uses existing scheduleService)
- Enables: TASK-037, TASK-040, TASK-041

TASK-037: Admin Schedule Management
- Dependencies: TASK-036 (needs Booking type)
- Enables: TASK-042 integration

TASK-039: Friend System
- Dependencies: None (independent feature)
- Can run parallel with TASK-036
```

**This helps:**
- Plan parallel execution
- Understand impact of delays
- Coordinate integration timing

#### 9. Mobile-First Responsive Design

**Every Jules task includes responsive requirements:**

- Use Tailwind responsive prefixes: `md:`, `lg:`, `xl:`
- Test mobile view during integration
- Common patterns:
  ```typescript
  // Mobile: stack, Desktop: grid
  className="flex flex-col md:grid md:grid-cols-3 gap-4"

  // Mobile: full width, Desktop: constrained
  className="w-full md:max-w-2xl mx-auto"

  // Mobile: hidden, Desktop: visible
  className="hidden md:block"
  ```

#### 10. When Jules Isn't The Right Tool

**Use Claude Code instead for:**
- Quick bug fixes (< 5 files)
- TypeScript error resolution
- Code review and feedback
- Architectural decisions
- Documentation updates
- Small refactoring

**Use Gemini CLI instead for:**
- Git operations and commits
- Status checks and monitoring
- Task coordination
- Information retrieval

**Jules excels at:**
- Multi-file feature implementations (5+ files)
- Complex scaffolding
- Architecture-wide refactoring
- Autonomous implementation from specs

## References

- **Project Specification:** `GymApp.md` - Full product vision and PoC scope
- **Scaffolding Guide:** `Init - Scaffold.md` - Original setup instructions
- **README:** `README.md` - Installation and basic usage
- **Multi-Agent Workflow:** `.dev-pipeline/MULTI-AGENT-WORKFLOW-SPECIFICATION.md` - Complete agent coordination guide
- **Claude Code Integration:** `.dev-pipeline/CLAUDE-CODE-INTEGRATION.md` - Claude Code-specific guidance
