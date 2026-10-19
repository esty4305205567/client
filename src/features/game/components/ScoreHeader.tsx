import { useState } from 'react';
import { CountdownRing } from '@/components/fx/CountdownRing';
import type { GameState } from '@/types';
import { PlayerScorecard } from './PlayerScorecard';

interface ScoreHeaderProps {
  state: GameState;
  secondsLeft: number;
}

export function ScoreHeader({ state, secondsLeft }: ScoreHeaderProps) {
  const myScore = state.me.score;
  const opponentScore = state.opponent?.score ?? 0;

  // משך המשחק = הערך הגבוה ביותר שנצפה בספירה לאחור (נגזר, בלי לשנות את חוזה ה-API)
  const [totalSeconds, setTotalSeconds] = useState(secondsLeft);
  if (secondsLeft > totalSeconds) setTotalSeconds(secondsLeft);

  return (
    <div className="flex items-stretch gap-3">
      <PlayerScorecard player={state.me} isMe isLeading={myScore > opponentScore} />
      <div className="flex shrink-0 items-center justify-center">
        <CountdownRing secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
      </div>
      <PlayerScorecard player={state.opponent} isLeading={opponentScore > myScore} />
    </div>
  );
}
