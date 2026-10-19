import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/fx/SpotlightCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { GAME_TYPES } from '@/lib/constants';
import { useCreateGame } from '../hooks/useCreateGame';
import { GameArt } from './GameArt';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

// כל כרטיס הוא כפתור אחד: לוחצים על המשחק ופותחים חדר. הכרטיסים נכנסים בזה אחר זה.
export function CreateGameCard() {
  const createGame = useCreateGame();
  const pendingType = createGame.isPending ? createGame.variables : undefined;

  return (
    <motion.div className="grid gap-5 md:grid-cols-3" variants={container} initial="hidden" animate="show">
      {GAME_TYPES.map((game) => {
        const isPending = pendingType === game.value;
        return (
          <motion.div key={game.value} variants={item}>
            <SpotlightCard>
              <button
                type="button"
                disabled={createGame.isPending}
                onClick={() => createGame.mutate(game.value)}
                className="block h-full w-full rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-60"
              >
                <Card className="flex h-full flex-col transition-colors group-hover:border-primary/60">
                  <CardHeader className="gap-3">
                    <GameArt type={game.value} />
                    <CardTitle className="pt-1 text-2xl">{game.label}</CardTitle>
                    <CardDescription className="leading-relaxed">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {isPending && <Spinner className="h-4 w-4" label="פותח חדר" />}
                      {isPending ? 'פותח חדר...' : 'פתיחת חדר'}
                    </span>
                  </CardContent>
                </Card>
              </button>
            </SpotlightCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
