import { GameHistoryRow } from '@/components/custom/GameHistoryRow';
import { Pager } from '@/components/custom/Pager';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { HISTORY_PAGE_SIZE } from '@/lib/constants';
import { usePagination } from '@/hooks/usePagination';
import type { GameHistoryItem } from '@/types';

export function HistoryTable({ games }: { games: readonly GameHistoryItem[] }) {
  const { page, pageCount, total, pageItems, setPage } = usePagination(games, HISTORY_PAGE_SIZE);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>תאריך</TableHead>
            <TableHead>משחק</TableHead>
            <TableHead>מארח</TableHead>
            <TableHead>אורח</TableHead>
            <TableHead>מנצח</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((game) => (
            <GameHistoryRow key={game.sessionId} game={game} />
          ))}
        </TableBody>
      </Table>
      <Pager page={page} pageCount={pageCount} total={total} onChange={setPage} />
    </>
  );
}
