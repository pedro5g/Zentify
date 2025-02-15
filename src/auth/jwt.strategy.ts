import { EnvService } from '@/env/env.service';
import {
  jwtPayloadSchema,
  JwtPayloadType,
} from '@/core/schemas/jwt-payload.schema';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(JWTStrategy) {
  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookie = (req.cookies['accessToken'] as string) || null;
          return cookie;
        },
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayloadType) {
    return jwtPayloadSchema.parse(payload);
  }
}
