import { AuthCard } from '@/components/custom/AuthCard';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard title="הרשמה" description="שם משתמש וסיסמה בלבד, בלי אימייל.">
      <RegisterForm />
    </AuthCard>
  );
}
