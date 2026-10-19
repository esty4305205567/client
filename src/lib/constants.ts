import { GameType, SessionStatus } from '@/types';

export const POLL_INTERVAL_MS = 1000;
export const HISTORY_PAGE_SIZE = 10;
export const ADMIN_PAGE_SIZE = 10;
export const GAME_CODE_LENGTH = 5;

export interface GameTypeInfo {
  value: GameType;
  label: string;
  description: string;
}

export const GAME_TYPES: readonly GameTypeInfo[] = [
  { value: GameType.LootCollection, label: 'איסוף שלל', description: 'תיבות מופיעות ונעלמות. תפסו כמה שיותר לפני היריב.' },
  { value: GameType.NumberRace, label: 'מרוץ מספרים', description: 'לחצו על המספר הנכון, סבב אחרי סבב.' },
  { value: GameType.QuickQuiz, label: 'חידון מהיר', description: 'תרגילי חשבון מהירים. מי שעונה ראשון מקבל את הנקודה.' },
];

export const SESSION_STATUSES: readonly { value: SessionStatus; label: string }[] = [
  { value: SessionStatus.Waiting, label: 'ממתין ליריב' },
  { value: SessionStatus.InProgress, label: 'במשחק' },
  { value: SessionStatus.Finished, label: 'הסתיים' },
];

export function gameTypeLabel(type: GameType): string {
  return GAME_TYPES.find((game) => game.value === type)?.label ?? String(type);
}

export function sessionStatusLabel(status: SessionStatus): string {
  return SESSION_STATUSES.find((item) => item.value === status)?.label ?? String(status);
}
