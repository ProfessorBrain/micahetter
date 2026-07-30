COMPOSE := docker compose -f infra/docker-compose.yml

.PHONY: bootstrap db migrate ingest-sample ingest-production compute-metrics dev refresh-public-data static-test test lint e2e qa-report down

bootstrap:
	$(COMPOSE) build
	$(COMPOSE) up -d db

db:
	$(COMPOSE) up -d db

migrate:
	@echo "Database migrations begin in Epic 2."

ingest-sample:
	@echo "Fixture ingestion begins in Epic 2."

ingest-production:
	@echo "Production ingestion begins in Epics 3 and 4."

compute-metrics:
	@echo "Metric computation begins in Epic 5."

dev:
	$(COMPOSE) up --build

refresh-public-data:
	node scripts/build-public-data.mjs

static-test:
	node --check app.js
	node --check sample-data.js
	node --check public-data.js
	node --check scripts/build-public-data.mjs
	node --test tests/static-site.test.mjs

test: static-test
	$(COMPOSE) run --rm --no-deps api pytest
	$(COMPOSE) run --rm --no-deps web npm run test

lint:
	$(COMPOSE) run --rm --no-deps api ruff check app tests
	$(COMPOSE) run --rm --no-deps web npm run lint

e2e:
	cd apps/web && npm run e2e

qa-report:
	@echo "QA report generation begins in Epic 3."

down:
	$(COMPOSE) down
