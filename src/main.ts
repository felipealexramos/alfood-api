import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // The front-end issues Django-style requests with trailing slashes
  // (e.g. /api/v2/restaurantes/). Express ignores the trailing slash by
  // default, so both forms resolve to the same route.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const origins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());
  app.enableCors({ origin: origins });

  const port = config.get<number>('PORT', 8000);
  await app.listen(port);
}
void bootstrap();
