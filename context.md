# Technical System Context & Architecture Guide (`context.md`)
 
> **Repository**: `cv.aash7` (Ashirwad Singh Portfolio & Personal Platform)  


---

## 1. System Overview & Architectural Topology

`cv.aash7` is a high-performance, full-stack personal platform built on **Next.js 15 (App Router)** and deployed to **Cloudflare Workers** using **OpenNext for Cloudflare (`@opennextjs/cloudflare`)**.

The platform is designed for sub-50ms global edge latency, zero-cold-start compute, persistent relational data via **Cloudflare D1 (Serverless SQLite)**, blob storage via **Cloudflare R2**, and microsecond-level atomic state tracking via **Upstash Redis (Serverless HTTP REST)**.

### Architectural Diagram

```
                                  [ Incoming Client Traffic ]
                                               │
                                               ▼
                              ┌───────────────────────────────────┐
                              │     Cloudflare Edge Network       │
                              │ (SSL, CDN, cf-ipcountry, Headers) │
                              └────────────────┬──────────────────┘
                                               │
                                               ▼
                              ┌───────────────────────────────────┐
                              │ Cloudflare Worker (OpenNext Host) │
                              │        (.open-next/worker.js)     │
                              │    Next.js 15 SSR / Edge API      │
                              └───────┬──────────────┬────────────┘
                                      │              │
                   ┌──────────────────┼──────────────┼──────────────────┐
                   ▼                  ▼              ▼                  ▼
        ┌──────────────────┐ ┌─────────────────┐ ┌───────────────┐ ┌───────────────┐
        │  Cloudflare D1   │ │  Cloudflare R2  │ │ Upstash Redis │ │ GitHub API /  │
        │ Serverless SQLite│ │  Object Storage │ │  (HTTP REST)  │ │ External APIs │
        │  (Posts & Events)│ │ (Upload Assets) │ │(Highscore/Ops)│ │ (Stars/Contrib)│
        └──────────────────┘ └─────────────────┘ └───────────────┘ └───────────────┘
```

---

## 2. Cloudflare Ecosystem & Worker Runtime

### 2.1 OpenNext Cloudflare Adapter
- **Package**: `@opennextjs/cloudflare` (`^1.20.2`)
- **Compilation Output**: `.open-next/worker.js` + `.open-next/assets/`
- **Compatibility**: `nodejs_compat`, `compatibility_date = "2026-06-05"`
- **Context Access**: In server routes and database layers, Cloudflare environment bindings (`env.DB`, `env.R2`, etc.) are resolved via `getCloudflareContext()`:
  ```ts
  import { getCloudflareContext } from "@opennextjs/cloudflare";
  const { env } = await getCloudflareContext();
  ```

### 2.2 Cloudflare D1 Database (`aash7-db`)
- **Binding Name**: `DB`
- **Database ID**: `83673477-2706-4133-81d7-267dd69cbf19`
- **Driver**: D1 Prepared Statements API (`db.prepare(query).bind(...).all() | .first() | .run()`)
- **Execution Mode**:
  - **Local Development**: `.wrangler/state/v3/d1` SQLite file.
  - **Production Edge**: Global read-replicated SQLite cluster managed by Cloudflare.

### 2.3 Cloudflare R2 Bucket (`assh`)
- **Binding Name**: `R2`
- **Bucket Name**: `assh`
- **Endpoint**: `https://39c549d629e751c6bd6195081b2a88b8.r2.cloudflarestorage.com`
- **Public CDN Gateway**: `https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev`
- **Access Pattern**: Uploads are generated via AWS S3 SDK (`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`) using S3-compatible credentials stored in worker environment variables.

### 2.4 Upstash Redis (Serverless HTTP REST)
- **Library**: `@upstash/redis` (`^1.36.0`)
- **Protocol**: HTTP/HTTPS REST API (compatible with Edge Workers without TCP socket limits).
- **Credentials Binding**: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` injected via `wrangler.toml` vars or `process.env`.
- **Purpose**: Microsecond atomic writes for visitor counts, game session tracking, and global high score records.

---

## 3. Database Schemas, Storage Models & Indexing

### 3.1 D1 Relational Schema (`schema.sql`)

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('blog','reading','thought')),
  tag TEXT DEFAULT 'tech',
  title TEXT,
  url TEXT,
  banner_url TEXT,
  notes TEXT,
  note_images TEXT DEFAULT '[]',
  clicks INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  path TEXT,
  ref_id INTEGER,
  country TEXT,
  referrer TEXT,
  date TEXT DEFAULT (date('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Production Composite Indexes for Sub-Millisecond Queries
CREATE INDEX IF NOT EXISTS idx_posts_type_created ON posts(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_tag_created ON posts(type, tag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_tag_id ON posts(type, tag, id DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_clicks ON posts(type, clicks DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON analytics(event, date);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics(path);
```

