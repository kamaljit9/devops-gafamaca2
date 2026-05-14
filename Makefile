.PHONY: up down logs test build scan monitor shell migrate backup help

# Default target
help:
	@echo "AppForge Platform CLI"
	@echo "Usage:"
	@echo "  make up        - Start all services (detached)"
	@echo "  make down      - Stop and remove all containers, networks, and volumes"
	@echo "  make logs      - Tail logs from the API service"
	@echo "  make test      - Run unit and integration tests"
	@echo "  make build     - Build images without cache"
	@echo "  make scan      - Run Trivy vulnerability scan on API image"
	@echo "  make monitor   - Start services with monitoring profile"
	@echo "  make shell     - Drop into API container shell"
	@echo "  make migrate   - Run database migrations"
	@echo "  make backup    - Trigger manual database backup"

up:
	docker compose up -d

down:
	docker compose down -v

logs:
	docker compose logs -f api

test:
	cd api && npm test

build:
	docker compose build --no-cache

scan:
	trivy image appforge-api:latest

monitor:
	docker compose --profile monitoring up -d

shell:
	docker compose exec api sh

migrate:
	docker compose exec api npm run migrate

backup:
	docker compose run --rm backup
