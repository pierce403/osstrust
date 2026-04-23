# AGENTS.md - Instructions for Coding Agents

## Self-Improvement Directive

This file is intentionally inspired by `recurse.bot`: every agent should leave the repo easier for the next agent to understand.

When you learn something important about this project, update this file before you finish the task. Record both wins to repeat and mistakes to avoid. Be concrete: add exact commands, file paths, configuration details, workflow constraints, and collaborator preferences.

Update this file when you discover:

- build, lint, typecheck, or deploy commands that actually work
- project conventions or file ownership patterns
- recurring errors, warnings, or environment traps
- workflow expectations from the collaborator
- anything about the repo that would save the next agent time

## Mandatory Completion Workflow

This repo has an aggressive shipping bias.

After every completed task:

1. update `AGENTS.md` if you learned anything new
2. verify the relevant checks for the work you changed
3. push the finished work
4. merge it promptly

Do not leave completed work sitting locally or in a long-lived branch. Prefer one focused task per push and merge.

Do not end a turn with completed, uncommitted, or unpushed work.

If the remote repository has no default branch yet, bootstrap it by committing and pushing `main` first. After that, return to the normal push-and-merge flow.

If you cannot push or merge because of missing permissions, branch protection, failing CI, conflicts, or missing credentials, say so explicitly in your handoff and note the blocker here if it is likely to recur.

## Project Overview

OSSTrust is a Vercel-targeted TypeScript app for:

- showing a public leaderboard of GitHub repositories funded for bug bounties
- letting maintainers claim their program via GitHub ownership
- eventually routing USDC donations on Ethereum into guarded Safe-based treasuries
- optionally parking idle USDC in Compound III while preserving payout controls

Current app status:

- frontend scaffold is a `Next.js 16` App Router app
- landing page is in `app/page.tsx`
- seeded leaderboard data lives in `lib/programs.ts`
- a starter API route exists at `app/api/programs/route.ts`
- custody and product notes live in `docs/architecture.md`
- when the product needs intake for new repo entries, use blob storage as the ingest layer before normalizing records into the main app data model

## Verified Commands

Use Node `22.13.0` from `.nvmrc`, or another supported `22.x` release. `24+` is also acceptable. Avoid Node `23.x` because package engine warnings appear there.

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Typecheck:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
```

## Project Structure

- `app/`: App Router pages, layout, styles, and route handlers
- `app/page.tsx`: main OSSTrust landing page
- `app/api/programs/route.ts`: starter JSON endpoint for filtered program data
- `components/`: reusable React UI pieces
- `components/program-board.tsx`: client-side leaderboard and filters
- `lib/`: typed seed data, formatting helpers, and content constants
- `docs/architecture.md`: product and custody decisions, including Safe and Compound notes

## Conventions

- Keep the product framing centered on funding markets, repo claims, payout authority, and treasury controls.
- Preserve the existing visual language unless the collaborator asks for a redesign.
- Prefer small typed modules in `lib/` instead of stuffing logic into page files.
- Keep copy direct and concrete. Avoid marketing fluff.
- For new repo-entry intake, prefer blob storage for raw submissions or import payloads instead of writing ad hoc one-off entry paths straight into the primary database tables.
- When adding product or treasury behavior, keep a clear distinction between:
  - leaderboard/discovery
  - GitHub claim authority
  - treasury custody and payout execution

## Known Issues And Solutions

- `Next.js` may infer the wrong workspace root if it sees parent lockfiles. `next.config.ts` already sets `turbopack.root` to this repo to avoid that warning.
- `yarn create next-app` was unreliable in this environment. `npx create-next-app` worked, and the repo now installs cleanly with `npm`.
- Node `23.9.0` produced engine warnings during install. Use `.nvmrc` and stay on `22.13.0`.
- On this machine, `gh auth status` is configured for SSH Git operations. Keep `origin` on `git@github.com:pierce403/osstrust.git` or pushes may fall back to HTTPS credential prompts.

## Agent Tips

- Read `docs/architecture.md` before making product-level decisions about wallets, Safe modules, or Compound.
- If you touch the app shell or leaderboard flow, run `lint`, `typecheck`, and `build` before finishing.
- If you add real auth, database, or chain integrations, update this file with exact env vars, migration commands, and deployment steps.
- If you build repo-submission intake, store the raw entry payload in blob storage first, then run validation and normalization into durable app records.
- If a task changes the repo workflow, release process, or branch strategy, update the `Mandatory Completion Workflow` section immediately.

## Rapport And Reflection

- The collaborator wants pragmatic execution, not abstract planning.
- Default toward making the change instead of describing what you would do.
- Keep summaries concise and high-signal.
- The collaborator explicitly wants agents pushing and merging after each completed task.
- A prior turn failed to push finished work. Do not repeat that mistake.
- Keep this file compact, but do not omit information that will save future agents from repeating setup or workflow mistakes.
