import confetti from 'canvas-confetti';

/** חגיגת ניצחון: שני זרמי קונפטי ירוקים מהצדדים. מכבד prefers-reduced-motion. */
export function celebrateWin(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#00E676', '#69F0AE', '#FFFFFF'];
  const burst = (originX: number, angle: number) =>
    confetti({ particleCount: 70, spread: 65, angle, origin: { x: originX, y: 0.7 }, colors, disableForReducedMotion: true });
  burst(0.1, 60);
  burst(0.9, 120);
}
