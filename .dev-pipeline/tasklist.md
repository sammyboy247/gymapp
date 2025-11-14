# Instructions for Gemini CLI - Continue Processing

**Last Updated:** 2025-11-05 14:50
**Current Phase:** Initial Scaffold Implementation

---

## ⚠️ CRITICAL: Read Standing Orders First

**BEFORE doing ANYTHING, read:**
`.dev-pipeline/GEMINI-STANDING-ORDERS.md`

**Most Critical Rule:** NEVER run `npm run dev` or similar commands that wait indefinitely.

---

## Current Status

- **Last Task:** None (just restarted after crash)
- **Next Task:** Create scaffold-implementation-tasks.md
- **Working Directory:** d:\dev\gymApp


---

## Important Context

### Project State
- Dependencies: ✅ Installed (React 19, Firebase 11.6.1, Router, Zustand, Tailwind)
- Directory Structure: ✅ Created (feature-driven organization)
- Configuration Files: ✅ Present (Tailwind, PostCSS, TypeScript)
- Application Code: ❌ Still default Vite template

### What Needs to Be Done
According to Init - Scaffold.md, need to create:
1. Core application files (App.tsx, main.tsx, index.css)
2. Layout components (Navbar, AppLayout)
3. Auth system (useAuthInit, ProtectedRoute, UserProfileDetails)
4. All page components (Home, Login, Schedule, Admin, Profile)
5. All feature components (Schedule, Admin, Social features)

### Firebase Configuration
- .env file exists but is empty
- Will need Firebase credentials to test (developer task)
- For now, focus on file creation and structure

---

## Recovery Procedures

### If Build Fails
```powershell
cd d:\dev\gymApp
npm install
npm run build
```
Check error messages and fix syntax/import issues

### If Git Conflicts
```powershell
git status
git diff
# Resolve manually if needed
```

## Success Criteria

The scaffold will be complete when:
1. ✅ All files from Init - Scaffold.md are created
2. ✅ Project builds successfully (`npm run build`)
3. ✅ Project runs without errors (`npm run dev`)
4. ✅ Basic navigation works
5. ✅ Changes are committed to git

---

## Contact Points

If stuck or need clarification:
1. Review the Init - Scaffold.md document
2. Review GymApp.md for feature specifications
3. Review MULTI-AGENT-WORKFLOW-SPECIFICATION.md for process
4. Consult human developer for decisions


---

# GymApp Scaffold Implementation - Task Breakdown

**Created:** 2025-11-05
**Owner:** Development Team
**Target Completion:** 2025-11-06
**Reference:** Init - Scaffold.md

---

## ⚠️ CRITICAL: Read GEMINI-STANDING-ORDERS.md First

Before executing any tasks, Gemini MUST read:
`.dev-pipeline/GEMINI-STANDING-ORDERS.md`

**Key Constraint:** NEVER run `npm run dev` or similar long-running commands that wait indefinitely.

---

## Feature Overview

Complete the scaffolding of the GymApp PoC by creating all required files and components according to the Init - Scaffold.md specification. The project uses React 19 + TypeScript + Vite + Firebase with a feature-driven architecture.

## Success Criteria

- [ ] All files from Init - Scaffold.md are created
- [ ] Project builds successfully without errors
- [ ] All placeholder components render correctly
- [ ] Code is committed to git

---

## Task List

### TASK-001: Update Core Application Entry Point (index.css)
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 2 minutes

**Description:**
Replace the default Vite styles in src/index.css with Tailwind CSS directives and base styling.

**Instructions:**
```powershell
# Overwrite src/index.css
```

