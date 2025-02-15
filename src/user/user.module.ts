import { AuthModule } from '@/auth/auth.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { PrismaUserRepository } from './repository/user-prisma.repository';
import { RegisterByEmailService } from './services/register-by-email.service';
import { RegisterUserByEmailController } from './controllers/register-user-by-email.controller';
import { LoginWithEmailController } from './controllers/login-with-email.controller';
import { LoginWithEmailService } from './services/login-with-email.service';

@Module({
  imports: [DbModule, AuthModule],
  providers: [
    RegisterByEmailService,
    LoginWithEmailService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    PrismaUserRepository,
  ],
  controllers: [RegisterUserByEmailController, LoginWithEmailController],
})
export class UserModule {}
