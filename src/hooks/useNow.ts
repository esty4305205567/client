import { useEffect, useState } from 'react';

/** שעון מקומי שמתעדכן כל intervalMs. נעצר ומתנקה כשהרכיב יורד או כש-enabled=false. */
export function useNow(intervalMs: number, enabled = true): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return undefined;
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, enabled]);

  return now;
}