**File Content:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-zinc-50 text-zinc-900 antialiased;
}
```

**Verification:**
- File contains only Tailwind directives
- No default Vite styles remain

**Result:**
_Pending execution_

---

### TASK-002: Create Main Application Component (App.tsx)
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create the root App.tsx component with React Router setup and all route definitions according to Init - Scaffold.md specification.

**File Location:** src/App.tsx

**Key Requirements:**
- Import and use useAuthInit hook
- Set up Routes with BrowserRouter
- Include ProtectedRoute wrapper for authenticated routes
- Admin route with role-based protection
- Import all page components

**Verification:**
- File exists and compiles
- All routes configured correctly
- Protected routes implemented

**Result:**
_Pending execution_

---

### TASK-003: Update Application Entry Point (main.tsx)**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-002
**Estimated Duration:** 3 minutes

**Description:**
Replace default Vite template code in main.tsx with React application setup.

**File Location:** src/main.tsx

**Instructions:**
Remove all Vite template code and replace with proper React entry point that renders App component inside BrowserRouter (as shown in Init - Scaffold.md).

**Verification:**
- No counter.ts or typescript.svg references
- App component properly mounted
- BrowserRouter wraps application

**Result:**
_Pending execution_

---

### TASK-004: Create Authentication Hook (useAuthInit)
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 8 minutes

**Description:**
Create the Firebase authentication initialization hook.

**File Location:** src/hooks/useAuthInit.ts

**Instructions:**
Implement exactly as specified in Init - Scaffold.md with:
- __app_id and __initial_auth_token global variable handling
- onAuthStateChanged listener
- User profile loading/creation in Firestore
- Zustand store updates

**Verification:**
- File compiles without errors
- All Firebase imports correct
- Proper Firestore document paths
- Store updates implemented

**Result:**
_Pending execution_

---

### TASK-005: Create Protected Route Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create ProtectedRoute component for route guards.

**File Location:** src/features/auth/ProtectedRoute.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with:
- Auth ready check with loading state
- Authentication redirect to /login
- Role-based access control

**Verification:**
- File compiles without errors
- Loading state renders
- Redirects work
- Role checking implemented

**Result:**
_Pending execution_

---

### TASK-006: Create Navbar Layout Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 6 minutes

**Description:**
Create navigation bar component.

**File Location:** src/components/layout/Navbar.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with:
- Conditional rendering based on auth state
- Admin link for admin/coach roles only
- Lucide React icons
- Logout button (placeholder handler)

**Verification:**
- File compiles without errors
- Icons render correctly
- Role-based menu items work

**Result:**
_Pending execution_

---

### TASK-007: Create App Layout Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-006
**Estimated Duration:** 3 minutes

**Description:**
Create main application layout wrapper.

**File Location:** src/components/layout/AppLayout.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with Navbar and Outlet for nested routes.

**Verification:**
- File compiles without errors
- Navbar included
- Outlet properly placed

**Result:**
_Pending execution_

---

### TASK-008: Create Home Page Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 4 minutes

**Description:**
Create home/dashboard page.

**File Location:** src/pages/HomePage.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md.

**Verification:**
- File compiles
- Displays user's real name
- Link to schedule

**Result:**
_Pending execution_

---

### TASK-009: Create Login Page Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 4 minutes

**Description:**
Create login page placeholder.

**File Location:** src/pages/LoginPage.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md.

**Verification:**
- File compiles
- Shows auto-auth message

**Result:**
_Pending execution_

---

### TASK-010: Create Schedule Page Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 3 minutes

**Description:**
Create schedule page.

**File Location:** src/pages/SchedulePage.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md.

**Verification:**
- File compiles
- Imports ScheduleView

**Result:**
_Pending execution_

---

### TASK-011: Create Admin Page Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 4 minutes

**Description:**
Create admin dashboard page.

**File Location:** src/pages/AdminPage.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with ScheduleManager and ProgramManager.

**Verification:**
- File compiles
- Imports both managers
- Proper layout

**Result:**
_Pending execution_

---

### TASK-012: Create Profile Page Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 4 minutes

**Description:**
Create user profile page.

**File Location:** src/pages/ProfilePage.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with UserProfileDetails and FriendManager.

**Verification:**
- File compiles
- Imports both components
- Proper layout

**Result:**
_Pending execution_

---

### TASK-013: Create User Profile Details Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create user profile display component.

**File Location:** src/features/auth/UserProfileDetails.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md showing name, email, role, and Friend ID.

**Verification:**
- File compiles
- All fields displayed
- Friend ID highlighted

**Result:**
_Pending execution_

---

### TASK-014: Create Schedule View Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create schedule viewing component placeholder.

**File Location:** src/features/schedule/components/ScheduleView.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with placeholder UI and TODO comments.

**Verification:**
- File compiles
- Placeholder content present
- TODO comments included

**Result:**
_Pending execution_

---

### TASK-015: Create Booking Modal Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 4 minutes

**Description:**
Create booking modal placeholder.

**File Location:** src/features/schedule/components/BookingModal.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md.

**Verification:**
- File compiles
- Placeholder structure present

**Result:**
_Pending execution_

---### TASK-016: Create Schedule Manager Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create admin schedule management placeholder.

**File Location:** src/features/admin/components/ScheduleManager.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with placeholder for schedule CRUD operations.

**Verification:**
- File compiles
- Admin-focused placeholder present

**Result:**
_Pending execution_

---

### TASK-017: Create Program Manager Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Create admin program management placeholder.

**File Location:** src/features/admin/components/ProgramManager.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with placeholders for program creation and assignment.

**Verification:**
- File compiles
- Admin-focused placeholder present

**Result:**
_Pending execution_

---

### TASK-018: Create Friend Manager Component
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** None
**Estimated Duration:** 6 minutes

**Description:**
Create friend management component placeholder.

**File Location:** src/features/social/components/FriendManager.tsx

**Instructions:**
Implement as specified in Init - Scaffold.md with privacy-first model placeholders.

**Verification:**
- File compiles
- Social feature placeholder present

**Result:**
_Pending execution_

---

### TASK-019: 💾 COMMIT CHECKPOINT - Scaffold Complete
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-001 through TASK-018
**Description:** CRITICAL - Commit all scaffold implementation work

**Instructions:**
```powershell
cd d:\dev\gymApp
git status                    # Review all changes
git add .                     # Stage all files
git commit -m "feat: complete initial application scaffold

- Implement all core application files (App, main, index.css)
- Create layout components (Navbar, AppLayout)
- Implement authentication system (useAuthInit, ProtectedRoute)
- Create all page components (Home, Login, Schedule, Admin, Profile)
- Create all feature component placeholders
- Structure follows feature-driven architecture
- All components use TypeScript and Tailwind CSS

This commit establishes the complete PoC scaffold ready for feature implementation."

