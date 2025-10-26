TO: google-jules / gemini-cli  
FROM: Gemini  
DATE: 24/10/2025  
RE: Project Initiation & Scaffolding for GymApp (Ref: gym\_app\_project\_spec.md v1.3)

### **1\. TASK**

Initialize a new **React (TypeScript)** project using **Vite**. Install all specified dependencies. Scaffold the complete project directory structure, including placeholder component files and service stubs, based on the PoC scope (gym\_app\_project\_spec.md, Part 1).

### **2\. TECHNICAL STACK SPECIFICATION**

* **Project Initializer:** Vite  
* **Framework:** React (v19.0.0+)  
* **Language:** TypeScript (v5.5.x+)  
* **Backend Services:** Firebase (v11.6.1)  
  * firebase/app  
  * firebase/auth  
  * firebase/firestore  
* **Routing:** React Router (v6.x)  
  * react-router-dom  
* **State Management:** Zustand (v4.x)  
  * Lightweight global state for auth status, user profile, etc.  
* **Styling:** Tailwind CSS (v3.x)  
  * tailwindcss, postcss, autoprefixer  
* **Icons:** lucide-react (v0.390.x+)

### **3\. CORE ARCHITECTURAL PRINCIPLES**

* **Feature-Driven Structure:** Directories will be organized by *feature* (e.g., /features/schedule, /features/admin), not by *type* (e.g., /components, /pages). This scales better for the full product vision.  
* **Service Abstraction:** All Firebase calls **MUST** be abstracted into service files (e.g., src/services/firestoreService.ts) or custom hooks (e.g., src/hooks/useAuth.ts). Components should not directly import getDoc or getAuth.  
* **Global State:** Zustand will be used for minimal, critical global state (e.g., authStore for userId and isAuthReady).  
* **PoC Focus:** The scaffolding will create stubs for all PoC features. "Full Product Vision" features (Events, E-commerce) will have placeholder directories to ensure the structure is ready for them.

### **4\. DETAILED SCAFFOLDING INSTRUCTIONS**

**ACTION:** Execute the following commands to create the project structure and file stubs.

#### **4.1. Initialize Project & Install Dependencies**

\# 1\. Create the Vite project (select React, TypeScript)  
npm create vite@latest gym-app \-- \--template react-ts

\# 2\. Navigate into the new directory  
cd gym-app

\# 3\. Install ALL production dependencies  
npm install \\  
  firebase@11.6.1 \\  
  react-router-dom@6 \\  
  zustand \\  
  lucide-react \\  
  clsx \\  
  tailwind-merge

\# 4\. Install ALL dev dependencies  
npm install \-D \\  
  tailwindcss \\  
  postcss \\  
  autoprefixer

\# 5\. Initialize Tailwind CSS  
npx tailwindcss init \-p

#### **4.2. Create Core Configuration Files**

\# 1\. Create .env for Firebase config (leave values blank)  
CREATE FILE .env  
"""  
VITE\_FIREBASE\_API\_KEY=  
VITE\_FIREBASE\_AUTH\_DOMAIN=  
VITE\_FIREBASE\_PROJECT\_ID=  
VITE\_FIREBASE\_STORAGE\_BUCKET=  
VITE\_FIREBASE\_MESSAGING\_SENDER\_ID=  
VITE\_FIREBASE\_APP\_ID=  
"""

\# 2\. Overwrite tailwind.config.js  
CREATE FILE tailwind.config.js  
"""  
/\*\* @type {import('tailwindcss').Config} \*/  
export default {  
  content: \[  
    "./index.html",  
    "./src/\*\*/\*.{js,ts,jsx,tsx}",  
  \],  
  theme: {  
    extend: {  
      fontFamily: {  
        sans: \['Inter', 'sans-serif'\],  
      },  
    },  
  },  
  plugins: \[\],  
}  
"""

\# 3\. Overwrite src/index.css (Base Tailwind styles)  
CREATE FILE src/index.css  
"""  
@tailwind base;  
@tailwind components;  
@tailwind utilities;

body {  
  @apply bg-zinc-50 text-zinc-900 antialiased;  
}  
"""

#### **4.3. Scaffold Core Application Structure (src/)**

\# 1\. Clean default Vite files  
rm src/App.css  
rm src/assets/react.svg

