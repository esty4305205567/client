import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface AdminControlPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// מעטפת אחידה לכל אזור בלוח הניהול
export function AdminControlPanel({ title, description, children }: AdminControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
