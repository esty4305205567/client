import { buildQuery, request } from '@/lib/api';
import type {
  AdminGameSession,
  AdminSessionsQuery,
  CaptureRequest,
  CaptureResponse,
  GameHistoryItem,
  GameHistoryQuery,
  GameSessionResponse,
  GameSetting,
  GameState,
  GameType,
  JoinGameSessionResponse,
  LoginRequest,
  LoginResponse,
  PlayerResponse,
  RegisterRequest,
  UpdateGameSettingRequest,
} from '@/types';

export const authApi = {
  login: (body: LoginRequest) =>
    request<LoginResponse>('/api/auth/login', { method: 'POST', body, auth: false }),
  register: (body: RegisterRequest) =>
    request<PlayerResponse>('/api/auth/register', { method: 'POST', body, auth: false }),
};

export const gameApi = {
  create: (gameType: GameType) =>
    request<GameSessionResponse>('/api/game-sessions', { method: 'POST', body: { gameType } }),
  join: (code: string) =>
    request<JoinGameSessionResponse>(`/api/game-sessions/${encodeURIComponent(code)}/players`, {
      method: 'POST',
    }),
  getState: (id: number, signal?: AbortSignal) =>
    request<GameState>(`/api/game-sessions/${id}`, { signal }),
  capture: (id: number, body: CaptureRequest) =>
    request<CaptureResponse>(`/api/game-sessions/${id}/captures`, { method: 'POST', body }),
};

export const historyApi = {
  list: (query: GameHistoryQuery) =>
    request<GameHistoryItem[]>(
      `/api/game-history${buildQuery({ gameType: query.gameType, sortBy: query.sortBy, desc: query.desc })}`
    ),
};

export const adminApi = {
  listSettings: () => request<GameSetting[]>('/api/game-settings'),
  updateSetting: (gameType: GameType, body: UpdateGameSettingRequest) =>
    request<GameSetting>(`/api/game-settings/${gameType}`, { method: 'PUT', body }),
  listSessions: (query: AdminSessionsQuery) =>
    request<AdminGameSession[]>(
      `/api/admin/game-sessions${buildQuery({ gameType: query.gameType, status: query.status })}`
    ),
};
