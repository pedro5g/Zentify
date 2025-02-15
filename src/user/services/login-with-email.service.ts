import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { LoginWithEmailServiceDTO } from './dtos/login-service.dto';
import { comparePassword } from '@/core/helpers/cryptography';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginWithEmailService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginWithEmailServiceDTO) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.email) {
      throw new BadRequestException(
        'Ooh no! Your email or password are invalid',
      );
    }

    if (!user.password) {
      throw new BadRequestException(
        `It looks like you created your account using Google. Try signing in with Google or resetting your password.`,
      );
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new BadRequestException(
        'Ooh no! Your email or password are invalid',
      );
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileUrl: user.profileUrl,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    };
  }
}
