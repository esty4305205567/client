import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/custom/FormField';
import { quizAnswerSchema, type QuizAnswerFormValues } from '@/lib/schemas';
import type { Round } from '@/types';

interface QuizBoardProps {
  round: Round | null;
  disabled: boolean;
  /** onSuccess נקרא רק אחרי שהשרת אישר את התשובה */
  onAnswer: (round: Round, answer: string, onSuccess: () => void) => void;
}

export function QuizBoard({ round, disabled, onAnswer }: QuizBoardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuizAnswerFormValues>({
    resolver: zodResolver(quizAnswerSchema),
    defaultValues: { answer: '' },
  });

  if (!round) {
    return <p className="py-10 text-center text-muted-foreground">ממתינים לשאלה הבאה...</p>;
  }

  const submit = handleSubmit(({ answer }) => {
    onAnswer(round, answer, () => reset());
  });

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-8">
        <h2 className="font-mono text-4xl font-bold" dir="ltr">
          {round.displayText}
        </h2>
        <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3" noValidate>
          <FormField id="quiz-answer" label="התשובה שלך" error={errors.answer?.message}>
            <Input
              id="quiz-answer"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              dir="ltr"
              aria-invalid={errors.answer ? true : undefined}
              {...register('answer')}
            />
          </FormField>
          <Button type="submit" disabled={disabled}>
            שליחה
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
