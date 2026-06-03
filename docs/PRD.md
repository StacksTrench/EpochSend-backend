# 📘 Product Requirements Document (PRD)

## Product Name: EpochSend Oracle & Automation Backend

---

## 🧠 Overview

The **EpochSend Backend** is a dedicated Node.js service that acts as the off-chain "Oracle" and automation layer for the EpochSend protocol on the Stellar Network.

While the frontend handles user intent creation and the smart contracts securely lock the funds, the backend bridges the gap between Web2 reality and Web3 execution. It listens to external API events, validates the data, and automatically signs and submits the Stellar transaction required to unlock an escrow.

---

## 🎯 Problem Statement

Soroban smart contracts cannot make external HTTP requests or listen to webhooks. If a user creates an intent that says: *"Send 100 USDC to Alice when the FedEx package is delivered,"* the blockchain has no way of knowing when FedEx marks the package as delivered.

To execute programmable, conditional payments based on real-world events, a trusted, highly available off-chain intermediary is strictly required.

---

## 💡 The EpochSend Backend Solution

A robust, lightweight Express.js server that exposes webhook ingestion routes for external services. 

When a trusted external service (e.g., Stripe, a logistics API, or a custom internal dashboard) sends an HTTP POST request indicating a condition is met, the backend will:
1. Validate the cryptographic signature or API key of the incoming webhook.
2. Cross-reference the payload with the active escrows on the Stellar network.
3. Build a Soroban `execute_escrow` transaction.
4. Sign the transaction using a secure, server-side Oracle Wallet.
5. Submit it to the Stellar network to release the funds.

---

## 🧩 Core Features (MVP)

### 1. Webhook Ingestion API
- Secure REST endpoints (`POST /api/webhooks/trigger`).
- Middleware for validating API keys or Webhook secrets to prevent malicious triggers.

### 2. Payload Validation & Sanitization
- Strict typing and validation (using Zod) to ensure the incoming payload contains the exact `escrow_id` and required metadata.

### 3. Blockchain Execution Engine
- Integration with `@stellar/stellar-sdk`.
- Ability to securely construct and sponsor transactions if necessary.
- Signing with a dedicated `ORACLE_SECRET_KEY` managed via environment variables.

### 4. Idempotency & Retry Logic
- Ensuring that if a webhook is received twice, the transaction is only submitted to Stellar once.
- Handling network timeouts with the Soroban RPC by implementing an exponential backoff retry mechanism.

---

## 🔐 Security Model

- **Least Privilege Oracle Key**: The Oracle wallet stored on the server should only be used to authorize execution. It should not hold massive funds (other than XLM for gas fees, if sponsoring).
- **Environment Isolation**: Absolute reliance on `.env` files and secret managers in production.
- **Rate Limiting**: Implementation of IP rate limiting to prevent DDoS attacks on the webhook ingestion routes.

---

## 🚀 Roadmap

### Phase 1: MVP (Current)
- Initialize Node.js/Express.js scaffolding.
- Setup Stellar SDK connection to Soroban Testnet.
- Build the basic `/trigger` webhook route.
- Implement the `execute_escrow` transaction builder.

### Phase 2: Advanced Oracles & Databases
- Implement PostgreSQL/Redis to track webhook history and ensure idempotency.
- Create specialized webhook routes (e.g., `/webhooks/stripe`, `/webhooks/fedex`) with custom parsing logic.

### Phase 3: High Availability
- Docker containerization for deployment on Kubernetes/AWS/Render.
- Multi-region deployment to ensure the Oracle is always online.
