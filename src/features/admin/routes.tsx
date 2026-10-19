import { Navigate, type RouteObject } from 'react-router-dom';
import AdminPage from '@/pages/AdminPage';
import { SessionsPanel } from './components/SessionsPanel';
import { SettingsPanel } from './components/SettingsPanel';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    children: [
      { index: true, element: <Navigate to="settings" replace /> },
      { path: 'settings', element: <SettingsPanel /> },
      { path: 'rooms', element: <SessionsPanel /> },
    ],
  },
];
