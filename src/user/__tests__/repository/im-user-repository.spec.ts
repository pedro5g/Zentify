import { RegisterAccountDTO } from '@/user/repository/dtos/register-account.dto';
import { IMUserRepository } from './im-user-repository';
import { codeGenerate } from '@/core/helpers/code-generate';

let sut: IMUserRepository;

describe('Tests In Memory user Repository', () => {
  beforeEach(() => {
    sut = new IMUserRepository();
  });

  test('Register a user using email', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);

    expect(newUser).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        email: data.email,
        password: data.password,
        emailVerified: false,
      }),
    );
    expect(sut.accounts[0]).toStrictEqual(
      expect.objectContaining({
        providerIdOrEmail: data.email,
        provider: 'EMAIL',
      }),
    );
  });
  test('Register a user using google provider', async () => {
    const data: RegisterAccountDTO = {
      name: 'test',
      email: 'test@gmail.com',
      provideId: 'kjklasjkajs',
      provider: 'GOOGLE',
      profileUrl: 'http://google.image',
    };

    await sut.registerAccount(data);

    expect(sut.users[0]).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        email: data.email,
        emailVerified: true,
        profileUrl: data.profileUrl,
      }),
    );
    expect(sut.accounts[0]).toStrictEqual(
      expect.objectContaining({
        providerIdOrEmail: data.provideId,
        provider: 'GOOGLE',
      }),
    );
  });

  test('Update an user', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);

    const date = new Date(2022, 2, 22);

    const updateData = {
      id: newUser.id,
      emailVerified: true,
      name: 'testUpdated',
      lastLogin: date,
      profileUrl: 'http://google.image',
    };

    const userUpdated = await sut.updateUser(updateData);

    expect(userUpdated).toStrictEqual(
      expect.objectContaining({
        id: updateData.id,
        name: updateData.name,
        lastLogin: updateData.lastLogin,
        emailVerified: updateData.emailVerified,
        profileUrl: updateData.profileUrl,
      }),
    );
  });

  test('Update email verified', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);

    const updateData = {
      id: newUser.id,
      emailVerified: true,
    };

    await sut.setEmailVerify(updateData);

    expect(sut.users[0]).toStrictEqual(
      expect.objectContaining({
        id: updateData.id,
        emailVerified: updateData.emailVerified,
      }),
    );
  });

  test('Find user by email', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    await sut.registerByEmail(data);

    const findUser = await sut.findByEmail(data.email);

    expect(findUser).toBeTruthy();
  });

  test('Find user by id', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);

    const findUser = await sut.findById(newUser.id);

    expect(findUser).toBeTruthy();
  });

  test('Get Reset Password Code By Code', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);
    const code = codeGenerate();
    const expiresAt = new Date();

    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });

    const result = await sut.getResetPasswordCodeByCode(code);

    expect(result).toEqual(
      expect.objectContaining({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        resetId: 0,
        code,
      }),
    );
  });

  test('Reset User password', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);

    await sut.resetUserPassword({
      userId: newUser.id,
      password: 'new_password',
    });

    const updatedUser = sut.users[0];

    expect(updatedUser.password).toBe('new_password');
  });

  test('Register Reset Password', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);
    const code = codeGenerate();
    const expiresAt = new Date();

    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });

    expect(sut.resetPasswordCodes).toHaveLength(1);
    expect(sut.resetPasswordCodes[0].id).toBe(0);
    expect(sut.resetPasswordCodes[0].userId).toBe(newUser.id);
  });
  test('Delete Reset PasswordCode', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);
    const code = codeGenerate();
    const expiresAt = new Date();

    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });
    await sut.deleteResetPasswordCode(code);
    expect(sut.resetPasswordCodes).toHaveLength(0);
  });

  test('Delete Many Reset Password Code', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);
    const code = codeGenerate();
    const expiresAt = new Date();

    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });
    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });
    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });

    expect(sut.resetPasswordCodes).toHaveLength(3);

    await sut.deleteManyResetPasswordCode(newUser.id);

    expect(sut.resetPasswordCodes).toHaveLength(0);
  });
  test('Count Reset Code By Time', async () => {
    const data = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const newUser = await sut.registerByEmail(data);
    const code = codeGenerate();
    const expiresAt = new Date();

    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });
    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });
    await sut.registerResetPassword({ userId: newUser.id, code, expiresAt });

    const count = await sut.countResetCodeByTime({
      userId: newUser.id,
      time: expiresAt,
    });

    expect(count).toBe(3);
  });
});