git push origin main          # Push to remote
git status                    # Verify clean
```

**Verification:**
- All files committed
- Push succeeds
- Working directory clean

**Result:**
_Pending execution_

---

### TASK-020: Build Verification
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-019
**Description:** Verify the project builds successfully

**Instructions:**
```powershell
cd d:\dev\gymApp
npm run build
```

**Expected Outcome:**
- Build completes without errors
- dist/ directory created
- TypeScript compilation succeeds

**If Build Fails:**
1. Review error messages
2. Fix syntax/import errors
3. Run build again
4. Update task status with findings

**Result:**
_Pending execution_

---

### TASK-021: Dev Server Verification (MANUAL ONLY)
**Agent:** Human Developer
**Status:** REQUIRES_MANUAL_VERIFICATION
**Dependencies:** TASK-020
**Description:** Verify dev server runs without errors

⚠️ **CRITICAL CONSTRAINT:** This task requires MANUAL verification by human developer.

**Gemini MUST NOT run `npm run dev`** - it will hang indefinitely and stall all progress.

**Instructions for Gemini:**
1. Update this task status to "REQUIRES_MANUAL_VERIFICATION"
2. Document that human needs to test dev server
3. Proceed immediately to TASK-022

**Instructions for Human Developer:**
```powershell
cd d:\dev\gymApp
npm run dev
# Open browser to http://localhost:5173
# Verify:
#   - App loads
#   - No console errors
#   - Navigation works between pages
#   - Auth flow initializes
# Stop server with Ctrl+C
```

**Expected Outcome:**
- Dev server starts successfully
- App renders in browser
- Navigation functional
- No critical errors

**Result:**
_Pending execution_

---

### TASK-022: Update Status Report
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-020 (can proceed without TASK-021)
**Description:** Update STATUS-REPORT.md with completion details

**Instructions:**
Update .dev-pipeline/STATUS-REPORT.md to reflect:
- All implementation tasks completed
- Build verified successfully
- TASK-021 marked as requiring manual verification
- Project health: GREEN (pending manual dev server test)

**Result:**
_Pending execution_

---

## Progress Tracking

- [ ] TASK-001 - Update index.css
- [ ] TASK-002 - Create App.tsx
- [ ] TASK-003 - Update main.tsx
- [ ] TASK-004 - Create useAuthInit hook
- [ ] TASK-005 - Create ProtectedRoute
- [ ] TASK-006 - Create Navbar
- [ ] TASK-007 - Create AppLayout
- [ ] TASK-008 - Create HomePage
- [ ] TASK-009 - Create LoginPage
- [ ] TASK-010 - Create SchedulePage
- [ ] TASK-011 - Create AdminPage
- [ ] TASK-012 - Create ProfilePage
- [ ] TASK-013 - Create UserProfileDetails
- [ ] TASK-014 - Create ScheduleView
- [ ] TASK-015 - Create BookingModal
- [ ] TASK-016 - Create ScheduleManager
- [ ] TASK-017 - Create ProgramManager
- [ ] TASK-018 - Create FriendManager
- [ ] TASK-019 - Commit Checkpoint
- [ ] TASK-020 - Build Verification
- [ ] TASK-021 - Dev Server (MANUAL)
- [ ] TASK-022 - Update Status Report

**Total Tasks:** 22
**Automated Tasks:** 21
**Manual Tasks:** 1 (TASK-021)

---

## Notes & Learnings

### Critical Constraints
- ⚠️ Gemini must NEVER run `npm run dev` or similar long-running commands
- These commands block indefinitely and require manual intervention
- See GEMINI-STANDING-ORDERS.md for full constraint list

### Key Architectural Decisions
- Feature-driven directory structure for scalability
- Service abstraction layer for Firebase
- Zustand for minimal global state
- TypeScript strict mode for type safety
- Tailwind CSS for consistent styling

### Important Considerations
- All Firebase credentials in .env (not committed)
- Canvas environment provides __app_id and __initial_auth_token
- Friend ID is only searchable user identifier (privacy-first)
- Admin routes protected by role-based access control

### Next Phase After Scaffold
Once scaffold complete, next phase:
1. Manual dev server verification
2. Implement actual Firestore operations
3. Build out booking workflow
4. Implement friend system
5. Add admin management features

---

---

# ADDITIONAL TASKS - PHASE 2

**Added:** 2025-11-06
**Phase:** Post-Scaffold Enhancement and Verification

---

### TASK-023: Verify All Files Actually Exist
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-022
**Estimated Duration:** 5 minutes

**Description:**
Systematically verify that every single file specified in TASK-001 through TASK-018 actually exists in the file system.

**Instructions:**
```powershell
cd d:\dev\gymApp

# Check each file existence
Test-Path src\index.css
Test-Path src\App.tsx
Test-Path src\main.tsx
Test-Path src\hooks\useAuthInit.ts
Test-Path src\features\auth\ProtectedRoute.tsx
Test-Path src\components\layout\Navbar.tsx
Test-Path src\components\layout\AppLayout.tsx
Test-Path src\pages\HomePage.tsx
Test-Path src\pages\LoginPage.tsx
Test-Path src\pages\SchedulePage.tsx
Test-Path src\pages\AdminPage.tsx
Test-Path src\pages\ProfilePage.tsx
Test-Path src\features\auth\UserProfileDetails.tsx
Test-Path src\features\schedule\components\ScheduleView.tsx
Test-Path src\features\schedule\components\BookingModal.tsx
Test-Path src\features\admin\components\ScheduleManager.tsx
Test-Path src\features\admin\components\ProgramManager.tsx
Test-Path src\features\social\components\FriendManager.tsx
```

**Expected Outcome:**
- All commands return TRUE
- Every file from scaffold specification exists

**If ANY file is missing:**
1. Document which files are missing
2. Create the missing files according to their task specifications
3. Re-run build verification (TASK-020)
4. Update STATUS-REPORT.md with findings

**Result:**
_All files verified to exist._

---

### TASK-024: Verify Git Commit Actually Happened
**Agent:** Gemini
**Status:** COMPLETE
**Dependencies:** TASK-023
**Estimated Duration:** 3 minutes

**Description:**
Verify that the scaffold commit from TASK-019 actually exists in git history and was pushed to remote.

**Instructions:**
```powershell
cd d:\dev\gymApp
git log --oneline -5                    # Show recent commits
git log --grep="scaffold" --oneline     # Find scaffold commit
git status                              # Verify clean working tree
git remote -v                           # Check remote configuration
git fetch origin                        # Update remote references
git log origin/main --oneline -5        # Check remote commits
```

**Expected Outcome:**
- At least one commit contains "scaffold" in message
- Working directory is clean
- Local and remote are in sync

**If commit is missing:**
1. Stage all files: `git add .`
2. Create commit as specified in TASK-019
3. Push to origin: `git push origin main`
4. Document findings in STATUS-REPORT.md

**Result:**
_Commit verified and pushed to remote._

---

### TASK-025: Create Zustand Store Implementation
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-023
**Estimated Duration:** 8 minutes

**Description:**
Create the Zustand store that useAuthInit and other components depend on. This was referenced in the scaffold but never explicitly created.

**File Location:** src/store/authStore.ts

**Instructions:**
Create a Zustand store with the following state and actions:
```typescript
interface AuthStore {
  user: User | null;
  userProfile: UserProfile | null;
  authReady: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setAuthReady: (ready: boolean) => void;
  logout: () => void;
}
```

**Key Requirements:**
- TypeScript types for User and UserProfile
- Proper Zustand create function usage
- Clear separation of state and actions
- Logout function that resets all auth state

**Verification:**
- File compiles without errors
- Store exports properly typed hook
- useAuthInit can successfully import and use it

**Result:**
_Pending execution_

---

### TASK-026: Create Firebase Service Layer
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-025
**Estimated Duration:** 15 minutes

**Description:**
Create service layer for Firebase operations to abstract database logic from components.

**File Locations:**
- src/services/firebase/config.ts
- src/services/firebase/authService.ts
- src/services/firebase/userService.ts
- src/services/firebase/scheduleService.ts

**Instructions:**

**config.ts** - Firebase initialization:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize with environment variables
export const app = initializeApp({...});
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**authService.ts** - Authentication operations:
- signInWithCustomToken
- signOut
- getCurrentUser

**userService.ts** - User profile operations:
- createUserProfile
- getUserProfile
- updateUserProfile
- searchByFriendId

**scheduleService.ts** - Schedule operations (placeholders):
- getSchedules
- bookSession
- cancelBooking

**Verification:**
- All files compile
- Services properly typed
- Can be imported in components
- Error handling included

**Result:**
_Pending execution_

---

### TASK-027: Fix TypeScript Type Definitions
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-026
**Estimated Duration:** 10 minutes

**Description:**
Create comprehensive TypeScript type definitions for all domain models.

**File Location:** src/types/index.ts

**Instructions:**
Create type definitions for:
```typescript
// User types
export interface User { ... }
export interface UserProfile { ... }
export type UserRole = 'member' | 'coach' | 'admin';

