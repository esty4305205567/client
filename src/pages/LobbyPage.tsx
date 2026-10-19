import { Card, CardContent } from '@/components/ui/Card';
import { BorderBeam } from '@/components/fx/BorderBeam';
import { CreateGameCard } from '@/features/lobby/components/CreateGameCard';
import { JoinGameForm } from '@/features/lobby/components/JoinGameForm';
import { PlayerStats } from '@/features/lobby/components/PlayerStats';
import { ResumeGameCard } from '@/features/lobby/components/ResumeGameCard';

export default function LobbyPage() {
  return (
    <>
      <section className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
          בחרו משחק.
          <br />
          <span className="bg-gradient-to-l from-primary to-emerald-500 dark:to-emerald-200 bg-clip-text text-transparent">
            תפסו ראשונים.
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">שני שחקנים על אותו לוח. השרת קובע מי הקדים.</p>
      </section>

      <ResumeGameCard />

      <PlayerStats />

      <section className="mb-10" aria-labelledby="create-heading">
        <h2 id="create-heading" className="mb-4 text-xl font-bold">
          פתיחת חדר חדש
        </h2>
        <CreateGameCard />
      </section>

      <section aria-labelledby="join-heading">
        <Card className="relative overflow-hidden border-primary/20">
          <BorderBeam duration={9} />
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="join-heading" className="text-xl font-bold">
                יש לכם קוד?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">הקלידו את הקוד בן 5 התווים שקיבלתם מהחבר.</p>
            </div>
            <JoinGameForm />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
