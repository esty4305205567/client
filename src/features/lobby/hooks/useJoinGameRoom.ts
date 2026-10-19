import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifyApiError } from '@/lib/errors';
import { gameApi } from '@/lib/endpoints';
import { useRememberedGame } from '@/features/lobby/hooks/useRememberedGame';

// הצטרפות לפי קוד. 409 = "היריב הקדים אותך, המשחק כבר מלא" (מוצג כהתנגשות אדומה).
export function useJoinGameRoom() {
  const navigate = useNavigate();
  const { remember } = useRememberedGame();

  return useMutation({
    mutationFn: (code: string) => gameApi.join(code.toUpperCase()),
    onSuccess: (session) => {
      remember({ id: session.id, code: session.code, type: session.type });
      navigate(`/game/${session.id}`);
    },
    onError: (error) => notifyApiError(error, 'ההצטרפות נכשלה', 'הצטרפות למשחק'),
  });
}
