# Drinaluza ExpressJS — Backend Server

> **Drinaluza, business manager (backend server)** — Express.js + MongoDB backend for multi-business management (restaurants, tabouna stands, etc.) with products, orders, sales, purchases, reviews, dashboards, real-time notifications and media handling.

- **Package:** `drinaluza-server` `v1.4.0` — `src/main.js` (`type: module` ESM)
- **Repository:** https://github.com/ahmed-derbala/drinaluza-expressjs
- **Node:** `24` (`engines` in `package.json:9`)
- **Author:** Ahmed Derbala <derbala.ahmed531992@gmail.com>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Database](#database)
- [Logging](#logging)
- [File Uploads & Cloudinary](#file-uploads--cloudinary)
- [Realtime (Socket.IO)](#realtime-socketio)
- [Swagger / API Docs](#swagger--api-docs)
- [Seeding](#seeding)
- [Deployment (PM2)](#deployment-pm2)
- [Code Style](#code-style)
- [License](#license)

---

## Features

Core business-manager capabilities, split into `src/features` and `src/core`:

| Domain | Location | Description |
|---|---|---|
| **Auth & Sessions** | `src/core/auth`, `src/core/sessions` | JWT (`jsonwebtoken`) + bcrypt, token stored in `sessions` collection, `authenticate()` middleware |
| **Users** | `src/features/users` | Profiles (`/my-profile`, `/:slug`, `/:userSlug/profile`), roles, settings (language/currency/notifications) |
| **Businesses** | `src/features/businesses` | Generic business CRUD + `restaurants` (tables/refs), `tabouna-stand` sub-modules |
| **Products** | `src/features/products` | Business-scoped products, price schema, slugs |
| **Default Products** | `src/features/default-products` | Catalog seed/templates referenced by businesses |
| **Orders / Sales / Purchases** | `src/features/orders`, `sales`, `purchases` | Order lifecycle, sales helpers, purchase flow |
| **Feed** | `src/features/feed` | Business/user feed |
| **Reviews** | `src/features/reviews` | Ratings subschema, business/product reviews |
| **Dashboard** | `src/features/dashboard` | Business + personal dashboards, count/price period aggregations |
| **Search** | `src/features/search` | Keyword search field + pagination helpers |
| **Notifications** | `src/core/notifications` | Push via `expo-server-sdk`, templates |
| **Files** | `src/core/files` | `multer` + Cloudinary upload, files refs |
| **Health** | `src/core/health`, `src/features/index` | `GET /` and `GET /health` — uptime, NODE_ENV, app version |

Cross-cutting: **i18n** (`en`, `tn_latn`, `tn_arab`), **multi-currency** (`tnd`, `usd`, `eur`), slug plugin (`#slug` → `src/core/db/mongodb/slug-plugin.js`), pagination, rate-limiting, helmet, compression, CORS.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Runtime | Node.js | 24 |
| Framework | Express | `^5.2.1` |
| Database | Mongoose + MongoDB | `^9.9.4` |
| Auth | `bcrypt`, `jsonwebtoken` | `^6.0.0`, `^9.0.3` |
| Validation | `express-validator` | `^7.3.2` |
| Uploads | `multer`, `cloudinary` | `^2.3.0`, `^2.11.0` |
| Realtime | `socket.io` | `^4.8.3` |
| Docs | `swagger-ui-express` | `^5.0.1` |
| Logging | `winston`, `winston-mongodb`, `express-winston`, `morgan` | `^3.19.0`, `^7.0.1`, `^4.2.0`, `^1.12.0` |
| Security | `helmet`, `cors`, `compression`, `express-rate-limit`, `cookie-parser` | see `package.json:87` |
| Push | `expo-server-sdk` | `^7.2.0` |
| Misc | `dotenv`, `glob`, `cli-color`, `inquirer`, `express-useragent`, `express-ejs-layouts` | |

Path aliases defined in `package.json:19` (`imports`):

```
#error, #log, #helpers, #mongodb/*, #products/*, #feed/*, #orders/*,
#reviews/*, #users/*, #businesses/*, #dashboard/*, #config, #address,
#location, #media, #multilang, #state, #slug, #files, #auth,
#shared-schemas, #core, #core/*
```

---

## Project Structure

```
drinaluza-expressjs/
├── src/
│   ├── main.js                     # entry — connects MongoDB, starts server (src/main.js:1)
│   ├── config/
│   │   ├── index.js                # env-aware loader (local/production/default)
│   │   ├── default.config.js       # canonical config (311 lines)
│   │   ├── local.config.js         # gitignored, generated from default
│   │   ├── production.config.js    # gitignored, generated from default
│   │   └── pm2.config.js
│   ├── core/
│   │   ├── auth/                   # signup/signin/signout, JWT, authenticate()
│   │   ├── db/mongodb/             # connection, pagination, slug-plugin, shared-schemas
│   │   ├── enums/, validation/, error/, helpers/, utils/
│   │   ├── files/                  # multer + cloudinary
│   │   ├── health/                 # health controller
│   │   ├── log/                    # winston + morgan
│   │   ├── notifications/          # expo push + templates
│   │   ├── sessions/               # token sessions schema/service
│   │   ├── shared/, socketio/, swagger/
│   │   └── scripts/smenu.js        # interactive CLI menu (inquirer)
│   ├── features/
│   │   ├── index/                  # GET / and GET /health, seed-db script
│   │   ├── users/, businesses/ (restaurants/, tabouna-stand/), products/
│   │   ├── default-products/, orders/, sales/, purchases/
│   │   ├── feed/, reviews/, dashboard/, search/
│   │   └── ...                     # each: .schema.js, .service.js, .repository.js,
│   │                               #       .controller.js, .validator.js, .constant.js
│   └── ...
├── public/                         # static served at /public (public/default-products, default-thumbnails, docs, images)
├── docs/drinaluza.postman_collection.json
├── package.json
├── eslint.config.js
├── .prettierrc
├── .env.sample
└── AGENTS.md
```

Controllers are auto-loaded in `src/core/utils/app.js:62` via `loaders.load()`:

```js
// src/core/utils/app.js:62
await loaders.load({ app, rootDir: '/features', urlPrefix: '/api/', fileSuffix: '.controller.js' })
await loaders.load({ app, rootDir: '/features/index', urlPrefix: '/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/features/businesses/restaurants', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/core/auth', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/core/health', urlPrefix: '/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/core/notifications', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/core/sessions', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
await loaders.load({ app, rootDir: '/core/files', urlPrefix: '/api/', fileSuffix: '.controller.js', hasSubDir: false })
```

Shared schemas: `src/core/db/mongodb/shared-schemas` — `address`, `location`, `media`, `multi-lang`, `state`, `price`, `contact`, `phone`, `social-media`.

---

## Prerequisites

- **Node.js 24** (see `package.json:9` `engines`)
- **MongoDB** (local `mongodb://127.0.0.1:27017/drinaluza` or Atlas via `MONGO_URI`)
- **Cloudinary** account (for media uploads) — optional for local dev

---

## Installation

```bash
git clone https://github.com/ahmed-derbala/drinaluza-expressjs.git
cd drinaluza-expressjs

# install (also installs npm-check-updates globally)
npm run i          # or: npm install

# production deps only
npm run i:prod
```

---

## Environment Variables

Copy the sample and fill values:

```bash
cp .env.sample .env
# or switch presets:
npm run env:local   # cp .env.local .env
npm run env:prod    # cp .env.prod .env
```

`.env.sample:1` reference:

```ini
NODE_ENV=local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BACKEND_URL=http://192.168.1.11:5001
FRONTEND_URL=http://192.168.1.11:8081
MONGO_URI=mongodb://127.0.0.1:27017/drinaluza
```

Additional vars read in `src/config/default.config.js`:

| Var | Default | Purpose |
|---|---|---|
| `NODE_ENV` | `local` | Selects `src/config/<NODE_ENV>.config.js` |
| `PORT` | `5001` | HTTP port (`config.backend.port`) |
| `BACKEND_URL` | `http://<local-ip>:5001` | Public backend URL |
| `FRONTEND_URL` | `https://drinaluza.vercel.app/` | CORS/frontend origin |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/drinaluza` | Full Mongo URI (overrides host/port) |
| `DATABASE_HOST` | `127.0.0.1` | Used if `MONGO_URI` empty |
| `DATABASE_PORT` | `27017` | Used if `MONGO_URI` empty |

`.env`, `.env.local`, `.env.prod` are gitignored (`.gitignore:1`).

---

## Configuration

`src/config/default.config.js:183` is the source of truth. Key sections:

- **backend** — `port`, `host` (via `#core/helpers/ip.js` → `getLocalIp()`), `url` getter
- **security** — `apiLimiter` (15min / 100 req, `ipKeyGenerator`), `corsOptions` (`origin: '*'`), `helmet` (disabled by default), optional request `delay`
- **docs.swagger** — endpoint `/swagger` → `${backend.url}/swagger`
- **db.mongodb** — `uri`, `maxPoolSize: 200`, `minPoolSize: 5`
- **log.winston** — console transport (file/mongo commented out), levels `error..silly`, `morgan` token, `hiddenBodyFields: ['password','user.password']`
- **pagination** — `minLimit:1`, `defaultLimit:100`, `maxLimit:300`
- **socketio** — port `3066`, `cors: { origin:'*', credentials:true }`
- **language / currency / notifications** — defaults + supported lists
- **businesses.autoApprove** — `true`
- **cloudinary** — from env

Env-specific overrides: `src/config/index.js:6` loads `src/config/${NODE_ENV}.config.js` if it exists, otherwise copies `default.config.js` automatically.

Manage configs:

```bash
npm run config:local       # cp default → local
npm run config:prod        # cp -n default → production (no-clobber)
npm run config:new-prod    # cp default → production (overwrite)
```

---

## Scripts

All scripts from `package.json:44`:

| Script | Command | Description |
|---|---|---|
| `env:prod` / `env:local` | `cp .env.prod/.env.local .env` | Switch env file |
| `start` | `node src/main.js` | Start (uses current `.env` + `NODE_ENV`) |
| `start:prod` | `NODE_ENV=production node src/main.js` | Production start |
| `start:local` | `NODE_ENV=local node --watch-path=./src src/main.js` | Local with watch |
| `dev` | `npm run env:local && npm run start:local` | Recommended local dev |
| `dev:prod` | `npm run env:prod && NODE_ENV=production node --watch...` | Prod env with watch |
| `start:dev` | `NODE_ENV=development node --watch-path ...` | Dev env |
| `debug` | `NODE_DEBUG=module node --trace-warnings ...` | Debug with tracing |
| `start:prod-pm2` | `pm2 start --name drinaluza ... -i max` | PM2 cluster |
| `start:local-pm2` | `pm2 start src/config/pm2.config.js --env local` | PM2 local |
| `reload` / `stop` / `delete` / `monit` | `pm2 ...` | PM2 helpers |
| `build:prod` | `config:new-prod && clean:prod` | Prod build |
| `bootstrap:local` | `config:local && clean && start:local` | Fresh local bootstrap |
| `bootstrap:prod` | `config:new-prod && clean:prod && start:prod` | Fresh prod bootstrap |
| `clean` / `clean:prod` | `rm:local/rm:prod && i/i:prod` | Clean deps & reinstall |
| `smenu` / `smenu:prod` | `node src/core/scripts/smenu.js` | Interactive menu (inquirer) |
| `format` | `prettier --write "src/**/*.{js,jsx,ts,tsx}"` | Format code |
| `ver` | `npm version patch --no-git-tag-version` | Bump patch version |
| `update` / `ncu` | `npm-check-updates` | Update deps |

---

## Running the Server

```bash
# 1. env
cp .env.sample .env
# edit MONGO_URI, CLOUDINARY_*, BACKEND_URL, FRONTEND_URL

# 2. config
npm run config:local

# 3. run
npm run dev
# → drinaluza-server 1.4.0 http://<ip>:5001 NODE_ENV=local

# verify
curl http://localhost:5001/
curl http://localhost:5001/health
# Swagger UI:
open http://localhost:5001/swagger
```

Server bootstrap: `src/main.js:9` connects MongoDB if `config.db.mongodb.isActive`, creates HTTP server in `src/core/utils/server.js:15` (`http.createServer(app)`), initializes Socket.IO, handles cluster / graceful `SIGINT` shutdown.

---

## API Overview

Base prefix: `/api/` for feature controllers, `/` for index/health. 404 fallback in `src/core/utils/app.js:72`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | App info: `NODE_ENV`, `app`, `NODE_VERSION`, `uptime` (`src/features/index/index.controller.js:7`) |
| `GET` | `/health` | — | Same as `/` + health check (`src/features/index/index.controller.js:15`) |
| `POST` | `/api/signup` | — | Create user + auth, returns `{user, token}` (`src/core/auth/auth.controller.js:16`) |
| `POST` | `/api/signin` | — | Login with `slug`+`password`, returns `{user, token}` (`src/core/auth/auth.controller.js:29`) |
| `POST` | `/api/signout` | Bearer | Delete session (`src/core/auth/auth.controller.js:50`) |
| `GET` | `/api/users` | — | List users |
| `GET` | `/api/users/my-profile` | Bearer | Own profile (`src/features/users/users.controller.js:17`) |
| `PATCH` | `/api/users/my-profile` | Bearer | Update own profile |
| `GET` | `/api/users/:slug` | — | User by slug (must be last) |
| `GET` | `/api/users/:userSlug/profile` | — | Public profile |
| … | `/api/businesses`, `/api/products`, `/api/default-products`, `/api/orders`, `/api/sales`, `/api/purchases`, `/api/feed`, `/api/reviews`, `/api/dashboard`, `/api/search`, `/api/files`, `/api/notifications`, `/api/sessions` | — | Feature controllers (see `src/features/**/ *controller.js` and `src/core/**/ *controller.js`) |

Full interactive spec: `GET /swagger` (Swagger 2.0, generated from `*.path.swagger.js` / `*.tag.swagger.js` via `src/core/swagger/swagger.js:34`).

Postman: `docs/drinaluza.postman_collection.json`.

Error handling: final middleware `src/core/utils/app.js:85` — `res.status(err.status||500).json(err)`; request-level `tidHandler` (`src/core/helpers/tid.js`) + `express-winston` + `morganLogger()` (`src/core/log/morgan.js`) when enabled.

Rate limiting: `config.security.apiLimiter` applied globally in `src/core/utils/app.js:35`.

---

## Authentication

- **Signup** `POST /api/signup` → `validate(signupVld)` → hash with `bcrypt` (`saltRounds:10`), `AuthModel` + `UserModel`, `createNewSession()` → JWT `expiresIn: '90d'`, `privateKey: package.json.name` (`src/config/default.config.js:191`).
- **Signin** `POST /api/signin` → `bcrypt.compareSync`, token via `createNewSession`.
- **Authenticate** middleware (`#auth` → `src/core/auth/index.js`) — expects `authorization: Bearer <token>` (also reads `headers.token` for signout), validates against `sessions` collection.
- Passwords are `select: false` and hidden in logs (`hiddenBodyFields`).

---

## Database

- **MongoDB** via Mongoose (`src/core/db/mongodb/index.js`). URI from `MONGO_URI` or `DATABASE_HOST/PORT/dbName=drinaluza`.
- **Pooling** — `maxPoolSize:200`, `minPoolSize:5`.
- **Pagination** — `src/core/db/mongodb/pagination.js` (`paginateMongodb`), limits `1..300` (default `100`).
- **Slug plugin** — `#slug` (`src/core/db/mongodb/slug-plugin.js`) auto-generates slugs.
- **Shared schemas** — `src/core/db/mongodb/shared-schemas` reused across features.
- Connection gated by `config.db.mongodb.isActive` in `src/main.js:9`.

---

## Logging

Configured in `src/config/default.config.js:105`:

- **Winston** transports: `Console` active (File + MongoDB commented, enable by uncommenting in `createLoggerOptions.transports`), level `silly`, colors, `prettyPrint`, `timestamp: YYYY-MM-DD--HH:mm:ss.SSS`.
- **Morgan** (`src/core/log/morgan.js`) — token `{"status":":status","method":":method",...}`, enabled via `config.log.morgan.isActive`.
- **express-winston** MongoDB transport also mounted in `src/core/utils/app.js:47`.
- Process warnings caught: `uncaughtException`, `unhandledRejection`, `warning` in `src/main.js:12`.

Levels: `error (0) < warn (1) < info (2) < verbose (3) < debug (4) < silly (5)` (`src/config/default.config.js:145`).

---

## File Uploads & Cloudinary

- `multer` middleware (`src/core/files/files.middleware.js`) + `cloudinary` (`^2.11.0`) in `src/core/files`.
- Config from env: `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET` (`src/config/default.config.js:178`).
- Static serving: `app.use('/public', express.static(.../public))` (`src/core/utils/app.js:33`) — default thumbnails at `public/default-thumbnails/business.png`.

---

## Realtime (Socket.IO)

- Initialized in `src/core/utils/server.js:16` via `initSocketio(server)` (`src/core/socketio/index.js`).
- Config: `port:3066`, `cors: { origin:'*', credentials:true }` (`src/config/default.config.js:271`).
- Used by notifications/orders for live updates.

---

## Swagger / API Docs

- UI: `GET /swagger` (`src/core/utils/app.js:53` → `swagger-ui-express` + `swaggerSpec.mainDef`).
- Spec: `src/core/swagger/swagger.js:37` — Swagger 2.0, `host: 127.0.0.1:<port>`, `basePath: /`, `securityDefinitions.bearerAuth` (`apiKey` in `authorization`, `Bearer` prefix), auto-collects `*.path.swagger.js` and `*.tag.swagger.js`.
- Static docs also under `public/docs`.

---

## Seeding

Seed scripts (run with correct `NODE_ENV`):

```bash
NODE_ENV=local node src/features/users/scripts/seed.users.script.js
NODE_ENV=local node src/features/businesses/scripts/seed.businesses.script.js
NODE_ENV=local node src/features/default-products/scripts/seed.default-products.script.js
NODE_ENV=local node src/features/reviews/scripts/seed.reviews.script.js
NODE_ENV=local node src/features/index/scripts/seed-db.script.js  # orchestrates all
```

Interactive menu:

```bash
npm run smenu        # local
npm run smenu:prod   # production
```

---

## Deployment (PM2)

PM2 config: `src/config/pm2.config.js:3` — `name: drinaluza-server`, `script: src/index.js`, `instances: os.cpus().length`, `exec_mode: cluster`, `max_memory_restart: 8G`, `watch: true` (ignores `node_modules`, `logs`, `uploads`, `docs`).

```bash
npm run build:prod          # config:new-prod + clean:prod
npm run start:prod-pm2      # pm2 start -i max --max-old-space-size=8192
npm run start:prod-pm2-monit
npm run reload              # pm2 reload drinaluza
npm run monit
npm run stop
npm run delete
```

Direct production without PM2:

```bash
npm run start:prod          # NODE_ENV=production node src/main.js
# or
npm run bootstrap:prod
```

The server disables timeout (`server.setTimeout(0)`) and handles `SIGINT` gracefully in `src/core/utils/server.js:62`.

---

## Code Style

- **ESM** only (`"type": "module"`).
- **Prettier** (`prettier: ^3.9.6`, `.prettierrc:1`): `singleQuote`, `semi: false`, `useTabs`, `printWidth: 200`, `trailingComma: none`.
- **ESLint** (`eslint: ^10.9.1`, `eslint.config.js:1`): `js/recommended` + `globals.node`.
- Format: `npm run format`.
- Version bump: `npm run ver` (`npm version patch --no-git-tag-version`), `postpush` auto pushes + bumps.

---

## 📝 License

Private and proprietary — all rights reserved.

## 👤 Author

**Ahmed Derbala** — [derbala.ahmed531992@gmail.com](mailto:derbala.ahmed531992@gmail.com) · [GitHub: ahmed-derbala](https://github.com/ahmed-derbala)

## 🌐 Repository

[github.com/ahmed-derbala/drinaluza-expressjs](https://github.com/ahmed-derbala/drinaluza-expressjs) — `git clone https://github.com/ahmed-derbala/drinaluza-expressjs.git`
