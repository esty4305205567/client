import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountdownRingProps {
  secondsLeft: number;
  totalSeconds: number;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// טבעת שעון שמתרוקנת. ב-10 השניות האחרונות היא הופכת לאדומה ופועמת.
export function CountdownRing({ secondsLeft, totalSeconds }: CountdownRingProps) {
  const ratio = totalSeconds > 0 ? Math.min(1, secondsLeft / totalSeconds) : 0;
  const urgent = secondsLeft <= 10;

  return (
    <div
      className={cn('relative flex h-28 w-28 items-center justify-center', urgent && 'animate-breathe')}
      role="timer"
      aria-label={`נותרו ${secondsLeft} שניות`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="6" className="stroke-border" />
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
          transition={{ duration: 0.4, ease: 'linear' }}
          className={urgent ? 'stroke-conflict' : 'stroke-primary'}
          style={{ filter: `drop-shadow(0 0 6px hsl(var(${urgent ? '--conflict' : '--primary'}) / 0.7))` }}
        />
      </svg>
      <span className={cn('font-mono text-3xl font-bold tabular-nums', urgent && 'text-conflict')}>{secondsLeft}</span>
    </div>
  );
}
