export * from './api';

/** המשתמש המחובר, כפי שנשמר בין רענוני דף */
export interface AuthUser {
  token: string;
  username: string;
  role: import('./api').PlayerRole;
}
