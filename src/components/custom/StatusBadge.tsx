import { Badge } from '@/components/ui/Badge';
import { sessionStatusLabel } from '@/lib/constants';
import { SessionStatus } from '@/types';

export function StatusBadge({ status }: { status: SessionStatus }) {
  const variant =
    status === SessionStatus.InProgress ? 'default' : status === SessionStatus.Waiting ? 'outline' : 'secondary';
  return <Badge variant={variant}>{sessionStatusLabel(status)}</Badge>;
}
