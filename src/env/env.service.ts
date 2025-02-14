import { Injectable } from '@nestjs/common';

import { EnvType } from './env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvType, true>) {}

  get<T extends keyof EnvType>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
