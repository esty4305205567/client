import type { RouteObject } from 'react-router-dom';
import { AuthStage } from '@/components/custom/AuthStage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import WelcomePage from '@/pages/WelcomePage';

// שלושת המסכים חולקים במה אחת (AuthStage), כך שהלוגו והרקע נשארים ומתעדכנים בלי החלפת מסך
export const authRoutes: RouteObject[] = [
  {
    element: <AuthStage />,
    children: [
      { path: '/welcome', element: <WelcomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
];
