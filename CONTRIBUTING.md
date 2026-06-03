# Contributing to EpochSend Backend

Thank you for your interest in building the off-chain oracle automation for the EpochSend protocol! This guide will help you contribute effectively.

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Blockchain Integration:** `@stellar/stellar-sdk`
- **Validation:** Zod
- **Network:** Stellar (Testnet & Mainnet)

## 📝 Commit Guidelines

We follow a **Modular Commit** philosophy to ensure history is readable and revertable.

**The Golden Rule:**

> "Commit after every meaningful change, not every line."

- **Meaningful Change:** Completing a function, finishing a fix, adding a feature block, creating a file, or making a significant modification.
- **Avoid:** Micro-commits for single-line edits unless they are standalone fixes.
- **Frequency:** Commit often, but only when you finish a logical piece of work.

### Example Commit Messages

- `feat(oracle): add Stripe webhook ingestion route`
- `fix(tx-builder): correct transaction fee estimation`
- `docs: update deployment guide for Render`
- `chore: update dependencies`

## 📋 Issue Tracking

1. Pick an issue from the `docs/ISSUES.md` file.
2. When you start, comment on the issue or mark it as "In Progress".
3. **When Completed:** You MUST update the issue file with:
   - Check the box `[x]`
   - Append your GitHub username and Date/Time.
   - _Example:_ `- [x] Implement webhook validation middleware (@bbkenny - 2024-04-13 14:00)`

## 🧪 Development Workflow

1. **Clone**: Clone the repo locally.
2. **Branch**: Create a feature branch (`feat/my-feature`).
3. **Develop**: Write code following the Style Guide (`STYLE.md`).
4. **Test**: Run tests.
5. **Build**: Run `npm run build` before committing.
6. **Commit**: Follow the commit guidelines above.

## Getting Help

Read the **PRD** and `docs/ISSUES.md` for detailed technical requirements.

---

_Help us transform payments from manual to intent-based on Stellar!_
