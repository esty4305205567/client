import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/custom/Header';
import { Footer } from '@/components/custom/Footer';

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <Header />
      {/* במחשב הסרגל האנכי תופס פס צף וצר בצד הימני, והתוכן מקבל שוליים בהתאם.
          העמודה גבוהה כמסך מלא, כך שהכותרת התחתונה נשארת בתחתית גם בעמוד קצר */}
      <div className="flex min-h-screen flex-col md:ms-32">
        {/* כניסה עדינה של כל עמוד (key לפי הנתיב, כך שסקר המשחק לא מפעיל אותה מחדש) */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-5xl flex-1 px-4 py-10"
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
