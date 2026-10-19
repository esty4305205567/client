import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { notifyApiError } from '@/lib/errors';
import { adminApi } from '@/lib/endpoints';
import type { GameType, UpdateGameSettingRequest } from '@/types';
import { gameSettingsQueryKey } from './useGameSettings';

interface UpdateVariables {
  gameType: GameType;
  body: UpdateGameSettingRequest;
}

export function useUpdateGameSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameType, body }: UpdateVariables) => adminApi.updateSetting(gameType, body),
    onSuccess: () => {
      toast({ variant: 'success', title: 'ההגדרות נשמרו' });
      return queryClient.invalidateQueries({ queryKey: gameSettingsQueryKey });
    },
    onError: (error) => notifyApiError(error, 'השמירה נכשלה'),
  });
}
