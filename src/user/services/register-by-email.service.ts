import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user-repository.interface';
import { RegisterByEmailServiceDTO } from './dtos/register-by-email-service.dto';
import { passwordToHash } from '@/core/helpers/cryptography';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class RegisterByEmailService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async execute({ name, email, password }: RegisterByEmailServiceDTO) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new BadRequestException('You already have an account');
    }

    const passwordHashed = await passwordToHash(password);

    const newUser = await this.userRepository.registerByEmail({
      name,
      email,
      password: passwordHashed,
    });

    await this.mailService.sendEmailVerify({ userId: newUser.id, email });
  }
}
