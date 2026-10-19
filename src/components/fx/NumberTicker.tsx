import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface NumberTickerProps {
  value: number;
  className?: string;
  suffix?: string;
}

// מספר שסופר אל הערך החדש בקפיצה חלקה (בסגנון Magic UI Number Ticker)
export function NumberTicker({ value, className, suffix = '' }: NumberTickerProps) {
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const text = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: reducedMotion ? 0 : 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, motionValue, reducedMotion]);

  return <motion.span className={className}>{text}</motion.span>;
}
