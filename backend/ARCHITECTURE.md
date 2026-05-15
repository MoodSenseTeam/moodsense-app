# Moodsense Backend — Architecture Overview

This document summarizes the main architectural patterns used in the backend and points to concrete examples in the codebase. The goal is to make it easy for contributors to understand where to add new features while preserving separation of concerns and testability.

Core ideas
- Vertical slices: features are organized by feature (`src/features/v1/...`) and contain their route, controller, use-case, DTOs, and repository.
- Domain / DDD: business rules, value objects, and entities live under `src/domain` and are unit-tested in `tests/domain`.
- Hexagonal / Ports-and-Adapters: the domain and use-cases depend on abstract ports (interfaces). Concrete adapters (e.g., Prisma) implement those ports. This keeps business logic decoupled from infrastructure.

Layers and responsibilities
- Domain (`src/domain`)
  - Entities, value objects, domain-specific rules (examples: `src/domain/user/user.ts`, `src/domain/user/email.vo.ts`).
  - Pure, framework-agnostic code — easy to unit test.
- Application / Use-cases (`src/features/.../*.usecase.ts`)
  - Orchestrate domain logic and persistence through repository interfaces.
  - Contain the *application* behaviour (e.g., `CreateUserUseCase`).
- Ports / Repositories (`src/features/.../user.repository.ts`)
  - Define interfaces (contracts) used by use-cases.
- Adapters / Infra (Prisma adapter)
  - Implement the repository interfaces and map to DB models (e.g., `src/features/v1/auth/create-user/prisma-user.repository.ts`).
- HTTP layer / Controllers (`create-user.controller.ts`) and Routes
  - Validate DTOs, call use-cases, format responses. Controllers are thin adapters.
- Composition / Bootstrap (`src/bootstrap/*.ts`)
  - Wire dependencies in a single place (repositories, hashers, controllers), keeping `app` wiring explicit.

Testing strategy
- Domain tests for pure logic (`tests/domain/*`).
- Use-case tests with small in-memory or mocked repositories (`tests/*usecase.test.ts`).
- Lightweight controller tests where helpful; keep integration tests focused and fast.

Guidance for adding a new feature
1. Design domain model and write unit tests under `src/domain` / `tests/domain`.
2. Add a use-case under `src/features/<version>/<feature>` and test it with an in-memory repository.
3. Add repository interface and a Prisma adapter if persistence is required.
4. Add DTOs and controller and wire in `src/bootstrap`.
5. Run `pnpm test` in `backend/` and ensure all tests pass.

Examples
- Domain entity: `src/domain/user/user.ts`
- Use-case: `src/features/v1/auth/create-user/create-user.usecase.ts`
- Repo adapter: `src/features/v1/auth/create-user/prisma-user.repository.ts`
- Bootstrap wiring: `src/bootstrap/create-auth-module.ts`