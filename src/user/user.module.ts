import { AuthModule } from '@/auth/auth.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user-repository.interface';
import { PrismaUserRepository } from './repository/user-prisma.repository';
import { RegisterByEmailService } from './services/register-by-email.service';
import { RegisterUserByEmailController } from './controllers/register-user-by-email.controller';
import { LoginWithEmailController } from './controllers/login-with-email.controller';
import { LoginWithEmailService } from './services/login-with-email.service';
import { MailModule } from '@/mail/mail.module';
import { EmailVerifyService } from './services/email-verify.service';
import { EmailVerifyController } from './controllers/email-verify.controller';
import { ForgetPasswordService } from './services/forget-password.service';
import { ForgetPasswordController } from './controllers/forgot-password.controller';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { MailService } from '@/mail/mail.service';
import { ResetPasswordService } from './services/reset-password.service';
import { EnvModule } from '@/env/env.module';

@Module({
  imports: [DbModule, AuthModule, MailModule, EnvModule],
  providers: [
    PrismaUserRepository,
    MailService,
    RegisterByEmailService,
    LoginWithEmailService,
    EmailVerifyService,
    ForgetPasswordService,
    ResetPasswordService,

    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [
    RegisterUserByEmailController,
    LoginWithEmailController,
    EmailVerifyController,
    ForgetPasswordController,
    ResetPasswordController,
  ],
})
export class UserModule {}
