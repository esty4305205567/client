import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormField } from '@/components/custom/FormField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  return (
    <form onSubmit={handleSubmit((values) => registerUser.mutate(values))} className="grid gap-4" noValidate>
      <FormField id="username" label="שם משתמש (אנגלית וספרות)" error={errors.username?.message}>
        <Input id="username" autoComplete="username" dir="ltr" aria-invalid={errors.username ? true : undefined} {...register('username')} />
      </FormField>
      <FormField id="password" label="סיסמה (לפחות 8 תווים)" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="new-password" dir="ltr" aria-invalid={errors.password ? true : undefined} {...register('password')} />
      </FormField>
      <FormField id="confirmPassword" label="אימות סיסמה" error={errors.confirmPassword?.message}>
        <Input id="confirmPassword" type="password" autoComplete="new-password" dir="ltr" aria-invalid={errors.confirmPassword ? true : undefined} {...register('confirmPassword')} />
      </FormField>
      <Button type="submit" disabled={registerUser.isPending}>
        {registerUser.isPending && <Spinner className="h-4 w-4 text-primary-foreground" />}
        הרשמה
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        כבר רשומה?{' '}
        <Link to="/login" className="text-primary hover:underline">
          התחברות
        </Link>
      </p>
    </form>
  );
}
