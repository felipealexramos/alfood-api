import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PratosModule } from './pratos/pratos.module';
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'alfood'),
        password: config.get<string>('DB_PASSWORD', 'alfood'),
        database: config.get<string>('DB_DATABASE', 'alfood'),
        autoLoadEntities: true,
        // Schema is managed by migrations (npm run migration:run).
        // Keep synchronize off by default; only enable it explicitly in dev.
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
        // Auto-run pending migrations on boot unless explicitly disabled.
        migrationsRun:
          config.get<string>('DB_MIGRATIONS_RUN', 'true') === 'true',
      }),
    }),
    // Serve uploaded dish images at /media/<filename>.
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/media',
    }),
    AuthModule,
    TagsModule,
    RestaurantesModule,
    PratosModule,
  ],
})
export class AppModule {}
