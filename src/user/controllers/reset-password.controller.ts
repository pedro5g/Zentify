import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { Public } from '@/auth/public';
import { ValidationPipe } from '@/pipes/validation.pipe';
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from '@/core/schemas/user.schema';
import { ResetPasswordService } from '../services/reset-password.service';

@Controller('user/auth')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('/reset-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe(resetPasswordSchema))
  @Public()
  async handle(@Body() body: ResetPasswordSchema) {
    const { code, password } = body;

    await this.resetPasswordService.execute({ code, password });

    return { message: 'Password reset successfully' };
  }
}
