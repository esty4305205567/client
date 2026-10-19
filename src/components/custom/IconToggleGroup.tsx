import type { LucideIcon } from 'lucide-react';
import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface IconToggleOption<T extends string | number> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface IconToggleGroupProps<T extends string | number> {
  /** שם הקבוצה לקורא מסך */
  label: string;
  value: T;
  options: readonly IconToggleOption<T>[];
  onChange: (value: T) => void;
  /** true = מציג גם טקסט ליד האייקון (למשל בדף הפרופיל) */
  showLabels?: boolean;
  className?: string;
}

// קבוצת בחירה באייקונים: כל כפתור עם aria-label ו-title (תיאור בריחוף), ניווט בחיצים כמו radiogroup
export function IconToggleGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  showLabels = false,
  className,
}: IconToggleGroupProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? -1 : event.key === 'ArrowLeft' ? 1 : 0;
    if (step === 0) return;
    event.preventDefault();
    // RTL: חץ ימינה הולך אחורה ברשימה, חץ שמאלה קדימה
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      title={label}
      className={cn('inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/60 p-1', className)}
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }, index) => {
        const active = optionValue === value;
        return (
          <button
            key={String(optionValue)}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={optionLabel}
            title={optionLabel}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(optionValue)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              showLabels ? 'px-4' : 'w-10',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {showLabels && <span>{optionLabel}</span>}
          </button>
        );
      })}
    </div>
  );
}
