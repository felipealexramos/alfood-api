import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Alfood API')
    .setDescription(
      'Backend da SPA Alfood: vitrine pública (/api/v1) e CRUD admin ' +
        'protegido por JWT (/api/v2) para restaurantes, pratos e tags.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token retornado por POST /api/v2/auth/login',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('PORT', 8000);
  await app.listen(port);
}
void bootstrap();
