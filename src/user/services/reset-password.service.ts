import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user-repository.interface';
import { ResetPasswordServiceDTO } from './dtos/reset-password-service.dto';
import { passwordToHash } from '@/core/helpers/cryptography';

@Injectable()
export class ResetPasswordService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ code, password }: ResetPasswordServiceDTO) {
    const resetCode =
      await this.userRepository.getResetPasswordCodeByCode(code);

    if (
      !resetCode ||
      new Date(resetCode.expiresAt).getTime() < new Date().getTime()
    ) {
      throw new BadRequestException('Invalid reset code');
    }

    const passwordHash = await passwordToHash(password);

    await this.userRepository.resetUserPassword({
      userId: resetCode.id,
      password: passwordHash,
    });

    await this.userRepository.deleteResetPasswordCode(code);
  }
}
