import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/custom/FormField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { GAME_CODE_LENGTH } from '@/lib/constants';
import { joinGameSchema, type JoinGameFormValues } from '@/lib/schemas';
import { useJoinGameRoom } from '../hooks/useJoinGameRoom';

export function JoinGameForm() {
  const joinGame = useJoinGameRoom();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGameFormValues>({ resolver: zodResolver(joinGameSchema), defaultValues: { code: '' } });

  return (
    <form
      onSubmit={handleSubmit(({ code }) => joinGame.mutate(code))}
      className="flex flex-wrap items-start gap-3"
      noValidate
    >
      <div className="w-56">
        <FormField id="code" label="קוד המשחק" error={errors.code?.message}>
          <Input
            id="code"
            dir="ltr"
            autoComplete="off"
            maxLength={GAME_CODE_LENGTH}
            className="text-center font-mono text-lg uppercase tracking-[0.3em]"
            aria-invalid={errors.code ? true : undefined}
            {...register('code')}
          />
        </FormField>
      </div>
      <Button type="submit" className="mt-[1.65rem]" disabled={joinGame.isPending}>
        {joinGame.isPending && <Spinner className="h-4 w-4 text-primary-foreground" />}
        הצטרפות
      </Button>
    </form>
  );
}