// Schedule types
export interface Schedule { ... }
export interface Booking { ... }
export interface ProgramAssignment { ... }

// Social types
export interface FriendRequest { ... }
export interface Friend { ... }

// Admin types
export interface Program { ... }
```

**Key Requirements:**
- All interfaces match Firestore schema from GymApp.md
- Proper timestamp types (Timestamp from firebase/firestore)
- Optional fields marked correctly
- Export all types for use throughout app

**Verification:**
- File compiles without errors
- Types can be imported in components
- No conflicts with existing code
- Matches domain model specification

**Result:**
_Pending execution_

---

### TASK-028: Update useAuthInit to Use Services and Store
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-025, TASK-026, TASK-027
**Estimated Duration:** 10 minutes

**Description:**
Refactor useAuthInit hook to properly use the new store and service layer.

**File Location:** src/hooks/useAuthInit.ts

**Instructions:**
Update the hook to:
1. Import auth and db from firebase/config service
2. Import userService operations
3. Import authStore hook from store/authStore
4. Use store actions instead of direct state mutations
5. Properly handle global variables __app_id and __initial_auth_token
6. Include error handling and logging

**Verification:**
- File compiles without errors
- No direct Firebase imports in hook
- All operations go through service layer
- Store is properly updated
- Error cases handled gracefully

**Result:**
_Pending execution_

---

### TASK-029: Implement Actual Logout Functionality
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-026, TASK-028
**Estimated Duration:** 5 minutes

**Description:**
Replace the placeholder logout handler in Navbar with actual logout functionality.

**File Location:** src/components/layout/Navbar.tsx

**Instructions:**
```typescript
import { authService } from '@/services/firebase/authService';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

// In component:
const navigate = useNavigate();
const logout = useAuthStore(state => state.logout);

const handleLogout = async () => {
  try {
    await authService.signOut();
    logout(); // Clear store
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

**Verification:**
- Logout button calls real function
- Firebase signOut is called
- Store is cleared
- Navigation to login page works
- No errors in console

**Result:**
_Pending execution_

---

### TASK-030: Add Path Aliases Configuration
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** None
**Estimated Duration:** 5 minutes

**Description:**
Configure TypeScript path aliases for cleaner imports (e.g., '@/components' instead of '../../components').

**Files to Update:**
- tsconfig.json
- vite.config.ts

**Instructions:**

**tsconfig.json** - Add to compilerOptions:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

**vite.config.ts** - Add resolve alias:
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // ... rest of config
})
```

**Verification:**
- Configuration files parse correctly
- Can import using @/ prefix
- Build still succeeds
- TypeScript doesn't show errors

**Result:**
_Pending execution_

---

### TASK-031: Add ESLint Rules for Import Organization
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-030
**Estimated Duration:** 5 minutes

**Description:**
Configure ESLint to enforce consistent import ordering and organization.

**File Location:** .eslintrc.cjs

**Instructions:**
Add import order rules:
```javascript
rules: {
  'import/order': ['error', {
    'groups': [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index'
    ],
    'pathGroups': [
      {
        'pattern': '@/**',
        'group': 'internal'
      }
    ],
    'newlines-between': 'always',
    'alphabetize': {
      'order': 'asc'
    }
  }]
}
```

**Verification:**
- ESLint configuration is valid
- Rules don't break existing code
- Imports are properly organized

**Result:**
_Pending execution_

---

### TASK-032: Create README Documentation
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-028
**Estimated Duration:** 15 minutes

**Description:**
Create comprehensive README.md for the project documenting setup, architecture, and development workflow.

**File Location:** README.md

**Instructions:**
Create README with sections:
1. **Project Overview** - Brief description of GymApp PoC
2. **Tech Stack** - List all major technologies
3. **Prerequisites** - Node.js version, Firebase setup
4. **Installation** - Step-by-step setup instructions
5. **Environment Variables** - Required .env variables
6. **Development** - How to run locally (with Canvas environment note)
7. **Architecture** - Feature-driven structure explanation
8. **Key Features** - Authentication, scheduling, social, admin
9. **Testing** - How to run tests (when implemented)
10. **Deployment** - Deployment process
11. **Contributing** - Development workflow

**Verification:**
- File is well-formatted in Markdown
- All sections are complete
- Links work correctly
- Code examples are accurate

**Result:**
_Pending execution_

---

### TASK-033: 💾 COMMIT CHECKPOINT - Phase 2 Complete
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-023 through TASK-032
**Description:** Commit all Phase 2 enhancements

**Instructions:**
```powershell
cd d:\dev\gymApp
git status
git add .
git commit -m "feat: add service layer, store, and enhanced configuration

