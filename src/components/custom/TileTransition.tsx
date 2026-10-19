import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

const CELL_PX = 120;
const TILE_SECONDS = 0.22;
const SPREAD_SECONDS = 0.38;

interface TileTransitionProps {
  /** cover: ריבועים צומחים וממלאים את המסך. reveal: הריבועים מתכווצים וחושפים את הדף שמאחוריהם */
  mode: 'cover' | 'reveal';
  /** נקודת המוצא של הגל, כשבר מגודל המסך (0 עד 1) */
  origin: { x: number; y: number };
  onDone?: () => void;
}

// מעבר בין מסכים בסגנון לוח המשחק: רשת של תיבות (כמו תיבות השלל) שנפתחות בגל מנקודת הלחיצה.
// אותו רכיב משמש לכיסוי המסך (בדף הפתיחה) ולחשיפתו (בהתחברות), ולכן המעבר רציף בלי קפיצה.
export function TileTransition({ mode, origin, onDone }: TileTransitionProps) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const grid = useMemo(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cols = Math.max(4, Math.round(width / CELL_PX));
    const rows = Math.max(4, Math.round(height / CELL_PX));
    const ox = origin.x * width;
    const oy = origin.y * height;
    const farthest = Math.max(
      Math.hypot(ox, oy),
      Math.hypot(width - ox, oy),
      Math.hypot(ox, height - oy),
      Math.hypot(width - ox, height - oy)
    );
    const cellW = width / cols;
    const cellH = height / rows;
    const tiles: { key: number; delay: number; alt: boolean }[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const distance = Math.hypot((col + 0.5) * cellW - ox, (row + 0.5) * cellH - oy) / farthest;
        tiles.push({ key: row * cols + col, delay: distance * SPREAD_SECONDS, alt: (row + col) % 2 === 1 });
      }
    }
    return { cols, rows, tiles };
  }, [origin.x, origin.y]);

  useEffect(() => {
    const timer = window.setTimeout(() => doneRef.current?.(), (TILE_SECONDS + SPREAD_SECONDS) * 1000 + 60);
    return () => window.clearTimeout(timer);
  }, []);

  const cover = mode === 'cover';

  return (
    <div
      className={cn('fixed inset-0 z-50 grid', cover ? 'pointer-events-auto' : 'pointer-events-none')}
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}
      aria-hidden
    >
      {grid.tiles.map((tile) => (
        <motion.div
          key={tile.key}
          className={cn('bg-primary', tile.alt && 'brightness-90')}
          initial={{ scale: cover ? 0 : 1.05 }}
          animate={{ scale: cover ? 1.05 : 0 }}
          transition={{ duration: TILE_SECONDS, delay: tile.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