\# 2\. Create core directories  
mkdir \-p src/assets  
mkdir \-p src/components/common  
mkdir \-p src/components/layout  
mkdir \-p src/hooks  
mkdir \-p src/lib  
mkdir \-p src/pages  
mkdir \-p src/services  
mkdir \-p src/store  
mkdir \-p src/types  
mkdir \-p src/features/auth  
mkdir \-p src/features/schedule/components  
mkdir \-p src/features/admin/components  
mkdir \-p src/features/social/components  
mkdir \-p src/features/programs/components

\# 3\. Create global type definitions  
CREATE FILE src/types/index.ts  
"""  
// PoC Types based on gym\_app\_project\_spec.md

export interface UserProfile {  
  uid: string;  
  email: string | null;  
  realName: string;  
  friendId: string; // The public-facing, non-personal ID (e.g., FitnessFan72)  
  role: 'member' | 'admin' | 'coach';  
  assignedProgramIds?: string\[\];  
}

export interface GymSession {  
  id: string;  
  title: string;  
  type: string; // e.g., "Spin", "Yoga", "HIIT"  
  startTime: number; // Firestore Timestamp (as number)  
  endTime: number; // Firestore Timestamp (as number)  
  roomId: string;  
  coachId: string;  
}

export interface Booking {  
  id: string;  
  userId: string;  
  sessionId: string;  
  sessionTitle: string;  
  startTime: number;  
  // Program selection from PoC spec  
  selectedProgramId: string; // 'generic' or a specific program ID  
}

export interface Program {  
  id: string;  
  title: string;  
  description: string;  
  // A simple list of exercise descriptions for the PoC  
  exercises: Array\<{ name: string; details: string }\>;  
}  
"""

\# 4\. Create Tailwind utility file (for clsx/tailwind-merge)  
CREATE FILE src/lib/utils.ts  
"""  
import { type ClassValue, clsx } from "clsx"  
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue\[\]) {  
  return twMerge(clsx(inputs))  
}  
"""

\# 5\. Create Firebase config/init  
CREATE FILE src/services/firebase.ts  
"""  
import { initializeApp } from 'firebase/app';  
import { getAuth } from 'firebase/auth';  
import { getFirestore, setLogLevel } from 'firebase/firestore';

// IMPORTANT: Use environment variables  
const firebaseConfig \= {  
  apiKey: import.meta.env.VITE\_FIREBASE\_API\_KEY,  
  authDomain: import.meta.env.VITE\_FIREBASE\_AUTH\_DOMAIN,  
  projectId: import.meta.env.VITE\_FIREBASE\_PROJECT\_ID,  
  storageBucket: import.meta.env.VITE\_FIREBASE\_STORAGE\_BUCKET,  
  messagingSenderId: import.meta.env.VITE\_FIREBASE\_MESSAGING\_SENDER\_ID,  
  appId: import.meta.env.VITE\_FIREBASE\_APP\_ID,  
};

// Initialize Firebase  
const app \= initializeApp(firebaseConfig);  
const auth \= getAuth(app);  
const db \= getFirestore(app);

// Enable debug logging for PoC  
setLogLevel('Debug');

export { app, auth, db };  
"""

\# 6\. Create global state store (Zustand)  
CREATE FILE src/store/authStore.ts  
"""  
import { create } from 'zustand';  
import { UserProfile } from '@/types';

interface AuthState {  
  isAuthReady: boolean;  
  isAuthenticated: boolean;  
  user: UserProfile | null;  
  appId: string; // From \_\_app\_id  
  userId: string | null; // From auth.currentUser  
  setAuthReady: (isReady: boolean) \=\> void;  
  setUser: (user: UserProfile | null) \=\> void;  
  setAppId: (appId: string) \=\> void;  
  setUserId: (userId: string | null) \=\> void;  
}

export const useAuthStore \= create\<AuthState\>((set) \=\> ({  
  isAuthReady: false,  
  isAuthenticated: false,  
  user: null,  
  appId: 'default-app-id',  
  userId: null,  
  setAuthReady: (isReady) \=\> set({ isAuthReady: isReady }),  
  setUser: (user) \=\> set({ user, isAuthenticated: \!\!user }),  
  setAppId: (appId) \=\> set({ appId }),  
  setUserId: (userId) \=\> set({ userId }),  
}));  
"""

#### **4.4. Scaffold Core App Logic (main.tsx, App.tsx)**

