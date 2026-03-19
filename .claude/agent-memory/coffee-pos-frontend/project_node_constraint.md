---
name: Node 18 environment constraint
description: The dev machine runs Node 18.19.1 which is incompatible with several package engine requirements — affects Tailwind v4, create-vite v9, react-router-dom v7
type: project
---

The development machine runs **Node v18.19.1 / npm 9.2.0**. This causes engine-mismatch warnings for:

- `@tailwindcss/oxide@4.x` — requires Node >=20. The native Rust binding (`@tailwindcss/oxide-linux-x64-gnu`) is NOT installed automatically because npm skips optional deps on engine mismatch.
- `create-vite@9` — requires `^20.19.0 || >=22.12.0`. Must use `create-vite@5` instead.
- `react-router-dom@7` — requires Node >=20.0.0. Installs but logs a warning.

**Why:** Machine is locked to Node 18 LTS; no nvm/volta upgrade performed.

**How to apply:**
- When adding new packages, check their `engines` field first. If they require Node >=20, look for v-1 alternatives compatible with Node 18.
- The Tailwind v4 native binding fix: run `npm install @tailwindcss/oxide-linux-x64-gnu` after the main install. This resolves the "Cannot find native binding" build error.
- Scaffold new Vite projects with `npm create vite@5 .` not `vite@latest`.
