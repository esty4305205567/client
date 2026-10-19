import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { notifyApiError } from '@/lib/errors';
import { gameApi } from '@/lib/endpoints';
import type { CaptureResponse } from '@/types';
import type { CaptureVariables } from '../types';
import { gameQueryKey } from './usePollGameStatus';

/**
 * תפיסת פריט. לא מניחים הצלחה: התוצאה מוצגת רק אחרי תשובת השרת.
 * 409 (היריב הקדים / המשחק הסתיים) מוצג כהתנגשות אדומה, ושאר השגיאות (למשל "לא נכון") כ-toast רגיל.
 */
export function useCaptureItem(sessionId: number) {
  const queryClient = useQueryClient();

  return useMutation<CaptureResponse, unknown, CaptureVariables>({
    mutationFn: ({ itemId, answer }) =>
      gameApi.capture(sessionId, { itemId, answer: answer ?? null }),
    onSuccess: (result) => {
      toast({ variant: 'success', title: `+${result.points} נקודות` });
    },
    onError: (error, variables) => {
      notifyApiError(error, 'התפיסה נכשלה', variables.label);
    },
    // בכל מקרה מרעננים מיד את המצב מהשרת, בלי לחכות לסקר הבא
    onSettled: () => queryClient.invalidateQueries({ queryKey: gameQueryKey(sessionId) }),
  });
}
