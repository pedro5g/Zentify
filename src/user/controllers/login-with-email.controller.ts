import {
  Body,
  Controller,
  HttpCode,
  Post,
  Response,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/auth/public';
import { ValidationPipe } from '@/pipes/validation.pipe';
import { LoginSchema, loginSchema } from '@/core/schemas/user.schema';
import { LoginWithEmailService } from '../services/login-with-email.service';
import { Response as ResponseType } from 'express';

@Controller('user/auth')
export class LoginWithEmailController {
  constructor(private readonly loginWithEmailService: LoginWithEmailService) {}

  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe(loginSchema))
  @Public()
  async handle(@Body() body: LoginSchema, @Response() res: ResponseType) {
    const { email, password } = body;

    const { user, accessToken } = await this.loginWithEmailService.execute({
      email,
      password,
    });

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'lax',
      })
      .json(user);
  }
}
