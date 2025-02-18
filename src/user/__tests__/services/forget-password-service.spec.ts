import { MailService } from '@/mail/mail.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { ForgetPasswordService } from '@/user/services/forget-password.service';

let userRepository: IMUserRepository;
let sub: ForgetPasswordService;

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

describe('[Service Tests] - Forgot Password Service', () => {
  beforeEach(async () => {
    userRepository = new IMUserRepository();
    const registerByEmailService = new RegisterByEmailService(
      userRepository,
      fakeMailService,
    );

    await registerByEmailService.execute(data);

    sub = new ForgetPasswordService(userRepository, fakeMailService);
  });
  afterEach(() => {
    process.env.RESET_PASSWORD_CODE = undefined;
  });

  it('Should be able sending an email to reset password', async () => {
    userRepository.users[0].emailVerified = true;
    const email = data.email;
    const spySendEmail = vitest.spyOn(fakeMailService, 'sendRestPasswordEmail');
    await sub.execute({ email });

    expect(spySendEmail).toBeCalled();
    expect(userRepository.resetPasswordCodes).toHaveLength(1);
    expect(userRepository.resetPasswordCodes[0]).toStrictEqual(
      expect.objectContaining({
        userId: userRepository.users[0].id,
      }),
    );
    const code = userRepository.resetPasswordCodes[0].code;
    expect(process.env.RESET_PASSWORD_CODE).toEqual(code);
  });

  it('Should not be able solicitation with invalid email', async () => {
    const email = 'incorrect@gmail.com';

    const error = await sub.execute({ email }).catch((error) => error);

    expect(error.status).toBe(404);
    expect(error.message).toBe("Looks like you don't an account");
  });

  it('Should not be possible to request more than 2 password resets within a 3 minute period', async () => {
    const email = data.email;
    let error;

    for (let i = 0; i < 3; i++) {
      error = await sub.execute({ email }).catch((error) => error);
    }

    expect(error.status).toBe(400);
    expect(error.message).toBe('Too many request, try again later');
    expect(userRepository.resetPasswordCodes).toHaveLength(2);
  });
});
