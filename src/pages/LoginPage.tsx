import { AuthShell } from '@/components/custom/AuthShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell title="התחברות" description="היכנסו כדי לפתוח משחק או להצטרף לחבר.">
      <LoginForm />
    </AuthShell>
  );
}
