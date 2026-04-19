# Hono · Better Auth · Drizzle · OpenAPI — Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)][license]
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6)][typescript]
[![Hono](https://img.shields.io/badge/Hono-4.x-orange)][hono]
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.x-c5f74f)][drizzle]
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.6.x-7c3aed)][better-auth]
[![Vitest](https://img.shields.io/badge/Vitest-4.x-6e9f18)][vitest]

Starting a new REST API from scratch means wiring together authentication, database migrations, input validation, OpenAPI docs, and a test setup — before writing a single line of business logic. This template eliminates that overhead.

It combines **[Hono][hono]**, **[Better Auth][better-auth]**, **[Drizzle ORM][drizzle]**, and **[Zod OpenAPI][zod-openapi]** into a single, opinionated starter where every layer is type-safe and production-ready from day one.

- **Type-safe end-to-end** — database schema, Zod validation, and OpenAPI spec stay in sync automatically
- **Auth out of the box** — email/password and OAuth-ready via Better Auth, no boilerplate needed
- **OpenAPI auto-generated** — route definitions double as OpenAPI 3.1 specs with interactive [Scalar][scalar] UI
- **Test infrastructure included** — integration and unit tests with in-memory Postgres (PGlite), 60% coverage threshold enforced
- **Edge-ready** — runs on Node.js by default, switchable to Bun with minimal changes

---

[Report a bug][issues] &nbsp;|&nbsp; [Request a feature][issues] &nbsp;|&nbsp; [Open a pull request][pulls]

---

## Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick start](#quick-start)
  - [Installation](#installation)
  - [Environment variables](#environment-variables)
  - [Start the database](#start-the-database)
  - [Database setup](#database-setup)
  - [Switching runtime or package manager](#switching-runtime-or-package-manager)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Tech stack](#tech-stack)
- [API endpoints](#api-endpoints)

---

## Getting started

### Prerequisites

- **[Node.js][node]** ≥ 22 — or **[Bun][bun]** ≥ 1.x as an alternative runtime
- **[pnpm][pnpm]** ≥ 10 — or npm, yarn, or bun (see [switching package manager](#switching-runtime-or-package-manager))
- **[Docker][docker]** — for the included PostgreSQL + pgAdmin setup

### Quick start

<details>
<summary>Steps to get up and running</summary>

**1.** Clone the repository:

```bash
git clone https://github.com/doinel1a/hono-drizzle-openapi YOUR-PROJECT-NAME
cd YOUR-PROJECT-NAME
```

**2.** Install dependencies:

```bash
pnpm install
```

**3.** Copy and fill in the environment variables:

```bash
cp .env.example .env
```

> [!NOTE]
> At minimum, set `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` before proceeding.

**4.** Start the database:

```bash
docker compose up -d
```

**5.** Push the schema:

```bash
pnpm db:push
```

**6.** Start the server:

```bash
pnpm dev
```

</details>

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/doinel1a/hono-drizzle-openapi YOUR-PROJECT-NAME
cd YOUR-PROJECT-NAME
```

| | **npm** | **bun** | **pnpm** | **yarn** |
| --- | --- | --- | --- | --- |
| **install** | `npm install` | `bun install` | `pnpm install` | `yarn install` |

### Environment variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

| Variable | Description | Required |
| --- | --- | --- |
| `PORT` | Port the server listens on | Yes |
| `ORIGIN` | Allowed CORS origin | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_URL` | Base URL for Better Auth | Yes |
| `BETTER_AUTH_SECRET` | Secret key (min 32 chars) | Yes |

> [!TIP]
> Generate a secure `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`

> [!NOTE]
> Set `SKIP_ENV_VALIDATION=true` to bypass env validation (useful for Docker builds).

### Start the database

The project ships a `docker-compose.yml` with PostgreSQL and pgAdmin. Start them with:

```bash
docker compose up -d
```

| Service | Default URL |
| --- | --- |
| PostgreSQL | `localhost:5433` |
| pgAdmin | `http://localhost:8080` |

> [!NOTE]
> If you prefer to use an existing PostgreSQL instance, skip this step and set `DATABASE_URL` accordingly.

### Database setup

Push the schema to your database or run migrations:

```bash
# Push schema directly (development)
pnpm db:push

# Or run migrations (production)
pnpm db:migrate
```

> [!TIP]
> Use `pnpm db:studio` to open Drizzle Studio and inspect your database visually.

### Switching runtime or package manager

#### Switching to Bun runtime

<details>
<summary>Steps to switch to Bun</summary>

**1.** Replace `src/index.ts` with the Bun-native entry point:

```ts
import { env } from './env';
import server from './server';

export default {
  port: env.PORT,
  fetch: server.fetch
};
```

**2.** Remove the Node.js-specific packages — Bun has built-in HTTP server and bundler:

```bash
pnpm remove @hono/node-server tsup
```

Also delete `tsup.config.ts`.

**3.** Update the scripts in `package.json`:

```json
"dev":   "bun src/env.ts && bun --watch src/index.ts",
"build": "bun build src/index.ts --outdir dist --target bun",
"start": "bun src/env.ts && bun dist/index.js"
```

</details>

#### Switching package manager

<details>
<summary>Steps to switch from pnpm to npm, yarn, or bun</summary>

**1.** Delete the pnpm lock file:

```bash
rm pnpm-lock.yaml
```

**2.** (Optional) Declare the new package manager in `package.json` so tooling and CI pick it up automatically:

```json
"packageManager": "npm@10.x.x"
```

Replace `npm@10.x.x` with `yarn@4.x.x` or `bun@1.x.x` as appropriate. See [Corepack docs][corepack] for details.

**3.** Install dependencies with the new package manager:

```bash
# npm
npm install

# yarn
yarn install

# bun
bun install
```

</details>

> [!NOTE]
> All scripts in `package.json` use package-manager-agnostic syntax and work without changes after switching.

---

## Project structure

```
.
├── drizzle/
│   ├── migrations/        # SQL migration history
│   ├── schemas/           # Drizzle table definitions (auth + tasks)
│   ├── config.ts          # Drizzle Kit configuration
│   └── db.ts              # Database client
├── src/
│   ├── lib/
│   │   ├── errors/        # Database error handling (maps PG error codes to HTTP)
│   │   ├── openapi/       # Shared OpenAPI schemas & helpers
│   │   ├── auth.ts        # Better Auth configuration
│   │   ├── init-docs.ts   # Scalar / OpenAPI doc setup
│   │   ├── init-server.ts # Hono app factory
│   │   └── types.ts       # Shared TypeScript types
│   ├── middlewares/       # CORS, auth, logging, error handling
│   ├── routes/
│   │   └── tasks/         # Example CRUD domain (routes, handlers)
│   ├── env.ts             # Env validation (Zod + T3 env-core)
│   ├── index.ts           # Entry point
│   └── server.ts          # Route registration & server export
└── tests/
    ├── integration/       # End-to-end route tests
    ├── unit/              # Isolated unit tests
    └── utils/             # Shared test helpers (mock DB, app setup)
```

---

## Available scripts

| Script | Description |
| --- | --- |
| `dev` | Start the server in watch mode with env validation |
| `build` | Compile TypeScript to JavaScript via tsup |
| `start` | Run the compiled output |
| `typecheck` | Run TypeScript compiler without emitting files |
| `lint` | Run ESLint |
| `lint:fix` | Run ESLint and auto-fix issues |
| `format` | Format all source files with Prettier |
| `test` | Run Vitest in watch mode |
| `test:coverage` | Run Vitest once and generate a coverage report (60% threshold enforced) |
| `ba:auth` | Run the Better Auth CLI to regenerate auth artifacts |
| `db:studio` | Open Drizzle Studio for visual database inspection |
| `db:push` | Push the Drizzle schema to the database (development) |
| `db:create-migration` | Generate a new migration from schema changes |
| `db:migrate` | Run SQL migrations (production) |

---

## Tech stack

| Tool | Purpose |
| --- | --- |
| **[Hono][hono]** | Lightweight, edge-ready web framework |
| **[Better Auth][better-auth]** | Type-safe authentication with email/password and OAuth |
| **[Drizzle ORM][drizzle]** | Type-safe SQL ORM with schema-driven migrations |
| **[Zod OpenAPI][zod-openapi]** | Route definitions with automatic OpenAPI spec generation |
| **[Scalar][scalar]** | Interactive API reference UI |
| **[LogLayer][loglayer]** | Structured, pluggable logging |
| **[Vitest][vitest]** | Unit and integration tests with PGlite (in-memory Postgres) |
| **[ESLint 10][eslint]** + **[Prettier][prettier]** | Linting and formatting |
| **[Husky][husky]** + **[Commitlint][commitlint]** | Git hooks and conventional commit enforcement |

---

## API endpoints

All endpoints are served under the `/api` base path.

### OpenAPI

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/docs` | OpenAPI JSON specification |
| `GET` | `/api/reference` | Scalar interactive API reference UI |

### Better Auth

Better Auth endpoints are mounted at `/api/auth/*`. The `openAPI()` plugin exposes its own interactive reference:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/sign-up/email` | Register with email and password |
| `POST` | `/api/auth/sign-in/email` | Sign in with email and password |
| `POST` | `/api/auth/sign-out` | Sign out and invalidate session |
| `GET` | `/api/auth/get-session` | Get the current session |
| `GET` | `/api/auth/reference` | Better Auth Scalar UI |
| `GET` | `/api/auth/open-api.json` | Better Auth OpenAPI JSON spec |

> [!NOTE]
> The full list of Better Auth endpoints (including OAuth flows) is available at `/api/auth/reference` once the server is running.

### Tasks

> [!NOTE]
> The `tasks` domain is an example CRUD resource included to demonstrate the project conventions — routing, validation, error handling, and OpenAPI integration. Replace or extend it with your own domain logic.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/tasks` | Required | List all tasks |
| `GET` | `/api/tasks/{id}` | Required | Get a task by ID |
| `POST` | `/api/tasks` | Required | Create a new task |
| `PATCH` | `/api/tasks/{id}` | Required | Update a task |
| `DELETE` | `/api/tasks/{id}` | Required | Delete a task |

[issues]: https://github.com/doinel1a/hono-drizzle-openapi/issues
[pulls]: https://github.com/doinel1a/hono-drizzle-openapi/pulls
[license]: https://github.com/doinel1a/hono-drizzle-openapi/blob/main/LICENSE
[node]: https://nodejs.org/en
[bun]: https://bun.com/docs/installation
[pnpm]: https://pnpm.io/installation
[yarn]: https://yarnpkg.com/getting-started/install
[docker]: https://docs.docker.com/get-docker/
[corepack]: https://nodejs.org/api/corepack.html
[typescript]: https://www.typescriptlang.org/
[hono]: https://hono.dev/
[drizzle]: https://orm.drizzle.team/
[better-auth]: https://better-auth.com/
[zod-openapi]: https://github.com/honojs/middleware/tree/main/packages/zod-openapi
[scalar]: https://scalar.com/
[loglayer]: https://loglayer.dev/
[vitest]: https://vitest.dev/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[husky]: https://typicode.github.io/husky/
[commitlint]: https://commitlint.js.org/
