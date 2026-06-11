# EpochSend — Backend & Oracle Service

<p align="center">
  <img src="./docs/epochsend-logo.png" alt="EpochSend Logo" width="120" />
</p>

<p align="center">
  <strong>The trusted oracle bridge that connects real-world events to on-chain Soroban escrow execution on Stellar.</strong>
</p>

<p align="center">
  <a href="https://epochsend.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20App-epochsend.vercel.app-brightgreen?style=for-the-badge&logo=vercel" alt="Live App" />
  </a>
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Built%20on-Stellar%20Soroban-6B21A8?style=for-the-badge&logo=stellar" alt="Stellar Soroban" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://github.com/StacksTrench/EpochSend-backend/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
</p>

---

## 🧠 What This Repository Is

Soroban smart contracts on Stellar cannot natively pull data from the outside world. They cannot listen to webhooks, query REST APIs, or react to real-world delivery confirmations.

The **EpochSend Backend** solves this — it is the **trusted oracle bridge** that:
1. Listens for authenticated external triggers (webhooks, scheduled jobs, API events)
2. Validates and authenticates incoming payloads with Zod schemas and API key middleware
3. Translates the validated trigger into a **signed Soroban transaction**
4. Submits the transaction to the Stellar network, causing the smart contract to automatically release locked funds to the recipient

> *"When the real world says the condition is met — this service is the one that tells the blockchain."*

Without this backend, oracle-condition escrows would require manual intervention. This service automates the full loop.

---

## 🏗️ Architecture

```
External World (Web2)
        │
        │  POST /api/webhooks/trigger
        │  { escrowId, triggerSecret }
        ▼
EpochSend Backend (Express + TypeScript)
        │
        ├── API Key Authentication Middleware
        │       └── Reject 401 if header missing/invalid
        │
        ├── Zod Payload Validation
        │       └── Reject 400 if payload malformed
        │
        ├── Idempotency Check
        │       └── Skip if intent already executed/refunded
        │
        ├── StellarService.executeIntent(escrowId)
        │       ├── Build InvokeHostFunction transaction
        │       ├── Simulate via Soroban RPC
        │       ├── Sign with Oracle Keypair
        │       └── Submit to Stellar Network
        │
        └── Return { txHash, status: "submitted" }
                │
                ▼
        Soroban Escrow Contract
                │
                ├── execute_intent() → Transfer to Recipient ✅
                └── (or reject if condition not met) ❌
```

---

## 🧩 Service Features

### Phase 1 — Foundation (Current)
| Feature | File | Status |
|---|---|---|
| Express server bootstrap | `src/index.ts` | ✅ Implemented |
| Security middleware (Helmet, CORS) | `src/index.ts` | ✅ Implemented |
| `GET /health` health check | `src/index.ts` | ✅ Implemented |
| `POST /api/webhooks/trigger` stub | `src/index.ts` | ⚠️ Stub only |
| CI pipeline (build) | `.github/workflows/ci.yml` | ✅ Exists, minimal |
| Soroban RPC config module | `src/config/stellar.ts` | ❌ Pending |
| Oracle keypair management | `src/config/stellar.ts` | ❌ Pending |
| Zod payload validation | `src/middlewares/validate.ts` | ❌ Pending |
| API key authentication | `src/middlewares/auth.ts` | ❌ Pending |
| Webhook route module | `src/routes/webhookRoutes.ts` | ❌ Pending |
| Soroban transaction builder | `src/services/stellarService.ts` | ❌ Pending |
| Oracle sign & submit pipeline | `src/services/stellarService.ts` | ❌ Pending |
| Retry with exponential backoff | `src/services/stellarService.ts` | ❌ Pending |

### Phase 2 — Automation & Observability
| Feature | Status |
|---|---|
| Scheduled cron triggers for time-based intents | 🔜 Planned |
| Email/SMS notifications on execution | 🔜 Planned |
| Structured logging (Winston/Pino) | 🔜 Planned |
| Intent status polling endpoint | 🔜 Planned |
| Webhook delivery receipts | 🔜 Planned |

### Phase 3 — Production Hardening
| Feature | Status |
|---|---|
| Docker + Docker Compose support | 🔜 Planned |
| Rate limiting per API key | 🔜 Planned |
| Database layer for idempotency records | 🔜 Planned |
| Prometheus metrics endpoint | 🔜 Planned |
| Full test suite (Vitest) | 🔜 Planned |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | v20+ |
| **Language** | TypeScript | ^6.0 |
| **Framework** | Express | ^5.2.1 |
| **Blockchain** | `@stellar/stellar-sdk` | ^15.1.0 |
| **Validation** | Zod | ^4.4.3 |
| **Security** | Helmet + CORS + dotenv | latest |
| **Dev Runner** | Nodemon + ts-node | latest |
| **CI** | GitHub Actions | — |

---

## 📁 Project Structure

