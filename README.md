# EpochSend — Backend & Oracle Service

<p align="center">
  <strong>The trusted oracle bridge that connects Web2 webhook events to on-chain Soroban escrow execution on Stellar.</strong>
</p>

<p align="center">
  <a href="https://epochsend.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20App-epochsend.vercel.app-brightgreen?style=for-the-badge&logo=vercel" alt="Live App" />
  </a>
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Built%20on-Stellar%20Soroban-6B21A8?style=for-the-badge&logo=stellar" alt="Stellar Soroban" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

---

## 🧠 What is this service?

Soroban smart contracts on Stellar are isolated; they cannot natively listen to shipping APIs, Stripe events, or database triggers. 

The **EpochSend Backend** acts as our off-chain oracle bridge. It runs an Express server that:
1. **Listens** for webhook trigger events from Web2 APIs (like shipping confirmations or transaction updates).
2. **Validates** incoming request payloads.
3. **Builds and signs** a Soroban transaction invoking `execute_intent` on the smart contract.
4. **Submits** the signed transaction to the Stellar network, releasing the escrowed funds to the recipient automatically.

---

## 🏗️ Architecture

```
External API (Web2 Webhook)
            │
            │  POST /api/webhooks/trigger
            ▼
EpochSend Oracle Backend (Express + TypeScript)
            │
            ├── API Key / Payload validation (Zod)
            ├── Build InvokeHostFunction transaction
            ├── Sign transaction with Oracle keypair
            ▼
Stellar Soroban Network (calls execute_intent() to pay recipient) ✅
```

---

## 🧩 Service Features

| Feature | Description | Status |
|---|---|---|
| Express server bootstrap | Basic routing and middleware setup | ✅ Done |
| Security middlewares | CORS and Helmet configurations | ✅ Done |
| Health Check | `GET /health` service endpoint | ✅ Done |
| Ingestion Endpoint | `POST /api/webhooks/trigger` trigger stub | ✅ Done |
| Zod validation | Schema validation for triggers | 🔨 In Progress |
| Transaction builder | Constructing Soroban execution calls | 🔨 In Progress |
| Oracle signer | Signing transactions with oracle keys | 🔨 In Progress |

---

## 🛠️ Tech Stack

- **Runtime:** Node.js v20+
- **Language:** TypeScript
- **Framework:** Express
- **Blockchain:** `@stellar/stellar-sdk`
- **Validation:** Zod
- **Runner:** Nodemon + ts-node

---

## 📁 Project Structure

```
EpochSend-backend/
├── docs/
│   ├── PRD.md                     # Product Requirements Document
│   └── ISSUES.md                  # Backend feature roadmap & issue tracker
│
├── backend/                       # Node.js/Express application root
│   ├── src/
│   │   ├── index.ts               # App entry point — Express bootstrap
│   │   ├── config/
│   │   │   └── stellar.ts         # Soroban RPC client & oracle keypair init (pending)
│   │   ├── middlewares/
│   │   │   ├── auth.ts            # API key auth middleware (pending)
│   │   │   └── validate.ts        # Zod payload validation middleware (pending)
│   │   ├── routes/
│   │   │   └── webhookRoutes.ts   # POST /api/webhooks route definitions (pending)
│   │   └── services/
│   │       └── stellarService.ts  # Soroban tx builder, signer, submitter (pending)
│   ├── package.json               # dependencies & scripts
│   ├── tsconfig.json              # TypeScript compilation rules
│   └── package-lock.json          # npm locks
│
├── README.md                      # This file
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md             # Community standards
├── MAINTAINERS.md                 # Maintainer list
└── STYLE.md                       # TypeScript coding style guide
```

---

## 🚀 Getting Started

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
Fill in the environment variables:
```env
PORT=3000
STELLAR_NETWORK=TESTNET
ORACLE_SECRET_KEY=S...  # Oracle keypair secret for signing transactions
```

### 3. Run Development Server
```bash
npm run dev
```
The server will run on `http://localhost:3000`.