\# 1\. Overwrite src/main.tsx (Root entrypoint)  
CREATE FILE src/main.tsx  
"""  
import React from 'react'  
import ReactDOM from 'react-dom/client'  
import App from './App.tsx'  
import './index.css'  
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')\!).render(  
  \<React.StrictMode\>  
    \<BrowserRouter\>  
      \<App /\>  
    \</BrowserRouter\>  
  \</React.StrictMode\>,  
)  
"""

\# 2\. Create Layout Components  
CREATE FILE src/components/layout/Navbar.tsx  
"""  
import React from 'react';  
import { Link } from 'react-router-dom';  
import { useAuthStore } from '@/store/authStore';  
import { LogOut, User, LayoutDashboard, Calendar } from 'lucide-react';

export const Navbar: React.FC \= () \=\> {  
  const { isAuthenticated, user } \= useAuthStore();

  return (  
    \<nav className="bg-white shadow-md"\>  
      \<div className="container mx-auto px-6 py-3 flex justify-between items-center"\>  
        \<Link to="/" className="text-2xl font-bold text-zinc-800"\>  
          GymApp  
        \</Link\>  
        \<div className="flex items-center space-x-4"\>  
          {isAuthenticated ? (  
            \<\>  
              \<Link to="/schedule" className="flex items-center text-zinc-600 hover:text-blue-600"\>  
                \<Calendar className="w-5 h-5 mr-1" /\> Schedule  
              \</Link\>  
              {user?.role \=== 'admin' && (  
                \<Link to="/admin" className="flex items-center text-zinc-600 hover:text-blue-600"\>  
                  \<LayoutDashboard className="w-5 h-5 mr-1" /\> Admin  
                \</Link\>  
              )}  
              \<Link to="/profile" className="flex items-center text-zinc-600 hover:text-blue-600"\>  
                \<User className="w-5 h-5 mr-1" /\> Profile  
              \</Link\>  
              \<button onClick={() \=\> {/\* Add auth.signOut() logic here \*/}} className="flex items-center text-red-500 hover:text-red-700"\>  
                \<LogOut className="w-5 h-5 mr-1" /\> Logout  
              \</button\>  
            \</\>  
          ) : (  
            \<Link to="/login" className="text-zinc-600 hover:text-blue-600"\>Login\</Link\>  
          )}  
        \</div\>  
      \</div\>  
    \</nav\>  
  );  
};  
"""

CREATE FILE src/components/layout/AppLayout.tsx  
"""  
import React from 'react';  
import { Outlet } from 'react-router-dom';  
import { Navbar } from './Navbar';

export const AppLayout: React.FC \= () \=\> {  
  return (  
    \<div className="min-h-screen flex flex-col"\>  
      \<Navbar /\>  
      \<main className="flex-grow container mx-auto p-6"\>  
        \<Outlet /\>  
      \</main\>  
    \</div\>  
  );  
};  
"""

\# 3\. Create Protected Route Component  
CREATE FILE src/features/auth/ProtectedRoute.tsx  
"""  
import React from 'react';  
import { Navigate, Outlet } from 'react-router-dom';  
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {  
  allowedRoles?: Array\<'member' | 'admin' | 'coach'\>;  
}

export const ProtectedRoute: React.FC\<ProtectedRouteProps\> \= ({ allowedRoles }) \=\> {  
  const { isAuthenticated, isAuthReady, user } \= useAuthStore();

  if (\!isAuthReady) {  
    // Show loading spinner while auth state is being determined  
    return (  
      \<div className="flex justify-center items-center min-h-screen"\>  
        \<div\>Loading...\</div\>  
      \</div\>  
    );  
  }

  if (\!isAuthenticated) {  
    return \<Navigate to="/login" replace /\>;  
  }

  if (allowedRoles && user?.role && \!allowedRoles.includes(user.role)) {  
    // User is authenticated but not authorized for this route  
    return \<Navigate to="/schedule" replace /\>;  
  }

  return \<Outlet /\>;  
};  
"""

