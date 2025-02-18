import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { MailService } from '@/mail/mail.service';
import { EmailVerifyService } from '@/user/services/email-verify.service';

let userRepository: IMUserRepository;
let registerUser: RegisterByEmailService;
let sub: EmailVerifyService;

const fakeMailService = {
  sendEmailVerify: async ({ userId }) => {
    process.env.CONFIRM_EMAIL = userId;
  },
} as MailService;

describe('[Service Tests] - Email verify Service', () => {
  beforeEach(() => {
    userRepository = new IMUserRepository();
    registerUser = new RegisterByEmailService(userRepository, fakeMailService);
    sub = new EmailVerifyService(userRepository);
  });

  afterEach(() => {
    process.env.CONFIRM_EMAIL = undefined;
  });

  it('Should be able to confirm an user email', async () => {
    const data = {
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456',
    };

    await registerUser.execute(data);

    // simulate reading email
    const userId = process.env.CONFIRM_EMAIL as string;

    await sub.execute({ userId });

    expect(userRepository.users[0].emailVerified).toBeTruthy();
  });

  it('should not be able to verify an user that not exists', async () => {
    const data = {
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456',
    };

    await registerUser.execute(data);

    const error = await sub
      .execute({ userId: 'id_not_exists' })
      .catch((error) => error);

    expect(error.status).toBe(404);
    expect(error.message).toBe('User not found');
  });
});
