# Architecture

Vertical-slice with ports-and-adapters — each feature owns its route, controller, use-case, and DTO. Infrastructure is injected at bootstrap.

## Layers

```
src/
├── features/v1/<feature>/   # controller, use-case, DTO, route — one per feature
├── infrastructure/           # Prisma repo, password hasher, JWT token service
├── shared/ports/             # interfaces (UserRepository)
├── shared/utils/             # parseDurationToMs
├── bootstrap/                # dependency wiring (create-app, create-auth-module, create-prisma-client)
├── app.ts                    # createApp() → Express instance
└── server.ts                 # entry point — loads env, starts listening
```

Key points:
- **Use-cases** depend on interfaces (`UserRepository`, `PasswordHasher`, `TokenService`), not concrete classes
- **Controllers** are thin — validate DTOs, call use-case, format response
- **Infrastructure** classes implement the interfaces (`PrismaUserRepository`, `ScryptPasswordHasher`, `JwtTokenService`)
- **Bootstrap** wires everything explicitly in one place

## Adding a feature

1. Add DTO (Zod schema) under `src/features/v1/<feature>/`
2. Add use-case, controller, and route
3. Wire into `src/bootstrap/create-auth-module.ts`
4. Add tests under `tests/`

## Testing

| Layer | How |
|---|---|
| Use-cases | In-memory repository + mock hasher/token service |
| Infrastructure | Integration (e.g., `ScryptPasswordHasher`, `JwtTokenService`) |
| DTOs | Zod schema validation |
