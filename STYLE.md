# Code Style Guide - EpochSend Backend

## Node.js / TypeScript (Backend Oracle)

- **Formatting:** Use Prettier with standard config.
- **Linting:** ESLint with recommended TypeScript rules.
- **Async:** Always use async/await. Avoid raw `.then()` chains. Always wrap external API or RPC calls in `try/catch` blocks.
- **Types:** Always define strict interfaces or Zod schemas for incoming payloads. No `any` types allowed.
- **Environment Variables:** All secrets and configuration must be loaded via `dotenv` and strictly validated at runtime startup.
- **Blockchain Interactions:** Isolate all `@stellar/stellar-sdk` logic into dedicated service files (e.g., `stellarService.ts`) to keep the Express routes clean.

## Project Conventions

### File Naming
- Routes: `*Routes.ts` (e.g., `webhookRoutes.ts`)
- Controllers: `*Controller.ts`
- Services: `*Service.ts`
- Middlewares: `*Middleware.ts`
- Types/Schemas: `*Schema.ts`

### Git Commits
- Follow modular commit philosophy.
- Commit after meaningful changes.
- Run `npm run build` before committing.

## Integrity Checks

- **Typecheck:** Always ensure `npx tsc --noEmit` passes before pushing.
- **Build:** `npm run build` should successfully output to the `dist/` directory.

---

*Always ensure the backend compiles correctly and safely connects to the Stellar network.*
