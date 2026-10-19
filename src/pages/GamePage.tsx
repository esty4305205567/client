import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '@/components/custom/ErrorState';
import { PageHeading } from '@/components/custom/PageHeading';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/use-toast';
import { gameTypeLabel } from '@/lib/constants';
import { SessionStatus } from '@/types';
import { GameBoard } from '@/features/game/components/GameBoard';
import { GameBoardSkeleton } from '@/features/game/components/GameBoardSkeleton';
import { GameResultDialog } from '@/features/game/components/GameResultDialog';
import { ScoreHeader } from '@/features/game/components/ScoreHeader';
import { WaitingRoom } from '@/features/game/components/WaitingRoom';
import { useCountdown } from '@/features/game/hooks/useCountdown';
import { usePollGameStatus } from '@/features/game/hooks/usePollGameStatus';

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const sessionId = Number(params.id);

  const { data: state, error, isPending, dataUpdatedAt, refetch } = usePollGameStatus(sessionId);

  const status = state?.status;
  const secondsLeft = useCountdown(
    state?.remainingSeconds ?? null,
    dataUpdatedAt,
    status === SessionStatus.InProgress
  );

  // הודעה ברגע שהיריב מצטרף והמשחק מתחיל
  const previousStatus = useRef<SessionStatus | undefined>(undefined);
  useEffect(() => {
    if (previousStatus.current === SessionStatus.Waiting && status === SessionStatus.InProgress) {
      toast({ variant: 'success', title: 'היריב הצטרף', description: 'המשחק התחיל!' });
    }
    previousStatus.current = status;
  }, [status]);

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return <ErrorState error={new Error('מזהה משחק לא תקין')} />;
  }

  if (isPending) return <GameBoardSkeleton />;

  if (!state) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ErrorState error={error} onRetry={() => void refetch()} />
        <Button asChild variant="link">
          <Link to="/">חזרה ללובי</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeading title={gameTypeLabel(state.type)} />

      {state.status === SessionStatus.Waiting && <WaitingRoom code={state.code} />}

      {state.status !== SessionStatus.Waiting && (
        <div className="flex flex-col gap-4">
          <ScoreHeader state={state} secondsLeft={secondsLeft} />
          {state.status === SessionStatus.InProgress && <GameBoard sessionId={sessionId} state={state} />}
        </div>
      )}

      {state.status === SessionStatus.Finished && <GameResultDialog state={state} />}
    </>
  );
}
