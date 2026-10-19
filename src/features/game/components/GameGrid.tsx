import { useMovingBoxes } from '../hooks/useMovingBoxes';
import type { LootBox } from '@/types';

interface GameGridProps {
  boxes: readonly LootBox[];
  disabled: boolean;
  onCapture: (box: LootBox) => void;
}

// לוח איסוף השלל. רשימת התיבות מהשרת, והתנועה (בצד הלקוח) מ-useMovingBoxes.
// העטיפה מקבלת transform מ-requestAnimationFrame, והכפתור הפנימי מריץ את אנימציית ההופעה.
export function GameGrid({ boxes, disabled, onCapture }: GameGridProps) {
  const { containerRef, getBoxRef } = useMovingBoxes(boxes);

  return (
    <div
      ref={containerRef}
      aria-label="לוח המשחק"
      className="game-grid-bg relative h-[420px] w-full select-none overflow-hidden rounded-xl border border-border shadow-lg shadow-black/30 ring-1 ring-inset ring-white/[0.03]"
    >
      {boxes.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          ממתינים לתיבות...
        </p>
      )}

      {boxes.map((box) => (
        <div
          key={box.id}
          ref={getBoxRef(box.id)}
          className="absolute left-0 top-0 -ml-7 -mt-7 h-14 w-14 will-change-transform"
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => onCapture(box)}
            aria-label={`תיבה של ${box.points} נקודות`}
            className="flex h-full w-full animate-box-pop items-center justify-center rounded-xl border-2 border-primary bg-primary/20 font-mono text-lg font-bold text-primary shadow-glow transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {box.points}
          </button>
        </div>
      ))}
    </div>
  );
}
