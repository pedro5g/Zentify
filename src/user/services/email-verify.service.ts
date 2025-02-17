import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user-repository.interface';
import { EmailVerifyServiceDTO } from './dtos/email-verify-service.dto';

@Injectable()
export class EmailVerifyService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: EmailVerifyServiceDTO) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) return;

    await this.userRepository.setEmailVerify({
      id: userId,
      emailVerified: true,
    });
  }
}
