import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthInit } from '@/hooks/useAuthInit';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// --- Directly Import All Pages ---
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import SchedulePage from '@/pages/SchedulePage';
import ProfilePage from '@/pages/ProfilePage';
import SocialPage from '@/pages/SocialPage';
import AdminPage from '@/pages/AdminPage';

function App() {
  // Initialize Firebase auth state listener
  useAuthInit();

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
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

          {/* Admin-Only Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

        </Routes>
    </>
  );
}

export default App;