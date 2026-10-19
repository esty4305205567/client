import { ArrowDownWideNarrow, ArrowUpNarrowWide, CalendarDays, Gift, Hash, LayoutGrid, Trophy, Zap } from 'lucide-react';
import { IconToggleGroup, type IconToggleOption } from '@/components/custom/IconToggleGroup';
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

// אייקון לכל אפשרות. הטקסט נשאר כ-aria-label וכתיאור בריחוף
const GAME_OPTIONS: readonly IconToggleOption<GameTypeFilter>[] = [
  { value: '', label: 'כל המשחקים', icon: LayoutGrid },
  { value: GameType.LootCollection, label: 'איסוף שלל', icon: Gift },
  { value: GameType.NumberRace, label: 'מרוץ מספרים', icon: Hash },
  { value: GameType.QuickQuiz, label: 'חידון מהיר', icon: Zap },
];

const SORT_OPTIONS: readonly IconToggleOption<HistorySortBy>[] = [
  { value: HistorySortBy.Date, label: 'מיון לפי תאריך', icon: CalendarDays },
  { value: HistorySortBy.Score, label: 'מיון לפי ניקוד', icon: Trophy },
];

const ORDER_OPTIONS: readonly IconToggleOption<'desc' | 'asc'>[] = [
  { value: 'desc', label: 'סדר יורד', icon: ArrowDownWideNarrow },
  { value: 'asc', label: 'סדר עולה', icon: ArrowUpNarrowWide },
];

export function HistoryFilters(props: HistoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3" role="toolbar" aria-label="סינון ומיון ההיסטוריה">
      <IconToggleGroup label="סינון לפי משחק" value={props.gameType} options={GAME_OPTIONS} onChange={props.onGameTypeChange} />
      <IconToggleGroup label="מיון לפי" value={props.sortBy} options={SORT_OPTIONS} onChange={props.onSortByChange} />
      <IconToggleGroup
        label="כיוון המיון"
        value={props.desc ? 'desc' : 'asc'}
        options={ORDER_OPTIONS}
        onChange={(value) => props.onDescChange(value === 'desc')}
      />
    </div>
  );
}
