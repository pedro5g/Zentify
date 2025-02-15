import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from '@/db/prisma/prisma.service';
import { RegisterByEmailDTO } from './dtos/register-by-email.dto';
import { Providers } from '@prisma/client';
import { RegisterAccountDTO } from './dtos/register-account.dto';
import { User } from './models/user.model';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerByEmail({
    name,
    email,
    password,
  }: RegisterByEmailDTO): Promise<void> {
    await this.prisma.$transaction(async (trx) => {
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
    });
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

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user;
  }
}
