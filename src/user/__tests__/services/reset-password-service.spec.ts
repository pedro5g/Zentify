import { MailService } from '@/mail/mail.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { ForgetPasswordService } from '@/user/services/forget-password.service';
import { ResetPasswordService } from '@/user/services/reset-password.service';
import { comparePassword } from '@/core/helpers/cryptography';

let userRepository: IMUserRepository;
let forgetPasswordService: ForgetPasswordService;
let sub: ResetPasswordService;

const fakeMailService = {
  sendEmailVerify: async ({ userId, email }) => {
    // console.log(`confirm-email/${userId}`);
  },

  sendRestPasswordEmail: async ({ code }) => {
    // simulate a email sending
    process.env.RESET_PASSWORD_CODE = code;
  },
} as MailService;

const data = {
  name: 'Test',
  email: 'test1@gmail.com',
  password: '123456',
};

describe('[Service Tests] - Reset Password Service', () => {
  beforeEach(async () => {
    userRepository = new IMUserRepository();
    const registerByEmailService = new RegisterByEmailService(
      userRepository,
      fakeMailService,
    );

    await registerByEmailService.execute(data);
    forgetPasswordService = new ForgetPasswordService(
      userRepository,
      fakeMailService,
    );

    sub = new ResetPasswordService(userRepository);
  });

  afterEach(() => {
    process.env.RESET_PASSWORD_CODE = undefined;
  });

  it('Should be able to reset password', async () => {
    userRepository.users[0].emailVerified = true;
    const email = data.email;
    await forgetPasswordService.execute({ email });

    const code = process.env.RESET_PASSWORD_CODE as string;

    await sub.execute({ code, password: 'password' });

    const isMatch = await comparePassword(
      'password',
      userRepository.users[0].password!,
    );

    expect(isMatch).toBe(true);
  });

  it('Should not be able reset password after 30 minutes', async () => {
    const email = data.email;
    await forgetPasswordService.execute({ email });

    let expiresAt = new Date(userRepository.resetPasswordCodes[0].expiresAt);
    expiresAt.setTime(new Date().getTime() - 10000);

    userRepository.resetPasswordCodes[0].expiresAt = expiresAt;

    const code = process.env.RESET_PASSWORD_CODE as string;
    const error = await sub
      .execute({ code, password: 'password' })
      .catch((error) => error);

    expect(error.status).toBe(400);
    expect(error.message).toBe('Invalid reset code');
  });
});
