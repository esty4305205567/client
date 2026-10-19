import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { notifyApiError } from '@/lib/errors';
import { authApi } from '@/lib/endpoints';
import type { RegisterFormValues } from '../types';

// הרשמה, ואז התחברות אוטומטית עם אותם פרטים
export function useRegister() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async ({ username, password }: RegisterFormValues) => {
      await authApi.register({ username, password });
      return authApi.login({ username, password });
    },
    onSuccess: (result) => {
      signIn({ token: result.token, username: result.username, role: result.role });
      toast({ variant: 'success', title: 'נרשמת בהצלחה', description: `ברוכה הבאה, ${result.username}!` });
    },
    onError: (error) => notifyApiError(error, 'ההרשמה נכשלה'),
  });
}
