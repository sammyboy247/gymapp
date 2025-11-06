import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthInit } from '@/hooks/useAuthInit';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// --- Page Components (Import stubs) ---
import { LoginPage } from '@/pages/LoginPage';
import { SchedulePage } from '@/pages/SchedulePage';
import { AdminPage } from '@/pages/AdminPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { HomePage } from '@/pages/HomePage';

function App() {
  // Initialize Firebase auth state listener
  useAuthInit();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main App Routes (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
            
          {/* Admin-Only Route */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'coach']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

        </Route>
      </Route>

    </Routes>
  );
}

export default App;