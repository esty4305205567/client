import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { sessionStorageAdapter, setUnauthorizedHandler } from '@/lib/api';
import { PlayerRole, type AuthUser } from '@/types';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(() => sessionStorageAdapter.read());

  const signIn = useCallback((next: AuthUser) => {
    sessionStorageAdapter.write(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    sessionStorageAdapter.clear();
    setUser(null);
    // נתוני השרת שייכים למשתמש הקודם
    queryClient.clear();
  }, [queryClient]);

  // 401 מכל בקשה מוגנת: מנקים את ההתחברות. ה-ProtectedRoute מעביר למסך ההתחברות.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      queryClient.clear();
      toast({
        variant: 'destructive',
        title: 'ההתחברות פגה',
        description: 'יש להתחבר מחדש.',
      });
    });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === PlayerRole.Admin,
      signIn,
      signOut,
    }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
