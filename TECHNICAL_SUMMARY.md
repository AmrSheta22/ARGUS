# ARGUS Technical Summary

## Overview

ARGUS is a multi-page research portal for students at the Faculty of Computers and Data Science. It publishes lab-curated videos, paper summaries, foundational knowledge paths, and ARGUS research work. Public visitors can read content but cannot submit or modify it.

The application also provides a contact form, a Discord invitation, and a protected administration console. The only administrator is `emanelkhalily69@gmail.com`.

## Architecture

The repository uses a single-database architecture:

```text
Browser
   │
   ▼
Vinext / React frontend
   │ server-to-server HTTP
   ▼
FastAPI
   │
   ▼
SQLite: backend/data/argus.db
```

FastAPI is the only component that accesses SQLite. Frontend pages call FastAPI through `frontend/lib/api.ts`, while the frontend `/api/content` and `/api/contact` routes act as protected browser-facing gateways.

This avoids competing copies of content and ensures that edits made in the administration console are read from the same database used by every public page.

## Technology stack

### Frontend

- React 19
- Vinext and Vite
- TypeScript
- Tailwind CSS 4
- OpenAI Sites integration
- Prettier and ESLint

### Backend

- Python 3.11+
- FastAPI
- Pydantic
- Uvicorn
- SQLite
- Pytest and HTTPX

## Repository layout

```text
argus-website/
├── assets/                 Original ARGUS visual assets
├── backend/
│   ├── app/
│   │   ├── main.py         FastAPI routes and authorization
│   │   ├── database.py     All SQLite access
│   │   ├── schemas.py      Request and response models
│   │   └── summarizer.py   Deterministic paper summarizer
│   ├── data/argus.db       Local SQLite database
│   └── tests/
├── frontend/
│   ├── app/                Pages and browser-facing API routes
│   ├── components/         Reusable interface components
│   ├── lib/api.ts          Typed FastAPI client
│   ├── lib/auth.ts         ChatGPT identity and admin authorization
│   └── public/             Logo, eye frames, and social preview
├── docker-compose.yml
└── README.md
```

## Pages

- `/` — animated welcome screen.
- `/videos` — curated YouTube resources.
- `/summarize` — ARGUS-authored paper summaries.
- `/knowledge` — expandable foundational knowledge paths.
- `/work` — ARGUS research archive.
- `/contact` — Discord and contact form.
- `/admin` — administrator-only editorial console.

## SQLite data model

The single SQLite database contains:

### `content`

- `section`: `videos`, `summaries`, `knowledge`, or `work`
- `title`
- `subtitle`
- `description`
- `url`
- `tags`
- `published`
- `sort_order`
- creation and update timestamps

The index `idx_content_section_published` supports the public section queries and editorial ordering.

### `contact_messages`

- sender name
- sender email
- subject
- message
- creation timestamp

The index `idx_messages_created_at` supports the administrator inbox ordering.

## Authentication and authorization

Sites supplies the current signed-in visitor through `oai-authenticated-user-email`. The frontend checks this server-side and permits administration only when the value matches `emanelkhalily69@gmail.com`.

The browser never receives the FastAPI admin token. After verifying the administrator, the frontend server route attaches `ARGUS_ADMIN_TOKEN` to the server-to-server FastAPI request.

FastAPI compares the token using a timing-safe comparison. Administrative content mutations and contact-message retrieval are rejected without the correct bearer token.

The local administrator fallback exists only when `NODE_ENV` is `development`.

## Running with Docker

Requirements: Docker Desktop and Docker Compose.

```powershell
cd E:\repos\argus-website
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- FastAPI documentation: `http://localhost:8000/docs`
- FastAPI health check: `http://localhost:8000/health`

Docker stores SQLite in the named `argus-data` volume, so content survives container recreation.

To stop the stack:

```powershell
docker compose down
```

Do not add `-v` unless the SQLite data should also be deleted.

## Running without Docker

### Backend

```powershell
cd E:\repos\argus-website\backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"

$env:ARGUS_CORS_ORIGINS = "http://localhost:3000"
$env:ARGUS_DB_PATH = ".\data\argus.db"
$env:ARGUS_ADMIN_TOKEN = "replace-with-a-long-random-secret"

python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

Use a second terminal and give it the same admin token:

```powershell
cd E:\repos\argus-website\frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

The frontend requires:

```dotenv
ARGUS_API_URL=http://localhost:8000
ARGUS_ADMIN_TOKEN=replace-with-the-same-secret-used-by-fastapi
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`ARGUS_API_URL` and `ARGUS_ADMIN_TOKEN` are server-only. They must not use the `NEXT_PUBLIC_` prefix.

## API

### Public

- `GET /health`
- `GET /api/videos`
- `GET /api/knowledge`
- `GET /api/papers`
- `GET /api/content`
- `POST /api/contact`
- `POST /api/summarize`

### Administrative

- `GET /api/content?drafts=true`
- `POST /api/admin/content`
- `PATCH /api/admin/content/{content_id}`
- `DELETE /api/admin/content/{content_id}`
- `GET /api/admin/messages`

Administrative requests require:

```http
Authorization: Bearer <ARGUS_ADMIN_TOKEN>
```

## Validation

Backend:

```powershell
cd backend
python -m pytest -q
python -m ruff check .
```

Frontend:

```powershell
cd frontend
npm run format:check
npm run lint
npm run build
```

## Production deployment

The frontend can remain on ChatGPT Sites, but FastAPI must be deployed to a provider that supports Python containers and persistent storage. Suitable examples include Render, Railway, Fly.io, Azure, or AWS.

For SQLite production hosting:

1. Run one FastAPI application instance.
2. Attach a persistent disk.
3. Set `ARGUS_DB_PATH` to a location on that disk.
4. Configure automatic backups for the database file.
5. Set a long random `ARGUS_ADMIN_TOKEN`.
6. Set `ARGUS_CORS_ORIGINS` to the exact frontend origin.
7. Set the Sites secret `ARGUS_API_URL` to the public HTTPS FastAPI URL.
8. Set the Sites secret `ARGUS_ADMIN_TOKEN` to the same value.

SQLite supports this small lab workload well when FastAPI runs as a single instance. If the application later needs multiple API replicas or frequent concurrent writes, migrate the same API layer to managed PostgreSQL.

## Cutover from the current hosted D1 version

The currently published Sites version still uses its existing D1 database. Do not replace it with the new frontend until FastAPI has a public HTTPS URL.

Use this cutover sequence:

1. Deploy FastAPI with persistent SQLite storage.
2. Export the current D1 `content` and `contact_messages` records.
3. Import them into the production SQLite database.
4. Configure the two server-only Sites variables.
5. Verify public content, admin editing, drafts, deletion, and contact messages.
6. Deploy the refactored frontend.
7. Keep a backup of both databases during the rollback window.

## Production checklist

- Replace demonstration records with verified ARGUS content.
- Keep the admin token out of browser code and source control.
- Back up SQLite regularly and test restoration.
- Restrict CORS to the production Sites origin.
- Configure Resend secrets and verify its sender domain.
- Add contact-form rate limiting and spam protection.
- Run tests, formatting, lint, and the production build before deployment.
