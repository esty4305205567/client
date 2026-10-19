import { useMemo, useState } from 'react';

interface Pagination<T> {
  page: number;
  pageCount: number;
  total: number;
  pageItems: T[];
  setPage: (page: number) => void;
}

/**
 * דפדוף בצד הלקוח. השרת מחזיר עד 200 שורות (בלי pagination), והפלט נגזר מהרשימה.
 * העמוד מוגבל תמיד לטווח התקף, ולכן רשימה קצרה יותר אחרי סינון לא תשאיר עמוד ריק.
 * מי ששינה סינון קורא ל-setPage(1) כדי לחזור לעמוד הראשון.
 */
export function usePagination<T>(items: readonly T[], pageSize: number): Pagination<T> {
  const [requestedPage, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return { page, pageCount, total: items.length, pageItems, setPage };
}
