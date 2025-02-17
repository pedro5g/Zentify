import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { MailService } from '@/mail/mail.service';
import { EmailVerifyService } from '@/user/services/email-verify.service';

let userRepository: IMUserRepository;
let registerUser: RegisterByEmailService;
let sub: EmailVerifyService;

const fakeMailService = {
  sendEmailVerify: async ({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }) => {
    process.env.CONFIRM_EMAIL = userId;
  },
} as MailService;

describe('[Service Tests] - Email verify Service', () => {
  beforeEach(() => {
    userRepository = new IMUserRepository();
    registerUser = new RegisterByEmailService(userRepository, fakeMailService);
    sub = new EmailVerifyService(userRepository);
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
    process.env.CONFIRM_EMAIL = undefined;

    await sub.execute({ userId });

    expect(userRepository.users[0].emailVerified).toBeTruthy();
  });
});
