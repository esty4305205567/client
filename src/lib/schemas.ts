import { z } from 'zod';
import { GAME_CODE_LENGTH } from '@/lib/constants';

// כללי הוולידציה זהים לאלה שבשרת (UsernameRules, PasswordRules, GameSettingRules).

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'יש להזין שם משתמש'),
  password: z.string().min(1, 'יש להזין סיסמה'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{3,50}$/, 'שם משתמש: 3 עד 50 תווים, אותיות באנגלית וספרות בלבד'),
    password: z
      .string()
      .min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים')
      .max(72, 'הסיסמה ארוכה מדי, עד 72 תווים'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'הסיסמאות אינן זהות',
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const joinGameSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'יש להזין קוד משחק')
    .length(GAME_CODE_LENGTH, `קוד המשחק מורכב מ-${GAME_CODE_LENGTH} תווים`)
    .regex(/^[A-Za-z0-9]+$/, 'קוד המשחק כולל אותיות וספרות בלבד'),
});
export type JoinGameFormValues = z.infer<typeof joinGameSchema>;

export const quizAnswerSchema = z.object({
  answer: z.string().trim().min(1, 'יש להקליד תשובה').max(50, 'התשובה ארוכה מדי'),
});
export type QuizAnswerFormValues = z.infer<typeof quizAnswerSchema>;

export const gameSettingSchema = z.object({
  durationSeconds: z
    .number({ invalid_type_error: 'יש להזין מספר' })
    .int('יש להזין מספר שלם')
    .min(30, 'משך המשחק חייב להיות בין 30 ל-600 שניות')
    .max(600, 'משך המשחק חייב להיות בין 30 ל-600 שניות'),
  speed: z
    .number({ invalid_type_error: 'יש להזין מספר' })
    .int('יש להזין מספר שלם')
    .min(1, 'המהירות חייבת להיות בין 1 ל-5')
    .max(5, 'המהירות חייבת להיות בין 1 ל-5')
    .nullable(),
});
export type GameSettingFormValues = z.infer<typeof gameSettingSchema>;
