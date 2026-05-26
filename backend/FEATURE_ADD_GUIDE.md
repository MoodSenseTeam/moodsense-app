# Adding a feature

## Workflow

1. **DTO first** — define the Zod schema in `src/features/v1/<feature>/<feature>.dto.ts`
2. **Use-case** — implement in `<feature>.usecase.ts`. Depends on interfaces, not concrete classes. Use in-memory mocks to test.
3. **Controller** — parse DTO, call use-case, return response. Keep thin.
4. **Route** — create a Router with the route handler in `<feature>.route.ts`
5. **Wire** — register in `src/bootstrap/create-auth-module.ts`
6. **Test** — add tests under `tests/`, then run `pnpm test`

## Patterns

- Interfaces live in `src/shared/ports/` or `src/infrastructure/security/`; import from there, don't redefine
- Use-cases and controllers are classes with a single public method (`execute` / `handle`)
- Repository methods are concrete on `PrismaUserRepository` and declared on `UserRepository` — keep both in sync
- Add new Prisma models in `prisma/schema.prisma`, then regenerate the client

## Before committing

- `pnpm test` passes
- `npx tsc --noEmit` clean
