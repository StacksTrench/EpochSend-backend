# EpochSend Backend — Issues & Roadmap 🛠️

**Live App:** [https://epochsend.vercel.app/](https://epochsend.vercel.app/)

This document is the authoritative engineering tracker for all backend and oracle service development on the EpochSend protocol. It captures what has been shipped, what is actively being built, and the complete roadmap to a production-grade, reliable oracle execution engine.

> **Standards:** Each issue carries — priority, labels, status, description, and granular task-level checkboxes grounded in the actual codebase state.
> Status: ✅ COMPLETED | 🔨 IN PROGRESS | ❌ PENDING | 🔜 FUTURE

---

## 🏗️ Module 1: Foundation & Configuration (BE-01 → BE-06)

### Issue #BE-01: Node.js & TypeScript Project Initialisation
**Status:** ✅ COMPLETED | **Priority:** CRITICAL
**Labels:** `backend`, `config`, `good-first-issue`
**Description:** Bootstrap the Node.js/TypeScript project with all core dependencies and development tooling.
- **Tasks:**
  - [x] Initialise `package.json` with `"type": "module"` for ESM compatibility
  - [x] Install core dependencies: `express`, `cors`, `helmet`, `dotenv`, `zod`, `@stellar/stellar-sdk`
  - [x] Install dev dependencies: `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/cors`, `@types/node`
  - [ ] Install ESLint and configure `.eslintrc.json` for TypeScript rules
  - [ ] Install Prettier and configure `.prettierrc` for consistent formatting
  - [ ] Add `npm run lint` and `npm run format` scripts to `package.json`

---

### Issue #BE-02: TypeScript Compiler Configuration Fix
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `config`, `bug`
**Description:** The current `tsconfig.json` has three critical bugs that cause compiled output to be placed inside `src/` (not `dist/`), include wrong JSX settings, and silently disable `@types/node`. These must be fixed before any further development.
- **Tasks:**
  - [ ] Un-comment `"rootDir": "./src"` — specifies where TypeScript looks for source files
  - [ ] Un-comment `"outDir": "./dist"` — ensures compiled output goes to `dist/`, not `src/`
  - [ ] Remove `"jsx": "react-jsx"` — this is a Node.js backend, not a React app
  - [ ] Change `"types": []` to `"types": ["node"]` — re-enable `@types/node` global declarations
  - [ ] Add `"include": ["src/**/*"]` to scope compilation to the `src/` directory only
  - [ ] Add `"exclude": ["node_modules", "dist"]` to prevent accidental compilation of dependencies
  - [ ] Verify `npm run build` produces output in `dist/` and `npm run start` (`node dist/index.js`) works

---

### Issue #BE-03: Compiled Artifact Cleanup & Gitignore
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `config`, `cleanup`
**Description:** Due to the `outDir` bug in Issue #BE-02, compiled artifacts (`index.js`, `index.d.ts`, `index.js.map`, `index.d.ts.map`) have leaked into `src/` and been committed to the repository. These must be removed and the `.gitignore` hardened.
- **Tasks:**
  - [ ] Delete `backend/src/index.js`, `backend/src/index.d.ts`, `backend/src/index.js.map`, `backend/src/index.d.ts.map`
  - [ ] Add `dist/` to `backend/.gitignore` (compiled output should never be committed)
  - [ ] Add `src/**/*.js`, `src/**/*.d.ts`, `src/**/*.js.map` to `.gitignore` (prevent future leaks)
  - [ ] Verify `git status` shows no compiled files after `npm run build`

---

### Issue #BE-04: Environment Variable Template (`.env.example`)
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `config`, `security`
**Description:** The `backend/` directory has no `.env.example` file, yet the README instructs contributors to `cp .env.example .env`. This is a broken onboarding experience. Every required environment variable must be documented.
- **Tasks:**
  - [ ] Create `backend/.env.example` with all required variables:
    - `PORT` — server listen port (default: 3000)
    - `NODE_ENV` — `development` | `production`
    - `API_SECRET_KEY` — shared secret for webhook authentication
    - `STELLAR_NETWORK` — `TESTNET` | `MAINNET`
    - `SOROBAN_RPC_URL` — Soroban RPC endpoint
    - `NETWORK_PASSPHRASE` — Stellar network passphrase string
    - `ORACLE_SECRET_KEY` — Stellar secret key for the oracle signing wallet
    - `ORACLE_PUBLIC_KEY` — Corresponding public key
    - `ESCROW_CONTRACT_ID` — Deployed EpochSend Soroban contract address
  - [ ] Add descriptive inline comments explaining each variable
  - [ ] Update README getting-started section to reference the correct file path
  - [ ] Add startup validation: throw a clear error on boot if any required variable is missing

---

### Issue #BE-05: Development Server Fix (ESM + TypeScript)
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `config`, `dx`
**Description:** The current `dev` script (`nodemon src/index.ts`) will fail at runtime because the project uses ESM (`"type": "module"`) combined with TypeScript, which requires explicit loader configuration. The dev server is currently non-functional without workarounds.
- **Tasks:**
  - [ ] Install `tsx` as a dev dependency (`npm install -D tsx`)
  - [ ] Update `dev` script to `"nodemon --exec tsx src/index.ts"`
  - [ ] Create `nodemon.json` with `{ "ext": "ts", "exec": "tsx src/index.ts" }`
  - [ ] Verify `npm run dev` starts without errors and reloads on `.ts` file changes
  - [ ] Update `start` script to `"node dist/index.js"` (post-build production run)

---

### Issue #BE-06: CI Pipeline Enhancements
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `devops`, `ci`
**Description:** The current CI pipeline only runs `npm ci` and `npm run build`. It is missing lint, typecheck, and test steps. Node.js version is also pinned to v18 — must be v20 to match local development.
- **Tasks:**
  - [x] `npm ci` — install locked dependencies
  - [x] `npm run build` — TypeScript compilation check
  - [ ] Update Node.js version from `'18'` to `'20'` in `ci.yml`
  - [ ] Add `npm run lint` step (after ESLint is configured in BE-01)
  - [ ] Add `npx tsc --noEmit` step — typecheck without emitting files
  - [ ] Add `npm test` step (after test framework is configured in BE-31)
  - [ ] Add caching for `node_modules` to speed up CI runs
  - [ ] Upload compiled `dist/` as a CI artefact for inspection

---

## 🌐 Module 2: Server Bootstrap & Security (BE-07 → BE-12)

### Issue #BE-07: Express Application Structure
**Status:** 🔨 IN PROGRESS | **Priority:** CRITICAL
**Labels:** `backend`, `architecture`
**Description:** Refactor `src/index.ts` from a monolithic file into a clean, modular structure that separates concerns: app configuration, route registration, and server startup.
- **Tasks:**
  - [ ] Create `src/app.ts` — Express app instance, middleware registration, route mounting
  - [ ] Keep `src/index.ts` as the server entry point only (`app.listen(PORT, ...)`)
  - [ ] Export `app` from `src/app.ts` for use in integration tests without starting the server
  - [ ] Move inline webhook route definition from `index.ts` to `src/routes/webhookRoutes.ts`
  - [ ] Register all routes via `app.use('/api', webhookRoutes)` in `app.ts`

---

### Issue #BE-08: CORS Policy Hardening
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `backend`, `security`
**Description:** The current `cors()` call with no configuration allows requests from any origin (`*`). This must be restricted to known frontend domains.
- **Tasks:**
  - [x] Install and apply `cors` middleware
  - [ ] Define allowed origins from environment variable (`ALLOWED_ORIGINS=https://epochsend.vercel.app,http://localhost:3000`)
  - [ ] Configure `cors({ origin: allowedOrigins, methods: ['GET', 'POST'], credentials: false })`
  - [ ] Reject requests from unlisted origins with `403 Forbidden`
  - [ ] Test CORS policy against frontend origin in development

---

### Issue #BE-09: Helmet Security Headers Configuration
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `backend`, `security`
**Description:** `helmet()` is applied with default settings. Configure it explicitly for the EpochSend API context.
- **Tasks:**
  - [x] Apply `helmet()` middleware to all routes
  - [ ] Configure `helmet.contentSecurityPolicy()` — restrict to API-appropriate policy
  - [ ] Enable `helmet.hsts()` for production (HTTPS enforcement)
  - [ ] Disable `helmet.xPoweredBy()` — hide Express version from response headers
  - [ ] Verify headers with a tool like `securityheaders.com` against the deployed endpoint

---

### Issue #BE-10: Rate Limiting Middleware
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `security`, `reliability`
**Description:** Without rate limiting, the webhook endpoint can be flooded with requests, exhausting server resources or draining the oracle wallet via repeated transaction submissions.
- **Tasks:**
  - [ ] Install `express-rate-limit`
  - [ ] Create `src/middlewares/rateLimiter.ts`
  - [ ] Apply a global limiter: 100 requests per 15 minutes per IP
  - [ ] Apply a stricter limiter to `POST /api/webhooks/trigger`: 10 requests per minute per API key
  - [ ] Return `429 Too Many Requests` with `Retry-After` header when limit is exceeded

---

### Issue #BE-11: `GET /health` — Enhanced Health Check
**Status:** 🔨 IN PROGRESS | **Priority:** MEDIUM
**Labels:** `backend`, `observability`
**Description:** The current health check only confirms the server is running. Extend it to verify critical dependencies are reachable.
- **Tasks:**
  - [x] Implement `GET /health` returning `{ status: "OK", service: "EpochSend Oracle Backend" }`
  - [ ] Add Soroban RPC reachability check (attempt `server.getLatestLedger()` — pass/fail)
  - [ ] Add oracle wallet balance check (confirm oracle has enough XLM for fees)
  - [ ] Return structured health payload: `{ status, rpc: "ok"|"error", wallet: "funded"|"low", uptime }`
  - [ ] Return `503 Service Unavailable` if RPC or wallet check fails

---

### Issue #BE-12: Request Logging Middleware
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `observability`
**Description:** Add structured request/response logging so every incoming webhook can be traced through the system.
- **Tasks:**
  - [ ] Install `morgan` or configure a structured logger (Winston/Pino)
  - [ ] Log: method, path, status code, response time, and (redacted) payload summary on every request
  - [ ] Redact sensitive fields (`triggerSecret`, API keys) from logs
  - [ ] Write to `stdout` in development, structured JSON in production
  - [ ] Add `requestId` header (`x-request-id`) to every response for tracing

---

## ⛓️ Module 3: Blockchain Integration (BE-13 → BE-18)

### Issue #BE-13: Soroban RPC Configuration Module
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `blockchain`, `config`
**Description:** Create `src/config/stellar.ts` — the central module that initialises the Soroban RPC server connection based on the active environment. Currently `src/config/` is an empty directory.
- **Tasks:**
  - [ ] Create `src/config/stellar.ts`
  - [ ] Initialise `SorobanRpc.Server` from `SOROBAN_RPC_URL` environment variable
  - [ ] Export `sorobanServer` singleton for use across the service layer
  - [ ] Export `networkPassphrase` constant from `NETWORK_PASSPHRASE` env var
  - [ ] Export `contractId` constant from `ESCROW_CONTRACT_ID` env var
  - [ ] Log `"[Stellar] Connected to <NETWORK> via <RPC_URL>"` on module load

---

### Issue #BE-14: Soroban RPC Connectivity Validation on Startup
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `blockchain`, `reliability`
**Description:** The current startup log says "Connected to Soroban Network" but makes zero actual network calls. Add a real connectivity check that fails loudly if the RPC is unreachable before accepting any requests.
- **Tasks:**
  - [ ] On server startup, call `sorobanServer.getLatestLedger()` to verify RPC connectivity
  - [ ] If the call succeeds: log the current ledger sequence number
  - [ ] If the call fails: log the error and exit the process (`process.exit(1)`)
  - [ ] Add a retry on startup failure: attempt 3 times with 5-second delays before exiting

---

### Issue #BE-15: Oracle Keypair Loading & Validation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `blockchain`, `security`
**Description:** The oracle's Stellar keypair is the signing authority for all contract execution transactions. It must be loaded securely from environment variables at startup with strict validation.
- **Tasks:**
  - [ ] In `src/config/stellar.ts`, load `ORACLE_SECRET_KEY` from `process.env`
  - [ ] Throw a startup error if `ORACLE_SECRET_KEY` is missing, empty, or not a valid Stellar secret key format (`S...`, 56 chars)
  - [ ] Create `Keypair.fromSecret(ORACLE_SECRET_KEY)` and export the `oracleKeypair`
  - [ ] Log the oracle's **public key** on startup (never the secret key)
  - [ ] Validate the oracle account exists and has a positive XLM balance on Testnet/Mainnet

---

### Issue #BE-16: Soroban Contract Client Initialisation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `blockchain`
**Description:** Set up the contract client that the service layer will use to build `execute_intent` transactions against the deployed EpochSend Soroban contract.
- **Tasks:**
  - [ ] Import `Contract` from `@stellar/stellar-sdk`
  - [ ] Initialise `new Contract(ESCROW_CONTRACT_ID)` in `src/config/stellar.ts`
  - [ ] Export `escrowContract` singleton for use by `stellarService.ts`
  - [ ] Validate `ESCROW_CONTRACT_ID` is a valid Soroban contract address format (`C...`, 56 chars)
  - [ ] Log `"[Contract] EpochSend contract loaded: <CONTRACT_ID>"` on startup

---

### Issue #BE-17: Transaction Builder & Simulation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `blockchain`, `service`
**Description:** Create `src/services/stellarService.ts` — the core service responsible for building, simulating, and submitting Soroban transactions that call `execute_intent` on the escrow contract.
- **Tasks:**
  - [ ] Create `src/services/stellarService.ts`
  - [ ] Implement `buildExecuteTransaction(intentId: string)`:
    - Fetch oracle account via `sorobanServer.getAccount(oracleKeypair.publicKey())`
    - Encode `intentId` as `xdr.ScVal.scvU64(BigInt(intentId))`
    - Build `InvokeHostFunctionOperation` via `escrowContract.call("execute_intent", intentIdArg)`
    - Wrap in `TransactionBuilder` with `fee: "100000"` and `networkPassphrase`
    - Simulate via `sorobanServer.simulateTransaction(tx)`
    - Assemble final transaction via `SorobanRpc.assembleTransaction(tx, sim)`
  - [ ] Return the assembled (unsigned) transaction for the signing step

---

### Issue #BE-18: Oracle Signing & Transaction Submission
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `blockchain`, `service`
**Description:** Complete the execution pipeline: sign the assembled transaction with the oracle keypair and submit it to the Stellar network.
- **Tasks:**
  - [ ] Implement `signAndSubmit(tx: Transaction) → Promise<string>` in `stellarService.ts`
  - [ ] Sign the transaction: `tx.sign(oracleKeypair)`
  - [ ] Submit via `sorobanServer.sendTransaction(tx)`
  - [ ] Poll for transaction completion: `sorobanServer.getTransaction(hash)` in a loop (max 30s)
  - [ ] Return the transaction hash on success
  - [ ] Throw typed errors: `SimulationError`, `SubmissionError`, `TimeoutError`
  - [ ] Log each step: build, simulate, sign, submit, confirmed

---

## 🔗 Module 4: Webhook Ingestion Pipeline (BE-19 → BE-25)

### Issue #BE-19: Zod Payload Schema Definition
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `validation`
**Description:** Define strict Zod schemas for all incoming webhook payloads. Malformed requests must be rejected before reaching any business logic.
- **Tasks:**
  - [ ] Create `src/middlewares/validate.ts`
  - [ ] Define `TriggerPayloadSchema` with Zod: `{ escrowId: z.string().min(1), triggerSecret: z.string().optional() }`
  - [ ] Export `validateBody(schema)` middleware factory that parses `req.body`, returns `400` with structured error details on failure
  - [ ] Apply `validateBody(TriggerPayloadSchema)` to `POST /api/webhooks/trigger`
  - [ ] Write unit tests for schema validation (valid payload, missing escrowId, extra fields)

---

### Issue #BE-20: API Key Authentication Middleware
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `security`, `middleware`
**Description:** All webhook trigger routes must be protected by API key authentication. Without this, anyone can trigger the oracle to execute or refund escrows on behalf of EpochSend.
- **Tasks:**
  - [ ] Create `src/middlewares/auth.ts`
  - [ ] Extract `x-api-key` header from the incoming request
  - [ ] Compare against `API_SECRET_KEY` from environment variables using constant-time comparison (`crypto.timingSafeEqual`)
  - [ ] Return `401 Unauthorized` with `{ error: "Unauthorized" }` if key is missing or invalid
  - [ ] Log authentication failures with the request IP (for monitoring)
  - [ ] Apply `authMiddleware` to all routes under `/api/webhooks/`

---

### Issue #BE-21: Webhook Route Module
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `backend`, `routing`
**Description:** Extract the inline webhook route from `src/index.ts` into a proper route module with all middleware applied in the correct order.
- **Tasks:**
  - [x] `POST /api/webhooks/trigger` stub exists in `index.ts`
  - [ ] Create `src/routes/webhookRoutes.ts`
  - [ ] Mount middleware chain: `authMiddleware` → `rateLimiter` → `validateBody(TriggerPayloadSchema)` → controller
  - [ ] Create `src/controllers/webhookController.ts` — handles validated trigger, calls `stellarService.executeIntent(escrowId)`
  - [ ] Remove the inline route definition from `src/index.ts`
  - [ ] Register `webhookRoutes` in `src/app.ts` via `app.use('/api/webhooks', webhookRoutes)`

---

### Issue #BE-22: Idempotency Guard
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `reliability`, `security`
**Description:** If the same webhook fires twice (network retry, duplicate delivery), the oracle must not attempt to execute the same intent twice. The second attempt would fail with a contract error and waste gas fees.
- **Tasks:**
  - [ ] Maintain an in-memory `Set<string>` of recently processed `escrowId` values
  - [ ] Before executing: check if `escrowId` is already in the processed set
  - [ ] If already processed: return `200 OK` with `{ status: "AlreadyProcessed" }` — idempotent response
  - [ ] If not processed: add to set, execute, keep in set for 1 hour
  - [ ] Phase 2: replace in-memory set with a persistent database (Redis or SQLite)

---

### Issue #BE-23: Webhook Test Endpoint
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `feature`, `dx`
**Description:** Allow oracle operators and integration developers to verify their webhook URL is correctly configured without triggering a real Soroban transaction.
- **Tasks:**
  - [ ] Create `POST /api/webhooks/test` route
  - [ ] Accept same payload as `/trigger` but respond with `200 OK` and a dry-run confirmation
  - [ ] Skip all Soroban execution — only validate auth and payload
  - [ ] Return: `{ status: "TestOK", message: "Webhook configuration is valid. No transaction submitted." }`
  - [ ] Document this endpoint in README API reference section

---

### Issue #BE-24: Standardised Error Response Format
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `api`, `reliability`
**Description:** All error responses must follow a consistent JSON structure so the frontend and external integrators can handle them programmatically.
- **Tasks:**
  - [ ] Define standard error envelope: `{ error: string, code: string, details?: unknown }`
  - [ ] Create `src/utils/errors.ts` — `AppError` class with `statusCode`, `code`, `message`
  - [ ] Create Express global error handler middleware in `src/middlewares/errorHandler.ts`
  - [ ] Map all thrown `AppError` instances to structured JSON responses
  - [ ] Map unhandled errors to `500 Internal Server Error` with generic message (no stack traces in production)
  - [ ] Register `errorHandler` as the last middleware in `src/app.ts`

---

### Issue #BE-25: Intent Status Query Endpoint
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `feature`, `blockchain`
**Description:** Allow external callers to query the current on-chain status of a specific intent without needing direct Soroban access.
- **Tasks:**
  - [ ] Create `GET /api/intents/:intentId/status` route
  - [ ] Call `sorobanServer` to read `get_intent(intentId)` from the Soroban contract
  - [ ] Parse the `ScVal` response and return a typed JSON object: `{ intentId, status, sender, recipient, amount, asset, expiration }`
  - [ ] Return `404 Not Found` if intent does not exist on-chain
  - [ ] Apply `authMiddleware` to this route (only oracle operators should query)

---

## 🔁 Module 5: Soroban Execution Engine (BE-26 → BE-30)

### Issue #BE-26: Retry Mechanism with Exponential Backoff
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `reliability`
**Description:** Transient network failures (RPC timeouts, Stellar network hiccups) should not cause permanent execution failures. Implement automatic retry with exponential backoff.
- **Tasks:**
  - [ ] Create `src/utils/retry.ts` — generic `withRetry(fn, maxAttempts, baseDelayMs)` wrapper
  - [ ] Apply `withRetry` around the transaction submission step in `stellarService.ts`
  - [ ] Retry up to 3 times with delays: 1s → 2s → 4s (exponential backoff)
  - [ ] Only retry on transient errors (network timeout, `PENDING` status) — do NOT retry on contract errors (`ERROR` status, condition not met)
  - [ ] Log each retry attempt with attempt number and delay

---

### Issue #BE-27: Transaction Confirmation Polling
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `blockchain`, `reliability`
**Description:** After submitting a transaction, the RPC returns a hash but the transaction may still be `PENDING`. Implement polling to confirm the final `SUCCESS` or `ERROR` status.
- **Tasks:**
  - [ ] After `sendTransaction()`, poll `getTransaction(hash)` every 2 seconds
  - [ ] Stop polling when status is `SUCCESS` or `ERROR`
  - [ ] Timeout after 30 seconds — throw `TimeoutError` if still pending
  - [ ] On `SUCCESS`: return `{ txHash, status: "success", ledger }`
  - [ ] On `ERROR`: parse the contract error XDR and throw descriptive `ExecutionError`

---

### Issue #BE-28: Execution Audit Logging
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `observability`
**Description:** Every execution attempt — success or failure — must be logged with enough detail to audit exactly what happened, when, and why.
- **Tasks:**
  - [ ] Log on every trigger received: `{ requestId, escrowId, timestamp, apiKeyId }`
  - [ ] Log on every execution: `{ escrowId, txHash, status, ledger, gasUsed, durationMs }`
  - [ ] Log on every failure: `{ escrowId, error, attempt, willRetry }`
  - [ ] Log on idempotency hit: `{ escrowId, status: "AlreadyProcessed" }`
  - [ ] Phase 2: write logs to a persistent store (database or log aggregation service)

---

### Issue #BE-29: Oracle Fee Reserve Monitoring
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `reliability`, `blockchain`
**Description:** The oracle wallet needs XLM to pay for transaction fees. If the balance falls too low, executions will fail silently. Add proactive monitoring and alerts.
- **Tasks:**
  - [ ] On startup: check oracle account XLM balance and log it
  - [ ] Define `MIN_BALANCE_XLM = 5` as a configurable constant
  - [ ] If balance falls below `MIN_BALANCE_XLM`, log a `[WARN]` alert on every execution
  - [ ] Add wallet balance to the `GET /health` response
  - [ ] Phase 2: send an email/Slack alert when balance is critically low

---

### Issue #BE-30: Refund Intent Execution Path
**Status:** 🔜 FUTURE | **Priority:** MEDIUM
**Labels:** `backend`, `feature`, `blockchain`
**Description:** In addition to executing intents (releasing to recipient), the backend should also be able to trigger refunds for expired intents on behalf of the sender when called via webhook.
- **Tasks:**
  - [ ] Add `action: "execute" | "refund"` to the `TriggerPayloadSchema`
  - [ ] Implement `stellarService.refundIntent(intentId)` — builds and submits `refund_intent()` contract call
  - [ ] Create `POST /api/webhooks/refund` route (or add `action` routing to existing trigger route)
  - [ ] Validate that `ledger.timestamp > intent.expiration` before submitting refund
  - [ ] Write unit tests for the refund execution path

---

## 🧪 Module 6: Testing, Logging & Production (BE-31 → BE-36)

### Issue #BE-31: Test Framework Setup
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `backend`, `testing`
**Description:** The current `npm test` script is `exit 1` — no test runner exists. Set up the testing infrastructure before any further business logic is added.
- **Tasks:**
  - [ ] Install `vitest` (or `jest` + `ts-jest`) as a dev dependency
  - [ ] Add `"test": "vitest"` script to `package.json`
  - [ ] Create `src/__tests__/` directory for test files
  - [ ] Add a basic smoke test: `describe("server", () => { it("should start") })` that imports `app` and verifies it is defined
  - [ ] Verify `npm test` passes in CI

---

### Issue #BE-32: Unit Tests — Middleware & Utilities
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `testing`
**Description:** Every piece of middleware and utility must have isolated unit tests that don't require a real network or Soroban contract.
- **Tasks:**
  - [ ] Test `auth.ts` middleware: valid key → passes, missing key → `401`, wrong key → `401`
  - [ ] Test `validate.ts` middleware: valid payload → passes, missing `escrowId` → `400` with details
  - [ ] Test `rateLimiter.ts`: exceeding limit → `429`
  - [ ] Test `retry.ts`: succeeds on 1st attempt, succeeds on 2nd after 1 failure, fails after max retries
  - [ ] Test `errors.ts`: `AppError` serialises to correct JSON structure

---

### Issue #BE-33: Integration Tests — Webhook Pipeline
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `backend`, `testing`, `integration`
**Description:** End-to-end integration tests for the full webhook ingestion pipeline — from HTTP request through to Soroban service call — using a mocked Stellar SDK.
- **Tasks:**
  - [ ] Use `supertest` for HTTP integration testing against the Express app
  - [ ] Mock `stellarService.executeIntent()` to avoid real network calls in tests
  - [ ] Test: valid request with correct API key → `202 Accepted`
  - [ ] Test: valid request with wrong API key → `401 Unauthorized`
  - [ ] Test: malformed payload → `400 Bad Request` with validation details
  - [ ] Test: duplicate `escrowId` → `200 OK` with `AlreadyProcessed` status
  - [ ] Test: Stellar SDK throws → `500 Internal Server Error`

---

### Issue #BE-34: Structured Logging
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `backend`, `observability`
**Description:** Replace `console.log` calls with a proper structured logging library that outputs machine-parseable JSON in production and human-readable format in development.
- **Tasks:**
  - [ ] Install `pino` (or `winston`) and configure log levels
  - [ ] Create `src/utils/logger.ts` — export a singleton logger instance
  - [ ] Replace all `console.log` / `console.error` calls with `logger.info` / `logger.error`
  - [ ] In production: output JSON with `{ level, message, timestamp, requestId, ...context }`
  - [ ] In development: output pretty-printed human-readable format with colours

---

### Issue #BE-35: Docker Support
**Status:** 🔜 FUTURE | **Priority:** MEDIUM
**Labels:** `backend`, `devops`, `deployment`
**Description:** Package the backend as a Docker container for consistent deployment across environments.
- **Tasks:**
  - [ ] Create `backend/Dockerfile` — multi-stage build: `build` stage (TypeScript compile) → `production` stage (Node.js runtime only)
  - [ ] Create `docker-compose.yml` at the repo root for local development
  - [ ] Add `.dockerignore` file excluding `node_modules`, `dist`, `.env`, `src/__tests__`
  - [ ] Test `docker build` and `docker run` produce a working container
  - [ ] Document Docker usage in README

---

### Issue #BE-36: Production Deployment Guide
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `backend`, `devops`, `documentation`
**Description:** Document the full path from git push to a live, production-grade oracle service.
- **Tasks:**
  - [ ] Document deployment options: Railway, Fly.io, Render, or VPS
  - [ ] Document required environment variables and how to set them in each platform
  - [ ] Document how to point the oracle to a Mainnet Soroban contract
  - [ ] Document how to rotate the `ORACLE_SECRET_KEY` safely (generate new keypair, deploy, update contract oracle registry)
  - [ ] Add health check URL to deployment platform's uptime monitoring

---

## 📌 Issue Numbering Reference

| Range | Module |
|---|---|
| BE-01 – BE-06 | Foundation & Configuration |
| BE-07 – BE-12 | Server Bootstrap & Security |
| BE-13 – BE-18 | Blockchain Integration |
| BE-19 – BE-25 | Webhook Ingestion Pipeline |
| BE-26 – BE-30 | Soroban Execution Engine |
| BE-31 – BE-36 | Testing, Logging & Production |

---

## 📊 Implementation Priority Matrix

| Priority | Issues | Block Reason |
|---|---|---|
| 🔴 **Ship Blockers** | BE-02, BE-04, BE-05, BE-20 | Broken config makes builds unreliable; missing .env.example breaks onboarding; no auth = anyone can trigger oracle |
| 🟡 **Core Function** | BE-13, BE-14, BE-15, BE-16, BE-17, BE-18, BE-21, BE-22 | Without these, the oracle does nothing — it's just a health check server |
| 🟢 **Production-Ready** | BE-19, BE-24, BE-25, BE-26, BE-27, BE-31, BE-32, BE-33 | Required for a reliable, testable, observable service |
| 🔵 **Phase 2+** | BE-29, BE-30, BE-34, BE-35, BE-36 | Operational improvements and deployment hardening |

---

*EpochSend Backend — The oracle bridge for programmable payments on Stellar. Building in public.*