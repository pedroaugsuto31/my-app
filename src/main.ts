import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // levantar erro quando a achave não existir
      transform: false, // quando true tenta transformar os tipos de dados de param e dtos
    }),
    new ParseIntIdPipe(),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
