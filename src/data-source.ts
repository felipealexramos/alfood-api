import 'reflect-metadata';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Standalone DataSource used by the TypeORM CLI (migration:generate/run/revert).
// It reads the same .env the Nest app uses, so the CLI and the running app
// always point at the same database.
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'alfood',
  password: process.env.DB_PASSWORD ?? 'alfood',
  database: process.env.DB_DATABASE ?? 'alfood',
  entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: false,
});
