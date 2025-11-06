# GymApp - Proof of Concept

## 1. Project Overview

GymApp is a Proof of Concept (PoC) for a comprehensive gym membership application with a strong social media component. This PoC focuses on validating the technical feasibility of core booking and scheduling workflows, testing user experience for members and admins, and demonstrating privacy-first social features. It serves as a functional model for early user feedback.

## 2. Tech Stack

-   **Frontend:** React 19, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **State Management:** Zustand
-   **Routing:** React Router DOM
-   **Authentication & Database:** Firebase (Authentication, Firestore)
-   **Icons:** Lucide React
-   **Build Tool:** Vite
-   **Code Quality:** ESLint, Prettier (recommended)

## 3. Prerequisites

-   Node.js (LTS version, e.g., 18.x or 20.x)
-   npm or pnpm (recommended)
-   Firebase Project: A Google Firebase project with Firestore and Authentication enabled.

## 4. Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gymApp
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```
3.  **Set up Environment Variables:** Create a `.env` file in the project root based on `.env.example` (if provided, otherwise see section 5).

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

Additionally, for the Canvas environment, the following global variables are expected:

-   `__app_id`: Unique identifier for the application instance.
-   `__initial_auth_token`: Custom authentication token for initial sign-in.

## 6. Development

To run the application locally:

1.  **Start the development server:**
    ```bash
    pnpm run dev
    # or npm run dev
    ```
2.  Open your browser to `http://localhost:5173` (or the address provided by Vite).

**Note for Canvas Environment:** If running within a Canvas environment, the `__app_id` and `__initial_auth_token` global variables will be provided. For local development outside Canvas, the application will attempt anonymous sign-in if no custom token is available.

## 7. Architecture

The project follows a feature-driven architecture, organizing code by domain features rather than by type. Key directories include:

-   `src/components`: Reusable UI components.
-   `src/features`: Contains domain-specific features (e.g., `auth`, `schedule`, `social`, `admin`), each with its own components, hooks, and logic.
-   `src/hooks`: Custom React hooks.
-   `src/lib`: Utility functions.
-   `src/pages`: Top-level page components that compose features.
-   `src/services`: Abstraction layer for external services (e.g., `firebase`).
-   `src/store`: Zustand stores for global state management.
-   `src/types`: TypeScript type definitions for domain models.

## 8. Key Features (PoC Scope)

-   **Authentication:** User sign-in/sign-out, protected routes, role-based access control (admin/member).
-   **Schedule Viewing & Booking:** Members can view available sessions and book/cancel their spots.
-   **User Profiles:** Display of user information, including a unique `friendId`.
-   **Social Features (Privacy-First):** Add friends by `friendId` (double opt-in), optional activity sharing.
-   **Admin Management (Placeholders):** Basic interfaces for schedule and program management.

## 9. Testing

*(Testing framework and tests are not yet implemented in this PoC. Future plans include unit and integration tests.)*

## 10. Deployment

To build the application for production:

```bash
pnpm run build
# or npm run build
```

The build artifacts will be generated in the `dist/` directory.

## 11. Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Ensure code adheres to ESLint rules (`pnpm run lint` or `npm run lint`).
5.  Commit your changes (`git commit -m "feat: Add new feature"`).
6.  Push to the branch (`git push origin feature/your-feature-name`).
7.  Open a Pull Request.