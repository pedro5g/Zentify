import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { RegisterByEmailServiceDTO } from './dtos/register-by-email-service.dto';
import { passwordToHash } from '@/core/helpers/cryptography';

@Injectable()
export class RegisterByEmailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterByEmailServiceDTO) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('You already have an account');
    }

    const passwordHashed = await passwordToHash(password);

    await this.userRepository.registerByEmail({
      name,
      email,
      password: passwordHashed,
    });
  }
}
