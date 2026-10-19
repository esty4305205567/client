import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-s-4 border-primary ps-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-prose text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