\# 4\. Create Firebase Auth Hook (CRITICAL)  
CREATE FILE src/hooks/useAuthInit.ts  
"""  
import { useEffect } from 'react';  
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';  
import { doc, getDoc, setDoc } from 'firebase/firestore';  
import { auth, db } from '@/services/firebase';  
import { useAuthStore } from '@/store/authStore';  
import { UserProfile } from '@/types';

// Provided by Canvas environment  
declare const \_\_app\_id: string | undefined;  
declare const \_\_initial\_auth\_token: string | undefined;

export const useAuthInit \= () \=\> {  
  const { setAuthReady, setUser, setAppId, setUserId } \= useAuthStore();

  useEffect(() \=\> {  
    // 1\. Set App ID from global var  
    const appId \= typeof \_\_app\_id \!== 'undefined' ? \_\_app\_id : 'default-app-id';  
    setAppId(appId);

    // 2\. Set up auth listener  
    const unsubscribe \= onAuthStateChanged(auth, async (firebaseUser) \=\> {  
      if (firebaseUser) {  
        // User is signed in  
        setUserId(firebaseUser.uid);  
        const userRef \= doc(db, \`artifacts/${appId}/users/${firebaseUser.uid}/profile/main\`);  
        const userSnap \= await getDoc(userRef);

        if (userSnap.exists()) {  
          // 3a. User profile exists, load it  
          setUser(userSnap.data() as UserProfile);  
        } else {  
          // 3b. New user, create a default profile  
          const newProfile: UserProfile \= {  
            uid: firebaseUser.uid,  
            email: firebaseUser.email,  
            realName: firebaseUser.email || 'New User',  
            friendId: \`User${Math.floor(Math.random() \* 9000\) \+ 1000}\`,  
            role: 'member', // Default role  
          };  
          await setDoc(userRef, newProfile);  
          setUser(newProfile);  
        }  
      } else {  
        // User is signed out  
        setUser(null);  
        setUserId(null);  
      }  
      // 4\. Signal that auth check is complete  
      setAuthReady(true);  
    });

    // 5\. Perform initial sign-in  
    const signIn \= async () \=\> {  
      if (typeof \_\_initial\_auth\_token \!== 'undefined' && auth.currentUser \=== null) {  
        try {  
          await signInWithCustomToken(auth, \_\_initial\_auth\_token);  
        } catch (error) {  
          console.error('Error signing in with custom token:', error);  
          await signInAnonymously(auth); // Fallback  
        }  
      } else if (auth.currentUser \=== null) {  
        await signInAnonymously(auth);  
      }  
      // onAuthStateChanged will handle the rest  
    };

    signIn();

    // 6\. Cleanup listener on unmount  
    return () \=\> unsubscribe();  
  }, \[setAuthReady, setUser, setAppId, setUserId\]);  
};  
"""

\# 5\. Overwrite src/App.tsx (Main router and auth init)  
CREATE FILE src/App.tsx  
"""  
import { Routes, Route } from 'react-router-dom';  
import { AppLayout } from '@/components/layout/AppLayout';  
import { useAuthInit } from '@/hooks/useAuthInit';  
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// \--- Page Components (Import stubs) \---  
import { LoginPage } from '@/pages/LoginPage';  
import { SchedulePage } from '@/pages/SchedulePage';  
import { AdminPage } from '@/pages/AdminPage';  
import { ProfilePage } from '@/pages/ProfilePage';  
import { HomePage } from '@/pages/HomePage';

function App() {  
  // Initialize Firebase auth state listener  
  useAuthInit();

  return (  
    \<Routes\>  
      \<Route path="/login" element={\<LoginPage /\>} /\>

      {/\* Main App Routes (Protected) \*/}  
      \<Route element={\<ProtectedRoute /\>}\>  
        \<Route element={\<AppLayout /\>}\>  
          \<Route path="/" element={\<HomePage /\>} /\>  
          \<Route path="/schedule" element={\<SchedulePage /\>} /\>  
          \<Route path="/profile" element={\<ProfilePage /\>} /\>  
            
          {/\* Admin-Only Route \*/}  
          \<Route element={\<ProtectedRoute allowedRoles={\['admin', 'coach'\]} /\>}\>  
            \<Route path="/admin" element={\<AdminPage /\>} /\>  
          \</Route\>

        \</Route\>  
      \</Route\>

    \</Routes\>  
  );  
}

export default App;  
"""

#### **4.5. Scaffold Page & Feature Components (Stubs)**

