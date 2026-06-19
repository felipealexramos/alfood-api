# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

NestJS + PostgreSQL backend for the Alfood SPA. It implements the exact contract
that front-end expects: a public vitrine API (`/api/v1`) and a JWT-protected admin
CRUD API (`/api/v2`) for restaurants (`restaurantes`), dishes (`pratos`), and tags,
plus dish image uploads. The README is the authoritative reference for the API
contract, env vars, and setup — read it before changing routes or response shapes.

## Commands

```bash
docker compose up -d        # start PostgreSQL (host port 5433 by default)
npm run migration:run       # create schema + seed default tags (first setup)
npm run start:dev           # watch mode, http://localhost:8000
npm run build               # nest build
npm run lint                # eslint --fix
npm test                    # jest unit tests (*.spec.ts under src/)
npm run test:e2e            # jest with test/jest-e2e.json
npx jest src/auth/auth.service.spec.ts   # run a single test file
```

### Migrations (TypeORM)

```bash
npm run migration:run                                  # apply pending migrations
npm run migration:revert                               # undo last migration
npm run migration:show                                 # list applied/pending
npm run migration:generate -- src/migrations/<Name>    # diff entities → migration
```

## Architecture

**Schema is migration-managed, not synchronized.** `DB_SYNCHRONIZE` defaults to
`false`; the initial migration creates tables *and seeds the default tags*. With
`DB_MIGRATIONS_RUN=true` (default) pending migrations also run automatically on app
boot, so `npm run start:dev` is enough after first setup. When you change an entity,
generate a new migration rather than relying on synchronize.

**Two DataSource configs that must stay in sync.** The running app configures
TypeORM in [src/app.module.ts](src/app.module.ts) via `forRootAsync`; the TypeORM
CLI uses a standalone DataSource in [src/data-source.ts](src/data-source.ts). Both
read the same `.env`. Keep their connection/entity/migration settings aligned.

**Routing is per-controller, no global prefix.** Each controller declares its full
path (`@Controller('api/v1/restaurantes')`, `@Controller('api/v2/...')`). Public vs
admin is split into separate controllers — e.g. `restaurantes.public.controller.ts`
(open) vs `restaurantes.admin.controller.ts` (guarded). The front-end sends
Django-style trailing slashes; Express matches both forms.

**Admin auth = single hardcoded user, no users table.** [auth.service.ts](src/auth/auth.service.ts)
validates against `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` (bcrypt). `POST /api/v2/auth/login`
is public; every other `/api/v2/*` route is protected by `JwtAuthGuard` applied at
the controller level. Login body uses Portuguese field names `{ usuario, senha }`.

**Response shapes are dictated by the SPA — do not change casually.**
- Vitrine pagination uses a DRF-style envelope `{ count, next, previous, results }`
  ([common/paginacao.interface.ts](src/common/paginacao.interface.ts)).
- Dishes are never returned as raw entities. [prato.view.ts](src/pratos/prato.view.ts)
  `serializePrato` maps the entity to `IPrato`: the stored image filename becomes an
  absolute URL `{APP_URL}/media/<file>` and the relation is flattened to the
  `restaurante` id. Always serialize dishes through this function.

**Image uploads.** Dish images use Multer disk storage configured in
[pratos/upload.config.ts](src/pratos/upload.config.ts) (random UUID filename, 5MB
limit, image MIME allowlist), saved to `./uploads`, and served statically at `/media`
via `ServeStaticModule`. The service deletes the old file on image replace and on
dish delete; deleting a restaurant cascades dish rows at the DB level but leaves
their image files orphaned (known MVP limitation).

## Conventions

- Domain names are Portuguese (`restaurantes`, `pratos`, `tags`, `nome`, `descricao`)
  — match existing naming, don't anglicize.
- Module-per-feature under `src/<feature>/`: entity, service, DTOs (`class-validator`),
  controller(s), module. Global `ValidationPipe` runs with `whitelist` + `transform`.
