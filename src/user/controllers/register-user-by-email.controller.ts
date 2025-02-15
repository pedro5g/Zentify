import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { RegisterByEmailService } from '../services/register-by-email.service';
import { Public } from '@/auth/public';
import { ValidationPipe } from '@/pipes/validation.pipe';
import {
  RegisterByEmailSchema,
  registerByEmailSchema,
} from '@/core/schemas/user.schema';

@Controller('user/auth')
export class RegisterUserByEmailController {
  constructor(
    private readonly registerByEmailService: RegisterByEmailService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe(registerByEmailSchema))
  @Public()
  async handle(@Body() body: RegisterByEmailSchema) {
    const { name, email, password } = body;

    await this.registerByEmailService.execute({ name, email, password });
  }
}
