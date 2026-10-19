import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CodeInput } from '@/components/custom/CodeInput';
import { FormField } from '@/components/custom/FormField';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { GAME_CODE_LENGTH } from '@/lib/constants';
import { joinGameSchema, type JoinGameFormValues } from '@/lib/schemas';
import { useJoinGameRoom } from '../hooks/useJoinGameRoom';

export function JoinGameForm() {
  const joinGame = useJoinGameRoom();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGameFormValues>({ resolver: zodResolver(joinGameSchema), defaultValues: { code: '' } });

  return (
    <form
      onSubmit={handleSubmit(({ code }) => joinGame.mutate(code))}
      className="flex flex-wrap items-end gap-4"
      noValidate
    >
      <FormField id="code" label="קוד המשחק" error={errors.code?.message}>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <CodeInput
              id="code"
              length={GAME_CODE_LENGTH}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={Boolean(errors.code)}
              disabled={joinGame.isPending}
            />
          )}
        />
      </FormField>
      <Button type="submit" size="lg" className="mb-0 sm:mb-0" disabled={joinGame.isPending}>
        {joinGame.isPending && <Spinner className="h-4 w-4 text-primary-foreground" />}
        הצטרפות
      </Button>
    </form>
  );
}
