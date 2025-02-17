import { User } from './models/user.model';
import { RegisterAccountDTO } from './dtos/register-account.dto';
import { RegisterByEmailDTO } from './dtos/register-by-email.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SetEmailVerifyDTO } from './dtos/set-email-verify-dto';
import { RegisterResetPasswordDTO } from './dtos/register-reset-password.dto';
import { ResetUserPasswordDTO } from './dtos/reset-user-password.dto';
import { UserWithResetCode } from './models/user-with-reset-code';

export abstract class UserRepository {
  abstract registerByEmail(args: RegisterByEmailDTO): Promise<User>;
  abstract registerAccount(args: RegisterAccountDTO): Promise<void>;
  abstract updateUser(args: UpdateUserDTO): Promise<User>;
  abstract setEmailVerify(args: SetEmailVerifyDTO): Promise<void>;
  abstract resetUserPassword(args: ResetUserPasswordDTO): Promise<void>;
  abstract deleteResetPasswordCode(code: string): Promise<void>;
  abstract getResetPasswordCodeByCode(
    code: string,
  ): Promise<UserWithResetCode | null>;
  abstract registerResetPassword(args: RegisterResetPasswordDTO): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
