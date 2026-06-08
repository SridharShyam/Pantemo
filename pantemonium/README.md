# Pantemonium - Intelligent Apparel Fit Recommendation System

Pantemonium is a Micro-SaaS platform that eliminates sizing confusion by converting body measurements into accurate, brand-specific size recommendations with confidence scoring.

## Tech Stack
- **Backend:** Python 3.11+ with FastAPI
- **Database:** PostgreSQL 15+
- **ORM:** SQLAlchemy 2.0+ (Async)
- **Migrations:** Alembic
- **Deployment:** Docker + Docker Compose

## Setup Instructions

### Prerequisites
- Python 3.11+
- Docker & Docker Compose (for running PostgreSQL and the app in containers)
- OR Local PostgreSQL server

### 1. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` if you are running PostgreSQL locally on a different port/user.
Default for Docker: `postgresql+asyncpg://postgres:postgres@db:5432/pantemonium`
Default for Local: `postgresql+asyncpg://postgres:postgres@localhost:5432/pantemonium`

### 2. Run with Docker (Recommended)
```bash
docker-compose up --build
```
This will start the PostgreSQL database and the FastAPI backend.
The API will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

### 3. Run Locally
If you do not have Docker or prefer local development:

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start PostgreSQL:**
   Ensure your local PostgreSQL server is running and create the database `pantemonium`.

3. **Run Migrations:**
   ```bash
   alembic upgrade head
   ```
   *Note: If this is the first time, generate the migration first (requires running DB):*
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

4. **Seed Data:**
   Populate the database with initial brands, categories, and size charts:
   ```bash
   python scripts/seed_db.py
   ```

5. **Start Server:**
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure
- `app/api`: API route handlers
- `app/core`: Core business logic (Fit Engine, specific calculations)
- `app/models`: SQLAlchemy database models
- `app/schemas`: Pydantic schemas for request/response validation
- `tests`: Unit and integration tests

## Testing
Run tests using pytest:
```bash
pytest
```
