import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthInit } from '@/hooks/useAuthInit';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { updateTestAccountRoles } from '@/utils/updateTestAccountRoles';
import { testFirestore } from '@/utils/testFirestore';
import { checkDatabase } from '@/utils/checkDatabase';
import { checkUserRole } from '@/utils/checkUserRole';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PageLoadingSpinner } from '@/components/PageLoadingSpinner';

// --- Lazy Load All Pages for Code Splitting ---
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const SchedulePage = lazy(() => import('@/pages/SchedulePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SocialPage = lazy(() => import('@/pages/SocialPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const GymSettingsPage = lazy(() => import('@/pages/GymSettingsPage'));

function App() {
  // Initialize Firebase auth state listener
  useAuthInit();

  // Make utility functions available in browser console
  if (typeof window !== 'undefined') {
    (window as any).updateTestAccountRoles = updateTestAccountRoles;
    (window as any).testFirestore = testFirestore;
    (window as any).checkDatabase = checkDatabase;
    (window as any).checkUserRole = checkUserRole;
  }

  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-blue-600"
      >
        Skip to main content
      </a>
      <Toaster position="top-right" richColors closeButton />
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Main App Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/social" element={<SocialPage />} />
            </Route>
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/gym-settings" element={<GymSettingsPage />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;