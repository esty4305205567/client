import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormField } from '@/components/custom/FormField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { loginSchema, type LoginFormValues } from '@/lib/schemas';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { username: '', password: '' } });

  return (
    <form onSubmit={handleSubmit((values) => login.mutate(values))} className="grid gap-4" noValidate>
      <FormField id="username" label="שם משתמש" error={errors.username?.message}>
        <Input id="username" autoComplete="username" dir="ltr" aria-invalid={errors.username ? true : undefined} {...register('username')} />
      </FormField>
      <FormField id="password" label="סיסמה" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" dir="ltr" aria-invalid={errors.password ? true : undefined} {...register('password')} />
      </FormField>
      <Button type="submit" disabled={login.isPending}>
        {login.isPending && <Spinner className="h-4 w-4 text-primary-foreground" />}
        התחברות
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        אין לך חשבון?{' '}
        <Link to="/register" className="text-primary hover:underline">
          הרשמה
        </Link>
      </p>
    </form>
  );
}
