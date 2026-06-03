# EpochSend - Backend & Oracle Service

![EpochSend Logo](./docs/epochsend-logo.png)

> **The off-chain execution engine and Web2 Oracle for the EpochSend Protocol on Stellar.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar%20Soroban-purple)](https://soroban.stellar.org)

## 💡 Overview

Smart contracts on the Stellar Network cannot natively pull data from the outside world or listen to standard Web2 webhooks. 

The **EpochSend Backend** solves this by acting as a highly available, secure bridge between real-world events and the Soroban escrow contracts. It listens for verified external triggers (e.g., a webhook from a shipping company, a payment API, or a custom application integration), validates the payload, and signs a transaction to automatically execute the on-chain payment.

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph External World (Web2)
        API[External API / Webhook]
        Cron[Scheduled Cron Jobs]
    end

    subgraph EpochSend Backend (Node.js)
        Ingestion[Webhook Ingestion Route]
        Validator[Payload Validator]
        Wallet[Oracle Key Manager]
        TxBuilder[Stellar Tx Builder]
        
        Ingestion --> Validator
        Validator --> TxBuilder
        Wallet --> TxBuilder
    end

    subgraph Stellar Network (Web3)
        Soroban[EpochSend Escrow Contract]
    end

    API -->|POST /webhook| Ingestion
    Cron -->|Trigger| Ingestion
    TxBuilder -->|Submit Signed Tx| Soroban
```

---

## 🛠 Tech Stack

*   **Runtime:** Node.js
*   **Language:** TypeScript
*   **Framework:** Express.js (for webhook ingestion)
*   **Blockchain Integration:** `@stellar/stellar-sdk`
*   **Validation:** Zod (for strict payload validation)
*   **Security:** `dotenv` for secret management, Helmet/CORS for API security.

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js v18+
*   npm or yarn
*   A funded Stellar oracle account (Secret Key)

### 2. Local Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 📚 Documentation & Task Tracking

*   🧠 **[Backend Issues & Task Breakdown](./docs/ISSUES.md)**
*   📄 **[Product Requirements Document](./docs/PRD.md)**

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

*Project maintained by @babalola & contributors.*
