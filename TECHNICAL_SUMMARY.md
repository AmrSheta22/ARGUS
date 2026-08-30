# ARGUS Technical Summary

## 1. Project overview

ARGUS is a full-stack research-lab portal for students at the Faculty of Computers and Data Science. It presents material curated by the lab while keeping all public visitors read-only.

The site is divided into four editorial areas:

1. **Watch** — curated YouTube videos and learning material.
2. **Summaries** — summaries and links for research papers.
3. **Knowledge** — a nested, tagged foundational knowledge hub.
4. **Our Work** — research papers and projects produced by ARGUS.

It also includes a contact page, the ARGUS Discord invitation, a database-backed contact form, and a protected administration console. Only `emanelkhalily69@gmail.com` is authorized as an administrator. The administrator can return to the public interface through **Switch to user view**.

The homepage uses the ARGUS logo and a dense field of transparent eye animations. Pointer proximity opens multiple nearby eyes, while the navigation cards take visitors to the four dedicated sections.

## 2. Repository layout

```text
argus-website/
├── assets/                 Original visual assets
├── backend/                FastAPI application and SQLite database
│   ├── app/                API, schemas, data access, and summarizer
│   ├── data/               Local SQLite database
│   ├── tests/              Backend test suite
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/               Vinext/React web application
│   ├── app/                Pages and server API routes
│   ├── components/         Shared interface components
│   ├── db/                 Drizzle schema
│   ├── lib/                Authentication and D1 access
│   ├── public/             Logo and transparent eye frames
│   ├── .openai/            Sites hosting and D1 migrations
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 3. Technology stack

### Frontend

- React 19
- Next.js-compatible Vinext runtime
- TypeScript
- Vite
- Tailwind CSS 4
- Drizzle ORM
- Cloudflare Workers runtime and D1 bindings
- OpenAI Sites Vite integration

The frontend requires Node.js 22.13 or newer.

### Backend

- Python 3.11+
- FastAPI
- Pydantic
- Uvicorn
- Standard-library SQLite
- Pytest and HTTPX for testing

### External services

- ChatGPT Sites for the current hosted frontend
- Cloudflare D1-compatible storage supplied to the Sites application
- Resend for optional contact-form email forwarding
- Discord for the community invitation

## 4. Application pages

- `/` — animated welcome screen and primary navigation.
- `/videos` — curated YouTube resources.
- `/summarize` — published paper summaries.
- `/knowledge` — hierarchical tagged learning resources.
- `/work` — ARGUS research and publications.
- `/contact` — Discord link and contact form.
- `/admin` — administrator-only content management.

The frontend exposes server routes at `/api/content` and `/api/contact`. Public content requests return only published records. Administrative mutations are checked on the server.

## 5. Data model

The frontend D1 database contains two primary tables.

### `content`

Each record contains:

- `section`: `videos`, `summaries`, `knowledge`, or `work`
- `title`
- `subtitle`
- `description`
- `url`
- comma-separated `tags`
- `published` state
- `sort_order`
- creation and update timestamps

One demonstration record is seeded for each section.

### `contact_messages`

Each submission stores:

- sender name
- sender email
- subject
- message
- creation timestamp

If Resend is configured, the same submission is forwarded to `emanelkhalily69@gmail.com`. Otherwise, the site saves the message and opens a pre-addressed email draft for the visitor.

## 6. Current dual-database architecture

The repository currently contains two independent persistence paths:

```text
Hosted browser
    │
    ▼
Vinext frontend and server routes
    │
    ▼
Sites/Cloudflare D1

FastAPI
    │
    ▼
backend/data/argus.db
```

The live frontend reads and writes D1 through `frontend/lib/db.ts`. It does not currently call FastAPI for its content, even though `NEXT_PUBLIC_API_URL` exists in the environment configuration.

The FastAPI service maintains a separate SQLite database and provides its own content, contact, summarization, video, paper, and knowledge endpoints. Consequently, an item created in the frontend administration console is not automatically copied into the backend database.

Before a conventional production launch, one database should be selected as the authoritative source. The recommended long-term arrangement is described in the migration section.

## 7. Authentication and authorization

The Sites deployment supplies the verified user email through the `oai-authenticated-user-email` request header. The server compares the normalized value with:

```text
emanelkhalily69@gmail.com
```

During local development only, the frontend permits a local administrator when the Sites identity header is absent. This fallback is disabled in production because it is guarded by `NODE_ENV === "development"`.

The FastAPI administrative routes use a separate bearer token configured with `ARGUS_ADMIN_TOKEN`. That token must remain server-side and must never be embedded in browser JavaScript or committed to source control.

When changing hosting providers, the Sites identity header must be replaced with a real authentication integration. The new implementation must verify identity on the server and compare the verified email with the administrator allowlist. A browser-supplied email address must never be treated as proof of identity.

## 8. Running the complete project

### Prerequisites

- Node.js 22.13 or newer
- npm
- Python 3.11 or newer
- Docker Desktop, if using containers

### Docker workflow

From the repository root:

```powershell
docker compose up --build
```

The applications are exposed at:

- Frontend: `http://localhost:3000`
- FastAPI: `http://localhost:8000`
- OpenAPI documentation: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

Stop the stack with `Ctrl+C`, followed by:

```powershell
docker compose down
```

### Native backend workflow

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"

$env:ARGUS_CORS_ORIGINS = "http://localhost:3000"
$env:ARGUS_DB_PATH = ".\data\argus.db"
$env:ARGUS_ADMIN_TOKEN = "replace-with-a-long-random-secret"