#### Fields Breakdown (`posts`)
- `type`: `blog` | `reading` | `thought`
- `tag`: `'tech'` | `'non-tech'` (primarily used for `/readings` filtering)
- `title`: Display title of the entry
- `url`: External source URL (or substack link)
- `banner_url`: R2 / Static banner image URL
- `notes`: Markdown content (for reading notes or full thought text)
- `note_images`: JSON array string of embedded image assets
- `clicks`: Atomic click counter for engagement tracking

### 3.2 Upstash Redis Key Schema

| Key | Type | Description |
|---|---|---|
| `runner:global_highscore` | `INTEGER` | Global all-time highest score on Bunny Runner |
| `runner:total_games_played` | `INTEGER` | Atomic counter incremented on every game session start |
| `visitors:unique` | `SET` | Set of unique visitor fingerprint hashes (`scard` used for unique total) |

---

## 4. API Specifications & Server Route Architecture

### 4.1 Posts API (`/api/posts` & `/api/posts/[id]`)
- `GET /api/posts?type=reading&tag=tech&limit=20&page=0`
  - Fetches paginated posts filtered by `type` and optional `tag` using indexed D1 SQL queries.
- `POST /api/posts`
  - Protected by `admin_session` cookie verification. Inserts a new post record and returns the generated entity.
- `GET /api/posts/[id]`
  - Returns a single post by primary key.
- `PATCH /api/posts/[id]`
  - Protected by `admin_session`. Updates mutable fields (`title`, `url`, `tag`, `notes`, `banner_url`, `note_images`).
- `DELETE /api/posts/[id]`
  - Protected by `admin_session`. Deletes post record.
- `POST /api/posts/[id]/click`
  - Public atomic increment of the `clicks` counter in D1.

### 4.2 Image Upload & Client-Side Compression Pipeline (`/api/upload`)
- **Client Pre-Processing (`src/lib/imageCompression.ts`)**:
  - Automatically intercepts user file inputs (PNG, JPG, BMP).
  - Uses an offscreen HTML5 Canvas to re-encode images to `image/webp` with 85% quality and maximum 1920px width before network dispatch.
  - Drops payload sizes by ~70–80% before reaching Cloudflare.
- **Server Handler (`src/app/api/upload/route.ts`)**:
  - Receives `multipart/form-data`.
  - Generates a UUID filename with sanitized `.webp` extension.
  - Puts the object into the R2 bucket (`assh`) and returns `{ publicUrl, filename }`.

### 4.3 Analytics API (`/api/analytics`)
- `POST /api/analytics`:
  - Ingests telemetry event (`page_visit`, `blog_click`, etc.) with `path`, `ref_id`, `country` (from `cf-ipcountry`), and normalized `referrer` (from `referer` header).
- `GET /api/analytics?range=30d`:
  - Protected by `admin_session`.
  - Queries D1 for daily visits/clicks timeline, top countries, top referrers, top pages, top content.
  - Queries Redis for `runner:total_games_played` to feed the admin KPI summary.

### 4.4 Game Highscore API (`/api/game/highscore`)
- `GET /api/game/highscore`:
  - Queries Redis for `runner:global_highscore` and `runner:total_games_played`. Returns `{ highscore, totalGamesPlayed }`.
- `POST /api/game/highscore`:
  - Body `{ action: 'start' }`: Atomically increments `runner:total_games_played`.
  - Body `{ score: number }`: Atomically compares with `runner:global_highscore`, sets new value if score > current highscore, and increments `runner:total_games_played`.

### 4.5 Admin Authentication (`/api/admin/auth`)
- `POST /api/admin/auth`:
  - Compares provided password against `ADMIN_PASSWORD` (env).
  - Sets a 30-day `admin_session` cookie (`HttpOnly`, `SameSite: 'lax'`, `Path: '/'`, `Secure` in production).
- `GET /api/admin/auth`:
  - Validates active cookie session for client auth gates (`AdminGate.tsx`).
- `DELETE /api/admin/auth`:
  - Clears `admin_session` cookie for secure logout.

---

## 5. Bunny Runner Game Engine Architecture

The Chrome Dino-inspired **Bunny Runner Game** is embedded directly into the platform footer (`src/components/footer-game/`).

