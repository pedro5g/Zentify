import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import { parseEnvironment } from './env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        return parseEnvironment(env);
      },
      isGlobal: true,
    }),
    EnvModule,
  ],
})
export class AppModule {}
