import { User } from './models/user.model';
import { RegisterAccountDTO } from './dtos/register-account.dto';
import { RegisterByEmailDTO } from './dtos/register-by-email.dto';

export abstract class UserRepository {
  abstract registerByEmail(args: RegisterByEmailDTO): Promise<void>;
  abstract registerAccount(args: RegisterAccountDTO): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
