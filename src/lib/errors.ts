import { toast } from '@/hooks/use-toast';
import { isApiError } from '@/lib/api';

/** טקסט להצגה למשתמש: הודעת השרת כשיש, אחרת הודעה כללית */
export function errorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'אירעה שגיאה בלתי צפויה';
}

/**
 * toast לשגיאת שרת. 409 מוצג בסגנון התנגשות (אדום בולט).
 * 401 לא מוצג כאן: api.ts כבר מנקה את ההתחברות והמשתמש מועבר למסך ההתחברות.
 */
export function notifyApiError(error: unknown, title: string, conflictContext?: string): void {
  if (isApiError(error) && error.status === 401) return;

  if (isApiError(error) && error.status === 409) {
    toast({
      variant: 'conflict',
      title: 'התנגשות (409)',
      description: conflictContext ? `${conflictContext}: ${error.message}` : error.message,
    });
    return;
  }

  toast({ variant: 'destructive', title, description: errorMessage(error) });
}
