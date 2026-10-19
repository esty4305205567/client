import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableCell, TableRow } from '@/components/ui/Table';
import { formatDateTime } from '@/lib/format';
import { gameTypeLabel } from '@/lib/constants';
import type { GameHistoryItem } from '@/types';

export function GameHistoryRow({ game }: { game: GameHistoryItem }) {
  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{formatDateTime(game.finishedAtUtc)}</TableCell>
      <TableCell>
        <Badge variant="outline">{gameTypeLabel(game.gameType)}</Badge>
      </TableCell>
      <TableCell>
        {game.hostUsername} <span className="font-mono font-semibold">{game.hostScore}</span>
      </TableCell>
      <TableCell>
        {game.guestUsername ? (
          <>
            {game.guestUsername} <span className="font-mono font-semibold">{game.guestScore ?? 0}</span>
          </>
        ) : (
          '—'
        )}
      </TableCell>
      <TableCell>
        {game.winnerUsername ? (
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <Trophy className="h-4 w-4" aria-hidden />
            {game.winnerUsername}
          </span>
        ) : (
          <Badge variant="secondary">תיקו</Badge>
        )}
      </TableCell>
    </TableRow>
  );
}
