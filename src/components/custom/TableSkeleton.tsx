import { Skeleton } from '@/components/ui/Skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns: number;
  label?: string;
}

// שלד טעינה לטבלאות (היסטוריה, רשימת חדרים). role=status כדי שקוראי מסך יכריזו על הטעינה.
export function TableSkeleton({ rows = 5, columns, label = 'טוען נתונים' }: TableSkeletonProps) {
  return (
    <div role="status" aria-label={label} className="grid gap-3">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
