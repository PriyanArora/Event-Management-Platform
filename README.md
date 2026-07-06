<div align="center">

<img src="image.png" alt="Qeue logo" width="320" />

**Event management, built as small microservices.**

Organizers publish events. Attendees register. Capacity never oversells.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-topic%20exchange-FF6600)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

</div>

# Qeue

Qeue is a Java and Spring event-management platform for organizers and attendees. It is a learning portfolio project built as a small microservice system.

The product goal is simple: organizers can build and publish events, attendees can register without overselling capacity, and organizers can run basic event operations such as attendee management, check-in, analytics, notifications, and surveys.

## Table of Contents

- [Current Feature Scope](#current-feature-scope)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Repository Layout](#repository-layout)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Run The Full Local App](#run-the-full-local-app)
- [Run The UI In Vite Dev Mode](#run-the-ui-in-vite-dev-mode)
- [Run Services Individually](#run-services-individually)
- [Verification](#verification)
- [API Contracts](#api-contracts)
- [Local Kubernetes](#local-kubernetes)
- [Configuration Notes](#configuration-notes)
- [CI](#ci)
- [Recent Additions](#recent-additions)

## Current Feature Scope

The active implementation covers the full event-platform scope:

- Event builder fields: format, category, banner image, venue, timezone, start and end time, capacity, and a draft, publish, and cancel lifecycle.
- Registration questions and stored attendee answers.
- Registration types with per-type capacity enforcement.
- Agenda, sessions, and speakers.
- Organizer attendee list with status, type, and search filters, sorting, registration detail data, and CSV export.
- Ticket-code check-in with hashed ticket codes.
- Notification templates and notification logs for registration and check-in events.
- Event analytics: capacity, confirmed and cancelled registrations, available seats, check-ins, no-shows, and a per-type breakdown.
- Post-event survey definitions and attendee survey submissions.
- OpenAPI and AsyncAPI contracts for the HTTP APIs and RabbitMQ event messages.

Public event pages show total capacity. Remaining capacity is available to organizers through analytics. It is not exposed on public event detail because registration capacity is owned by `registration-service`, and the project avoids cross-service database reads.

## Architecture

Qeue is a set of small Spring Boot services behind a single API gateway, plus a React browser client. Services own their own PostgreSQL databases and never read each other's tables. They share state through RabbitMQ events backed by transactional outbox tables.

All active runtime code lives under `services/` and `web-client/`.

| Component | Port | Responsibility |
| --- | ---: | --- |
| `services/identity-service` | `4001` | User registration, login, BCrypt password hashing, JWT issuing, and `/api/auth/me`. |
| `services/gateway-service` | `8080` | Browser-facing API gateway, JWT validation, role checks, and downstream proxy routing. |
| `services/event-service` | `4000` | Event lifecycle, event setup, registration-question definitions, registration-type definitions, speakers, sessions, surveys, and the event outbox. |
| `services/registration-service` | `4002` | Registration correctness, event inventory projection, registration answers, tickets, check-in, attendee lists, CSV export, analytics, survey submissions, and the registration outbox. |
| `services/notification-worker` | `4003` | RabbitMQ notification consumer, template rendering, notification logs, and optional MailHog SMTP delivery. |
| `web-client` | Compose `3000`, Vite `5173` | React and Vite browser UI for public browsing, auth, organizer workflows, attendee registration, tickets, check-in, analytics, and surveys. |

## How It Works

Two flows are worth understanding before reading the code.

### Request flow

1. The browser talks only to the gateway at `http://localhost:8080`. It never calls the backend services directly.
2. The gateway validates the JWT, checks the caller's role, and proxies the request to the correct downstream service.
3. Each service trusts the gateway for identity and role context instead of trusting raw user-supplied headers.

This keeps the browser pointed at one API origin and keeps authentication logic in one place.

### Event flow

Services do not read each other's databases. When something happens in one service that another service needs to know about, the producing service writes the change and an event row to its own outbox table in the same database transaction. A publisher then forwards outbox rows to a RabbitMQ topic exchange.

- `event-service` publishes event lifecycle and setup changes through its outbox.
- `registration-service` keeps a local projection of event inventory from those events, enforces capacity locally, and publishes its own registration and check-in events through its outbox.
- `notification-worker` consumes registration and check-in events, renders a notification template, writes a notification log, and optionally delivers email to MailHog.

The transactional outbox makes event publication durable, so a crash between the database write and the broker publish does not silently drop an event.

## Repository Layout

```text
qeue/
  services/              Active Spring Boot services
    identity-service/
    gateway-service/
    event-service/
    registration-service/
    notification-worker/
  web-client/            React and Vite browser UI
  contracts/             API and event contracts
    openapi/             HTTP API specs (identity, event, registration)
    asyncapi/            RabbitMQ event message specs
  api-requests/          Manual HTTP request examples per service
  infra/                 Local Docker Compose stack and init scripts
  deploy/k8s/            Kubernetes manifests with Kustomize overlays
  .env.example           Local-only credentials and ports template
```

## Tech Stack

- Java 21 and Spring Boot 4 for the backend services.
- Spring MVC for the HTTP APIs.
- Spring Security for stateless JWT-protected gateway and identity routes.
- Spring Data JPA and Flyway for relational persistence and migrations.
- PostgreSQL 16 for the local service databases.
- H2 for most fast service tests, and Testcontainers PostgreSQL for registration concurrency tests.
- RabbitMQ topic exchange plus transactional outbox tables for cross-service event propagation.
- React 19, TypeScript, Vite, Tailwind CSS, and React Router for the UI.
- Docker Compose for the full local developer stack.
- Kubernetes manifests with Kustomize for local deployment shape validation.
- MailHog for local email inspection when notification delivery is enabled.

Why these tools:

- Docker Compose gives one command to run the complete local platform.
- Kubernetes manifests document the deployable service shape without requiring Kubernetes for daily development.
- RabbitMQ plus the outbox keeps event publication durable enough for a microservice learning project.
- Flyway keeps schema changes explicit and repeatable across local, test, and container runs.
- Gateway-owned JWT validation keeps browser clients pointed at one API origin and prevents direct trust in user-supplied service headers.

## Prerequisites

- Java 21.
- Docker with Docker Compose.
- Node 22 LTS or newer, and npm.
- `kubectl`, only if validating or applying Kubernetes manifests.
- `kind`, only if running the Kubernetes walkthrough.

## Run The Full Local App

From the repository root:

```sh
cp .env.example .env
docker compose -f infra/docker-compose.yml up --build
```

Open the UI:

```text
http://localhost:3000
```

Useful local URLs:

- Web UI: `http://localhost:3000`
- Gateway API: `http://localhost:8080`
- RabbitMQ management: `http://localhost:15672`
- MailHog: `http://localhost:8025`

Local seed accounts:

| Role | Email | Password |
| --- | --- | --- |
| Organizer | `organizer@qeue.local` | `LocalDevPassword1!` |
| Attendee | `attendee@qeue.local` | `LocalDevPassword1!` |

Stop the stack:

```sh
docker compose -f infra/docker-compose.yml down
```

Reset local database and broker volumes:

```sh
docker compose -f infra/docker-compose.yml down -v
```

## Run The UI In Vite Dev Mode

Use this when you want hot reload while the backend services run in Compose:

```sh
docker compose -f infra/docker-compose.yml up --build postgres rabbitmq mailhog identity-service event-service registration-service notification-worker gateway-service
cd web-client
npm install
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

Open:

```text
http://localhost:5173
```

## Run Services Individually

Start shared infrastructure first:

```sh
docker compose -f infra/docker-compose.yml up postgres rabbitmq mailhog
```

Then run services from their folders under `services/`. Example:

```sh
cd services/event-service
EVENT_DB_URL=jdbc:postgresql://localhost:5432/qeue_event \
EVENT_DB_USERNAME=qeue_event_user \
EVENT_DB_PASSWORD=change-me-local-only \
RABBITMQ_HOST=localhost \
./mvnw spring-boot:run
```

Use the same pattern for:

- `services/identity-service`
- `services/registration-service`
- `services/notification-worker`
- `services/gateway-service`

Required local secrets and connection values are listed in `.env.example`.

## Verification

Backend service tests:

```sh
cd services/identity-service && ./mvnw test
cd services/event-service && ./mvnw test
cd services/registration-service && ./mvnw test
cd services/gateway-service && ./mvnw test
cd services/notification-worker && ./mvnw test
```

The `services/registration-service` tests require Docker because they use Testcontainers PostgreSQL for capacity and concurrency checks.

Frontend checks:

```sh
cd web-client
npm test
npm run build
```

Kubernetes manifest validation:

```sh
kubectl kustomize deploy/k8s/overlays/local
```

## API Contracts

- Identity API: `contracts/openapi/identity-api.yaml`
- Event API: `contracts/openapi/event-api.yaml`
- Registration API: `contracts/openapi/registration-api.yaml`
- Platform events: `contracts/asyncapi/event-platform-events.yaml`

Manual request examples live in `api-requests/`.

## Local Kubernetes

Build images, load them into kind, apply manifests, and port-forward the web client:

```sh
docker build -t qeue/identity-service:local services/identity-service
docker build -t qeue/event-service:local services/event-service
docker build -t qeue/registration-service:local services/registration-service
docker build -t qeue/notification-worker:local services/notification-worker
docker build -t qeue/gateway-service:local services/gateway-service
docker build -t qeue/web-client:local web-client
kind load docker-image qeue/identity-service:local qeue/event-service:local qeue/registration-service:local qeue/notification-worker:local qeue/gateway-service:local qeue/web-client:local
kubectl apply -k deploy/k8s/overlays/local
kubectl -n qeue-local get pods
kubectl -n qeue-local port-forward svc/web-client 3000:80
```

Open `http://localhost:3000`.

## Configuration Notes

- `.env.example` contains local-only dummy credentials and ports.
- Keep real secrets out of Git.
- `IDENTITY_JWT_SECRET` must be at least 32 bytes.
- `RABBITMQ_LISTENER_ENABLED`, `EVENT_OUTBOX_PUBLISHER_ENABLED`, and `REGISTRATION_OUTBOX_PUBLISHER_ENABLED` are enabled in Compose so the full platform runs end to end. They default to `false` in `.env.example`.
- `MAILHOG_ENABLED=true` sends rendered notification emails to MailHog. Otherwise notification logs are still recorded with status `SKIPPED`.

## CI

CI is not enabled in this repository yet. A GitHub Actions workflow draft is maintained locally and will be wired in later. Once enabled it will run:

- Maven tests for all active backend services.
- npm test and a production build for `web-client`.
- Docker image builds.
- Kubernetes Kustomize validation.
- `git diff --check`.

## Recent Additions

Changes from the July 2026 simplification and hardening pass:

- **Removed the unused gRPC surface** in `registration-service` (stub service, proto, six build dependencies, port `9001` across Compose, Kubernetes, and `.env.example`). It duplicated the REST API and had no callers.
- **Outbox publishers now retry transient broker failures.** Previously any publish error marked the message `FAILED` permanently, silently dropping the event. Transient AMQP failures now stay `PENDING` and retry on the next scheduled run; only permanently unroutable messages (unknown event type) go `FAILED`. Applies to both `event-service` and `registration-service`.
- **Gateway timeouts and error mapping.** The proxy `RestTemplate` now has a 3s connect / 15s read timeout so a hung downstream service cannot pin gateway threads indefinitely; timeouts surface as `504` instead of a generic `502`.
- **Gateway passes `Content-Disposition` through**, so the registrations CSV export keeps its server-provided filename.
- **Web client UI theme refresh** built on Tailwind CSS.
- **Web client session expiry handling.** A `401` on an authenticated request now clears the stored token and flips the UI to logged-out, instead of leaving a stale session where every call fails until a manual reload.
- **Route-driven document titles** in the web client, so browser tabs and history show the page (`Browse events | Qeue`) rather than one static title.
- **Notification template rendering** fetches the active template once per delivery instead of twice.
- **Registration idempotency keys** use `crypto.randomUUID()` instead of `Math.random`, making collisions practically impossible.
