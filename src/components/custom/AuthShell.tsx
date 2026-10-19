import { Gamepad2 } from 'lucide-react';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedLogo } from '@/components/custom/AnimatedLogo';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { revealScreen } from '@/lib/tileTransition';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

// רקע ירוק מלא בשני גוונים לסירוגין: אותם ריבועים של מעבר התיבות, ולכן המסך נראה כהמשך שלו.
// הצבע הוא צבע הערכה (ירוק זוהר בכהה, ירוק עמוק בבהיר), והכרטיס הבהיר או הכהה בולט עליו בשני המצבים.
const CHECKER: CSSProperties = {
  backgroundColor: 'hsl(var(--primary))',
  backgroundImage: 'conic-gradient(rgb(0 0 0 / 0.1) 25%, transparent 0 50%, rgb(0 0 0 / 0.1) 0 75%, transparent 0)',
  backgroundSize: '220px 220px',
};

// כשמגיעים ממסך הפתיחה, התיבות עוד מכסות את המסך ונסגרות בגל מהמרכז כדי לחשוף את הטופס.
export function AuthShell({ title, description, children }: AuthShellProps) {
  const location = useLocation();
  const fromTiles = (location.state as { fromTiles?: boolean } | null)?.fromTiles === true;

  useEffect(() => {
    if (fromTiles) void revealScreen({ x: 0.5, y: 0.5 });
  }, [fromTiles]);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-6"
      style={CHECKER}
    >
      <ThemeToggle className="absolute end-4 top-4 z-10 text-primary-foreground hover:bg-black/10 hover:text-primary-foreground" />

      <div className="relative w-full max-w-sm">
        <div className="mb-5 flex items-center justify-center gap-3 text-primary-foreground">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary shadow-lg">
            <Gamepad2 className="h-7 w-7" aria-hidden />
          </span>
          <AnimatedLogo text="GameHub" className="font-display text-4xl font-extrabold tracking-tight" />
        </div>

        {/* הטופס עולה בעדינות (גדל ומופיע) בדיוק כשהריבועים מתחילים להיפתח, ולא אחרי שהם נעלמו */}
        <div className="animate-bubble-in" style={{ animationDelay: fromTiles ? '120ms' : '0ms' }}>
          <Card className="rounded-2xl border-0 shadow-2xl shadow-black/30">
            <CardHeader className="gap-2 px-8 pt-7">
              <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-7">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
