import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email()
  .max(255, { message: 'Your email is to long :)' });
export const nameSchema = z.string().trim().min(3).max(255);
export const passwordSchema = z.string().trim().min(6).max(25);

export const registerByEmailSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterByEmailSchema = z.infer<typeof registerByEmailSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
