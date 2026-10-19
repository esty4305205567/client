import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PagerProps {
  page: number;
  pageCount: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pager({ page, pageCount, total, onChange }: PagerProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <span className="text-sm text-muted-foreground">
        עמוד {page} מתוך {pageCount} ({total} שורות)
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronRight className="h-4 w-4" aria-hidden />
          הקודם
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          הבא
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
