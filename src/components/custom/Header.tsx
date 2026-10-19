import { AnimatePresence, motion } from 'framer-motion';
import { Gamepad2, History, LayoutGrid, LogOut, Menu, Shield, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  end?: boolean;
  adminOnly?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'לובי', icon: LayoutGrid, end: true },
  { to: '/history', label: 'היסטוריה', icon: History },
  { to: '/profile', label: 'פרופיל', icon: User },
  { to: '/admin', label: 'ניהול', icon: Shield, adminOnly: true },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function LogoMark({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow',
        size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'
      )}
    >
      <Gamepad2 className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden />
    </span>
  );
}

// ---------- מחשב: פס צף וצר עם אייקונים וכיתוב מתחתם ----------

function RailItem({ to, label, icon: Icon, end }: NavItem) {
  return (
    <NavLink
      to={to}
      end={end}
      className={cn('group relative flex w-full flex-col items-center gap-1.5 rounded-2xl py-2', focusRing)}
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
              isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="rail-active"
                className="absolute inset-0 rounded-2xl bg-primary shadow-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="relative h-5 w-5" aria-hidden />
          </span>
          <span
            className={cn(
              'text-xs font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function Rail() {
  const { user, isAdmin, signOut } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      aria-label="תפריט ראשי"
      className="fixed inset-y-4 start-4 z-40 hidden w-24 flex-col items-center rounded-3xl border border-border bg-card/80 py-5 shadow-xl backdrop-blur-xl md:flex"
    >
      <NavLink to="/" aria-label="GameHub, לובי" className={cn('flex flex-col items-center gap-1.5 rounded-2xl', focusRing)}>
        <LogoMark />
        <span className="font-display text-xs font-extrabold">GameHub</span>
      </NavLink>

      <div className="my-4 h-px w-10 bg-border" aria-hidden />

      <nav aria-label="ניווט ראשי" className="flex w-full flex-1 flex-col items-center gap-1 px-2">
        {items.map((item) => (
          <RailItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="mt-4 flex w-full flex-col items-center gap-2 px-2">
        <div className="h-px w-10 bg-border" aria-hidden />
        <ThemeToggle />
        <NavLink
          to="/profile"
          aria-label={`הפרופיל של ${user?.username ?? ''}`}
          className={cn('flex max-w-full flex-col items-center gap-1 rounded-2xl p-1', focusRing)}
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary ring-1 ring-primary/40"
            aria-hidden
          >
            {user?.username.charAt(0).toUpperCase()}
          </span>
          <span className="max-w-[5.5rem] truncate text-xs font-medium">{user?.username}</span>
        </NavLink>
        <button
          type="button"
          onClick={signOut}
          className={cn(
            'flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            focusRing
          )}
        >
          <LogOut className="h-5 w-5" aria-hidden />
          <span className="text-xs font-medium">התנתקות</span>
        </button>
      </div>
    </aside>
  );
}

// ---------- נייד: מגירה עם רשימה ----------

function DrawerContent() {
  const { user, isAdmin, signOut } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <NavLink to="/" className={cn('flex w-fit items-center gap-3 rounded-2xl', focusRing)}>
        <LogoMark size="sm" />
        <span className="font-display text-xl font-extrabold">GameHub</span>
      </NavLink>

      <nav aria-label="ניווט ראשי" className="flex-1">
        <ul className="flex flex-col gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                    focusRing,
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2">
          <NavLink
            to="/profile"
            aria-label={`הפרופיל של ${user?.username ?? ''}`}
            className={cn('flex min-w-0 items-center gap-3 rounded-2xl p-1', focusRing)}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary ring-1 ring-primary/40"
              aria-hidden
            >
              {user?.username.charAt(0).toUpperCase()}
            </span>
            <span className="grid min-w-0 gap-1 text-start">
              <span className="truncate text-sm font-bold">{user?.username}</span>
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="w-fit">
                {isAdmin ? 'מנהל' : 'שחקן'}
              </Badge>
            </span>
          </NavLink>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={signOut}
          className={cn(
            'mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            focusRing
          )}
        >
          <LogOut className="h-5 w-5" aria-hidden />
          התנתקות
        </button>
      </div>
    </div>
  );
}

// במחשב: פס צף וצר בצד ימין. בנייד: פס עליון קטן, והתפריט נפתח כמגירה.
export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // המגירה נסגרת במעבר עמוד וב-Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <Rail />

      <header className="sticky top-0 z-40 flex h-16 items-center gap-1 border-b border-border bg-card/90 px-4 backdrop-blur-xl md:hidden">
        <NavLink to="/" aria-label="GameHub, לובי" className={cn('flex items-center gap-2 rounded-2xl', focusRing)}>
          <LogoMark size="sm" />
          <span className="font-display text-xl font-extrabold">GameHub</span>
        </NavLink>
        <div className="ms-auto flex items-center gap-1">
          <ThemeToggle />
          <NavLink
            to="/profile"
            aria-label={`הפרופיל של ${user?.username ?? ''}`}
            className={cn('rounded-full', focusRing)}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-base font-bold text-primary ring-1 ring-primary/40"
              aria-hidden
            >
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            aria-label="פתיחת התפריט"
            aria-expanded={open}
            aria-controls="mobile-sidebar"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="drawer"
              id="mobile-sidebar"
              aria-label="תפריט"
              className="fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] border-e border-border bg-card shadow-2xl md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute end-3 top-5"
                aria-label="סגירת התפריט"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </Button>
              <DrawerContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
