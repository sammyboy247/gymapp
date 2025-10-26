# GymApp - Proof of Concept

This repository contains the Proof of Concept (PoC) for GymApp, a modern gym membership and social application. The project has recently undergone a significant architectural pivot to a single-page application model using Firebase for its backend services.

**Note:** The previous pnpm monorepo structure with a separate Express backend is now deprecated and has been completely removed. Please refer to `GymApp.md` for the full project specification and future vision.

## Tech Stack

The current application is built with the following technologies:

- **Framework:** React (v19+) with TypeScript
- **Bundler:** Vite
- **Backend Services:** Firebase (Authentication, Firestore)
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gym-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    - Create a new file named `.env` in the root of the project.
    - Add your Firebase project configuration keys to this file. You can get these from your Firebase project settings.
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

## Project Structure

The project follows a feature-driven directory structure to improve scalability and organization.

-   `src/features/`: Contains components, hooks, and logic grouped by application feature (e.g., `auth`, `schedule`, `admin`).
-   `src/components/`: Shared, reusable components (`common`, `layout`).
-   `src/services/`: Houses all interactions with external services, primarily Firebase (`firebase.ts`).
-   `src/hooks/`: Contains custom React hooks, such as the critical `useAuthInit.ts` for handling authentication state.
-   `src/store/`: Global state management using Zustand (`authStore.ts`).
-   `src/pages/`: Top-level components that correspond to application routes.
-   `src/types/`: TypeScript type definitions for the application's data structures.

For a complete breakdown of the initial scaffolding, see `Init - Scaffold.md`.