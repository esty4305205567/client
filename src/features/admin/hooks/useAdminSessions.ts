import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/endpoints';
import type { AdminSessionsQuery } from '@/types';

export function useAdminSessions(query: AdminSessionsQuery) {
  return useQuery({
    queryKey: ['admin-sessions', query] as const,
    queryFn: () => adminApi.listSessions(query),
    placeholderData: keepPreviousData,
  });
}
