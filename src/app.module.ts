import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import { parseEnvironment } from './env/env';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        return parseEnvironment(env);
      },
      isGlobal: true,
    }),
    EnvModule,
    DbModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
