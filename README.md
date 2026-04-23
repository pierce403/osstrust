# OSSTrust

OSSTrust is a TypeScript app for ranking GitHub repositories by committed bug-bounty funding, letting maintainers claim payout control, and eventually routing idle USDC through guarded Safe treasuries.

## Current state

This repo now contains:

- A Vercel-ready Next.js 16 App Router app.
- A filterable landing-page leaderboard tailored to the OSSTrust product shape.
- Typed mock program data and a starter `GET /api/programs` endpoint.
- Architecture notes for GitHub claims, Safe custody, and Compound parking.

## Local development

Use Node `22.13.0` or newer on the `22.x` line, or `24+`.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel deployment target

## Product direction

- Public leaderboard first
- GitHub-based claim flow for repository owners
- USDC donations on Ethereum
- Safe-backed treasury controls
- Optional Compound III yield for idle balances

## Docs

- [Architecture notes](docs/architecture.md)
