import { AnimatePresence, motion } from 'framer-motion';
import { Gamepad2, History, LayoutGrid, LogOut, Menu, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  { to: '/admin', label: 'ניהול', icon: Shield, adminOnly: true },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

// הכפתור הפעיל מסומן בכתם ירוק אחד שמחליק בין הלשוניות (layoutId)
function DesktopNav({ items }: { items: readonly NavItem[] }) {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="ניווט ראשי">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              focusRing,
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4" aria-hidden />
              <span className="relative">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  // התפריט נסגר במעבר עמוד וב-Escape
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-4">
        <NavLink to="/" className={cn('flex shrink-0 items-center gap-2.5 rounded-lg font-display text-lg font-extrabold', focusRing)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Gamepad2 className="h-5 w-5" aria-hidden />
          </span>
          <span>GameHub</span>
        </NavLink>

        <DesktopNav items={items} />

        <div className="ms-auto flex min-w-0 items-center gap-2">
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-display font-bold text-primary ring-1 ring-border"
              aria-hidden
            >
              {user?.username.charAt(0).toUpperCase()}
            </span>
            <span className="hidden truncate text-muted-foreground sm:inline">{user?.username}</span>
          </span>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={signOut}>
            <LogOut className="h-4 w-4" aria-hidden />
            התנתקות
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label={menuOpen ? 'סגירת התפריט' : 'פתיחת התפריט'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="תפריט נייד"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full border-b border-border bg-card/95 px-4 pb-4 pt-2 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex max-w-5xl flex-col gap-1">
              {items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors',
                        focusRing,
                        isActive ? 'bg-primary/15 text-primary' : 'hover:bg-accent'
                      )
                    }
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-1 border-t border-border pt-2">
                <button
                  type="button"
                  onClick={signOut}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground',
                    focusRing
                  )}
                >
                  <LogOut className="h-5 w-5" aria-hidden />
                  התנתקות
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
