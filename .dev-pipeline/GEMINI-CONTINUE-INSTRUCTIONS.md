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

## Immediate Actions Required

### Step 1: Verify Context
```powershell
cd d:\dev\gymApp
git status
ls .dev-pipeline
```

**Expected Outcome:**
- Should see STATUS-REPORT.md, ACTION-QUEUE.md, this file
- Git should show .dev-pipeline as untracked

### Step 2: Read Task Breakdown
```powershell
cat .dev-pipeline\scaffold-implementation-tasks.md
```

**If file exists:**
- Begin executing tasks sequentially starting with TASK-001

**If file doesn't exist:**
- The file needs to be created by Claude
- Wait for task breakdown to be generated

### Step 3: Begin Task Execution
Once task breakdown exists:
```bash
gemini "Execute TASK-001 from .dev-pipeline/scaffold-implementation-tasks.md"
```

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

### If Lost Context
1. Read this file (GEMINI-CONTINUE-INSTRUCTIONS.md)
2. Read STATUS-REPORT.md
3. Read ACTION-QUEUE.md
4. Check scaffold-implementation-tasks.md for current task

---

## Task File Location

When created, the task breakdown will be at:
```
.dev-pipeline/scaffold-implementation-tasks.md
```

This will contain all atomic tasks needed to complete the scaffold.

---

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

## Firebase Credentials Issue (from Jules)

I've analyzed the code and found the source of the Firebase credentials issue. The file `src/services/firebase/config.ts` is correctly set up to use environment variables, but the `.env` file in the root of the project is empty.

To fix this, you need to add your Firebase project's configuration to the `.env` file.

Here are the steps:
1.  Go to your Firebase project console: https://console.firebase.google.com/
2.  In the project overview, click on the "Web" icon (</>) to see your web app's configuration.
3.  Copy the `firebaseConfig` object.
4.  Paste the values into the `.env` file in the root of the project, like this:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Once you have updated the `.env` file, I will proceed with committing the changes from Jules.

---

## Rule for GEMINI-CONTINUE-INSTRUCTIONS.md

**IMPORTANT:** Do not delete any lines from this file. Only append new instructions or updates.