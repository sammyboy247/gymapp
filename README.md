# GymApp - Proof of Concept

## 1. Project Overview

GymApp is a Proof of Concept (PoC) for a comprehensive gym membership application with a strong social media component. This project has recently undergone a significant architectural pivot to a single-page application model using Firebase for its backend services.

**Note:** The previous pnpm monorepo structure with a separate Express backend is now deprecated and has been completely removed. Please refer to `GymApp.md` for the full project specification and future vision.

This PoC focuses on validating the technical feasibility of core booking and scheduling workflows, testing user experience for members and admins, and demonstrating privacy-first social features. It serves as a functional model for early user feedback.

## 2. Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Backend Services:** Firebase (Authentication, Firestore)
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React

## 3. Prerequisites

- Node.js (LTS version, e.g., 18.x or 20.x)
- npm or pnpm (recommended)
- Firebase Project: A Google Firebase project with Firestore and Authentication enabled

## 4. Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gymApp
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Set up Environment Variables:** Create a `.env` file in the project root based on the template below.

## 5. Environment Variables

Create a `.env` file in the project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
```

**Note for Canvas Environment:** If running within a Canvas environment, the following global variables are also expected:
- `__app_id`: Unique identifier for the application instance
- `__initial_auth_token`: Custom authentication token for initial sign-in

## 6. Development

To run the application locally:

1. **Start the development server:**
   ```bash
   pnpm run dev
   # or npm run dev
   ```

2. Open your browser to `http://localhost:5173` (or the address provided by Vite)

**Note for Canvas Environment:** If running within a Canvas environment, the `__app_id` and `__initial_auth_token` global variables will be provided. For local development outside Canvas, the application will attempt anonymous sign-in if no custom token is available.

## 7. Architecture

The project follows a feature-driven architecture, organizing code by domain features rather than by type. Key directories include:

- `src/components`: Reusable UI components (common, layout)
- `src/features`: Contains domain-specific features (e.g., `auth`, `schedule`, `social`, `admin`), each with its own components, hooks, and logic
- `src/hooks`: Custom React hooks, including the critical `useAuthInit.ts` for handling authentication state
- `src/lib`: Utility functions
- `src/pages`: Top-level page components that compose features
- `src/services`: Abstraction layer for external services, primarily Firebase (`firebase/`)
- `src/store`: Zustand stores for global state management (`authStore.ts`)
- `src/types`: TypeScript type definitions for domain models

For a complete breakdown of the initial scaffolding, see `Init - Scaffold.md`.

## 8. Key Features (PoC Scope)

### Member Features

#### Authentication & Profiles
- **Email/Password Authentication:** Secure login with Firebase Authentication
- **User Profile Management:** View and edit display name, email, role, and unique Friend ID
- **Privacy Settings:** Global activity sharing toggle with clear explanations
- **Protected Routes:** Role-based access control (member, coach, admin)

#### Schedule & Booking
- **Browse Sessions:** View available gym sessions in real-time with Firestore listeners
- **Session Details:** See session type, coach, time, capacity, and spots remaining
- **Book Sessions:** Reserve spots with program selection dropdown
- **Cancel Bookings:** Remove your bookings with immediate capacity updates
- **Date Range Filtering:** Filter sessions by date range
- **Session Type Filtering:** Filter by session category
- **Program Selection:** Choose which assigned program to use for each booking
- **Real-time Updates:** Session availability updates instantly across all users

#### Program Management (Member View)
- **View Assigned Programs:** See all programs assigned by coaches
- **Program Details:** View full program information including exercises, duration, and type
- **Program Selection at Booking:** Choose which program to use when booking sessions

#### Social Features (Privacy-First)
- **Friend Search:** Find other members ONLY by their unique Friend ID (privacy-first design)
- **Send Friend Requests:** Double opt-in system - requests must be accepted
- **Manage Requests:** View sent/received requests, accept/deny incoming requests
- **Friends List:** View confirmed friendships with activity sharing status
- **Per-Friend Activity Sharing:** Toggle activity sharing for each friend individually
- **Privacy Controls:** Only Friend ID is searchable - no email or name exposure

