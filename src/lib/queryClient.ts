import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/lib/api';
import { notifyApiError } from '@/lib/errors';

const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 409]);

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { silent?: boolean };
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // שגיאת קריאה שלא סומנה silent מוצגת כ-toast. 401 מטופל ב-api.ts (מעבר להתחברות).
    onError: (error, query) => {
      if (query.meta?.silent) return;
      notifyApiError(error, 'הטעינה נכשלה');
    },
  }),
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !(isApiError(error) && NO_RETRY_STATUSES.has(error.status)) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
