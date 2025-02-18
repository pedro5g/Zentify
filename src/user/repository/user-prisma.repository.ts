import { Injectable } from '@nestjs/common';
import { UserRepository } from './user-repository.interface';
import { PrismaService } from '@/db/prisma/prisma.service';
import { RegisterByEmailDTO } from './dtos/register-by-email.dto';
import { Providers } from '@prisma/client';
import { RegisterAccountDTO } from './dtos/register-account.dto';
import { User } from './models/user.model';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SetEmailVerifyDTO } from './dtos/set-email-verify-dto';
import { RegisterResetPasswordDTO } from './dtos/register-reset-password.dto';
import { ResetUserPasswordDTO } from './dtos/reset-user-password.dto';
import { UserWithResetCode } from './models/user-with-reset-code';
import { CountResetCodeByTimeDTO } from './dtos/count-reset-code-by-time.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerByEmail({
    name,
    email,
    password,
  }: RegisterByEmailDTO): Promise<User> {
    const [user] = await this.prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      await trx.account.create({
        data: {
          userId: user.id,
          providerIdOrEmail: email,
          provider: Providers.EMAIL,
        },
      });

      return [user];
    });

    return user;
  }

  async registerAccount({
    name,
    email,
    profileUrl,
    provider,
    provideId,
  }: RegisterAccountDTO): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          name,
          email,
          profileUrl,
          emailVerified: !!email, // if email exists then already verified
        },
      });
      await this.prisma.account.create({
        data: {
          userId: user.id,
          providerIdOrEmail: provideId,
          provider,
        },
      });
    });
  }

  async updateUser({
    id,
    name,
    profileUrl,
    emailVerified,
    lastLogin,
  }: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        profileUrl,
        emailVerified,
        lastLogin,
      },
    });

    return updatedUser;
  }

  async setEmailVerify({
    id,
    emailVerified,
  }: SetEmailVerifyDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { emailVerified },
    });
  }

  async resetUserPassword({
    userId,
    password,
  }: ResetUserPasswordDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async registerResetPassword({
    userId,
    code,
    expiresAt,
  }: RegisterResetPasswordDTO): Promise<void> {
    await this.prisma.verificationCode.create({
      data: {
        userId,
        type: 'FORGET_PASSWORD',
        expiresAt,
        code,
      },
    });
  }

  async countResetCodeByTime({
    userId,
    time,
  }: CountResetCodeByTimeDTO): Promise<number> {
    const count = await this.prisma.verificationCode.count({
      where: {
        userId,
        type: 'FORGET_PASSWORD',
        createdAt: { gt: time },
      },
    });

    return count;
  }

  async getResetPasswordCodeByCode(
    code: string,
  ): Promise<UserWithResetCode | null> {
    const [resetCode] = await this.prisma.$queryRaw<UserWithResetCode[]>`
      SELECT v."user_id" AS "userId", v."id" AS "resetId", v."code", v."type",
      v."expires_at" AS "expiresAt", u."id", u."name", u."email", u."phone",
      u."email_verified" AS "emailVerified" FROM "verification_codes" AS v
      JOIN "users" AS u ON v."user_id" = u."id" WHERE v."code" = ${code} LIMIT 1;
    `;

    return resetCode;
  }

  async deleteResetPasswordCode(code: string): Promise<void> {
    await this.prisma.verificationCode.delete({ where: { code } });
  }

  async deleteManyResetPasswordCode(userId: string): Promise<void> {
    await this.prisma.verificationCode.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user;
  }
}
