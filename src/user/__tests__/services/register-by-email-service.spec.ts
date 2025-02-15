import { RegisterByEmailService } from '@/user/services/register-by-email.service';
import { IMUserRepository } from '../repository/im-user-repository';
import { comparePassword } from '@/core/helpers/cryptography';

let userRepository: IMUserRepository;
let sub: RegisterByEmailService;
describe('[Service Tests] - Register By Email Service', () => {
  beforeEach(() => {
    userRepository = new IMUserRepository();
    sub = new RegisterByEmailService(userRepository);
  });

  it('Should be able to register new user', async () => {
    const data = {
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456',
    };

    await sub.execute(data);

    expect(userRepository.users).toHaveLength(1);
    expect(userRepository.accounts).toHaveLength(1);
    expect(userRepository.users[0]).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        email: data.email,
        password: expect.any(String),
        emailVerified: false,
      }),
    );
  });

  it('Should be able to encrypt the user password', async () => {
    const data = {
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456',
    };

    await sub.execute(data);

    expect(
      await comparePassword(
        data.password,
        userRepository.users[0].password || '',
      ),
    ).toBeTruthy();
  });

  it('Should not be able to register two users with same email', async () => {
    const data = {
      name: 'Test1',
      email: 'test@gmail.com',
      password: '123456',
    };
    const data2 = {
      name: 'Test2',
      email: 'test@gmail.com',
      password: '123456',
    };

    await sub.execute(data);

    await sub.execute(data2).catch((err) => {
      expect(err.status).toBe(400);
      expect(err.message).toBe('You already have an account');
    });
  });
});