- Create Zustand auth store with proper typing
- Implement Firebase service layer (auth, user, schedule services)
- Add comprehensive TypeScript type definitions
- Refactor useAuthInit to use service layer
- Implement actual logout functionality in Navbar
- Configure path aliases for cleaner imports
- Add ESLint rules for import organization
- Create comprehensive README documentation
- Verify all scaffold files exist and are committed

Phase 2 enhances the scaffold with proper architecture patterns and documentation."

git push origin main
git status
```

**Verification:**
- All changes committed
- Push succeeds
- Working directory clean
- Git log shows new commit

**Result:**
_Pending execution_

---

### TASK-034: Final Build and Verification
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-033
**Estimated Duration:** 5 minutes

**Description:**
Run final build to ensure all Phase 2 changes compile successfully.

**Instructions:**
```powershell
cd d:\dev\gymApp
npm run build
```

**Expected Outcome:**
- Build completes without errors
- No TypeScript errors
- No ESLint errors
- dist/ directory updated

**If build fails:**
1. Review and fix errors
2. Commit fixes
3. Re-run build
4. Update STATUS-REPORT.md

**Result:**
_Pending execution_

---

### TASK-035: Update STATUS-REPORT.md - Phase 2 Complete
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-034
**Estimated Duration:** 5 minutes

**Description:**
Update STATUS-REPORT.md to reflect completion of Phase 2 tasks.

**Instructions:**
Update the status report with:
- Phase 2 completion summary
- All new files created listed
- Build verification status
- Project health: GREEN
- Next recommended steps
- Any issues or blockers discovered

**Result:**
_Pending execution_

---

## Updated Progress Tracking

### Phase 1 - Scaffold (COMPLETE)
- [x] TASK-001 through TASK-022

### Phase 2 - Enhancement (COMPLETE)
- [x] TASK-023 - Verify All Files Exist
- [x] TASK-024 - Verify Git Commit
- [x] TASK-025 - Create Zustand Store
- [x] TASK-026 - Create Firebase Service Layer
- [x] TASK-027 - Fix TypeScript Types
- [x] TASK-028 - Update useAuthInit
- [x] TASK-029 - Implement Logout
- [x] TASK-030 - Path Aliases
- [x] TASK-031 - ESLint Rules
- [x] TASK-032 - README Documentation
- [x] TASK-033 - Commit Checkpoint
- [x] TASK-034 - Final Build Verification
- [x] TASK-035 - Update Status Report

**Total Phase 2 Tasks:** 13
**Status:** Ready to begin execution

---

## Notes for Gemini

### Why These Tasks Are Needed

1. **TASK-023-024:** Trust but verify - Gemini claimed tasks were complete, but we need proof
2. **TASK-025-027:** Missing foundational pieces that components depend on
3. **TASK-028-029:** Convert placeholders into real functionality
4. **TASK-030-031:** Developer experience improvements
5. **TASK-032:** Documentation for future developers
6. **TASK-033-035:** Proper closeout and verification

### Critical Reminders

- ⚠️ Remember GEMINI-STANDING-ORDERS.md constraints
- ⏱️ Instant commands need wait times
- 🚫 Never run `npm run dev` 
- ✅ Commit after each major milestone
- 📝 Update STATUS-REPORT.md regularly

### Success Criteria for Phase 2

Phase 2 will be considered complete when:
1. All scaffold files verified to exist
2. Service layer fully implemented
3. Store properly configured
4. Types comprehensive and consistent
5. Path aliases working
6. README documentation complete
7. All changes committed and pushed
8. Build succeeds without errors
9. STATUS-REPORT.md updated

---

# PHASE 3: FEATURE IMPLEMENTATION

**Added:** 2025-11-10
**Phase:** Core PoC Features - Booking, Admin, Social
**Status:** READY TO BEGIN

---

## 🎯 Phase 3 Overview

Implement the core PoC features as defined in GymApp.md:
- Schedule viewing and booking workflow
- Admin schedule and program management
- Privacy-first friend system with double opt-in
- Activity sharing between confirmed friends

**Strategy:** Jules handles complex multi-file features, Gemini coordinates verification and git operations.

---

## 🚀 JULES TASKS (Execute Asynchronously)

### TASK-036: Implement Schedule Booking System
**Agent:** Jules
**Status:** PENDING
**Dependencies:** Phase 2 complete
**Estimated Duration:** 60-90 minutes
**Priority:** CRITICAL - Core PoC feature

**Description:**
Implement the complete schedule booking workflow including viewing available sessions, booking/canceling spots, program selection at booking time, and real-time availability updates.

**Jules Instructions:**
```
Implement the schedule booking system for GymApp with the following requirements:

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
```typescript
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
```

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
- Real-time updates work
```

**Gemini Verification Task:** TASK-042

**Result:**
**Jules Session:** 17192703439224119445 (Completed ~4 hours ago)
**Status:** REQUIRES_RE_RUN - Previous session partially integrated by Claude Code. Needs full re-run.

**Notes:**
- Jules session completed successfully but `--apply` failed due to local code divergence
- Valuable improvements were manually extracted and integrated:
  - Added `orderBy` to getSchedules for chronological sorting
  - Added optional `sessionTypeFilter` parameter
  - Fixed `isEmpty` → `empty` for QuerySnapshot
  - Enhanced real-time listener patterns
- Related dependencies manually added: date-fns, moment
- All TypeScript errors resolved
- Build status: ✅ PASSING
- Integrated in commit: c1de949

**Recommendation:** TASK-036 should be re-run with fresh Jules session for full implementation of booking modal and comprehensive schedule view features. Current code has service layer enhancements but may be missing UI components.

---

### TASK-037: Implement Admin Schedule Management
**Agent:** Jules
**Status:** PENDING
**Dependencies:** TASK-036 (schedule types defined)
**Estimated Duration:** 45-60 minutes
**Priority:** HIGH - Admin features

**Description:**
Implement admin interface for creating, editing, and deleting schedule entries. Includes session creation wizard, bulk operations, and roster viewing.

**Jules Instructions:**
```
Implement admin schedule management for GymApp:

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
- Admin can manually add/remove bookings
```

**Gemini Verification Task:** TASK-043

**Result:**
**Jules Session:** 1813635457888636822 (Completed ~4 hours ago)
**Status:** REQUIRES_RE_RUN - Previous session partially integrated by Claude Code. Needs full re-run.

**Notes:**
- Jules session completed successfully but `--apply` failed due to local code divergence
- Valuable improvements were manually extracted and integrated:
  - Added calendar/scheduling dependencies: react-big-calendar, react-datepicker
  - Added type definitions: @types/react-big-calendar, @types/react-datepicker
  - RosterModal component mentioned in session (file may need verification)
- All TypeScript errors resolved
- Build status: ✅ PASSING
- Integrated in commit: c1de949

**Recommendation:** TASK-037 should be re-run with fresh Jules session for full implementation. Verify if ScheduleManager, SessionFormModal, and RosterModal components exist and are complete.

---

### TASK-038: Implement Program Creation & Assignment
**Agent:** Jules
**Status:** PENDING
**Dependencies:** TASK-037 (admin components structure)
**Estimated Duration:** 45-60 minutes
**Priority:** HIGH - Required for booking workflow

**Description:**
Implement admin interface for creating workout programs and assigning them to members. Programs are shown in booking modal for member selection.

**Jules Instructions:**
```
Implement program management for GymApp:

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
```typescript
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
```

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
- Can select program when booking
```

**Gemini Verification Task:** TASK-044

**Result:**
**Jules Session:** 4612389176397979767 (Completed ~4 hours ago)
**Status:** REQUIRES_RE_RUN - Previous session partially integrated by Claude Code. Needs full re-run.

**Notes:**
- Jules session completed successfully but `--apply` failed due to local code divergence
- Valuable improvements were manually extracted and integrated:
  - Added form validation dependencies: react-hook-form, @hookform/resolvers, zod
  - Fixed TypeScript type imports (added `type` keyword for verbatimModuleSyntax)
  - Fixed form field type handling (checkbox values, date inputs)
  - Added searchUsers function to userService for member lookup
  - Resolved form validation error message rendering
- Files verified to exist: ProgramFormModal.tsx, AssignProgramModal.tsx, ViewAssignmentsModal.tsx, ProgramManager.tsx
- All TypeScript errors resolved
- Build status: ✅ PASSING
- Integrated in commit: c1de949

**Recommendation:** Verify completeness of program management UI components. All base components exist, but may need testing with live Firebase data to confirm full functionality. If UI components are incomplete, re-run Jules with a specific prompt to complete them.

---

### TASK-039: Implement Privacy-First Friend System
**Agent:** Jules
**Status:** PENDING
**Dependencies:** Phase 2 (userService exists)
**Estimated Duration:** 60-75 minutes
**Priority:** HIGH - Core social feature

**NOTE FOR TOMORROW:** Re-issue this task to Jules. The previous attempt likely failed due to missing Firebase credentials. The credentials have now been added to `.env`. Jules should be made aware that this is a revisited task and that the majority of the work has already been done.

**Description:**
Implement the privacy-first friend system where users can only search by Friend ID, with double opt-in friend requests, and activity sharing preferences.

**Jules Instructions:**
```
Implement privacy-first friend system for GymApp:

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
```typescript
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
```

