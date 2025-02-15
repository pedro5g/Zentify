import { Logger } from '@nestjs/common';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  JWT_SECRET_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
});

export const parseEnvironment = (env: unknown) => {
  const _env = envSchema.safeParse(env);

  if (!_env.success) {
    const errors = _env.error.flatten();

    Logger.error(
      'Invalid or missing environments variables',
      JSON.stringify(errors),
    );
    throw new Error('Invalid or missing environments variables ❌❌❌❌');
  }

  return _env.data;
};

export type EnvType = z.infer<typeof envSchema>;
