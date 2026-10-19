// מעבר ה"תיבות" בין דף הפתיחה להתחברות. הכול מצויר על canvas אחד שנמצא מחוץ לעץ של React,
// ולכן אין מאות אלמנטים, אין הרכבה מחדש בזמן המעבר, והוא חלק גם כשהדף מתחלף מאחוריו.
// coverScreen: ריבועים צומחים ממקום הלחיצה עד שהמסך מלא. revealScreen: הם מתכווצים וחושפים את הדף החדש.

// 110px: חצי מגודל הדוגמה ברקע של דף ההתחברות (220px), כך שהריבועים זהים בדיוק ליושבים מתחת
const CELL_PX = 110;
const TILE_MS = 200;
const SPREAD_MS = 330;
const MAX_FRAME_MS = 32;

export interface Origin {
  /** שבר מרוחב המסך (0 עד 1) */
  x: number;
  /** שבר מגובה המסך (0 עד 1) */
  y: number;
}

interface Overlay {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  color: string;
}

let overlay: Overlay | null = null;
let revealing = false;

// הצבע נלקח מהערכה הפעילה (בהיר או כהה). הריבועים לסירוגין מקבלים שכבה שחורה שקופה, בדיוק כמו ברקע של דף ההתחברות
const SHADE = 'rgba(0, 0, 0, 0.1)';

function readBaseColor(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  const match = raw.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!match) return '#00E676';
  return `hsl(${Number(match[1])}, ${Number(match[2])}%, ${Number(match[3])}%)`;
}

function createOverlay(): Overlay | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '2147483000',
  });
  ctx.scale(ratio, ratio);
  document.body.appendChild(canvas);
  return { canvas, ctx, width, height, color: readBaseColor() };
}

function play(target: Overlay, origin: Origin, mode: 'cover' | 'reveal'): Promise<void> {
  const { ctx, width, height, color } = target;
  const cols = Math.ceil(width / CELL_PX);
  const rows = Math.ceil(height / CELL_PX);
  const ox = origin.x * width;
  const oy = origin.y * height;
  const farthest = Math.max(
    Math.hypot(ox, oy),
    Math.hypot(width - ox, oy),
    Math.hypot(ox, height - oy),
    Math.hypot(width - ox, height - oy)
  );

  const tiles: { cx: number; cy: number; delay: number; shaded: boolean }[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = (col + 0.5) * CELL_PX;
      const cy = (row + 0.5) * CELL_PX;
      tiles.push({ cx, cy, delay: (Math.hypot(cx - ox, cy - oy) / farthest) * SPREAD_MS, shaded: (row + col) % 2 === 1 });
    }
  }

  return new Promise((resolve) => {
    // הזמן מצטבר לפי הפריימים שבאמת צוירו, וקפיצה בין פריימים מוגבלת. כך עיכוב רגעי של הדפדפן
    // (למשל בזמן שהדף החדש נבנה) מאט את האנימציה במקום לדלג קדימה, וזה מה שנראה כקטיעה.
    let elapsed = 0;
    let last: number | null = null;
    function frame(now: number) {
      if (last !== null) elapsed += Math.min(now - last, MAX_FRAME_MS);
      last = now;
      ctx.clearRect(0, 0, width, height);
      let finished = true;
      for (const tile of tiles) {
        const progress = Math.min(Math.max((elapsed - tile.delay) / TILE_MS, 0), 1);
        if (progress < 1) finished = false;
        // smoothstep: התחלה וסוף רכים, בלי "קפיצה" של ריבוע שמופיע
        const eased = progress * progress * (3 - 2 * progress);
        const scale = mode === 'cover' ? eased : 1 - eased;
        if (scale <= 0) continue;
        const size = CELL_PX * scale;
        // הצבע הבסיסי מעט גדול יותר כשהריבוע מלא, כדי שלא יישאר חריץ בין ריבועים
        const bleed = scale >= 1 ? 1 : 0;
        ctx.fillStyle = color;
        ctx.fillRect(tile.cx - size / 2 - bleed / 2, tile.cy - size / 2 - bleed / 2, size + bleed, size + bleed);
        if (tile.shaded) {
          ctx.fillStyle = SHADE;
          ctx.fillRect(tile.cx - size / 2, tile.cy - size / 2, size, size);
        }
      }
      if (finished) resolve();
      else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

/** ריבועים צומחים ממקום הלחיצה וממלאים את המסך. המסך נשאר מכוסה עד הקריאה ל-revealScreen. */
export async function coverScreen(origin: Origin): Promise<void> {
  if (!overlay) overlay = createOverlay();
  if (!overlay) return;
  overlay.canvas.style.pointerEvents = 'auto';
  await play(overlay, origin, 'cover');
}

/** הריבועים מתכווצים וחושפים את הדף. אם אין מה לחשוף (למשל רענון דף), לא קורה כלום. */
export async function revealScreen(origin: Origin): Promise<void> {
  if (!overlay || revealing) return;
  revealing = true;
  const current = overlay;
  current.canvas.style.pointerEvents = 'none';
  // המסך מכוסה במלואו: ממתינים לשני פריימים, כדי שהדף החדש יצטייר לפני שהחשיפה מתחילה
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  await play(current, origin, 'reveal');
  current.canvas.remove();
  overlay = null;
  revealing = false;
}