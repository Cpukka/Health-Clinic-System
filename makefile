# Makefile
.PHONY: help build up down logs restart shell migrate generate studio

help:
	@echo "Available commands:"
	@echo "  make build      - Build Docker images"
	@echo "  make up         - Start containers"
	@echo "  make down       - Stop containers"
	@echo "  make logs       - View container logs"
	@echo "  make restart    - Restart containers"
	@echo "  make shell      - Open shell in app container"
	@echo "  make migrate    - Run Prisma migrations"
	@echo "  make generate   - Generate Prisma client"
	@echo "  make studio     - Open Prisma Studio"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

shell:
	docker-compose exec app sh

migrate:
	docker-compose exec app npx prisma migrate dev

generate:
	docker-compose exec app npx prisma generate

studio:
	docker-compose exec app npx prisma studio