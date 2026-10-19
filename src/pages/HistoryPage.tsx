import { useState } from 'react';
import { ErrorState } from '@/components/custom/ErrorState';
import { PageHeading } from '@/components/custom/PageHeading';
import { TableSkeleton } from '@/components/custom/TableSkeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { HistoryFilters } from '@/features/history/components/HistoryFilters';
import { HistoryTable } from '@/features/history/components/HistoryTable';
import { useGameHistory } from '@/features/history/hooks/useGameHistory';
import type { GameTypeFilter } from '@/features/history/types';
import { HistorySortBy } from '@/types';

export default function HistoryPage() {
  const [gameType, setGameType] = useState<GameTypeFilter>('');
  const [sortBy, setSortBy] = useState<HistorySortBy>(HistorySortBy.Date);
  const [desc, setDesc] = useState(true);

  const history = useGameHistory({
    gameType: gameType === '' ? undefined : gameType,
    sortBy,
    desc,
  });

  return (
    <>
      <PageHeading title="היסטוריה" description="המשחקים שהסתיימו. מנהל רואה את כל המשחקים." />

      <Card>
        <CardContent className="grid gap-6 p-6">
          <HistoryFilters
            gameType={gameType}
            sortBy={sortBy}
            desc={desc}
            onGameTypeChange={setGameType}
            onSortByChange={setSortBy}
            onDescChange={setDesc}
          />

          {history.isPending && <TableSkeleton columns={5} label="טוען היסטוריה" />}
          {history.isError && <ErrorState error={history.error} onRetry={() => void history.refetch()} />}
          {history.data && history.data.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">עדיין אין משחקים שהסתיימו.</p>
          )}
          {history.data && history.data.length > 0 && (
            // key: סינון או מיון חדש מחזיר לעמוד הראשון
            <HistoryTable key={`${gameType}-${sortBy}-${desc}`} games={history.data} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
