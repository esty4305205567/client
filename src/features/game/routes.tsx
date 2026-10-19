import type { RouteObject } from 'react-router-dom';
import GamePage from '@/pages/GamePage';

export const gameRoutes: RouteObject[] = [{ path: '/game/:id', element: <GamePage /> }];
