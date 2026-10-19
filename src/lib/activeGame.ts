import type { GameType } from '@/types';

/** משחק שהמשתמש פתח או הצטרף אליו, כדי לאפשר חזרה אליו מהלובי */
export interface RememberedGame {
  id: number;
  code: string;
  type: GameType;
}

const MAX_REMEMBERED = 10;

// מפתח לכל משתמש, כדי ששני משתמשים באותו דפדפן לא יראו משחקים של השני
const keyFor = (username: string) => `gamehub.activeGame.${username.toLowerCase()}`;

function isRememberedGame(value: unknown): value is RememberedGame {
  if (typeof value !== 'object' || value === null) return false;
  const game = value as Partial<RememberedGame>;
  return typeof game.id === 'number' && typeof game.code === 'string' && typeof game.type === 'number';
}

function save(username: string, games: RememberedGame[]): void {
  try {
    if (games.length === 0) localStorage.removeItem(keyFor(username));
    else localStorage.setItem(keyFor(username), JSON.stringify(games));
  } catch {
    // אחסון חסום: ההמשך עובד, רק בלי אפשרות חזרה
  }
}

export const activeGameStorage = {
  readAll(username: string): RememberedGame[] {
    try {
      const raw = localStorage.getItem(keyFor(username));
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      // תאימות לגרסה הקודמת ששמרה משחק יחיד כאובייקט
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return list.filter(isRememberedGame);
    } catch {
      return [];
    }
  },
  add(username: string, game: RememberedGame): void {
    const others = activeGameStorage.readAll(username).filter((item) => item.id !== game.id);
    save(username, [game, ...others].slice(0, MAX_REMEMBERED));
  },
  remove(username: string, id: number): void {
    save(
      username,
      activeGameStorage.readAll(username).filter((item) => item.id !== id)
    );
  },
};
