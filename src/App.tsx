import { useRoutes, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/components/custom/AppLayout';
import { AuroraBackground } from '@/components/fx/AuroraBackground';
import { AdminRoute, ProtectedRoute, PublicRoute } from '@/components/custom/RouteGuards';
import { adminRoutes } from '@/features/admin/routes';
import { authRoutes } from '@/features/auth/routes';
import { gameRoutes } from '@/features/game/routes';
import { historyRoutes } from '@/features/history/routes';
import { lobbyRoutes } from '@/features/lobby/routes';
import { profileRoutes } from '@/features/profile/routes';
import NotFoundPage from '@/pages/NotFoundPage';

// ציבורי: התחברות והרשמה. פרטי: לובי, משחק, היסטוריה, פרופיל וניהול (Admin בלבד).
const routes: RouteObject[] = [
  { element: <PublicRoute />, children: authRoutes },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...lobbyRoutes,
          ...gameRoutes,
          ...historyRoutes,
          ...profileRoutes,
          { element: <AdminRoute />, children: adminRoutes },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export default function App() {
  const element = useRoutes(routes);
  return (
    <>
      <AuroraBackground />
      {element}
    </>
  );
}
