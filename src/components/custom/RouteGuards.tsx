import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasSeenWelcome } from '@/lib/welcome';

// Route guard: בלי JWT רואים רק הרשמה והתחברות. האכיפה האמיתית בשרת ([Authorize]).
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={hasSeenWelcome() ? '/login' : '/welcome'} replace />;
}

// משתמש מחובר לא צריך לראות את מסכי ההתחברות וההרשמה
export function PublicRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
