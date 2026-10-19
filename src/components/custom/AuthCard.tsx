import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

// כרטיס הטופס של ההתחברות וההרשמה: עולה מלמטה ומופיע, בזמן שהלוגו גולש למעלה
export function AuthCard({ title, description, children }: AuthCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="w-full"
      initial={reduceMotion ? false : { opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="rounded-2xl border-0 shadow-2xl shadow-black/30">
        <CardHeader className="gap-2 px-8 pt-7">
          <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-7">{children}</CardContent>
      </Card>
    </motion.div>
  );
}
