import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { markWelcomeSeen } from '@/lib/welcome';

// תוכן דף הפתיחה: משפט וכיתוב "כניסה". הלוגו והרקע שייכים לבמה (AuthStage), ולכן הלחיצה פשוט מעבירה
// להתחברות, והלוגו גולש למעלה בזמן שהטופס עולה.
export default function WelcomePage() {
  const navigate = useNavigate();

  function enter() {
    markWelcomeSeen();
    navigate('/login');
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="sr-only">GameHub</h1>
      <p className="max-w-xs text-xl text-muted-foreground">תפסו ראשונים. נצחו ביחד.</p>
      <button
        type="button"
        onClick={enter}
        className="group inline-flex items-center gap-2 rounded-md px-2 py-1 text-2xl font-semibold text-foreground underline-offset-8 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        כניסה
        <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" aria-hidden />
      </button>
    </div>
  );
}
