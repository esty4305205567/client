# GameHub Client

לקוח אינטרנט לשרת GameHub.API: React 19 + TypeScript, React Query, React Hook Form + Zod, React Router, Tailwind CSS ורכיבי shadcn/ui (מועתקים לתיקיית `src/components/ui`, בלי CLI).

אנימציות ואפקטים: framer-motion (מעברי עמוד, כתם ניווט מחליק, הטיית כרטיסים, מונים, טבעת שעון), canvas-confetti (חגיגת ניצחון). האפקטים מ-`src/components/fx` בנויים בהשראת Aceternity UI ו-Magic UI.

## דרישות מוקדמות

- Node.js LTS
- שרת GameHub.API רץ (ראו README של השרת)

## הרצה

```
npm install
copy .env.example .env
npm run dev
```

האתר עולה ב-`http://localhost:5173`. השרת מאשר ב-CORS רק את הכתובת הזאת, ורק בסביבת `Development`, ולכן יש לפתוח אותו בדיוק על `localhost:5173`.

אם `npm install` נכשל בשגיאת `ERESOLVE`, להריץ `npm install --legacy-peer-deps`.

כתובת השרת נקראת מ-`VITE_API_URL` בקובץ `.env` (ברירת מחדל `http://localhost:5163`). `.env` לא נכנס ל-git, ו-`.env.example` כן.

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | שרת פיתוח |
| `npm run build` | בנייה לייצור (`dist/`) |
| `npm run typecheck` | בדיקת טיפוסים של TypeScript |

כניסה: משתמשי הדמו מופיעים ב-README של השרת. אפשר גם להירשם (שם משתמש באנגלית וספרות, סיסמה של 8 תווים לפחות).

## מבנה

```
src/
  components/fx/       אפקטים: AuroraBackground, SpotlightCard, BorderBeam, NumberTicker, CountdownRing
  components/ui/       רכיבי shadcn/ui: Button, Input, Label, Card, Badge, Table, Select, Dialog, Toast, Toaster, Skeleton, Spinner
  components/custom/   רכיבים משותפים של האפליקציה: Header, AppLayout, RouteGuards, GameHistoryRow, AdminControlPanel, ConflictBanner, Pager...
  features/            auth, lobby, game, history, admin. בכל אחד: hooks, components, routes.tsx, types.ts
  hooks/               use-toast, useAuth, useNow, usePagination
  context/             AuthContext
  lib/                 api (fetch), endpoints, queryClient, schemas (Zod), errors, constants
  pages/               דף לכל route
  types/               טיפוסי ה-DTOs של השרת
```

## איך זה עובד

- **polling:** `usePollGameStatus` הוא `useQuery` עם `refetchInterval` של שנייה. הסקר נעצר כשהמשחק הסתיים או כשאין גישה (403/404), ו-React Query מנקה אותו כשהמסך נסגר.
- **פריטים נעים (איסוף שלל):** השרת קובע אילו תיבות קיימות, מה ה-id והניקוד. התנועה היא קישוט בצד הלקוח בלבד (`useMovingBoxes`): כיוון ומהירות נגזרים מה-id, והמיקום מחושב ב-`requestAnimationFrame` ומוחל כ-`translate3d`. המצב נשמר ב-ref לפי id, ולכן סקר חדש כל שנייה לא מאפס את התנועה. תיבה שהזמן שלה נגמר דועכת ולא ניתנת ללחיצה עד שהשרת מפסיק להחזיר אותה.
- **409:** מוצג כ-toast אדום מודגש ובאנר אדום עם הפריט שנחטף ("היריב חטף את תיבה של 5 נקודות לפניך!").
- **401:** מנקה את ההתחברות ומעביר למסך ההתחברות. בלי JWT רואים רק הרשמה והתחברות (route guard), והאכיפה האמיתית בשרת.
- **אין הנחת הצלחה:** תפיסה, פתיחת משחק והצטרפות מוצגות רק אחרי תשובת השרת.
- **ה-JWT** נשמר ב-`localStorage`.
- **הזמן הנותר** מגיע מהשרת (`remainingSeconds`). הלקוח רק סופר לאחור בין בקשות.
- **היסטוריה ורשימת חדרים:** הסינון והמיון בשרת. השרת מחזיר עד 200 שורות, והדפדוף בצד הלקוח.
- **enum-ים:** השרת מחזיר אותם כמספרים (ברירת המחדל של System.Text.Json). אם יתווסף לשרת `JsonStringEnumConverter`, יש לעדכן את `src/types/api.ts`.
