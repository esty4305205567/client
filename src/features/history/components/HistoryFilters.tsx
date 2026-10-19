import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { GAME_TYPES } from '@/lib/constants';
import { GameType, HistorySortBy } from '@/types';
import type { GameTypeFilter } from '../types';

interface HistoryFiltersProps {
  gameType: GameTypeFilter;
  sortBy: HistorySortBy;
  desc: boolean;
  onGameTypeChange: (value: GameTypeFilter) => void;
  onSortByChange: (value: HistorySortBy) => void;
  onDescChange: (value: boolean) => void;
}

function parseGameType(value: string): GameTypeFilter {
  const parsed = Number(value);
  return GAME_TYPES.some((game) => game.value === parsed) ? (parsed as GameType) : '';
}

export function HistoryFilters(props: HistoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="grid w-44 gap-2">
        <Label htmlFor="filter-game">משחק</Label>
        <Select id="filter-game" value={props.gameType} onChange={(e) => props.onGameTypeChange(parseGameType(e.target.value))}>
          <option value="">הכול</option>
          {GAME_TYPES.map((game) => (
            <option key={game.value} value={game.value}>
              {game.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid w-44 gap-2">
        <Label htmlFor="filter-sort">מיון לפי</Label>
        <Select
          id="filter-sort"
          value={props.sortBy}
          onChange={(e) => props.onSortByChange(Number(e.target.value) === HistorySortBy.Score ? HistorySortBy.Score : HistorySortBy.Date)}
        >
          <option value={HistorySortBy.Date}>תאריך</option>
          <option value={HistorySortBy.Score}>ניקוד</option>
        </Select>
      </div>
      <div className="grid w-36 gap-2">
        <Label htmlFor="filter-order">סדר</Label>
        <Select id="filter-order" value={props.desc ? 'desc' : 'asc'} onChange={(e) => props.onDescChange(e.target.value === 'desc')}>
          <option value="desc">יורד</option>
          <option value="asc">עולה</option>
        </Select>
      </div>
    </div>
  );
}
