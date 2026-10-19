import { Skeleton } from '@/components/ui/Skeleton';

// שלד של מסך המשחק: שני כרטיסי ניקוד, טיימר ולוח
export function GameBoardSkeleton() {
  return (
    <div role="status" aria-label="טוען את המשחק" className="flex flex-col gap-4">
      <div className="flex items-stretch gap-3">
        <Skeleton className="h-24 flex-1" />
        <Skeleton className="h-24 w-28" />
        <Skeleton className="h-24 flex-1" />
      </div>
      <Skeleton className="h-[420px] w-full" />
    </div>
  );
}
