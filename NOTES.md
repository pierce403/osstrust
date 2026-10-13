# Cloudflare migration notes

## 2026-10-12 preparation

Prepared from `f963574762bcc4cfa2ca930fb0d332de12260597` on
`codex/cloudflare-migration`. Installed/read upstream `migrate-to-vinext` skill
and ran compatibility check before source changes: 94%, zero unsupported issues,
only the existing Turbopack config partially relevant.

Worker `osstrust` uses pinned vinext 1.1.0, Vite 8.3.4, Cloudflare Vite plugin
1.63.1 and Wrangler 4.149.0. React/React DOM/react-server-dom-webpack 19.3.0
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

Coordinated security review found a React Server Components Server Function denial
of service advisory affecting versions below 19.2.8. Updated React, React DOM and
RSC together to 19.3.0, plus retained Next/eslint-config-next to 16.4.0. Compatible
transitive advisory patches were refreshed without forced peer overrides. Remaining
audit findings are build glob tooling and the unused OG image dependency chain;
this application has no OG/ZIP endpoint or user-controlled build glob input.

When switching between Next recovery builds and vinext builds, remove the generated
`.next` cache first. Their generated route-type declarations differ; a stale Next
validator caused a typecheck error until the build cache was separated.

Clean `npm ci --no-audit --no-fund` from the final lockfile succeeded under Node
22.23.3. The final Cloudflare build and Wrangler dry run were repeated after that
install. Existing application dependency versions are preserved except the required
React 19.3.0 adapter peer alignment in OSSTrust and resolved shared transitive tools.

## Deployment contract

Cloudflare native Git builds publish production after an approved push to `main`.
Use Node 22.23.3 (`.nvmrc`), install with `npm ci`, build with
`npm run build:cloudflare`, and deploy with `npx wrangler deploy`. Deployment
credentials stay in Cloudflare. `vercel.json` disables future Vercel Git builds
while the existing deployment remains the recovery source. Do not run a local
production deployment concurrently with native builds. The initial migration commit had no production routes; the migration coordinator
owns DNS, routes and cutover. The later route candidate below remains unpublished.
`/deployment.json` reports `CF_COMMIT_SHA` (or the local Git commit) with `no-store`.
A local build does not establish deployment identity, DNS, TLS or production behavior.
Ignored `.migration/` contains local command logs, HTTP evidence and a screenshot.

## 2026-10-12 route cutover candidate

Prepared `preview_urls: false` and ordinary zone routes for `osstrust.org/*`.
Routes use `zone_name` and do not create custom-domain DNS. Build and Wrangler
dry run pass. No push, deployment, proxy/DNS change or certificate change was made
for this candidate. The coordinator must finish DNS/TLS readiness and sequence the
production push.

## 2026-10-13 dependency remediation candidate

The separate security review branch resolves fflate 0.7.3 to 0.7.5 through an
npm override because Satori pins the older version exactly. This addresses
Dependabot alert #80. Alert #81 remains: braces 3.0.3 is still pulled by
micromatch through `@next/eslint-plugin-next` and vinext's dynamic import
tooling. The current advisory lists no patched braces version. No alert was
dismissed, and no app source or deployment configuration changed.

Node 22.22.1 validation: clean offline `npm ci --omit=optional`, lint,
typecheck, Cloudflare build, and Wrangler dry run. Native optional binaries
were restored from matching cached tarballs or the identical-version local
install of another app after the offline install; a normal registry-backed
`npm ci` must be checked by remote CI. This local checkout omits the remote
favicon binary, so asset parity was not asserted. Keep this review separate
from the coordinated migration release and do not merge or deploy it yet.
