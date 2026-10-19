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

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className={cn('flex items-center gap-3 rounded-xl', focusRing)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow',
          compact ? 'h-10 w-10' : 'h-11 w-11'
        )}
      >
        <Gamepad2 className={compact ? 'h-5 w-5' : 'h-6 w-6'} aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-xl font-extrabold">GameHub</span>
        {!compact && <span className="block text-xs text-muted-foreground">משחקי מהירות לשניים</span>}
      </span>
    </NavLink>
  );
}

// תוכן הסרגל: לוגו, ניווט אנכי, ובתחתית מצב תצוגה, פרטי המשתמש והתנתקות
function SidebarContent() {
  const { user, isAdmin, signOut } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />

      <nav aria-label="ניווט ראשי" className="flex-1">
        <ul className="flex flex-col gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors',
                    focusRing,
                    isActive
                      ? 'bg-primary/15 text-primary'
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
            className={cn('flex min-w-0 items-center gap-3 rounded-xl p-1', focusRing)}
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
            'mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
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

// במחשב: סרגל אנכי קבוע בצד הימני לכל גובה המסך. בנייד: פס עליון קטן, והסרגל נפתח כמגירה.
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
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-border bg-card md:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center gap-1 border-b border-border bg-card/90 px-4 backdrop-blur-xl md:hidden">
        <Logo compact />
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
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
