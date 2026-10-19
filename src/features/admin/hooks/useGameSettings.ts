import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/endpoints';

export const gameSettingsQueryKey = ['game-settings'] as const;

export function useGameSettings() {
  return useQuery({ queryKey: gameSettingsQueryKey, queryFn: adminApi.listSettings });
}
