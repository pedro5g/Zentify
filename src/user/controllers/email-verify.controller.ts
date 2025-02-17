import { Controller, Get, HttpCode, Param, Response } from '@nestjs/common';
import { Public } from '@/auth/public';
import { EmailVerifyService } from '../services/email-verify.service';
import { Response as ResponseType } from 'express';
import { verificationImagePath } from '@/core/verification-img-path';

@Controller('user/auth')
export class EmailVerifyController {
  constructor(private readonly emailVerifyService: EmailVerifyService) {}

  @Get('/verify/:userId.:format')
  @HttpCode(200)
  @Public()
  async handle(
    @Param('userId') userId: string,
    @Param('format') format: string,
    @Response() response: ResponseType,
  ) {
    await this.emailVerifyService.execute({ userId });

    response.sendFile(verificationImagePath);
  }
}
