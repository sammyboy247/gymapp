import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthInit } from '@/hooks/useAuthInit';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { updateTestAccountRoles } from '@/utils/updateTestAccountRoles';
import { testFirestore } from '@/utils/testFirestore';
import { checkDatabase } from '@/utils/checkDatabase';
import { checkUserRole } from '@/utils/checkUserRole';

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

  // Make utility functions available in browser console
  if (typeof window !== 'undefined') {
    (window as any).updateTestAccountRoles = updateTestAccountRoles;
    (window as any).testFirestore = testFirestore;
    (window as any).checkDatabase = checkDatabase;
    (window as any).checkUserRole = checkUserRole;
  }

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