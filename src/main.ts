import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: configService.get('FRONTEND_URL'),
  });

  app.setGlobalPrefix('/api/v1');

  const PORT = configService.get('PORT');

  await app.listen(PORT);
}
bootstrap();
