import { Swords } from 'lucide-react';

export interface ConflictInfo {
  /** מה נתפס: למשל "תיבה של 5 נקודות" */
  itemLabel: string;
  /** ההודעה שהשרת החזיר */
  message: string;
}

// התנגשות 409: היריב הקדים. אדום בולט, עם שם הפריט שנחטף.
export function ConflictBanner({ conflict }: { conflict: ConflictInfo | null }) {
  if (!conflict) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border-2 border-conflict bg-conflict/15 p-3 text-conflict shadow-conflict"
    >
      <Swords className="h-5 w-5 shrink-0" aria-hidden />
      <div className="text-sm">
        <strong className="block">היריב חטף את {conflict.itemLabel} לפניך!</strong>
        <span className="text-foreground/80">{conflict.message}</span>
      </div>
    </div>
  );
}
