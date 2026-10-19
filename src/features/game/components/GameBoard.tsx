import { useEffect } from 'react';
import { ConflictBanner, type ConflictInfo } from '@/components/custom/ConflictBanner';
import { isApiError } from '@/lib/api';
import { GameType, type GameState } from '@/types';
import { useCaptureItem } from '../hooks/useCaptureItem';
import { GameGrid } from './GameGrid';
import { NumberRaceBoard } from './NumberRaceBoard';
import { QuizBoard } from './QuizBoard';

const CONFLICT_VISIBLE_MS = 4000;

interface GameBoardProps {
  sessionId: number;
  state: GameState;
}

// בוחר את לוח המשחק לפי הסוג, ומחבר אותו לתפיסה מול השרת
export function GameBoard({ sessionId, state }: GameBoardProps) {
  const capture = useCaptureItem(sessionId);
  const { reset, mutate, isPending } = capture;

  // מצב ההתנגשות נגזר ממצב ה-mutation, בלי useState נוסף
  const conflict: ConflictInfo | null =
    capture.isError && isApiError(capture.error) && capture.error.status === 409 && capture.variables
      ? { itemLabel: capture.variables.label, message: capture.error.message }
      : null;

  // ההתנגשות נעלמת מהמסך אחרי כמה שניות. ה-timeout מתנקה אם הרכיב יורד או שיש תפיסה חדשה.
  useEffect(() => {
    if (!conflict) return undefined;
    const timer = setTimeout(reset, CONFLICT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [conflict, reset]);

  return (
    <div className="flex flex-col gap-4">
      <ConflictBanner conflict={conflict} />

      {state.type === GameType.LootCollection && (
        <GameGrid
          boxes={state.lootBoxes}
          disabled={isPending}
          onCapture={(box) => mutate({ itemId: box.id, label: `תיבה של ${box.points} נקודות` })}
        />
      )}

      {state.type === GameType.NumberRace && (
        <NumberRaceBoard
          round={state.currentRound}
          disabled={isPending}
          onSelect={(round, option) =>
            mutate({ itemId: round.id, answer: String(option), label: `המספר ${option}` })
          }
        />
      )}

      {state.type === GameType.QuickQuiz && (
        <QuizBoard
          round={state.currentRound}
          disabled={isPending}
          onAnswer={(round, answer, onSuccess) =>
            mutate({ itemId: round.id, answer, label: `השאלה ${round.displayText}` }, { onSuccess })
          }
        />
      )}
    </div>
  );
}
