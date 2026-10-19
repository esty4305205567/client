import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <p className="text-muted-foreground">העמוד שחיפשתם לא קיים.</p>
      <Button asChild>
        <Link to="/">חזרה ללובי</Link>
      </Button>
    </div>
  );
}
