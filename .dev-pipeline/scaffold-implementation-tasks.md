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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
**Status:** PENDING
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
