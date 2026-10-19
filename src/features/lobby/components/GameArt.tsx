import { cn } from '@/lib/utils';
import { GameType } from '@/types';

// איורים דקורטיביים לכרטיסי המשחקים: כל משחק נראה כמו הלוח שלו
const BOXES = [
  { className: 'start-[12%] top-[18%] h-5 w-5 bg-primary', delay: '[animation-delay:-0.5s]' },
  { className: 'start-[34%] top-[58%] h-7 w-7 bg-primary/60', delay: '[animation-delay:-2s]' },
  { className: 'start-[56%] top-[24%] h-6 w-6 bg-primary/80', delay: '[animation-delay:-3.2s]' },
  { className: 'start-[74%] top-[62%] h-5 w-5 bg-primary/40', delay: '[animation-delay:-1.2s]' },
  { className: 'start-[88%] top-[20%] h-4 w-4 bg-primary/70', delay: '[animation-delay:-4s]' },
];

function LootArt() {
  return (
    <>
      {BOXES.map((box) => (
        <span
          key={box.className}
          className={cn('absolute animate-drift rounded-md shadow-glow', box.className, box.delay)}
        />
      ))}
    </>
  );
}

function RaceArt() {
  const numbers = [7, 12, 9, 4];
  return (
    <div className="flex h-full items-center justify-center gap-3" dir="ltr">
      {numbers.map((n) => (
        <span
          key={n}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg border font-mono text-lg font-bold',
            n === 12
              ? 'border-primary bg-primary/15 text-primary shadow-glow'
              : 'border-border bg-card text-muted-foreground'
          )}
        >
          {n}
        </span>
      ))}
    </div>
  );
}

function QuizArt() {
  return (
    <div className="flex h-full items-center justify-center gap-3 font-mono font-bold" dir="ltr">
      <span className="text-3xl text-foreground">7 × 8 =</span>
      <span className="flex h-12 min-w-12 items-center justify-center rounded-lg border border-primary bg-primary/15 px-3 text-2xl text-primary shadow-glow">
        56
      </span>
    </div>
  );
}

export function GameArt({ type, className }: { type: GameType; className?: string }) {
  return (
    <div
      className={cn('relative h-32 overflow-hidden rounded-lg border border-border/70 bg-background/60 game-grid-bg', className)}
      aria-hidden
    >
      {type === GameType.LootCollection && <LootArt />}
      {type === GameType.NumberRace && <RaceArt />}
      {type === GameType.QuickQuiz && <QuizArt />}
    </div>
  );
}