\# 1\. Create Page Components  
CREATE FILE src/pages/HomePage.tsx  
"""  
import React from 'react';  
import { Link } from 'react-router-dom';  
import { useAuthStore } from '@/store/authStore';

export const HomePage: React.FC \= () \=\> {  
  const { user } \= useAuthStore();  
  return (  
    \<div className="bg-white p-8 rounded-lg shadow-md"\>  
      \<h1 className="text-3xl font-bold mb-4"\>Welcome to GymApp, {user?.realName || 'User'}\!\</h1\>  
      \<p className="text-lg text-zinc-700 mb-6"\>  
        This is your dashboard. From here you can view your schedule or manage your profile.  
      \</p\>  
      \<Link   
        to="/schedule"   
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"  
      \>  
        View My Schedule  
      \</Link\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/pages/LoginPage.tsx  
"""  
import React from 'react';  
// This component would handle Sign In / Sign Up  
// For this PoC, auth is handled by useAuthInit.ts  
// This page can be a placeholder or simple 'Sign In' button  
// that triggers the signInAnonymously/signInWithCustomToken logic.

export const LoginPage: React.FC \= () \=\> {  
  return (  
    \<div className="flex min-h-screen items-center justify-center"\>  
      \<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"\>  
        \<h1 className="text-3xl font-bold text-center mb-6"\>GymApp Login\</h1\>  
        \<p className="text-center text-zinc-600 mb-6"\>  
          Authentication is being handled automatically. You will be redirected shortly.  
        \</p\>  
        \<div className="text-center text-zinc-500"\>  
          (This page would normally contain email/password login)  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/pages/SchedulePage.tsx  
"""  
import React from 'react';  
import { ScheduleView } from '@/features/schedule/components/ScheduleView';

export const SchedulePage: React.FC \= () \=\> {  
  return (  
    \<div\>  
      \<h1 className="text-3xl font-bold mb-6"\>Class Schedule\</h1\>  
      \<ScheduleView /\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/pages/AdminPage.tsx  
"""  
import React from 'react';  
import { ScheduleManager } from '@/features/admin/components/ScheduleManager';  
import { ProgramManager } from '@/features/admin/components/ProgramManager';

export const AdminPage: React.FC \= () \=\> {  
  return (  
    \<div\>  
      \<h1 className="text-3xl font-bold mb-6"\>Admin Dashboard\</h1\>  
      \<div className="space-y-8"\>  
        \<ScheduleManager /\>  
        \<ProgramManager /\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/pages/ProfilePage.tsx  
"""  
import React from 'react';  
import { FriendManager } from '@/features/social/components/FriendManager';  
import { UserProfileDetails } from '@/features/auth/UserProfileDetails';

export const ProfilePage: React.FC \= () \=\> {  
  return (  
    \<div\>  
      \<h1 className="text-3xl font-bold mb-6"\>My Profile\</h1\>  
      \<div className="space-y-8"\>  
        \<UserProfileDetails /\>  
        \<FriendManager /\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

\# 2\. Create Feature Component Stubs (PoC Scope)

CREATE FILE src/features/auth/UserProfileDetails.tsx  
"""  
import React from 'react';  
import { useAuthStore } from '@/store/authStore';

export const UserProfileDetails: React.FC \= () \=\> {  
  const { user } \= useAuthStore();

  if (\!user) return null;

  return (  
    \<div className="bg-white p-6 rounded-lg shadow-md"\>  
      \<h2 className="text-2xl font-semibold mb-4"\>My Details\</h2\>  
      \<p\>\<strong\>Name:\</strong\> {user.realName}\</p\>  
      \<p\>\<strong\>Email:\</strong\> {user.email || 'Not provided'}\</p\>  
      \<p\>\<strong\>Role:\</strong\> {user.role}\</p\>  
      \<p className="mt-4 p-3 bg-zinc-100 rounded"\>  
        \<strong\>My Public Friend ID:\</strong\>   
        \<span className="font-mono text-blue-600 ml-2"\>{user.friendId}\</span\>  
      \</p\>  
      \<p className="text-sm text-zinc-600 mt-2"\>Share this ID with friends to connect.\</p\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/features/schedule/components/ScheduleView.tsx  
"""  
import React from 'react';  
// This component will fetch and display GymSession data from Firestore  
// It will also show friends' bookings (PoC Spec 2.3.2)  
export const ScheduleView: React.FC \= () \=\> {  
  // TODO:  
  // 1\. Fetch all GymSession items from Firestore collection  
  //    (e.g., /artifacts/{appId}/public/data/sessions)  
  // 2\. Fetch user's bookings  
  // 3\. Fetch friends' bookings  
  // 4\. Render a calendar/list view

  return (  
    \<div className="bg-white p-6 rounded-lg shadow-md"\>  
      \<h2 className="text-2xl font-semibold mb-4"\>Upcoming Classes\</h2\>  
      \<div className="border border-zinc-200 rounded-lg p-4 min-h-\[200px\] flex items-center justify-center"\>  
        \<p className="text-zinc-500"\>\[Schedule calendar/list placeholder\]\</p\>  
      \</div\>  
      {/\* Clicking a session should open BookingModal.tsx \*/}  
    \</div\>  
  );  
};  
"""

CREATE FILE src/features/schedule/components/BookingModal.tsx  
"""  
import React from 'react';  
// This component will be triggered from ScheduleView  
// It will show session details and the Program Selection dropdown (PoC Spec 2.3.2)  
export const BookingModal: React.FC \= () \=\> {  
  // TODO:  
  // 1\. Receive 'session' prop  
  // 2\. Fetch user's assigned programs  
  // 3\. Display a \<select\> with options:  
  //    \- "Generic Program"  
  //    \- User's assigned programs  
  // 4\. On "Book" button click, create a new document in  
  //    /artifacts/{appId}/users/{userId}/bookings/  
  //    and store the 'selectedProgramId'  
    
  return (  
    \<div\>  
      {/\* Modal placeholder \*/}  
    \</div\>  
  );  
};  
"""

CREATE FILE src/features/admin/components/ScheduleManager.tsx  
"""  
import React from 'react';  
// This component allows Admins to create, edit, and delete GymSessions (PoC Spec 2.3.1)  
export const ScheduleManager: React.FC \= () \=\> {  
  // TODO:  
  // 1\. Implement a form to create a new GymSession  
  // 2\. List all existing GymSessions with edit/delete buttons  
  // 3\. All writes go to /artifacts/{appId}/public/data/sessions  
    
  return (  
    \<div className="bg-white p-6 rounded-lg shadow-md"\>  
      \<h2 className="text-2xl font-semibold mb-4"\>Manage Schedule\</h2\>  
      \<div className="border border-zinc-200 rounded-lg p-4 min-h-\[150px\] flex items-center justify-center"\>  
        \<p className="text-zinc-500"\>\[Admin schedule management form/list placeholder\]\</p\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/features/admin/components/ProgramManager.tsx  
"""  
import React from 'react';  
// This component allows Admins to create Programs and assign them to users (PoC Spec 2.3.1)  
export const ProgramManager: React.FC \= () \=\> {  
  // TODO:  
  // 1\. Implement form to create a new Program  
  //    (Write to /artifacts/{appId}/public/data/programs)  
  // 2\. Implement UI to assign a Program ID to a User  
  //    (Update /artifacts/{appId}/users/{userId}/profile/main doc, 'assignedProgramIds' field)

  return (  
    \<div className="bg-white p-6 rounded-lg shadow-md"\>  
      \<h2 className="text-2xl font-semibold mb-4"\>Manage Member Programs\</h2\>  
      \<div className="border border-zinc-200 rounded-lg p-4 min-h-\[150px\] flex items-center justify-center"\>  
        \<p className="text-zinc-500"\>\[Admin program creation/assignment placeholder\]\</p\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

CREATE FILE src/features/social/components/FriendManager.tsx  
"""  
import React from 'react';  
// This component handles the Friend ID search and double-opt-in (PoC Spec 2.3.2)  
export const FriendManager: React.FC \= () \=\> {  
  // TODO:  
  // 1\. Implement an input to search for a 'friendId'  
  // 2\. On search, check for a user with that ID  
  // 3\. Send a "friend request" (e.g., write to a /friendRequests subcollection)  
  // 4\. Display pending incoming requests with "Accept" / "Deny" buttons  
  // 5\. List all accepted friends  
    
  return (  
    \<div className="bg-white p-6 rounded-lg shadow-md"\>  
      \<h2 className="text-2xl font-semibold mb-4"\>My Friends\</h2\>  
      \<div className="border border-zinc-200 rounded-lg p-4 min-h-\[150px\] flex items-center justify-center"\>  
        \<p className="text-zinc-500"\>\[Friend list and 'Add Friend' UI placeholder\]\</p\>  
      \</div\>  
    \</div\>  
  );  
};  
"""

\# 6\. Create placeholder directories for Full Product Vision (Part 2\)  
mkdir \-p src/features/goals  
mkdir \-p src/features/events  
mkdir \-p src/features/store  
