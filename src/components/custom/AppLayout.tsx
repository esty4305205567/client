import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/custom/Header';

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <Header />
      {/* כניסה עדינה של כל עמוד (key לפי הנתיב, כך שסקר המשחק לא מפעיל אותה מחדש) */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl px-4 py-10"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
