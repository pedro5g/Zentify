import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  sub: z.string().trim().uuid(),
});

export type JwtPayloadType = z.infer<typeof jwtPayloadSchema>;
