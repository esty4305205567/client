import { Handshake, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { celebrateWin } from '@/lib/confetti';
import type { GameState } from '@/types';

// הרכיב נטען רק כשהמשחק הסתיים, ולכן המודאל נפתח מיד
export function GameResultDialog({ state }: { state: GameState }) {
  const [open, setOpen] = useState(true);
  const iWon = !state.isDraw && state.winner === state.me.username;

  useEffect(() => {
    if (iWon) celebrateWin();
  }, [iWon]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          {state.isDraw ? (
            <Handshake className="h-12 w-12 text-muted-foreground" aria-hidden />
          ) : (
            <Trophy className="h-12 w-12 text-primary" aria-hidden />
          )}
          <DialogTitle className="text-2xl">{state.isDraw ? 'תיקו!' : `המנצח: ${state.winner}`}</DialogTitle>
          <DialogDescription>
            {state.me.username}: <strong className="font-mono">{state.me.score}</strong>
            {' · '}
            {state.opponent?.username ?? '—'}: <strong className="font-mono">{state.opponent?.score ?? 0}</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button asChild>
            <Link to="/">חזרה ללובי</Link>
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            סגירה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
