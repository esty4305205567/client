import { useQuery } from '@tanstack/react-query';
import { isApiError } from '@/lib/api';
import { POLL_INTERVAL_MS } from '@/lib/constants';
import { gameApi } from '@/lib/endpoints';
import { SessionStatus } from '@/types';

export const gameQueryKey = (sessionId: number) => ['game', sessionId] as const;

/**
 * polling על מצב המשחק, פעם בשנייה. השרת הוא מקור האמת.
 * - refetchInterval מחזיר false כשהמשחק הסתיים או כשאין גישה (403/404), וכך הסקר נעצר.
 * - React Query מנקה את ה-interval לבד כשהרכיב יורד מהעץ.
 * - refetchIntervalInBackground: שני שחקנים יכולים לשחק בשני חלונות על אותו מחשב.
 */
export function usePollGameStatus(sessionId: number) {
  return useQuery({
    queryKey: gameQueryKey(sessionId),
    queryFn: ({ signal }) => gameApi.getState(sessionId, signal),
    enabled: Number.isInteger(sessionId) && sessionId > 0,
    refetchInterval: (query) => {
      if (query.state.data?.status === SessionStatus.Finished) return false;
      const error = query.state.error;
      if (isApiError(error) && (error.status === 403 || error.status === 404)) return false;
      return POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: true,
    // שגיאות סקר מוצגות במסך עצמו, ולא כ-toast בכל שנייה
    meta: { silent: true },
  });
}
