# Developer Guide

## Workspace Setup
This is a Turborepo monorepo.
- `apps/api`: Go Fiber backend.
- `apps/web`: Next.js 15 frontend.

### Prerequisites
- Node.js 20+ & pnpm
- Go 1.24+
- Docker & Docker Compose

### Local Development
1. Clone the repository.
2. Run `pnpm install` at the root.
3. Start the infrastructure (Postgres, Redis, Meilisearch):
   ```bash
   docker compose up -d postgres redis meilisearch
   ```
4. Run the API:
   ```bash
   cd apps/api
   go run cmd/api/main.go
   ```
5. Run the Frontend:
   ```bash
   cd apps/web
   pnpm run dev
   ```

### Testing Strategy
- **Frontend E2E:** Cypress is configured in `apps/web/cypress`. Run via `pnpm run test:e2e`.
- **Backend Unit:** Run `go test ./...` in the API directory.
- **Mocking Providers:** By default, `.env.example` sets `AI_PROVIDER=mock`. To test real AI models, change this to `openai` and provide an `OPENAI_API_KEY`.

### Making Changes to Database
1. Update GORM structs in `apps/api/internal/models`.
2. Update raw DDL in `database/schema.sql` (Used for fresh Docker spins).
