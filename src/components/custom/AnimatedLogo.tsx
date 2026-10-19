import { cn } from '@/lib/utils';

// אותיות הלוגו נכנסות אחת אחרי השנייה (קפיצה קטנה), ואחר כך מתנדנדות בגל איטי.
// ב-prefers-reduced-motion האנימציות כבויות והטקסט פשוט מוצג.
export function AnimatedLogo({ text, className }: { text: string; className?: string }) {
  return (
    <span dir="ltr" className={cn('inline-flex', className)} aria-hidden>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="inline-block animate-letter-in opacity-0 [animation-fill-mode:both]"
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <span className="inline-block animate-letter-wave" style={{ animationDelay: `${900 + index * 130}ms` }}>
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}
