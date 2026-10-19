import { useState } from 'react';
import { AdminControlPanel } from '@/components/custom/AdminControlPanel';
import { ErrorState } from '@/components/custom/ErrorState';
import { TableSkeleton } from '@/components/custom/TableSkeleton';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { GAME_TYPES, SESSION_STATUSES } from '@/lib/constants';
import { GameType, SessionStatus } from '@/types';
import { useAdminSessions } from '../hooks/useAdminSessions';
import type { SessionGameTypeFilter, SessionStatusFilter } from '../types';
import { SessionsTable } from './SessionsTable';

function parseGameType(value: string): SessionGameTypeFilter {
  const parsed = Number(value);
  return GAME_TYPES.some((game) => game.value === parsed) ? (parsed as GameType) : '';
}

function parseStatus(value: string): SessionStatusFilter {
  const parsed = Number(value);
  return SESSION_STATUSES.some((item) => item.value === parsed) ? (parsed as SessionStatus) : '';
}

export function SessionsPanel() {
  const [gameType, setGameType] = useState<SessionGameTypeFilter>('');
  const [status, setStatus] = useState<SessionStatusFilter>('');

  const sessions = useAdminSessions({
    gameType: gameType === '' ? undefined : gameType,
    status: status === '' ? undefined : status,
  });

  return (
    <AdminControlPanel title="כל החדרים" description="עד 200 החדרים האחרונים. הסינון מתבצע בשרת.">
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="grid w-44 gap-2">
          <Label htmlFor="admin-game">משחק</Label>
          <Select id="admin-game" value={gameType} onChange={(e) => setGameType(parseGameType(e.target.value))}>
            <option value="">הכול</option>
            {GAME_TYPES.map((game) => (
              <option key={game.value} value={game.value}>
                {game.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid w-44 gap-2">
          <Label htmlFor="admin-status">סטטוס</Label>
          <Select id="admin-status" value={status} onChange={(e) => setStatus(parseStatus(e.target.value))}>
            <option value="">הכול</option>
            {SESSION_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {sessions.isPending && <TableSkeleton columns={6} label="טוען חדרים" />}
      {sessions.isError && <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />}
      {sessions.data && sessions.data.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">אין חדרים להצגה.</p>
      )}
      {sessions.data && sessions.data.length > 0 && (
        <SessionsTable key={`${gameType}-${status}`} sessions={sessions.data} />
      )}
    </AdminControlPanel>
  );
}
