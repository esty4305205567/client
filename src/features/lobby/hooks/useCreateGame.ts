import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifyApiError } from '@/lib/errors';
import { gameApi } from '@/lib/endpoints';
import { useRememberedGame } from '@/features/lobby/hooks/useRememberedGame';
import type { GameType } from '@/types';

// פתיחת חדר. עוברים למסך המשחק רק אחרי שהשרת ענה (לא מניחים הצלחה).
export function useCreateGame() {
  const navigate = useNavigate();
  const { remember } = useRememberedGame();

  return useMutation({
    mutationFn: (gameType: GameType) => gameApi.create(gameType),
    onSuccess: (session) => {
      remember({ id: session.id, code: session.code, type: session.type });
      navigate(`/game/${session.id}`);
    },
    onError: (error) => notifyApiError(error, 'לא הצלחנו לפתוח משחק'),
  });
}
