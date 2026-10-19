import type { AuthUser, ErrorResponse } from '@/types';

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5163').replace(/\/$/, '');
const STORAGE_KEY = 'gamehub.session';

export class ApiError extends Error {
  readonly status: number;
  readonly correlationId?: string;

  constructor(status: number, message: string, correlationId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.correlationId = correlationId;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// ---------- שמירת ההתחברות ----------
export const sessionStorageAdapter = {
  read(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },
  write(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // אחסון חסום: ההתחברות תחזיק עד רענון הדף בלבד
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

// ה-AuthProvider רושם כאן מה לעשות כששרת מחזיר 401 על בקשה מוגנת
let unauthorizedHandler: () => void = () => undefined;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** false = בקשה פתוחה (הרשמה והתחברות). 401 עליה היא שגיאה רגילה */
  auth?: boolean;
  signal?: AbortSignal;
}

function isErrorResponse(value: unknown): value is Partial<ErrorResponse> {
  return typeof value === 'object' && value !== null;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const session = sessionStorageAdapter.read();
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'אין חיבור לשרת. בדקו שהשרת רץ ושהכתובת ב-VITE_API_URL נכונה.');
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      // token חסר או שפג תוקפו: מנקים, וה-route guard מעביר להתחברות
      sessionStorageAdapter.clear();
      unauthorizedHandler();
    }
    const errorBody = isErrorResponse(data) ? data : {};
    throw new ApiError(
      response.status,
      errorBody.message ?? `שגיאה ${response.status}`,
      errorBody.correlationId
    );
  }

  return data as T;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}
