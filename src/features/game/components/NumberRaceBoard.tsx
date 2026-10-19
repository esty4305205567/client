import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Round } from '@/types';

interface NumberRaceBoardProps {
  round: Round | null;
  disabled: boolean;
  onSelect: (round: Round, option: number) => void;
}

export function NumberRaceBoard({ round, disabled, onSelect }: NumberRaceBoardProps) {
  if (!round) {
    return <p className="py-10 text-center text-muted-foreground">ממתינים לסבב הבא...</p>;
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold">{round.displayText}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {round.options.map((option) => (
            <Button
              key={option}
              variant="secondary"
              size="lg"
              className="h-16 min-w-20 font-mono text-2xl hover:bg-primary hover:text-primary-foreground"
              disabled={disabled}
              onClick={() => onSelect(round, option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
