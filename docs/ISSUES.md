# 🛠️ EpochSend Backend Task Tracker

This document breaks down the development of the EpochSend Oracle & Automation Backend into granular, actionable issues.

## 🟢 Phase 1: Project Scaffolding & Setup

### [Issue #1] Initialize Node.js & TypeScript Environment
- **Task:** Run `npm init` and install core dependencies.
- **Details:** 
  - Install `typescript`, `ts-node`, `nodemon` for development.
  - Create a robust `tsconfig.json`.
  - Set up ESLint and Prettier for code formatting.
- **Acceptance Criteria:** `npm run dev` successfully starts a compiled "Hello World" TypeScript file.

### [Issue #2] Express.js & Security Middleware Setup
- **Task:** Create the foundational web server.
- **Details:**
  - Install `express`, `cors`, `helmet`, and `dotenv`.
  - Create `src/index.ts` to initialize the Express app.
  - Configure CORS policies to restrict unwanted access.
  - Implement a basic health-check route (`GET /health`).
- **Acceptance Criteria:** Server boots up, loads `.env` variables, and responds `200 OK` to the health check.

---

## 🔵 Phase 2: Blockchain Integration

### [Issue #3] Setup Stellar SDK & Soroban RPC Connection
- **Task:** Configure the application to communicate with the Stellar network.
- **Details:**
  - Install `@stellar/stellar-sdk`.
  - Create `src/config/stellar.ts` to initialize the RPC Server URL based on the environment (Testnet vs Mainnet).
  - Write a utility function that validates the connection to the RPC node on startup.
- **Acceptance Criteria:** App logs successful connection to Soroban RPC on boot.

### [Issue #4] Implement Oracle Key Management
- **Task:** Securely load and utilize the server's Stellar wallet.
- **Details:**
  - Read `ORACLE_SECRET_KEY` from environment variables.
  - Create a Keypair instance using the Stellar SDK.
  - Implement strict error throwing if the secret key is missing on boot.
- **Acceptance Criteria:** The application correctly instantiates the Oracle's public key from the secret string.

---

## 🟣 Phase 3: Webhook Ingestion & Validation

### [Issue #5] Create Zod Payload Validators
- **Task:** Ensure incoming webhooks are structurally sound.
- **Details:**
  - Install `zod`.
  - Create a schema for `TriggerPayload` requiring an `escrowId` (string) and `triggerSecret` (string).
- **Acceptance Criteria:** Validation middleware throws a `400 Bad Request` if the payload is malformed.

### [Issue #6] Implement Webhook Authentication Middleware
- **Task:** Prevent malicious actors from triggering the endpoints.
- **Details:**
  - Check for a specific `x-api-key` or `Authorization` header against a server-side `.env` secret.
  - Reject unauthorized requests with `401 Unauthorized`.
- **Acceptance Criteria:** Only requests with the correct headers can reach the ingestion routes.

### [Issue #7] Build the Ingestion Route
- **Task:** Create the main POST route for webhooks.
- **Details:**
  - Create `POST /api/webhooks/trigger`.
  - Connect the Authentication and Validation middlewares.
  - Pass the validated payload to the pending Execution Controller.
- **Acceptance Criteria:** Route successfully receives, authenticates, validates, and acknowledges a valid webhook.

---

## 🟠 Phase 4: Soroban Execution Controller

### [Issue #8] Build the `execute_escrow` Transaction Builder
- **Task:** Write the logic to invoke the Soroban smart contract.
- **Details:**
  - Create `src/services/stellarService.ts`.
  - Use the Stellar SDK to construct a `ContractCall` operation targeting the `execute_escrow` function on the EpochSend contract.
  - Pass the `escrowId` as a `ScVal` argument.
- **Acceptance Criteria:** The function successfully builds a valid XDR transaction object.

### [Issue #9] Sign & Submit Transaction Logic
- **Task:** Finalize the execution flow.
- **Details:**
  - Sign the built transaction using the Oracle Keypair.
  - Submit the transaction to the Soroban RPC.
  - Implement try/catch blocks to handle simulation errors or RPC timeouts.
- **Acceptance Criteria:** The backend successfully signs and submits the transaction, returning the Stellar transaction hash to the webhook caller.

---

## 🔴 Phase 5: Reliability & Idempotency

### [Issue #10] Implement Retry Mechanism
- **Task:** Handle transient blockchain network failures.
- **Details:**
  - If a transaction submission fails due to a network timeout (not a contract revert), automatically retry up to 3 times with exponential backoff.
- **Acceptance Criteria:** Simulated network failures result in automated retries before returning a `500` error.