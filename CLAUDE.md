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

## References

- **Project Specification:** `GymApp.md` - Full product vision and PoC scope
- **Scaffolding Guide:** `Init - Scaffold.md` - Original setup instructions
- **README:** `README.md` - Installation and basic usage
- **Multi-Agent Workflow:** `.dev-pipeline/MULTI-AGENT-WORKFLOW-SPECIFICATION.md` - Complete agent coordination guide
- **Claude Code Integration:** `.dev-pipeline/CLAUDE-CODE-INTEGRATION.md` - Claude Code-specific guidance
