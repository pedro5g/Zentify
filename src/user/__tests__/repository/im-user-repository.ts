import { RegisterAccountDTO } from '@/user/repository/dtos/register-account.dto';
import { RegisterByEmailDTO } from '@/user/repository/dtos/register-by-email.dto';
import { RegisterResetPasswordDTO } from '@/user/repository/dtos/register-reset-password.dto';
import { ResetUserPasswordDTO } from '@/user/repository/dtos/reset-user-password.dto';
import { SetEmailVerifyDTO } from '@/user/repository/dtos/set-email-verify-dto';
import { UpdateUserDTO } from '@/user/repository/dtos/update-user.dto';
import { Account } from '@/user/repository/models/account.model';
import { ResetPasswordCode } from '@/user/repository/models/reset-password-code';
import { UserWithResetCode } from '@/user/repository/models/user-with-reset-code';
import { User } from '@/user/repository/models/user.model';
import { UserRepository } from '@/user/repository/user-repository.interface';
import { randomUUID } from 'node:crypto';

// IM prefix = In Memory
export class IMUserRepository implements UserRepository {
  public users: User[] = [];
  public accounts: Account[] = [];
  public resetPasswordCodes: ResetPasswordCode[] = [];

  async registerByEmail({
    name,
    email,
    password,
  }: RegisterByEmailDTO): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password,
      emailVerified: false,
      profileUrl: null,
      lastLogin: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const account: Account = {
      id: randomUUID(),
      userId: user.id,
      provider: 'EMAIL',
      providerIdOrEmail: email,
      createdAt: new Date(),
    };

    this.users.push(user);
    this.accounts.push(account);

    return user;
  }

  async registerAccount({
    name,
    provideId,
    provider,
    email,
    profileUrl,
  }: RegisterAccountDTO): Promise<void> {
    const user: User = {
      id: randomUUID(),
      name,
      email: email || null,
      password: null,
      emailVerified: true,
      profileUrl: profileUrl || null,
      lastLogin: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const account: Account = {
      id: randomUUID(),
      userId: user.id,
      provider,
      providerIdOrEmail: provideId,
      createdAt: new Date(),
    };

    this.users.push(user);
    this.accounts.push(account);
  }

  async updateUser({
    id,
    name,
    lastLogin,
    emailVerified,
    profileUrl,
  }: UpdateUserDTO): Promise<User> {
    this.users = this.users.map((value) => {
      if (value.id !== id) return value;
      return {
        ...value,
        name,
        lastLogin,
        emailVerified,
        profileUrl,
      };
    });

    const userUpdated = this.users.find((user) => user.id === id)!;

    return userUpdated;
  }

  async setEmailVerify({
    id,
    emailVerified,
  }: SetEmailVerifyDTO): Promise<void> {
    this.users = this.users.map((value) => {
      if (value.id !== id) return value;
      return {
        ...value,
        emailVerified,
      };
    });
  }

  async resetUserPassword({
    userId,
    password,
  }: ResetUserPasswordDTO): Promise<void> {
    this.users = this.users.map((user) => {
      if (user.id !== userId) return user;
      return {
        ...user,
        password,
      };
    });
  }

  async registerResetPassword({
    userId,
    code,
    expiresAt,
  }: RegisterResetPasswordDTO): Promise<void> {
    const resetPasswordCode: ResetPasswordCode = {
      userId,
      code,
      type: 'FORGET_PASSWORD',
      expiresAt,
      createdAt: new Date(),
    };

    this.resetPasswordCodes.push(resetPasswordCode);
  }

  async deleteResetPasswordCode(code: string): Promise<void> {
    this.resetPasswordCodes = this.resetPasswordCodes.filter(
      (resetCode) => resetCode.code !== code,
    );
  }

  async getResetPasswordCodeByCode(
    code: string,
  ): Promise<UserWithResetCode | null> {
    const resetCode = this.resetPasswordCodes.find(
      (resetCode) => resetCode.code === code,
    )!;
    const user = this.users.find((user) => user.id === resetCode.userId)!;

    const { createdAt, ...rest } = resetCode;

    return {
      ...rest,
      id: user.id,
      name: user.name,
      email: user.email!,
      phone: '',
      emailVerified: user.emailVerified,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }
  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);

    return user || null;
  }
}