python -m uvicorn app.main:app --reload --port 8000
```

The environment examples are stored in `backend/.env.example`. The application reads operating-system environment variables directly; copying the example file alone does not load its values automatically.

Run backend checks with:

```powershell
python -m pytest -q
python -m ruff check .
```

### Native frontend workflow

Open another terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Run frontend checks with:

```powershell
npm run lint
npm run build
```

## 9. Environment variables

### Backend

| Variable | Purpose |
| --- | --- |
| `ARGUS_CORS_ORIGINS` | Comma-separated frontend origins permitted to call FastAPI. |
| `ARGUS_DB_PATH` | Filesystem path for the backend SQLite database. |
| `ARGUS_ADMIN_TOKEN` | Secret bearer token protecting FastAPI administration routes. |

### Frontend

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Intended public FastAPI base URL; currently not used by the live content flow. |
| `NEXT_PUBLIC_SITE_URL` | Public frontend URL. |
| `RESEND_API_KEY` | Secret Resend API key used by the server-side contact route. |
| `CONTACT_FROM_EMAIL` | Verified sender identity used for contact email delivery. |

Secrets must be configured in the hosting provider's encrypted secret store, not in committed `.env` files.

## 10. FastAPI endpoints

### Public endpoints

- `GET /health`
- `GET /api/videos`
- `GET /api/knowledge`
- `GET /api/papers`
- `GET /api/content`
- `POST /api/contact`
- `POST /api/summarize`

The summarizer is deterministic and runs locally on the server. It can later be replaced by a model-backed implementation without changing the user-facing section structure.

### Administrative endpoints

- `POST /api/admin/content`
- `DELETE /api/admin/content/{content_id}`

Both require:

```http
Authorization: Bearer <ARGUS_ADMIN_TOKEN>
```

## 11. Current Sites deployment

The Sites project identifier and D1 binding are defined in `frontend/.openai/hosting.json`. The database binding is named `DB`.

ChatGPT Sites is already a production hosting service: every deployment URL is a production URL, and a custom domain can be attached from the Site settings. Moving providers is therefore optional if the only requirement is a branded domain.

Official documentation: [Creating and managing ChatGPT Sites](https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites).

## 12. Moving to an independent provider

### Lowest-friction option

The smallest migration is:

- Cloudflare Workers for the Vinext frontend
- Cloudflare D1 for frontend content
- Resend for contact delivery
- A container provider for FastAPI if the separate API is still required

This path requires the least frontend change because the application already uses the Cloudflare Vite plugin, Worker runtime bindings, and D1.

Migration procedure:

1. Create a Cloudflare account and Worker project.
2. Create a D1 database and bind it to the Worker under the name `DB`.
3. Apply the SQL files from `frontend/.openai/drizzle`.
4. Export the existing Sites D1 records and import them into the new D1 database.
5. Configure `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` as encrypted secrets.
6. Replace Sites authentication with Auth.js, Clerk, Auth0, Cloudflare Access, or an equivalent provider.
7. Retain the server-side administrator email allowlist.
8. Build and deploy the frontend Worker.
9. Connect the custom domain and update DNS.
10. Test public pages, administrator mutations, email delivery, and mobile layouts before retiring the Sites deployment.

The `.openai/hosting.json` project identifier belongs to Sites and should not be reused as credentials for the new host.

### Recommended long-term production architecture

For one authoritative database and simpler operational behavior, use:

```text
Browser
    │
    ▼
Vinext/React frontend
    │ HTTPS JSON API
    ▼
FastAPI
    │
    ▼
Managed PostgreSQL
```

Suggested responsibilities:

- Deploy the frontend to Cloudflare Workers, Vercel, or another Node-compatible platform.
- Deploy FastAPI to Render, Railway, Fly.io, Azure, AWS, or another container platform.
- Use managed PostgreSQL as the only production database.
- Move frontend content and contact operations into FastAPI.
- Update the frontend to call the FastAPI URL.
- Remove the frontend D1 access layer after migration.
- Configure FastAPI CORS with only the exact production frontend domain.
- Protect administration with verified sessions and server-side role checks.
- Add automated database backups, migrations, logging, and uptime monitoring.

SQLite may be retained temporarily only when FastAPI runs as a single instance with a persistent disk and regular backups. It is unsuitable for horizontally scaled instances when each instance receives its own filesystem.

## 13. Safe cutover procedure

1. Create the new infrastructure without changing the current live site.
2. Apply the database schema and import a test copy of the content.
3. Configure authentication, email, secrets, CORS, and HTTPS.
4. Test all public routes and administrator operations on a staging domain.
5. Announce a short editing freeze for the existing administration console.
6. Export and import the final database state.
7. Switch the domain's DNS records to the new frontend.
8. Monitor application errors, API health, email delivery, and database writes.
9. Keep the previous deployment intact during a defined rollback window.
10. Retire the old deployment only after the new service is stable and backed up.

## 14. Production checklist

- Replace all demonstration content with verified ARGUS records.
- Use a managed identity provider and server-side authorization.
- Generate a long random `ARGUS_ADMIN_TOKEN` if the token endpoints remain enabled.
- Restrict CORS to the deployed frontend domain.
- Store secrets only in the provider's secret manager.
- Verify the Resend sender domain.
- Configure database backups and migration automation.
- Add rate limiting and spam protection to the contact form.
- Add structured logs and error monitoring.
- Test keyboard navigation, reduced-motion behavior, and mobile layouts.
- Run backend tests, frontend linting, and production builds before every release.