```
src/components/footer-game/
├── types.ts              # TypeScript interfaces (Player, Obstacle, Particle, etc.)
├── constants.ts          # Canvas coordinate constants, theme tokens, physics values
├── physics.ts            # Non-repeating spawner, collision math, particle generators
├── renderUtils.ts        # Pure 2D canvas drawing routines (clouds, cacti, birds, particles)
├── audio.ts              # Web Audio API procedural sound synthesizer
├── ShareScoreModal.tsx   # Canvas scorecard PNG generator & social sharing dialog
├── RunnerGame.tsx        # React animation loop host, state machine, event listeners
├── FooterGameSection.tsx # Seamless transparent footer container wrapper
└── index.ts              # Public module exports
```

### 5.1 Architecture & Real-Time Paradigm
- **Not WebSockets**: The game runs entirely on a **deterministic client-side 60fps HTML5 Canvas animation loop** via `requestAnimationFrame`. WebSockets are intentionally omitted to avoid persistent connection overhead on serverless workers.
- **Persistence & Synchronization**: REST API endpoints (`/api/game/highscore`) handle asynchronous synchronization for global high scores and session play counts.

### 5.2 Physics Engine & Collision Detection
- **Coordinate Space**: Virtual `1000px × 240px` (or user-tuned scale `1660px × 280px`) aspect-locked canvas that scales responsively across desktop and mobile screens.
- **Physics Coefficients**:
  - `INITIAL_SPEED`: `9.8`
  - `MAX_SPEED`: `18.5`
  - `SPEED_ACCELERATION`: `0.0016 / frame`
  - `GRAVITY`: `1.35` (crisp, non-floaty vertical drop)
  - `JUMP_FORCE`: `-18.2`
  - `FAST_FALL_FORCE`: `2.4` (triggered on duck / down arrow / mobile duck touch)
- **Collision Math (`physics.ts`)**:
  - Axis-Aligned Bounding Box (AABB) intersection with tailored inset hitboxes (`paddingX = 10`, `paddingY = 8`) to ensure fair, forgiving gameplay feel.

### 5.3 Non-Repeating Procedural Spawning (`physics.ts`)
- **Weighted Filter Pool**: Prevents identical obstacle types from spawning consecutively 3 times in a row.
- **Obstacle Varieties**:
  - `cactus-small` (ground obstacle, scaled stem with arms)
  - `cactus-tall` (higher ground hurdle requiring precise jump timing)
  - `cactus-group` (wide cluster of 3 cacti requiring prolonged airtime)
  - `bird-low` (mid-air flying obstacle that can be jumped over or ducked under)
  - `bird-high` (high flying obstacle designed to punish over-jumping)
- **Rhythm Jitter (`getRandomObstacleDistance`)**: Randomizes gap distances between tight double hurdles and generous open recovery spans.

### 5.4 Character Sprite State Machine
Sprites are loaded from `/games/` and switched frame-by-frame:
- `idle`: `/games/initial.webp`
- `run start`: `/games/just_started.webp` (first 20 frames of active run)
- `running stride`: Alternates every 6 frames between `/games/r1.webp` and `/games/r2.webp`
- `jumping`: `/games/hump.webp`
- `gameover`: `/games/dead.webp`

### 5.5 Procedural Web Audio Synthesizer (`audio.ts`)
Zero MP3/WAV network dependencies. Uses browser native `AudioContext`:
- **Jump**: Sine wave exponential ramp (`260Hz -> 540Hz`, 120ms).
- **Score Milestone (every 100 pts)**: Dual triangle chime (`587.33Hz`, `880Hz`).
- **Game Over**: Sawtooth downward pitch sweep (`240Hz -> 70Hz`, 280ms).
- **High Score Record Celebration**: 4-note ascending major chord (`C5, E5, G5, C6`).

### 5.6 Social Share & Scorecard Canvas Generator (`ShareScoreModal.tsx`)
- Generates a standalone **1200×630 OpenGraph-style PNG** on an offscreen canvas.
- Composites `/open-graph.png` background, dark vignette, green sparkle, bold white score + lime `PTS`, and a circular green-ringed bunny avatar.
- Provides 1-click posting to **X (Twitter)** with formatted multiline text and 1-click PNG card downloads.

---

## 6. Analytics & Telemetry Subsystem

### 6.1 Telemetry Collection Pipeline
1. Client components trigger `POST /api/analytics` with `{ event, path, ref_id }` on page mount or user click.
2. The Cloudflare Worker extracts:
   - `cf-ipcountry` (ISO country code).
   - `referer` header (parsed via `src/lib/referrer.ts` into categories: `google`, `twitter`, `github`, `linkedin`, `direct`, etc.).
   - Timestamp and date.
