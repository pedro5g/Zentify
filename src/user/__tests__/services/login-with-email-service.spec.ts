import { MailService } from '@/mail/mail.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { LoginWithEmailService } from '@/user/services/login-with-email.service';
import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { JwtService } from '@nestjs/jwt';

let userRepository: IMUserRepository;
let sub: LoginWithEmailService;

const fakeJWTService = {
  signAsync: async (payload: object) => {
    return `token-jwt=${JSON.stringify(payload)}`;
  },
} as JwtService;

const fakeMailService = {
  sendEmailVerify: async ({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }) => {
    // console.log(`confirm-email/${userId}`);
  },
} as MailService;

const data = {
  name: 'Test',
  email: 'test1@gmail.com',
  password: '123456',
};

describe('[Service Tests] - Login With Email Service', () => {
  beforeEach(async () => {
    userRepository = new IMUserRepository();
    const registerByEmailService = new RegisterByEmailService(
      userRepository,
      fakeMailService,
    );

    await registerByEmailService.execute(data);

    sub = new LoginWithEmailService(
      userRepository,
      fakeMailService,
      fakeJWTService,
    );
  });

  it('Should be able to login', async () => {
    userRepository.users[0].emailVerified = true;
    const credentials = {
      email: 'test1@gmail.com',
      password: '123456',
    };

    const res = await sub.execute(credentials);

    expect(res.accessToken).toBeTruthy();
    expect(res.user).toBeTruthy();
    expect(res.user).toStrictEqual(
      expect.objectContaining({
        name: data.name,
        email: data.email,
      }),
    );
    expect(res.accessToken).toStrictEqual(`token-jwt={"sub":"${res.user.id}"}`);
  });

  it('Should not be able to login if user not confirmation it email', async () => {
    const credentials = {
      email: 'test1@gmail.com',
      password: '123456',
    };

    await sub.execute(credentials).catch((error) => {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'Please, check your email box to confirmation it email before trying login',
      );
    });
  });
  it('Should be able to send an email if user not confirmation it email', async () => {
    const credentials = {
      email: 'test1@gmail.com',
      password: '123456',
    };

    const sendEmailSpay = vitest.spyOn(fakeMailService, 'sendEmailVerify');

    await sub.execute(credentials).catch((error) => {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'Please, check your email box to confirmation it email before trying login',
      );
    });
    expect(sendEmailSpay).toBeCalled();
  });

  it('Should not be able to login with invalid email', async () => {
    userRepository.users[0].emailVerified = true;
    const credentials = {
      email: 'incorrect@gmail.com',
      password: '123456',
    };

    await sub.execute(credentials).catch((error) => {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Ooh no! Your email or password are invalid');
    });
  });
  it('Should not be able to login with invalid password', async () => {
    userRepository.users[0].emailVerified = true;
    const credentials = {
      email: 'test1@gmail.com',
      password: 'incorrect_password',
    };

    await sub.execute(credentials).catch((error) => {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Ooh no! Your email or password are invalid');
    });
  });
});