### Admin/Coach Features

#### Schedule Management
- **Create Sessions:** Add new gym sessions with full details (type, coach, time, capacity, location, default program)
- **Edit Sessions:** Update session details with validation
- **Delete Sessions:** Remove sessions with confirmation dialogs
- **Bulk Delete:** Remove multiple past sessions at once
- **View Roster:** See all members booked into a session with real-time updates
- **Manual Roster Management:** Add/remove members from sessions (transactional operations)
- **Export Roster:** Download session roster as CSV
- **Visual Capacity Indicators:** Color-coded progress bars for session capacity
- **Real-time Sync:** All changes instantly reflected across admin and member views

#### Program Management
- **Create Programs:** Define workout programs with name, description, type, duration, exercises
- **Edit Programs:** Update program details with React Hook Form validation
- **Delete Programs:** Remove programs (with check for existing assignments)
- **Assign Programs:** Assign programs to members with date ranges and notes
- **Search Members:** Find members by name or Friend ID for assignment
- **Track Assignments:** View who has which programs assigned
- **Program Types:** Strength, cardio, hybrid, flexibility, or other
- **Form Validation:** Zod schema validation for all inputs

### Technical Features

#### Real-time Synchronization
- All collections use Firestore `onSnapshot` listeners
- Changes appear instantly across all connected clients
- Optimistic UI updates for better user experience

#### Error Handling
- Comprehensive try/catch blocks in all Firebase operations
- User-friendly error messages
- Loading states for all async operations
- Graceful degradation on network failures

#### Security
- Production-ready Firestore security rules
- Role-based access control (member, coach, admin)
- Privacy-first friend system (only Friend ID searchable)
- Activity sharing opt-in by default
- Transactional booking operations to prevent race conditions

## 9. User Guide

### For Members

#### Getting Started
1. **Sign Up/Login:** Use email and password to authenticate
2. **View Your Profile:** Check your unique Friend ID (share this with friends)
3. **Browse Schedule:** Navigate to Schedule page to see available sessions
4. **Book a Session:** Click on a session, select your program (if assigned), and confirm booking
5. **Add Friends:** Go to Profile page, use Friends tab, search by Friend ID

#### Managing Your Account
- **Edit Display Name:** Profile page → UserProfileDetails section → Edit button
- **Activity Sharing:** Profile page → Privacy Settings → Toggle on/off
- **View Programs:** Profile page → My Programs section → Click for details

#### Booking Sessions
- Filter sessions by date range or session type
- Check capacity and spots remaining before booking
- Select which assigned program to use (if you have multiple)
- Cancel bookings anytime from your bookings list

#### Social Features
- Only share your Friend ID (found on Profile page) with people you trust
- Send friend requests - they must accept before you're connected
- Toggle activity sharing per friend or globally
- View sent/received requests and manage them

### For Admins/Coaches

#### Schedule Management
1. **Navigate to Admin Page:** Only accessible with admin/coach role
2. **Create Session:** Click "Create Session" button, fill form with:
   - Session type, date/time, coach, capacity
   - Optional: default program, location, description
3. **View Roster:** Click "View Roster" on any session to see bookings
4. **Manual Management:** Add/remove members from roster as needed
5. **Export Roster:** Download CSV for external tracking

#### Program Management
1. **Create Program:** Click "Create Program", define:
   - Name, description, program type
   - Duration (weeks), exercises list
2. **Assign to Members:** Click "Assign Program", search member, set dates
3. **Track Assignments:** View which members have which programs

## 10. Firebase Setup

### Required Firebase Services
- **Authentication:** Email/Password provider enabled
- **Firestore Database:** Created in production mode
- **Security Rules:** Deploy the `firestore.rules` file to your Firebase project

