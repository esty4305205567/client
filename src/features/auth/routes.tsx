import type { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import WelcomePage from '@/pages/WelcomePage';
import RegisterPage from '@/pages/RegisterPage';

export const authRoutes: RouteObject[] = [
  { path: '/welcome', element: <WelcomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];
