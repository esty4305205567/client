import { Gamepad2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BubbleBackdrop } from '@/components/custom/BubbleBackdrop';
import { Button } from '@/components/ui/Button';
import { markWelcomeSeen } from '@/lib/welcome';
import { cn } from '@/lib/utils';

const ENTER_MS = 700;

// מסך פתיחה: בועה גדולה. לחיצה על "כניסה" מנפחת אותה עד שהיא ממלאת את המסך, ואז עוברים להתחברות.
export default function WelcomePage() {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function enter() {
    if (entering) return;
    markWelcomeSeen();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      navigate('/login');
      return;
    }
    setEntering(true);
    timer.current = window.setTimeout(() => navigate('/login'), ENTER_MS);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <BubbleBackdrop />

      <div className={cn('relative flex flex-col items-center gap-10 transition-opacity duration-300', entering && 'opacity-0')}>
        <div className="bubble-orb relative flex h-64 w-64 animate-breathe items-center justify-center rounded-full border border-primary/40 sm:h-80 sm:w-80">
          <span className="absolute start-[18%] top-[12%] h-10 w-20 -rotate-[28deg] rounded-full bg-white/15 blur-sm" aria-hidden />
          <div className="flex flex-col items-center gap-3">
            <Gamepad2 className="h-16 w-16 text-primary sm:h-20 sm:w-20" aria-hidden />
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">GameHub</h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <p className="max-w-xs text-lg text-muted-foreground">תפסו ראשונים. נצחו ביחד.</p>
          <Button size="lg" onClick={enter} disabled={entering} className="min-w-44 rounded-full">
            כניסה
          </Button>
        </div>
      </div>

      {/* הבועה המתנפחת: שכבה נפרדת, כדי שהתוכן יתעמעם בזמן שהיא גדלה */}
      <span
        className={cn(
          'bubble-orb pointer-events-none fixed left-1/2 top-1/2 -ml-32 -mt-32 h-64 w-64 scale-0 rounded-full opacity-0 transition-all ease-in sm:-ml-40 sm:-mt-40 sm:h-80 sm:w-80',
          entering && 'scale-[24] opacity-100'
        )}
        style={{ transitionDuration: `${ENTER_MS}ms` }}
        aria-hidden
      />
    </div>
  );
}
