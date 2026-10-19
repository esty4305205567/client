import { LogOut, Moon, Palette, Shield, Sun, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconToggleGroup, type IconToggleOption } from '@/components/custom/IconToggleGroup';
import { PageHeading } from '@/components/custom/PageHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { PlayerStats } from '@/features/lobby/components/PlayerStats';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/context/ThemeContext';

const THEME_OPTIONS: readonly IconToggleOption<Theme>[] = [
  { value: 'light', label: 'בהיר', icon: Sun },
  { value: 'dark', label: 'כהה', icon: Moon },
];

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="font-semibold">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  return (
    <>
      <PageHeading title="פרופיל" description="הפרטים שלך, הסטטיסטיקה ותצוגת האתר." />

      <Card className="mb-8">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-start">
          <span
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-4xl font-extrabold text-primary ring-2 ring-primary/40"
            aria-hidden
          >
            {user.username.charAt(0).toUpperCase()}
          </span>
          <div className="grid gap-2">
            <h2 className="text-2xl font-extrabold">{user.username}</h2>
            <div>
              <Badge variant={isAdmin ? 'default' : 'secondary'}>{isAdmin ? 'מנהל' : 'שחקן'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <PlayerStats />

      <Card>
        <CardContent className="px-6 py-2">
          <DetailRow icon={<User className="h-5 w-5" aria-hidden />} label="שם משתמש">
            {user.username}
          </DetailRow>
          <DetailRow icon={<Shield className="h-5 w-5" aria-hidden />} label="תפקיד">
            {isAdmin ? 'מנהל' : 'שחקן'}
          </DetailRow>
          <DetailRow icon={<Palette className="h-5 w-5" aria-hidden />} label="מצב תצוגה">
            <IconToggleGroup label="מצב תצוגה" value={theme} options={THEME_OPTIONS} onChange={setTheme} showLabels />
          </DetailRow>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" aria-hidden />
          התנתקות
        </Button>
      </div>
    </>
  );
}
