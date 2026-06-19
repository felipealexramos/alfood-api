# Alfood API

NestJS + PostgreSQL backend for the [Alfood](../alfood) front-end. It implements
the exact contract the SPA expects: a public vitrine API (`/api/v1`) and an admin
CRUD API (`/api/v2`) for restaurants, dishes, and tags, with dish image uploads.

## Tech stack

- **NestJS** (Express platform)
- **TypeORM** + **PostgreSQL**
- **Multer** for `multipart/form-data` image uploads, served statically at `/media`
- **class-validator** / **class-transformer** for request validation
- **Docker Compose** for the local database

## Getting started

```bash
cp .env.example .env        # adjust if needed
docker compose up -d        # start PostgreSQL (host port 5433 by default)
npm install
npm run migration:run       # create schema + seed default tags
npm run start:dev           # http://localhost:8000
```

The schema is managed by **migrations** (not `synchronize`). The initial
migration creates the tables and seeds the default tags. With
`DB_MIGRATIONS_RUN=true` (default) pending migrations also run automatically when
the app boots, so `npm run start:dev` alone is enough after the first setup.

## Configuration (`.env`)

| Variable         | Default                  | Purpose                                   |
| ---------------- | ------------------------ | ----------------------------------------- |
| `PORT`           | `8000`                   | HTTP port                                 |
| `APP_URL`        | `http://localhost:8000`  | Base used to build absolute image URLs    |
| `CORS_ORIGINS`   | `http://localhost:3000`  | Comma-separated allowed origins           |
| `DB_HOST`        | `localhost`              | PostgreSQL host                           |
| `DB_PORT`        | `5433`                   | PostgreSQL port (5432 was already in use) |
| `DB_USERNAME`    | `alfood`                 | DB user                                   |
| `DB_PASSWORD`    | `alfood`                 | DB password                               |
| `DB_DATABASE`    | `alfood`                 | DB name                                   |
| `DB_SYNCHRONIZE` | `true`                   | Auto-sync schema from entities (dev only) |
| `JWT_SECRET`     | —                        | Secret used to sign admin JWTs (required) |
| `JWT_EXPIRES_IN` | `1d`                     | Token lifetime (`60s`, `15m`, `1d`, …)    |
| `ADMIN_USERNAME` | —                        | Single admin user for `/api/v2`           |
| `ADMIN_PASSWORD_HASH` | —                   | bcrypt hash of the admin password         |

## API

All routes use Django-style trailing slashes (Express also matches without them).

### Public — `/api/v1`

- `GET /api/v1/restaurantes/?page=N` — paginated envelope
  `{ count, next, previous, results }`, each result with nested `pratos[]`.

  This vitrine API stays **open** (no token required).

### Authentication

The admin API (`/api/v2`) is protected by JWT. There is a single admin user
defined by `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` (no users table, no
registration). Generate the password hash once:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
# paste the output into ADMIN_PASSWORD_HASH in .env
```

- `POST /api/v2/auth/login` — body `{ usuario, senha }` → `200 { access_token }`
  (`401` on bad credentials). This endpoint is public.

Send the token on every other `/api/v2` request:

```
Authorization: Bearer <access_token>
```

Requests to `/api/v2/*` without a valid token return `401`.

### Admin — `/api/v2` (requires `Authorization: Bearer <token>`)

- `GET    /api/v2/restaurantes/` — array
- `GET    /api/v2/restaurantes/:id/`
- `POST   /api/v2/restaurantes/` — body `{ nome }`
- `PUT    /api/v2/restaurantes/:id/` — body `{ nome }`
- `DELETE /api/v2/restaurantes/:id/` — `204` (cascade-deletes its dishes)
- `GET    /api/v2/pratos/` — array
- `GET    /api/v2/pratos/:id/`
- `POST   /api/v2/pratos/` — `multipart/form-data`: `nome`, `descricao`, `tag`,
  `restaurante` (id), `imagem` (file, optional)
- `PUT    /api/v2/pratos/:id/` — same multipart shape
- `DELETE /api/v2/pratos/:id/` — `204`
- `GET    /api/v2/tags/` — `{ tags: [{ id, value }] }`

Dish responses expose `imagem` as an absolute URL (`{APP_URL}/media/<file>`) and
`restaurante` as the restaurant id, matching the front-end `IPrato` interface.

## Scripts

```bash
npm run start:dev    # watch mode
npm run start:prod   # run compiled build (dist/)
npm run build        # tsc + nest build
npm run lint         # eslint --fix
npm test             # jest unit tests
```

### Migrations (TypeORM)

The CLI uses a standalone DataSource at `src/data-source.ts` that reads the same
`.env` as the app.

```bash
npm run migration:run                       # apply pending migrations
npm run migration:revert                     # undo the last migration
npm run migration:show                       # list applied/pending migrations
npm run migration:generate -- src/migrations/<Name>   # diff entities → new migration
```

Default tags are seeded inside the initial migration, so a clean database plus
`migration:run` reproduces the full schema and seed data.

## Known limitations (MVP)

- Deleting a restaurant cascades its dishes at the database level, which leaves
  those dishes' image files orphaned on disk (deleting a dish directly does clean
  its file). Acceptable for the MVP dev backend.
