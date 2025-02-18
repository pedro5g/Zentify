import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user-repository.interface';
import { ForgetPasswordServiceDTO } from './dtos/forget-password-service.dto';
import { codeGenerate } from '@/core/helpers/code-generate';
import { addMinutes } from '@/core/helpers/date';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class ForgetPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async execute({ email }: ForgetPasswordServiceDTO) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException("Looks like you don't an account");
    }

    if (!user.email) {
      throw new BadRequestException(
        `It looks like you created your account using Google. Try signing in with Google`,
      );
    }

    const threeMinutesAgo = addMinutes(-3);
    const MAX_ATTEMPTS = 2;

    const count = await this.userRepository.countResetCodeByTime({
      userId: user.id,
      time: threeMinutesAgo,
    });

    if (count >= MAX_ATTEMPTS) {
      throw new BadRequestException(`Too many request, try again later`);
    }

    const code = codeGenerate();
    const expiresAt = addMinutes(30);
    await this.userRepository.registerResetPassword({
      userId: user.id,
      code,
      expiresAt,
    });

    await this.mailService.sendRestPasswordEmail({
      code,
      expiresAt,
      email: user.email,
    });
  }
}
