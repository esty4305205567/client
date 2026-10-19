import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefCallback, type RefObject } from 'react';
import type { LootBox } from '@/types';

// תנועת התיבות היא קישוט בצד הלקוח בלבד. השרת קובע אילו תיבות קיימות, מה ה-id והניקוד שלהן.
// התנועה נגזרת מה-id של התיבה (מחולל אקראי עם seed) ומהזמן מאז שהתיבה נראתה לראשונה,
// ולכן סקר חדש כל שנייה לא מאפס אותה: המצב נשמר ב-ref לפי id, וה-DOM מעודכן ישירות
// ב-requestAnimationFrame, בלי render לכל פריים.

const FIELD_MIN = 5;
const FIELD_MAX = 95;
const MIN_SPEED = 6; // אחוזים לשנייה
const MAX_SPEED = 16;
const FADE_MS = 700; // דעיכה לפני שהתיבה נעלמת
const GRACE_MS = 400; // אחרי תום הזמן מסתירים ומבטלים לחיצה, עד שהשרת מפסיק להחזיר אותה

interface Motion {
  startedAt: number;
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  lifetimeMs: number;
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// קיפול התנועה לתוך הלוח: התיבה "קופצת" מהקצוות
function reflect(value: number): number {
  const span = FIELD_MAX - FIELD_MIN;
  const period = 2 * span;
  const wrapped = (((value - FIELD_MIN) % period) + period) % period;
  return FIELD_MIN + (wrapped > span ? period - wrapped : wrapped);
}

function createMotion(box: LootBox, now: number): Motion {
  const random = seededRandom(box.id);
  const angle = random() * Math.PI * 2;
  const speed = MIN_SPEED + random() * (MAX_SPEED - MIN_SPEED);
  return {
    startedAt: now,
    x0: box.x,
    y0: box.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    lifetimeMs: Math.max(1000, box.disappearAtMs - box.appearAtMs),
  };
}

interface MovingBoxes {
  containerRef: RefObject<HTMLDivElement | null>;
  getBoxRef: (id: number) => RefCallback<HTMLElement>;
}

export function useMovingBoxes(boxes: readonly LootBox[]): MovingBoxes {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const motions = useRef(new Map<number, Motion>());
  const elements = useRef(new Map<number, HTMLElement>());
  const refCallbacks = useRef(new Map<number, RefCallback<HTMLElement>>());

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const applyFrame = useCallback(
    (now: number) => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      motions.current.forEach((motion, id) => {
        const element = elements.current.get(id);
        if (!element) return;

        const age = now - motion.startedAt;
        const seconds = reducedMotion ? 0 : age / 1000;
        const x = reflect(motion.x0 + motion.vx * seconds);
        const y = reflect(motion.y0 + motion.vy * seconds);
        element.style.transform = `translate3d(${(x / 100) * width}px, ${(y / 100) * height}px, 0)`;

        const remaining = motion.lifetimeMs - age;
        element.style.opacity = remaining < FADE_MS ? String(Math.max(0.25, remaining / FADE_MS)) : '1';

        const expired = remaining < -GRACE_MS;
        element.style.visibility = expired ? 'hidden' : 'visible';
        element.style.pointerEvents = expired ? 'none' : 'auto';
      });
    },
    [reducedMotion]
  );

  // סנכרון עם מה שהשרת החזיר: תיבה חדשה מקבלת תנועה, תיבה שנעלמה מנוקה.
  // תיבה קיימת לא נוגעים בה, ולכן הסקר לא מאפס את מיקומה.
  useLayoutEffect(() => {
    const now = performance.now();
    const currentIds = new Set(boxes.map((box) => box.id));

    boxes.forEach((box) => {
      if (!motions.current.has(box.id)) motions.current.set(box.id, createMotion(box, now));
    });

    Array.from(motions.current.keys()).forEach((id) => {
      if (!currentIds.has(id)) {
        motions.current.delete(id);
        refCallbacks.current.delete(id);
        elements.current.delete(id);
      }
    });

    applyFrame(now);
  }, [boxes, applyFrame]);

  // לולאת האנימציה: אחת לכל הלוח, ומתנקה כשהרכיב יורד
  useEffect(() => {
    let frame = 0;
    const loop = (time: number) => {
      applyFrame(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [applyFrame]);

  // callback ref יציב לכל id, כדי ש-React לא יחבר ויפרק את האלמנט בכל render
  const getBoxRef = useCallback((id: number): RefCallback<HTMLElement> => {
    let callback = refCallbacks.current.get(id);
    if (!callback) {
      callback = (element) => {
        if (element) elements.current.set(id, element);
        else elements.current.delete(id);
      };
      refCallbacks.current.set(id, callback);
    }
    return callback;
  }, []);

  return { containerRef, getBoxRef };
}