3. Event is inserted into the D1 `analytics` table.

### 6.2 Real-Time vs Aggregated Metrics
- **Real-Time Counters (Redis)**:
  - Total Unique Visitors (`visitors:unique` Redis set).
  - Total Games Played (`runner:total_games_played` Redis integer).
- **Aggregated Analytics (D1 SQL)**:
  - Rolling timeframes (`7d`, `30d`, `90d`, `all`).
  - Daily page views and content clicks timeline.
  - Top 10 countries and top 10 referrers.
  - Top 5 most visited pages and top 5 highest-engagement blog/reading entries.

### 6.3 Admin Analytics Interface (`src/components/admin/analytics/`)
- `AnalyticsSummaryCards.tsx`: 4 primary KPI cards:
  1. Total Visits
  2. Total Clicks
  3. Total Games Played (live from Redis)
  4. Top Country
- `AnalyticsCharts.tsx`: Recharts time-series line chart and breakdown tables.
- `ContentPerformance.tsx`: Top blogs, readings, and thoughts sorted by engagement.

---

## 7. Project Structure & Dependency Graph

```
cv.aash7/
├── .open-next/                 # OpenNext build artifacts & worker bundle (gitignored)
├── .opencode/                  # Custom agent skills & workflows
│   └── skills/devtools-meme/   # DevTools easter-egg skill definition
├── .agents/skills/             # Workspace agent skills mirror
├── public/
│   ├── games/                  # Bunny runner animation sprites (webp/png)
│   ├── defaults/               # Fallback gradient banner images (1.png–7.png)
│   ├── open-graph.png          # Portfolio social preview & card background asset
│   └── p1.jpg, profile.png     # Author profile imagery
├── schema.sql                  # D1 SQLite schema definition & indexes
├── wrangler.toml               # Cloudflare Worker, D1, R2, and secret bindings
├── package.json                # Project dependencies & scripts
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard with password auth
│   │   ├── api/                # Edge API routes (posts, analytics, game, upload, etc.)
│   │   ├── blogs/              # Blog listing & dynamic detail pages (/blogs/[id])
│   │   ├── readings/           # Reading list with All/tech/non-tech filtering
│   │   ├── reading/[id]/       # Detailed reading notes page with Markdown rendering
│   │   ├── thoughts/           # Thought micro-posts list
│   │   ├── layout.tsx          # Root layout with DevtoolsMeme easter egg
│   │   └── page.tsx            # Main portfolio landing page
│   ├── components/
│   │   ├── admin/              # Admin forms, gates, analytics widgets
│   │   ├.......
│   └── lib/
│       ├── analytics.ts        # D1 event logger
│       ├── db.ts               # D1 SQL query abstraction & fallback handling
│       ├── imageCompression.ts # Client-side HTML5 canvas WebP converter
│       ├── posts.ts            # Post types & default banner resolver
│       ├── r2.ts               # S3 presigned URL generator for R2
│       ├── redis.ts            # Upstash Redis client singleton
│       └── visitors.ts         # Redis unique visitor tracking
```

---

## 8. Build, Deployment & Operations

### 8.1 Local Development
```bash
# Start Next.js local development server with local D1 SQLite state
pnpm dev

# Execute local D1 database migrations
npx wrangler d1 execute aash7-db --local --file=./schema.sql
```

### 8.2 Production Build & Cloudflare Deployment
```bash
# Type check & lint
npx tsc --noEmit
pnpm lint

# Build OpenNext Cloudflare bundle
pnpm build

# Deploy to Cloudflare Workers
npx wrangler deploy

# Execute remote production D1 schema updates
npx wrangler d1 execute aash7-db --remote --file=./schema.sql
```

### 8.3 Important Operational Invariants for AI Agents
1. **Response Conciseness**: User rule specifies keeping responses concise (1–3 lines).
2. **File Size Limit**: Keep modular files strictly under ~250 lines.
3. **Canvas Transparency**: The footer game canvas must always render with `background: 'transparent'` to blend seamlessly into light/dark portfolio themes.
4. **Non-Blocking Game Input**: Canvas space/arrow key listeners must only intercept events when `status === 'running'` to prevent hijacking normal page scrolling.
5. **Client WebP Pipeline**: All image uploads through admin components must pass through `uploadImageWithWebp()` in `src/lib/imageCompression.ts`.
