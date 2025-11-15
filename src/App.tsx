import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthInit } from '@/hooks/useAuthInit';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// --- Lazy Load All Pages for Code Splitting ---
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const SchedulePage = lazy(() => import('@/pages/SchedulePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SocialPage = lazy(() => import('@/pages/SocialPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

function App() {
  // Initialize Firebase auth state listener
  useAuthInit();

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Main App Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/social" element={<SocialPage />} />

              {/* Admin-Only Route */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

            </Route>
          </Route>

        </Routes>
      </Suspense>
    </>
  );
}

export default App;