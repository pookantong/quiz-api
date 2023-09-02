import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const allowedOrigin: string = configService.get<string>('allowedOrigin');

  // app.enableCors({
  //   origin: allowedOrigin,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  //   optionsSuccessStatus: 200,
  //   exposedHeaders: 'Authorization',
  // });

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
