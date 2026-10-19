import { useNow } from '@/hooks/useNow';

/**
 * הזמן הנותר מגיע מהשרת (remainingSeconds). הלקוח רק סופר לאחור בין שתי תשובות סקר,
 * לפי הרגע שבו התשובה האחרונה התקבלה (receivedAt, למשל dataUpdatedAt של השאילתה).
 */
export function useCountdown(remainingSeconds: number | null, receivedAt: number, running: boolean): number {
  const now = useNow(250, running);
  if (remainingSeconds === null) return 0;
  const elapsedSeconds = Math.max(0, now - receivedAt) / 1000;
  return Math.max(0, Math.ceil(remainingSeconds - elapsedSeconds));
}