```
EpochSend-backend/
├── docs/
│   ├── ISSUES.md                  # Granular backend task tracker & roadmap
│   └── PRD.md                     # Product Requirements Document
│
├── backend/                       # Node.js/Express application root
│   ├── src/
│   │   ├── index.ts               # App entry point — Express bootstrap
│   │   ├── config/
│   │   │   └── stellar.ts         # Soroban RPC client & oracle keypair init (pending)
│   │   ├── middlewares/
│   │   │   ├── auth.ts            # API key authentication middleware (pending)
│   │   │   └── validate.ts        # Zod payload validation middleware (pending)
│   │   ├── routes/
│   │   │   └── webhookRoutes.ts   # POST /api/webhooks/* route definitions (pending)
│   │   └── services/
│   │       └── stellarService.ts  # Soroban tx builder, signer, submitter (pending)
│   ├── package.json               # npm dependencies & scripts
│   ├── tsconfig.json              # TypeScript compiler config
│   └── .env.example               # Environment variable template
│
├── .github/
│   └── workflows/ci.yml           # GitHub Actions CI pipeline
│
├── README.md                      # This file
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md             # Community standards
├── MAINTAINERS.md                 # Project maintainers
└── STYLE.md                       # Code style guide
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** v9+
- A Stellar **Testnet** account to act as the oracle (funded via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test))
- The deployed EpochSend Soroban contract ID

### 1. Clone & Install

```bash
git clone https://github.com/StacksTrench/EpochSend-backend.git
cd EpochSend-backend/backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=3000
NODE_ENV=development

# API Security
API_SECRET_KEY=your-strong-random-secret-here

# Stellar Network
STELLAR_NETWORK=TESTNET
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Oracle Wallet (the server-side signing keypair)
ORACLE_SECRET_KEY=S...
ORACLE_PUBLIC_KEY=G...

# EpochSend Soroban Contract
ESCROW_CONTRACT_ID=C...
```

> ⚠️ **Never commit `.env`** — it contains real secret keys. Only `.env.example` belongs in version control.

### 3. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### 4. Verify Health

```bash
curl http://localhost:3000/health
# → { "status": "OK", "service": "EpochSend Oracle Backend" }
```

---

## 🌐 API Reference

### `GET /health`
Health check endpoint. Returns server status.

**Response `200`:**
```json
{
  "status": "OK",
  "service": "EpochSend Oracle Backend"
}
```

---

### `POST /api/webhooks/trigger`
Ingests an external webhook trigger and (when fully implemented) executes the corresponding Soroban intent.

**Headers:**
```
x-api-key: <your API_SECRET_KEY>
Content-Type: application/json
```

**Request Body:**
```json
{
  "escrowId": "42",
  "triggerSecret": "optional-shared-secret-for-verification"
}
```

**Response `202` (Accepted — trigger received, execution pending):**
```json
{
  "status": "Accepted",
  "message": "Webhook received. Execution pending.",
  "escrowId": "42"
}
```

**Response `400` (Malformed payload):**
```json
{ "error": "Invalid payload", "details": [...] }
```

**Response `401` (Missing or invalid API key):**
```json
{ "error": "Unauthorized" }
```

---

## 🔐 Security Model

| Layer | Implementation |
|---|---|
| **API Key Auth** | All mutation routes require `x-api-key` header matching `API_SECRET_KEY` env var |
| **Payload Validation** | Zod schemas reject malformed or missing fields with `400 Bad Request` |
| **Helmet** | Sets secure HTTP headers (HSTS, CSP, X-Frame-Options, etc.) |
| **CORS Policy** | Restrict origins to known frontend domains (not wildcard) |
| **Rate Limiting** | Planned: limit requests per API key to prevent abuse |
| **Secret Management** | All secrets loaded from `.env` at runtime — never hardcoded |
| **Idempotency** | Planned: track executed intent IDs to prevent double-execution |
| **Simulation-First** | All transactions simulated before signing — catches invalid calls early |

---

## 🧪 Testing

```bash
# Run tests (test framework setup pending — see docs/ISSUES.md BE-31)
npm test
```

See [`docs/ISSUES.md`](./docs/ISSUES.md) for the full testing roadmap.

---

## ⚙️ CI Pipeline

Every push and pull request to `main` triggers [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

1. Checkout repository
2. Setup Node.js v20
3. `npm ci` — install dependencies
4. `npm run build` — TypeScript compilation

Planned additions (see BE-35): lint step, typecheck step, test step.

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with hot reload (nodemon)
npm run build    # Compile TypeScript → JavaScript (dist/)
npm run start    # Run compiled production server (node dist/index.js)
npm run lint     # Run ESLint (pending setup)
npm test         # Run test suite (pending setup)
```

---

## 📊 Success Metrics

| Metric | Description |
|---|---|
| **Webhook Latency** | Time from webhook receipt to Stellar transaction confirmed |
| **Execution Success Rate** | % of webhook triggers that result in successful on-chain execution |
| **Oracle Uptime** | Service availability (target: 99.9% uptime) |
| **Retry Success Rate** | % of initially-failed submissions that succeed on retry |
| **False Execution Rate** | % of executions triggered without a valid condition being met |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [🗂️ Issues & Roadmap](./docs/ISSUES.md) | Granular backend task tracker (30+ issues across 6 modules) |
| [📄 PRD](./docs/PRD.md) | Full Product Requirements — oracle architecture, security model, roadmap |
| [🤝 Contributing](./CONTRIBUTING.md) | How to contribute to the backend codebase |
| [🎨 Style Guide](./STYLE.md) | TypeScript code style, naming conventions, formatting |
| [📜 Code of Conduct](./CODE_OF_CONDUCT.md) | Community standards |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/be-your-feature`
3. Write code + tests, ensure `npm run build` succeeds
4. Open a Pull Request against `main`

---

## 👥 Maintainers

See [MAINTAINERS.md](./MAINTAINERS.md).

---

## 📄 License

[MIT](./LICENSE) — free to use, fork, and build upon.

---

<p align="center">
  Built with Node.js + TypeScript · Connected to <a href="https://stellar.org">Stellar Soroban</a> · Protocol UI at <a href="https://epochsend.vercel.app">epochsend.vercel.app</a>
</p>
