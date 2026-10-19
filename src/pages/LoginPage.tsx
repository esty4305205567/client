import { AuthCard } from '@/components/custom/AuthCard';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard title="התחברות" description="היכנסו כדי לפתוח משחק או להצטרף לחבר.">
      <LoginForm />
    </AuthCard>
  );
}
