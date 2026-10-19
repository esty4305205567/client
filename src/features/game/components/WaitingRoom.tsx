import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export function WaitingRoom({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // הדפדפן חסם גישה ללוח: המשתמש יכול להעתיק ידנית
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
        <p className="text-muted-foreground">שלחו את הקוד לחבר. המשחק יתחיל ברגע שיצטרף:</p>
        <div className="flex gap-2 sm:gap-3" dir="ltr" aria-label={`קוד המשחק ${code}`}>
          {code.split('').map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="flex h-14 w-11 items-center justify-center rounded-lg border border-primary/60 bg-background font-mono text-3xl font-bold text-primary shadow-glow sm:h-20 sm:w-16 sm:text-5xl"
            >
              {char}
            </span>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={copyCode}>
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? 'הועתק' : 'העתקת הקוד'}
        </Button>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner label="ממתינים ליריב" /> ממתינים ליריב...
        </p>
        <Button asChild variant="link">
          <Link to="/">חזרה ללובי</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
