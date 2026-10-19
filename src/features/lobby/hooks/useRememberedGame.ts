import { useCallback } from 'react';
import { activeGameStorage, type RememberedGame } from '@/lib/activeGame';
import { useAuth } from '@/hooks/useAuth';

/** שמירה, קריאה והסרה של המשחקים הפתוחים של המשתמש המחובר */
export function useRememberedGame() {
  const { user } = useAuth();
  const username = user?.username;

  const remember = useCallback(
    (game: RememberedGame) => {
      if (username) activeGameStorage.add(username, game);
    },
    [username]
  );

  const readAll = useCallback(() => (username ? activeGameStorage.readAll(username) : []), [username]);

  const forget = useCallback(
    (id: number) => {
      if (username) activeGameStorage.remove(username, id);
    },
    [username]
  );

  return { remember, readAll, forget };
}