FIRESTORE STRUCTURE:
```
friendRequests/
  {requestId}: { fromUserId, toUserId, status, createdAt }

friendships/
  {friendshipId}: { user1Id, user2Id, createdAt, sharing settings }
```

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
- Privacy maintained
```

**Gemini Verification Task:** TASK-045

**Result:**
_Pending execution_

---

### TASK-040: Implement Friend Activity in Schedule View
**Agent:** Jules
**Status:** PENDING
**Dependencies:** TASK-036, TASK-039 (schedule and friends implemented)
**Estimated Duration:** 30-45 minutes
**Priority:** MEDIUM - Social enhancement

**NOTE FOR TOMORROW:** Re-issue this task to Jules. The previous attempt likely failed due to missing Firebase credentials. The credentials have now been added to `.env`. Jules should be made aware that this is a revisited task and that the majority of the work has already been done.

**Description:**
Add friend activity indicators to the schedule view, showing which sessions friends are booked into (only if both users have activity sharing enabled).

**Jules Instructions:**
```
Add friend activity to schedule view for GymApp:

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
- UI is clear and not cluttered
```

**Gemini Verification Task:** TASK-046

**Result:**
_Pending execution_

---

### TASK-041: Enhance User Profile with Programs & Settings
**Agent:** Jules
**Status:** PENDING
**Dependencies:** TASK-038, TASK-039 (programs and friends exist)
**Estimated Duration:** 30-45 minutes
**Priority:** MEDIUM - User experience

**NOTE FOR TOMORROW:** Re-issue this task to Jules. The previous attempt likely failed due to missing Firebase credentials. The credentials have now been added to `.env`. Jules should be made aware that this is a revisited task and that the majority of the work has already been done.

**Description:**
Enhance the user profile page to show assigned programs, activity sharing settings, and friend management integration.

**Jules Instructions:**
```
Enhance user profile page for GymApp:

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
- Layout is organized
```

**Gemini Verification Task:** TASK-047

**Result:**
_Pending execution_

---

## 🔧 GEMINI COORDINATION TASKS

### TASK-042: Monitor & Integrate Schedule Booking System
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-036 Jules execution
**Estimated Duration:** 15-20 minutes

**Description:**
Monitor Jules session for TASK-036, verify completion, integrate changes, and run verification tests.

**Instructions:**
```powershell
# 1. Check Jules session status (wait 5+ minutes after initiation)
jules remote list --session

