import { EnvService } from '@/env/env.service';
import { Injectable, Logger } from '@nestjs/common';
import { SendEmailVerifyDTO } from './dtos/send-email-verify-service.dto';
import { verifyEmailTemplate } from './templates/email-verify.template';
import { SendResetPasswordServiceDTO } from './dtos/send-reset-password-service.dto';
import { passwordResetTemplate } from './templates/password-reset.template';
import { Resend } from 'resend';

@Injectable()
export class MailService extends Resend {
  private logger = new Logger(MailService.name);
  constructor(private readonly configService: EnvService) {
    const resendApiKey = configService.get('RESEND_API_KEY');
    super(resendApiKey);
  }

  public async sendEmailVerify({ userId, email }: SendEmailVerifyDTO) {
    const url = `${this.configService.get('EMAIL_VERIFY_URL')}/${userId}.jpg`;

    const { data, error } = await this.emails.send({
      to: email,
      from: 'no-reply <onboarding@resend.dev>',
      ...verifyEmailTemplate(url),
    });

    if (error) this.logger.error(`Error to send email to email: ${email}`);
    if (data)
      return this.logger.warn(`Email verify sended successfully to ${email}`);
  }

  public async sendRestPasswordEmail({
    code,
    expiresAt,
    email,
  }: SendResetPasswordServiceDTO) {
    const url = `${this.configService.get('FRONTEND_URL')}/reset-password?code=${code}&exp=${expiresAt}`;

    const { error, data } = await this.emails.send({
      to: email,
      from: 'no-reply <onboarding@resend.dev>',
      ...passwordResetTemplate(url),
    });

    // TODO: add retry system

    if (error) this.logger.error(`Error to send email to email: ${email}`);
    if (data)
      return this.logger.warn(`Email verify sended successfully to ${email}`);
  }
}
