import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

// כרטיס עם הילה שעוקבת אחרי העכבר והטיה תלת-ממדית עדינה (בסגנון Aceternity Card Spotlight + 3D Card)
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const unitX = useMotionValue(0);
  const unitY = useMotionValue(0);

  const rotateX = useSpring(useTransform(unitY, [-0.5, 0.5], [5, -5]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(unitX, [-0.5, 0.5], [-5, 5]), { stiffness: 220, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(280px circle at ${pointerX}px ${pointerY}px, hsl(150 100% 45% / 0.20), transparent 70%)`;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pointerX.set(x);
    pointerY.set(y);
    unitX.set(x / rect.width - 0.5);
    unitY.set(y / rect.height - 0.5);
  }

  function onLeave() {
    pointerX.set(-200);
    pointerY.set(-200);
    unitX.set(0);
    unitY.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={cn('group relative h-full rounded-xl', className)}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
        aria-hidden
      />
    </motion.div>
  );
}
