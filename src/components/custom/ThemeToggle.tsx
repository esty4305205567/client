import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

// כפתור אייקון בלבד: ירח במצב בהיר (לחיצה מעבירה לכהה), שמש במצב כהה
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'מעבר למצב בהיר' : 'מעבר למצב כהה';

  return (
    <Button variant="ghost" size="icon" className={className} onClick={toggleTheme} aria-label={label} title={label}>
      {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </Button>
  );
}
