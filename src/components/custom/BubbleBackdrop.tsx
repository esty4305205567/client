import { cn } from '@/lib/utils';

// בועות צפות לרקע מסכי הפתיחה וההתחברות. דקורטיבי בלבד.
const BUBBLES = [
  'h-28 w-28 start-[6%] top-[10%] [animation-delay:-1s]',
  'h-16 w-16 start-[22%] top-[68%] [animation-delay:-3s]',
  'h-40 w-40 end-[8%] top-[14%] [animation-delay:-2s]',
  'h-20 w-20 end-[26%] top-[74%] [animation-delay:-4s]',
  'h-10 w-10 start-[40%] top-[8%] [animation-delay:-0.5s]',
  'h-12 w-12 end-[6%] top-[52%] [animation-delay:-2.5s]',
  'h-24 w-24 start-[3%] top-[44%] [animation-delay:-3.5s]',
];

export function BubbleBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BUBBLES.map((position) => (
        <span
          key={position}
          className={cn(
            'absolute animate-drift rounded-full border border-primary/20 bg-gradient-to-br from-primary/15 to-transparent',
            position
          )}
        />
      ))}
    </div>
  );
}
