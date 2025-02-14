import { Logger } from '@nestjs/common';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int(),
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
