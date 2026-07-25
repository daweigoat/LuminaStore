# LuminaStore Deployment Guide

LuminaStore uses a containerized architecture orchestrated via Docker Compose, built natively in a GitHub Actions pipeline.

## Prerequisites
- A Linux server (Ubuntu 22.04+ recommended) with Docker and Docker Compose installed.
- Minimum specs: 4 vCPUs, 8GB RAM (due to Next.js SSR and Meilisearch).
- A domain name pointing to the server IP.

## Environment Variables
Before running, define these variables in a `.env` file on your production server:

```env
POSTGRES_USER=luminastore
POSTGRES_PASSWORD=your_secure_db_password
REDIS_PASSWORD=your_secure_redis_password
JWT_SECRET=your_long_secure_jwt_secret
MEILISEARCH_KEY=your_secure_meili_master_key
AI_PROVIDER=openai # (or gemini, claude, ollama, mock)
OPENAI_API_KEY=sk-xxxx
```

## Running Production

1. Transfer the `docker-compose.prod.yml` to your server.
2. Run the deployment:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

## CI/CD Pipeline
LuminaStore is configured with a GitHub Actions workflow (`production.yml`). 
Upon pushing to the `main` branch, the pipeline will:
1. Lint the frontend (pnpm) and backend (go vet).
2. Execute test suites.
3. Build optimal, multi-stage Docker images (`ghcr.io/luminastore/api:latest` and `ghcr.io/luminastore/web:latest`).
4. Push them to the GitHub Container Registry.

You can set up Watchtower on your production server to auto-pull the latest images and restart containers, achieving true Continuous Deployment.

## Health Checks & Monitoring
All services in `docker-compose.prod.yml` have native Docker `healthcheck` configurations. 
Logs are configured to use the `json-file` driver with log rotation (max 10 files, 200k each) to prevent disk exhaustion.
