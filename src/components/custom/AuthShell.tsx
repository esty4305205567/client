import { Gamepad2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { BubbleBackdrop } from '@/components/custom/BubbleBackdrop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

// מעטפת משותפת להתחברות והרשמה: כרטיס עגול שצומח מתוך הבועה, על רקע בועות צפות
export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <BubbleBackdrop />

      <div className="relative w-full max-w-sm animate-bubble-in">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="bubble-orb flex h-20 w-20 items-center justify-center rounded-full border border-primary/40">
            <Gamepad2 className="h-9 w-9 text-primary" aria-hidden />
          </span>
          <span className="font-display text-3xl font-extrabold tracking-tight">GameHub</span>
        </div>

        <Card className="rounded-[2rem] border-primary/20 shadow-2xl">
          <CardHeader className="gap-2 px-8 pt-8">
            <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
