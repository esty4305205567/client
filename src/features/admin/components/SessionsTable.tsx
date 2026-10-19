import { Pager } from '@/components/custom/Pager';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { usePagination } from '@/hooks/usePagination';
import { ADMIN_PAGE_SIZE, gameTypeLabel } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import type { AdminGameSession } from '@/types';

export function SessionsTable({ sessions }: { sessions: readonly AdminGameSession[] }) {
  const { page, pageCount, total, pageItems, setPage } = usePagination(sessions, ADMIN_PAGE_SIZE);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>קוד</TableHead>
            <TableHead>משחק</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>מארח</TableHead>
            <TableHead>אורח</TableHead>
            <TableHead>נפתח</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-mono" dir="ltr">
                {session.code}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{gameTypeLabel(session.type)}</Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={session.status} />
              </TableCell>
              <TableCell>{session.hostUsername}</TableCell>
              <TableCell>{session.guestUsername ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(session.createdAtUtc)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pager page={page} pageCount={pageCount} total={total} onChange={setPage} />
    </>
  );
}