# 2. When complete, pull and apply changes
jules remote pull --session [SESSION_ID] --apply

# 3. Review changes
cd d:\dev\gymApp
git status
git diff

# 4. Verify files were created/modified
Test-Path src\features\schedule\components\ScheduleView.tsx
Test-Path src\features\schedule\components\BookingModal.tsx
Test-Path src\services\firebase\scheduleService.ts
Test-Path src\types\index.ts

# 5. Build verification
npm run build

# 6. If successful, commit
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

# 7. Update STATUS-REPORT.md
# Mark TASK-036 and TASK-042 as COMPLETE
```

**Verification:**
- Jules session completed successfully
- All expected files exist
- Build passes
- Git commit successful
- Status report updated

**Result:**
_Pending execution_

---

### TASK-043: Monitor & Integrate Admin Schedule Management
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-037 Jules execution, TASK-042 complete
**Estimated Duration:** 15-20 minutes

**Description:**
Monitor Jules session for TASK-037, integrate admin schedule management features.

**Instructions:**
```powershell
# Follow same pattern as TASK-042

# Verify files:
Test-Path src\features\admin\components\ScheduleManager.tsx
Test-Path src\features\admin\components\SessionFormModal.tsx
Test-Path src\features\admin\components\RosterModal.tsx

# Build and commit
npm run build
git add .
git commit -m "feat: implement admin schedule management

- Add ScheduleManager CRUD interface
- Implement SessionFormModal for creating/editing
- Add RosterModal for viewing bookings
- Support bulk operations
- Add admin schedule service functions

Implements admin schedule features for PoC."

git push origin main
```

**Result:**
_Pending execution_

---

### TASK-044: Monitor & Integrate Program Management
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-038 Jules execution, TASK-043 complete
**Estimated Duration:** 15-20 minutes

**Description:**
Monitor Jules session for TASK-038, integrate program creation and assignment features.

**Instructions:**
```powershell
# Follow same pattern

# Verify files:
Test-Path src\features\admin\components\ProgramManager.tsx
Test-Path src\features\admin\components\ProgramFormModal.tsx
Test-Path src\features\admin\components\AssignProgramModal.tsx
Test-Path src\services\firebase\programService.ts

# Build and commit
npm run build
git add .
git commit -m "feat: implement program creation and assignment

- Add ProgramManager for creating programs
- Implement ProgramFormModal and AssignProgramModal
- Add programService with Firestore operations
- Support assigning programs to members
- Add Program and ProgramAssignment types
- Integrate with booking workflow

Implements program management for PoC."

git push origin main
```

**Result:**
_Pending execution_

---

### TASK-045: Monitor & Integrate Friend System
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-039 Jules execution, TASK-044 complete
**Estimated Duration:** 15-20 minutes

**Description:**
Monitor Jules session for TASK-039, integrate privacy-first friend system.

**Instructions:**
```powershell
# Follow same pattern

# Verify files:
Test-Path src\features\social\components\FriendManager.tsx
Test-Path src\features\social\components\FriendSearch.tsx
Test-Path src\features\social\components\FriendList.tsx
Test-Path src\features\social\components\FriendRequests.tsx
Test-Path src\services\firebase\friendService.ts

# Build and commit
npm run build
git add .
git commit -m "feat: implement privacy-first friend system

- Add FriendManager with Friend ID search
- Implement double opt-in friend requests
- Add FriendList and FriendRequests components
- Create friendService with Firestore operations
- Support activity sharing preferences
- Add Friend and Friendship types
- Enforce privacy-first model

Implements core social features for PoC."

git push origin main
```

**Result:**
_Pending execution_

---

### TASK-046: Monitor & Integrate Friend Activity Display
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-040 Jules execution, TASK-045 complete
**Estimated Duration:** 10-15 minutes

**Description:**
Monitor Jules session for TASK-040, integrate friend activity in schedule view.

**Instructions:**
```powershell
# Follow same pattern

# Verify files:
Test-Path src\features\schedule\components\FriendActivityBadge.tsx

# Build and commit
npm run build
git add .
git commit -m "feat: add friend activity to schedule view

- Show friends booked into sessions
- Add FriendActivityBadge component
- Respect privacy settings (both must share)
- Add friend activity queries
- Real-time updates

Completes social integration with booking."

git push origin main
```

**Result:**
_Pending execution_

---

### TASK-047: Monitor & Integrate Profile Enhancements
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-041 Jules execution, TASK-046 complete
**Estimated Duration:** 10-15 minutes

**Description:**
Monitor Jules session for TASK-041, integrate profile page enhancements.

**Instructions:**
```powershell
# Follow same pattern

# Verify files:
Test-Path src\features\auth\components\MyPrograms.tsx
Test-Path src\features\auth\components\ProgramDetailsModal.tsx
Test-Path src\features\auth\components\PrivacySettings.tsx

# Build and commit
npm run build
git add .
git commit -m "feat: enhance user profile with programs and settings

- Add MyPrograms section showing assignments
- Implement ProgramDetailsModal
- Add PrivacySettings for activity sharing
- Support display name updates
- Improve profile layout

Completes user profile features for PoC."

git push origin main
```

**Result:**
_Pending execution_

---

### TASK-048: 💾 COMMIT CHECKPOINT - Phase 3 Complete
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-042 through TASK-047 complete
**Estimated Duration:** 10 minutes

**Description:**
Final verification and status update for Phase 3 feature implementation.

**Instructions:**
```powershell
cd d:\dev\gymApp

# Final build verification
npm run build