### Initial Setup Steps

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password provider)

2. **Get Configuration:**
   - Project Settings → Your apps → Web app configuration
   - Copy the config values to your `.env` file

3. **Deploy Security Rules:**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize project (if not already)
   firebase init firestore

   # Deploy rules
   firebase deploy --only firestore:rules
   ```

4. **Seed Initial Data (Optional):**
   Create test users with different roles in Firebase Authentication:
   - Admin user: email=admin@test.com, set custom claim `role: "admin"` via Firebase Admin SDK
   - Coach user: email=coach@test.com, set custom claim `role: "coach"`
   - Member user: email=member@test.com, set custom claim `role: "member"` (default)

   Create corresponding user profile documents in Firestore `users` collection with `friendId` generated.

### Firestore Collections Structure

The application uses the following Firestore collections:

- `users` - User profiles with role, displayName, friendId, shareActivity
- `schedules` - Gym sessions with capacity, time, coach info
- `bookings` - Session bookings with userId, sessionId, programId
- `programs` - Workout programs with exercises, type, duration
- `programAssignments` - Program assignments to members
- `friendRequests` - Friend request documents with status
- `friendships` - Confirmed friendships with activity sharing preferences

## 11. Known Limitations

### Current PoC Limitations
- **Friend Activity Display:** Not yet implemented (TASK-040 pending)
- **Testing Framework:** No unit/integration tests yet
- **Offline Support:** No offline mode or PWA features
- **Mobile Optimization:** Responsive but not fully mobile-optimized
- **Image Uploads:** Profile pictures and program images not supported
- **Notifications:** No push notifications or email alerts
- **Advanced Search:** Basic filtering only, no full-text search
- **Analytics:** No usage tracking or analytics dashboard

### Technical Debt
- Bundle size warning: Main chunk >500KB (code splitting recommended)
- Some components could use memo optimization for performance
- Error boundaries not implemented globally
- No loading skeleton components (only basic loading states)

### Future Enhancements (Post-PoC)
- Progressive Web App (PWA) capabilities
- Push notifications for bookings and friend requests
- Advanced analytics dashboard for admins
- Multi-language support
- Dark mode theme
- Accessibility (ARIA labels, keyboard navigation)
- Automated testing suite
- Performance monitoring and error tracking

## 12. Testing

*(Testing framework and tests are not yet implemented in this PoC. Future plans include unit and integration tests.)*

### Manual Testing Checklist

#### Member Flows
- [ ] Sign up with new email/password
- [ ] Login with existing credentials
- [ ] View schedule and filter sessions
- [ ] Book a session with program selection
- [ ] Cancel a booking
- [ ] Search and add friend by Friend ID
- [ ] Accept/deny friend requests
- [ ] View assigned programs
- [ ] Edit display name
- [ ] Toggle activity sharing

#### Admin/Coach Flows
- [ ] Create new session
- [ ] Edit existing session
- [ ] Delete session with confirmation
- [ ] View session roster
- [ ] Add/remove member from roster manually
- [ ] Export roster to CSV
- [ ] Create new program
- [ ] Assign program to member
- [ ] Edit program details
- [ ] Delete program (check assignment validation)

#### Security Testing
- [ ] Verify non-admin cannot access /admin route
- [ ] Verify members can only see their own bookings
- [ ] Verify friend search only works with exact Friend ID
- [ ] Verify activity sharing privacy is enforced

## 13. Deployment

To build the application for production:

```bash
pnpm run build
# or npm run build
```

The build artifacts will be generated in the `dist/` directory.

### Deployment Checklist
- [ ] All environment variables configured
- [ ] Firebase security rules deployed
- [ ] Build completes without errors
- [ ] Test with production Firebase project
- [ ] Verify all features work in production mode

## 14. Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Ensure code adheres to ESLint rules (`pnpm run lint` or `npm run lint`)
5. Commit your changes (`git commit -m "feat: Add new feature"`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request
