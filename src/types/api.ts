// טיפוסים שמשקפים את ה-DTOs של GameHub.API.
// השרת מחזיר enum כמספר (ברירת המחדל של System.Text.Json), ולכן כאן הם מספרים.

export const GameType = {
  LootCollection: 1,
  NumberRace: 2,
  QuickQuiz: 3,
} as const;
export type GameType = (typeof GameType)[keyof typeof GameType];

export const SessionStatus = {
  Waiting: 1,
  InProgress: 2,
  Finished: 3,
} as const;
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export const PlayerRole = {
  Player: 1,
  Admin: 2,
} as const;
export type PlayerRole = (typeof PlayerRole)[keyof typeof PlayerRole];

export const HistorySortBy = {
  Date: 1,
  Score: 2,
} as const;
export type HistorySortBy = (typeof HistorySortBy)[keyof typeof HistorySortBy];

// ---------- שגיאות ----------
export interface ErrorResponse {
  status: number;
  message: string;
  correlationId?: string;
}

// ---------- Auth ----------
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: PlayerRole;
}

export interface PlayerResponse {
  id: number;
  username: string;
  role: PlayerRole;
}

// ---------- חדרי משחק ----------
export interface GameSessionResponse {
  id: number;
  code: string;
  type: GameType;
  status: SessionStatus;
  durationSeconds: number;
  speed: number;
  hostUsername: string;
}

export interface JoinGameSessionResponse extends GameSessionResponse {
  startedAtUtc: string;
}

export interface PlayerState {
  username: string;
  score: number;
}

export interface LootBox {
  id: number;
  points: number;
  /** אחוזים (5 עד 95) */
  x: number;
  y: number;
  appearAtMs: number;
  disappearAtMs: number;
}

export interface Round {
  id: number;
  displayText: string;
  /** מרוץ מספרים: חמש אפשרויות. חידון: ריק */
  options: number[];
}

export interface GameState {
  code: string;
  status: SessionStatus;
  type: GameType;
  serverNowUtc: string;
  remainingSeconds: number | null;
  me: PlayerState;
  opponent: PlayerState | null;
  lootBoxes: LootBox[];
  currentRound: Round | null;
  winner: string | null;
  isDraw: boolean;
}

export interface CaptureRequest {
  itemId: number;
  answer: string | null;
}

export interface CaptureResponse {
  itemId: number;
  points: number;
  gameFinished: boolean;
}

// ---------- היסטוריה ----------
export interface GameHistoryItem {
  sessionId: number;
  gameType: GameType;
  finishedAtUtc: string | null;
  hostUsername: string;
  hostScore: number;
  guestUsername: string | null;
  guestScore: number | null;
  /** null בתיקו */
  winnerUsername: string | null;
}

export interface GameHistoryQuery {
  gameType?: GameType;
  sortBy: HistorySortBy;
  desc: boolean;
}

// ---------- ניהול ----------
export interface GameSetting {
  gameType: GameType;
  durationSeconds: number;
  speed: number;
  updatedAtUtc: string;
}

export interface UpdateGameSettingRequest {
  durationSeconds: number;
  speed: number | null;
}

export interface AdminGameSession {
  id: number;
  code: string;
  type: GameType;
  status: SessionStatus;
  hostUsername: string;
  guestUsername: string | null;
  durationSeconds: number;
  createdAtUtc: string;
  startedAtUtc: string | null;
  finishedAtUtc: string | null;
}

export interface AdminSessionsQuery {
  gameType?: GameType;
  status?: SessionStatus;
}