# Verify all feature files exist
Test-Path src\features\schedule\components\ScheduleView.tsx
Test-Path src\features\schedule\components\BookingModal.tsx
Test-Path src\features\admin\components\ScheduleManager.tsx
Test-Path src\features\admin\components\ProgramManager.tsx
Test-Path src\features\social\components\FriendManager.tsx

# Check git status
git status
git log --oneline -10

# Update STATUS-REPORT.md
# - Mark Phase 3 as COMPLETE
# - List all features implemented
# - Note any issues discovered
# - Set status to GREEN if all tasks passed
# - Document next steps (testing, Firebase setup)

# Commit status update
git add .dev-pipeline\STATUS-REPORT.md
git commit -m "docs: update status report - Phase 3 complete"
git push origin main
```

**Verification:**
- All Jules tasks completed successfully
- All builds passed
- All commits pushed
- STATUS-REPORT.md updated
- Project health: GREEN

**Result:**
_Pending execution_

---

### TASK-049: Create Firestore Rules for PoC Features
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-048 complete
**Estimated Duration:** 20-30 minutes

**Description:**
Update firestore.rules with security rules for schedules, bookings, programs, and friend system.

**Instructions:**
```powershell
cd d:\dev\gymApp

# Create comprehensive Firestore rules
# Edit firestore.rules file with rules for:
# - schedules collection (read: all auth, write: admin/coach)
# - bookings collection (read: own bookings, write: own + capacity check)
# - programs collection (read: all auth, write: admin/coach)
# - programAssignments (read: own + admin, write: admin/coach)
# - friendRequests (read: own, write: own with validation)
# - friendships (read: participants only, write: validated)

# Test rules locally if possible
# Commit rules
git add firestore.rules
git commit -m "feat: add Firestore security rules for PoC features

- Add rules for schedules and bookings
- Secure programs and assignments
- Protect friend system collections
- Enforce role-based access
- Validate data on write"

git push origin main
```

**Verification:**
- Rules syntax is valid
- Proper access control implemented
- Admin/coach roles enforced
- Privacy maintained

**Result:**
_Pending execution_

---

### TASK-050: Update README with Feature Documentation
**Agent:** Gemini
**Status:** PENDING
**Dependencies:** TASK-049 complete
**Estimated Duration:** 15-20 minutes

**Description:**
Update README.md to document all implemented features, usage guide, and Firebase setup requirements.

**Instructions:**
```powershell
cd d:\dev\gymApp

# Update README.md to include:
# 1. Feature overview (all implemented features)
# 2. User guide sections:
#    - Member: booking workflow
#    - Admin: schedule and program management
#    - Social: friend system usage
# 3. Firebase setup:
#    - Required collections
#    - Security rules deployment
#    - Initial data setup
# 4. Testing instructions
# 5. Known limitations

# Commit documentation
git add README.md
git commit -m "docs: update README with PoC feature documentation

- Document booking workflow
- Add admin features guide
- Explain friend system usage
- Include Firebase setup instructions
- Add testing guide"

git push origin main
```

**Result:**
_Pending execution_

---

## Phase 3 Progress Tracking

**Jules Tasks (Asynchronous):**
- [ ] TASK-036 - Schedule Booking System (60-90 min)
- [ ] TASK-037 - Admin Schedule Management (45-60 min)
- [ ] TASK-038 - Program Creation & Assignment (45-60 min)
- [ ] TASK-039 - Privacy-First Friend System (60-75 min)
- [ ] TASK-040 - Friend Activity Display (30-45 min)
- [ ] TASK-041 - Profile Enhancements (30-45 min)

**Gemini Tasks (Coordination):**
- [ ] TASK-042 - Integrate Schedule Booking
- [ ] TASK-043 - Integrate Admin Schedule
- [ ] TASK-044 - Integrate Program Management
- [ ] TASK-045 - Integrate Friend System
- [ ] TASK-046 - Integrate Friend Activity
- [ ] TASK-047 - Integrate Profile Enhancements
- [ ] TASK-048 - Phase 3 Checkpoint
- [ ] TASK-049 - Firestore Rules
- [ ] TASK-050 - README Documentation

**Total Phase 3 Tasks:** 15
**Jules Tasks:** 6 (can run in parallel/sequence)
**Gemini Tasks:** 9 (integration and coordination)

---

## 🎯 Execution Strategy

### Recommended Approach:

**Option A: Sequential Jules Execution**
1. Start TASK-036 (Schedule Booking) - Foundation
2. Wait for completion, integrate (TASK-042)
3. Start TASK-037 (Admin Schedule) - Builds on 036
4. Continue pattern through all Jules tasks

**Option B: Parallel Jules Execution (Faster)**
1. Start multiple Jules tasks simultaneously:
   - TASK-036 (Schedule Booking)
   - TASK-039 (Friend System) - Independent
2. Start dependent tasks after prerequisites:
   - TASK-037 after TASK-036 complete
   - TASK-038 after TASK-037 complete
   - TASK-040 after both TASK-036 and TASK-039
   - TASK-041 after TASK-038 and TASK-039

**Recommendation:** Start with Option A for first task to test Jules workflow, then proceed with Option B if comfortable.

---

## Notes for Execution

### Critical Reminders for Gemini:
- ⚠️ Wait minimum 5 minutes before checking Jules status
- 🔄 Use `jules remote list --session` to check progress
- ⏰ Jules tasks may take 30-90 minutes each
- 📋 Always verify files exist before committing
- 🏗️ Always run `npm run build` before committing
- 📝 Update STATUS-REPORT.md after each integration

### Success Criteria for Phase 3:
- All 6 Jules features implemented
- All builds pass
- All features integrated and committed
- Firestore rules created
- Documentation updated
- Ready for manual testing with Firebase

### Testing Notes:
- Manual testing required after Phase 3
- Firebase project must be configured
- Test data needed for schedules, programs
- Multiple test users for friend system
- Consider creating seed data script

---
