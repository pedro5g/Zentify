import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { Public } from '@/auth/public';
import { ValidationPipe } from '@/pipes/validation.pipe';
import {
  ForgetPasswordSchema,
  forgetPasswordSchema,
} from '@/core/schemas/user.schema';
import { ForgetPasswordService } from '../services/forget-password.service';

@Controller('user/auth')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post('/forget-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe(forgetPasswordSchema))
  @Public()
  async handle(@Body() body: ForgetPasswordSchema) {
    const { email } = body;

    await this.forgetPasswordService.execute({
      email,
    });
  }
}
