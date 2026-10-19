import { motion, useReducedMotion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatedLogo } from '@/components/custom/AnimatedLogo';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { cn } from '@/lib/utils';

// רקע הטופס: ירוק מלא בשני גוונים לסירוגין. בדף הפתיחה הוא שקוף, ומתמלא בהדרגה כשעוברים להתחברות
const CHECKER: CSSProperties = {
  backgroundColor: 'hsl(var(--primary))',
  backgroundImage: 'conic-gradient(rgb(0 0 0 / 0.1) 25%, transparent 0 50%, rgb(0 0 0 / 0.1) 0 75%, transparent 0)',
  backgroundSize: '220px 220px',
};

// במה אחת לפתיחה, התחברות והרשמה. הלוגו נשאר על המסך כל הזמן ורק גולש למעלה, התוכן שמתחתיו מתחלף,
// והרקע הופך לירוק. אין החלפת מסך ואין שכבות: זה מעבר רציף אחד, ולא מעבר בין שקופיות.
export function AuthStage() {
  const { pathname } = useLocation();
  const intro = pathname === '/welcome';
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-6">
      <div
        className={cn('absolute inset-0 transition-opacity duration-700 ease-out', intro ? 'opacity-0' : 'opacity-100')}
        style={CHECKER}
        aria-hidden
      />

      <ThemeToggle
        className={cn(
          'absolute end-4 top-4 z-10 transition-colors duration-500',
          !intro && 'text-primary-foreground hover:bg-black/10 hover:text-primary-foreground'
        )}
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* layout="position": כשהתוכן שמתחת משתנה והעמודה מתמרכזת מחדש, הלוגו גולש למקומו החדש בקפיצי תנועה */}
        <motion.div
          layout="position"
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 20 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-colors duration-500',
              intro ? 'bg-primary text-primary-foreground' : 'bg-card text-primary'
            )}
          >
            <Gamepad2 className="h-8 w-8" aria-hidden />
          </span>
          <AnimatedLogo
            text="GameHub"
            className={cn(
              'font-display text-5xl font-extrabold tracking-tight transition-colors duration-500 sm:text-6xl',
              intro ? 'text-foreground' : 'text-primary-foreground'
            )}
          />
        </motion.div>

        <Outlet />
      </div>
    </div>
  );
}
