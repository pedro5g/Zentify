import { RegisterAccountDTO } from '@/user/repository/dtos/register-account.dto';
import { RegisterByEmailDTO } from '@/user/repository/dtos/register-by-email.dto';
import { Account } from '@/user/repository/models/account.model';
import { User } from '@/user/repository/models/user.model';
import { UserRepository } from '@/user/repository/user.repository';
import { randomUUID } from 'node:crypto';

// IM prefix = In Memory
export class IMUserRepository implements UserRepository {
  public users: User[] = [];
  public accounts: Account[] = [];

  async registerByEmail({
    name,
    email,
    password,
  }: RegisterByEmailDTO): Promise<void> {
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
      emailVerified: false,
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

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }
  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);

    return user || null;
  }
}
