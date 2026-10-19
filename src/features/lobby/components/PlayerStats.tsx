import { Percent, Swords, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import { NumberTicker } from '@/components/fx/NumberTicker';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGameHistory } from '@/features/history/hooks/useGameHistory';
import { HistorySortBy, type GameHistoryItem } from '@/types';

function computeStats(games: readonly GameHistoryItem[], username: string) {
  const wins = games.filter((game) => game.winnerUsername === username).length;
  const winRate = games.length === 0 ? 0 : Math.round((wins / games.length) * 100);
  return { played: games.length, wins, winRate };
}

interface StatTileProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

function StatTile({ icon, label, children }: StatTileProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
        {icon}
      </span>
      <div>
        <div className="font-mono text-3xl font-bold leading-none tabular-nums">{children}</div>
        <div className="mt-1.5 text-sm text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}

// שלושה מספרים אישיים מההיסטוריה. מוצגים רק כשיש נתונים, כדי לא להציג אפסים בזמן טעינה.
export function PlayerStats() {
  const { user } = useAuth();
  const history = useGameHistory({ sortBy: HistorySortBy.Date, desc: true });

  if (!user) return null;

  if (history.isPending) {
    return (
      <div className="mb-10 grid gap-4 sm:grid-cols-3" aria-hidden>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-[88px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!history.data) return null;

  const { played, wins, winRate } = computeStats(history.data, user.username);

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3" aria-label="הסטטיסטיקה שלך">
      <StatTile icon={<Swords className="h-6 w-6" aria-hidden />} label="משחקים שהסתיימו">
        <NumberTicker value={played} />
      </StatTile>
      <StatTile icon={<Trophy className="h-6 w-6" aria-hidden />} label="ניצחונות">
        <NumberTicker value={wins} />
      </StatTile>
      <StatTile icon={<Percent className="h-6 w-6" aria-hidden />} label="אחוז ניצחון">
        <NumberTicker value={winRate} suffix="%" />
      </StatTile>
    </section>
  );
}
