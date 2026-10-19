import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { historyApi } from '@/lib/endpoints';
import type { GameHistoryQuery } from '@/types';

export function useGameHistory(query: GameHistoryQuery) {
  return useQuery({
    queryKey: ['history', query] as const,
    queryFn: () => historyApi.list(query),
    // בזמן מעבר בין סינונים ממשיכים להציג את הרשימה הקודמת במקום להבהב
    placeholderData: keepPreviousData,
  });
}
