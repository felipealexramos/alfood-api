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
npm run start:dev           # http://localhost:8000
```

On first boot the default tags are seeded automatically. With `DB_SYNCHRONIZE=true`
(dev default) the schema is created from the entities — no migrations needed yet.

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

## API

All routes use Django-style trailing slashes (Express also matches without them).

### Public — `/api/v1`

- `GET /api/v1/restaurantes/?page=N` — paginated envelope
  `{ count, next, previous, results }`, each result with nested `pratos[]`.

### Admin — `/api/v2`

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

## Known limitations (MVP)

- Deleting a restaurant cascades its dishes at the database level, which leaves
  those dishes' image files orphaned on disk (deleting a dish directly does clean
  its file). Acceptable for the MVP dev backend.
- No authentication on the admin API yet.
- Uses `synchronize` instead of migrations.
