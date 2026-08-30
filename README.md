# ARGUS Research Lab

ARGUS is a full-stack research portal for students at the Faculty of Computers and Data Science. It provides curated research videos, paper summaries, a nested foundational knowledge hub, ARGUS publications, and a contact page.

Public visitors have read-only access. The `/admin` console lets the authorized administrator publish, edit, draft, and remove content from all four sections. The only authorized administrator is `emanelkhalily69@gmail.com`.

## Project structure

- `frontend/` — React 19, Vinext, TypeScript, Tailwind CSS, server routes, D1 content storage, and the animated eye interface.
- `backend/` — FastAPI, Pydantic, SQLite, the summarization endpoint, content endpoints, and automated tests.
- `assets/` — Original ARGUS visual assets.
- `docker-compose.yml` — Local container configuration for both applications.

The hosted frontend currently uses its own D1 database and server routes. The FastAPI service has a separate SQLite database, so they are independent data sources until the frontend is explicitly connected to FastAPI.

## Quick start

Requirements: Node.js 22.13+, Python 3.11+, or Docker Desktop.

Run both applications with Docker:

```powershell
docker compose up --build
```

Then open:

- Website: `http://localhost:3000`
- API documentation: `http://localhost:8000/docs`
- API health check: `http://localhost:8000/health`

For native development, run the services in separate terminals:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
python -m uvicorn app.main:app --reload --port 8000
```

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

## Configuration

Backend variables are documented in `backend/.env.example`:

- `ARGUS_CORS_ORIGINS`
- `ARGUS_DB_PATH`
- `ARGUS_ADMIN_TOKEN`

Frontend and email variables are documented in `frontend/.env.example`:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`

## Verification

```powershell
cd backend
python -m pytest -q
```

```powershell
cd frontend
npm run lint
npm run build
```

## Documentation

See [TECHNICAL_SUMMARY.md](TECHNICAL_SUMMARY.md) for the complete architecture, data model, local operating guide, security notes, and migration procedure for moving from ChatGPT Sites to an independent production provider.
