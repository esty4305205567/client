import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableCell, TableRow } from '@/components/ui/Table';
import { gameTypeLabel } from '@/lib/constants';
import { gameSettingSchema, type GameSettingFormValues } from '@/lib/schemas';
import { GameType, type GameSetting } from '@/types';
import { useUpdateGameSetting } from '../hooks/useUpdateGameSetting';

export function SettingRow({ setting }: { setting: GameSetting }) {
  // מהירות רלוונטית רק לאיסוף שלל (בשאר המשחקים היא נשלחת כ-null)
  const usesSpeed = setting.gameType === GameType.LootCollection;
  const update = useUpdateGameSetting();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GameSettingFormValues>({
    resolver: zodResolver(gameSettingSchema),
    values: { durationSeconds: setting.durationSeconds, speed: usesSpeed ? setting.speed : null },
  });

  const submit = handleSubmit((values) =>
    update.mutate({
      gameType: setting.gameType,
      body: { durationSeconds: values.durationSeconds, speed: usesSpeed ? values.speed : null },
    })
  );

  const fieldError = errors.durationSeconds?.message ?? errors.speed?.message;

  return (
    <TableRow>
      <TableCell className="font-medium">{gameTypeLabel(setting.gameType)}</TableCell>
      <TableCell>
        <Input
          type="number"
          aria-label={`משך ${gameTypeLabel(setting.gameType)} בשניות`}
          className="w-28"
          dir="ltr"
          aria-invalid={errors.durationSeconds ? true : undefined}
          {...register('durationSeconds', { valueAsNumber: true })}
        />
      </TableCell>
      <TableCell>
        {usesSpeed ? (
          <Input
            type="number"
            aria-label="מהירות"
            className="w-24"
            dir="ltr"
            aria-invalid={errors.speed ? true : undefined}
            {...register('speed', { valueAsNumber: true })}
          />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={submit} disabled={update.isPending || !isDirty}>
            שמירה
          </Button>
          {fieldError && (
            <span role="alert" className="text-sm text-destructive">
              {fieldError}
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
