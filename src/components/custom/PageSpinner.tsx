import { Spinner } from '@/components/ui/Spinner';

export function PageSpinner({ label = 'טוען...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-8 w-8" label={label} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
