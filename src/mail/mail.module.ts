import { EnvModule } from '@/env/env.module';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EnvService } from '@/env/env.service';

@Module({
  imports: [EnvModule],
  providers: [MailService, EnvService],
  exports: [MailService],
})
export class MailModule {}
