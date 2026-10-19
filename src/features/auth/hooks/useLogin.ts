import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { notifyApiError } from '@/lib/errors';
import { authApi } from '@/lib/endpoints';
import type { LoginFormValues } from '../types';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    // אחרי ההתחברות ה-PublicRoute מעביר ללובי
    onSuccess: (result) => signIn({ token: result.token, username: result.username, role: result.role }),
    onError: (error) => notifyApiError(error, 'ההתחברות נכשלה'),
  });
}
