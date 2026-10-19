import { AuthShell } from '@/components/custom/AuthShell';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthShell title="הרשמה" description="שם משתמש וסיסמה בלבד, בלי אימייל.">
      <RegisterForm />
    </AuthShell>
  );
}
