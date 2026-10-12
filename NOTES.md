# Cloudflare migration notes

## 2026-10-12 preparation

Prepared from `f963574762bcc4cfa2ca930fb0d332de12260597` on
`codex/cloudflare-migration`. Installed/read upstream `migrate-to-vinext` skill
and ran compatibility check before source changes: 94%, zero unsupported issues,
only the existing Turbopack config partially relevant.

Worker `osstrust` uses pinned vinext 1.1.0, Vite 8.3.4, Cloudflare Vite plugin
1.63.1 and Wrangler 4.149.0. React/React DOM/react-server-dom-webpack 19.2.6
meet vinext's peer requirement. Original Next.js build remains available as
`npm run build`; no app components, seed data or API handler changed.

Native build uses the generated Cloudflare server config via Wrangler's build
redirect. Only ASSETS is bound. No KV, D1, R2, auth, wallet or custody feature was
added. `/api/programs` retains query-sensitive filtering and exact JSON shape.
The build emits 23 same-origin font files; the current vinext implementation
self-hosts these statically analyzable font imports despite older skill prose
describing a CDN fallback. Local HTML contains no Google Fonts CDN dependency.

Validation: lint, typecheck, vinext build, original Next.js build, dry run; twelve
local HTTP checks covering home, all API filter dimensions, combined/empty/query
normalization/zero-result cases, marker and 404. Unfiltered API JSON exactly matches
current public production. Browser search and combined language/claim filters work.

The retained Next.js recovery-build dependency has a critical npm advisory. It is
not the Cloudflare request runtime; no broad framework upgrade was mixed into this
port. Review separately before reactivating a Next.js production server.

Clean `npm ci --no-audit --no-fund` from the final lockfile succeeded under Node
22.23.3. The final Cloudflare build and Wrangler dry run were repeated after that
install. Existing application dependency versions are preserved except the required
React 19.2.6 adapter peer alignment in OSSTrust and resolved shared transitive tools.

## Deployment contract

Cloudflare native Git builds publish production after an approved push to `main`.
Use Node 22.23.3 (`.nvmrc`), install with `npm ci`, build with
`npm run build:cloudflare`, and deploy with `npx wrangler deploy`. Deployment
credentials stay in Cloudflare. `vercel.json` disables future Vercel Git builds
while the existing deployment remains the recovery source. Do not run a local
production deployment concurrently with native builds. Initial config intentionally
has no production routes; the migration coordinator owns DNS, routes and cutover.
`/deployment.json` reports `CF_COMMIT_SHA` (or the local Git commit) with `no-store`.
A local build does not establish deployment identity, DNS, TLS or production behavior.
Ignored `.migration/` contains local command logs, HTTP evidence and a screenshot.
