import { Crown } from 'lucide-react';
import { NumberTicker } from '@/components/fx/NumberTicker';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { PlayerState } from '@/types';

interface PlayerScorecardProps {
  player: PlayerState | null;
  isMe?: boolean;
  isLeading?: boolean;
}

export function PlayerScorecard({ player, isMe = false, isLeading = false }: PlayerScorecardProps) {
  return (
    <Card
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-2 p-4 transition-all duration-300',
        isMe && 'border-primary/50',
        isLeading && 'border-primary shadow-glow'
      )}
    >
      <span className="flex max-w-full items-center gap-2 text-sm font-medium">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold ring-1 ring-border',
            isMe && 'text-primary'
          )}
          aria-hidden
        >
          {player ? player.username.charAt(0).toUpperCase() : '?'}
        </span>
        <span className="truncate text-muted-foreground">
          {player?.username ?? 'ממתין...'}
          {isMe && ' (אני)'}
        </span>
        {isLeading && <Crown className="h-4 w-4 shrink-0 text-primary" aria-label="מוביל" />}
      </span>
      <NumberTicker value={player?.score ?? 0} className="font-mono text-5xl font-bold tabular-nums leading-none" />
    </Card>
  );
}
