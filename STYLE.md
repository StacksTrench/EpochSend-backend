# Code Style Guide - PayWhen

## JavaScript / TypeScript (Frontend)

- **Formatting:** Use Prettier with standard config
- **Linting:** ESLint with recommended rules
- **Components:** Functional components with typed props
- **State:** Use React Hooks (useState, useEffect, useContext)
- **Styling:** Tailwind CSS utility classes
- **Async:** Use async/await, handle errors properly
- **Types:** Always define interfaces for data structures

## Rust (Soroban Smart Contracts)

- **Formatting:** Always run `cargo fmt`
- **Version:** Always use latest Soroban SDK
- **Errors:** Use `Result<T, E>` for error handling
- **Safety:** Always use the `Env` object for authorization and state access
- **Logic:** Keep logic clean, separate concerns between factory and implementation
- **Testing:** Write comprehensive unit tests in `test.rs` for every contract function

## Project Conventions

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utils: `camelCase.ts`
- Types: `PascalCase.ts`

### Git Commits
- Follow modular commit philosophy
- Commit after meaningful changes
- Run build/compile before committing

## Integrity Checks

- **Frontend:** `npm run build` before pushing
- **Contracts:** `cargo build --target wasm32-unknown-unknown --release` before starting work
- **Typecheck:** `npm run typecheck` if available

---

*Always ensure the workspace is clean and compiles correctly on Stellar.*
