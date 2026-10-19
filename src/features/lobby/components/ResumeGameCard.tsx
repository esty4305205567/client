import { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { BorderBeam } from '@/components/fx/BorderBeam';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { isApiError } from '@/lib/api';
import { gameTypeLabel } from '@/lib/constants';
import { gameApi } from '@/lib/endpoints';
import { gameQueryKey } from '@/features/game/hooks/usePollGameStatus';
import { useRememberedGame } from '@/features/lobby/hooks/useRememberedGame';
import { SessionStatus, type GameState } from '@/types';

/**
 * "המשחקים שלך": כל המשחקים ששמורים בדפדפן וממתינים או רצים.
 * המצב נבדק מול השרת (מקור האמת). משחק שהסתיים או שאין אליו גישה נמחק מהרשימה.
 */
export function ResumeGameCard() {
  const { readAll, forget } = useRememberedGame();
  const [remembered] = useState(readAll);

  const results = useQueries({
    queries: remembered.map((game) => ({
      queryKey: gameQueryKey(game.id),
      queryFn: ({ signal }: { signal: AbortSignal }) => gameApi.getState(game.id, signal),
      staleTime: 0,
      refetchOnMount: 'always' as const,
      retry: false,
      meta: { silent: true },
    })),
  });

  const rows = remembered.map((game, index) => {
    const { data, error } = results[index];
    const isGone =
      data?.status === SessionStatus.Finished ||
      (isApiError(error) && (error.status === 403 || error.status === 404));
    return { game, state: data as GameState | undefined, isGone };
  });

  const goneIds = rows.filter((row) => row.isGone).map((row) => row.game.id);
  const goneKey = goneIds.join(',');

  useEffect(() => {
    goneIds.forEach(forget);
    // goneKey מייצג את goneIds, כדי לא להריץ מחדש בכל רינדור
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goneKey, forget]);

  const active = rows.filter((row) => row.state && !row.isGone);
  if (active.length === 0) return null;

  return (
    <section className="mb-10" aria-labelledby="resume-heading">
      <h2 id="resume-heading" className="mb-4 text-xl font-bold">
        {active.length === 1 ? 'המשחק הפתוח שלך' : `המשחקים הפתוחים שלך (${active.length})`}
      </h2>
      <div className="grid gap-3">
        {active.map(({ game, state }) => (
          <Card key={game.id} className="relative overflow-hidden border-primary/30">
            <BorderBeam duration={6} />
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{gameTypeLabel(game.type)}</span>
                  {state && <StatusBadge status={state.status} />}
                </div>
                <p className="text-sm text-muted-foreground">
                  קוד החדר: <span className="font-mono tracking-widest text-foreground">{game.code}</span>
                </p>
              </div>
              <Button asChild>
                <Link to={`/game/${game.id}`}>
                  <Play className="h-4 w-4" aria-hidden />
                  חזרה למשחק
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
