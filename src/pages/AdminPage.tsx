import { DoorOpen, Settings2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { PageHeading } from '@/components/custom/PageHeading';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/admin/settings', label: 'הגדרות משחקים', icon: Settings2 },
  { to: '/admin/rooms', label: 'חדרים', icon: DoorOpen },
] as const;

// דף הניהול מחולק לשני אזורים נפרדים, כל אחד בכתובת משלו
export default function AdminPage() {
  return (
    <>
      <PageHeading title="ניהול" description="הגדרות המשחקים, ורשימת כל החדרים בנפרד." />

      <nav
        aria-label="אזורי ניהול"
        className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-border bg-secondary/60 p-1"
      >
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </>
  );
}
