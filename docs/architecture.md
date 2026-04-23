# OSSTrust Architecture Notes

As of April 22, 2026, the cleanest MVP is a Vercel-hosted Next.js app that treats the leaderboard as the product front door and the treasury model as a second, harder layer.

## Recommended stack

- Frontend: Next.js 16 App Router on Vercel.
- Data: Postgres on Neon or Supabase, with Drizzle for schema and migrations.
- Ingest storage: blob storage for raw repo-entry submissions, import batches, and queue-like intake artifacts before normalization.
- Auth: GitHub OAuth via Auth.js so claim rights can be tied to repository admin or maintainer membership.
- GitHub sync: webhooks plus scheduled backfills for repository metadata, topics, languages, stars, and ownership changes.
- Chain layer: Ethereum mainnet USDC for donations, because that is where the strongest Safe and Compound support already exists.

## Product shape

- Anyone can create funding momentum by donating to an existing GitHub repo, even if the maintainers have never touched OSSTrust.
- Claimed programs switch from marketplace-mediated payout processing to maintainer-controlled payout approval.
- The landing page is a sortable, filterable leaderboard with search by repository type, language, claim status, and treasury size.
- When OSSTrust needs to ingest new repo entries, the raw submission should land in blob storage first, then be validated and promoted into the canonical program records.

## Safe plus Compound

Yes, a Safe-based vault can keep idle USDC in Compound. The important detail is that Safe does not natively auto-deposit to Compound. You need policy and automation around it.

- Safe modules can automate DeFi interactions and enforce custom rules, but Safe explicitly warns that modules can execute arbitrary transactions and must be trusted and audited.
- Safe guards can impose pre- and post-transaction checks, which is useful for limiting payout destinations, rate limits, or emergency stop logic.
- Safe's own RecoveryHub documentation shows a real delayed-execution pattern using the Zodiac Delay Modifier, which is the closest off-the-shelf model for a payout challenge window.
- Compound III on Ethereum uses USDC as its base asset, and accounts with a positive base balance earn interest.

## Recommended custody model

For a first serious version, use one Safe per claimed program or one factory-generated treasury contract that can later graduate to a dedicated Safe.

1. Donor sends USDC on Ethereum to the program treasury address.
2. Treasury keeps a configurable buffer in raw USDC for near-term payouts.
3. Idle excess is swept into Compound III supply from the same treasury identity.
4. Any payout or unsweep above a threshold is queued behind a delay and visible on the public program page.
5. A guardian or platform multisig can cancel malicious or obviously compromised transactions during the delay window.

This is materially safer than repo owner gets one private key and can drain everything.

## Why not give repo owners full immediate control?

- A compromised maintainer wallet would become a straight treasury drain.
- A delayed Safe workflow gives donors and guardians time to react.
- A public bounty platform benefits from visible, deterministic payout rules more than it benefits from instant discretionary withdrawals.

## Practical tradeoffs

- One Safe per repo on Ethereum mainnet is operationally clean but gas-heavy. That is fine for high-value programs and less fine for long-tail repos.
- Yield introduces smart-contract risk and accounting complexity. The UI should show principal, accrued yield, and immediately spendable balance separately.
- Claimed programs should probably choose between three presets: marketplace-managed, repo-owner-managed with delay, or dual-control with a guardian.

## MVP sequence

1. Public leaderboard with seeded data and filters.
2. GitHub OAuth and claim verification.
3. Blob-backed intake flow for new repo entries, plus validation and promotion into database-backed program records.
4. Database-backed programs, donations, and claim state.
5. Onchain donation receipts and treasury addressing.
6. Safe deployment and payout policy enforcement.
7. Compound sweep automation for programs that opt in.

## Source notes

- Safe Modules: https://docs.safe.global/advanced/smart-account-modules
- Safe Guards: https://docs.safe.global/advanced/smart-account-guards
- Safe RecoveryHub delay pattern: https://help.safe.global/en/articles/110656-account-recovery-with-safe-recoveryhub
- Compound III overview: https://docs.compound.finance/
- Compound III supply behavior: https://docs.compound.finance/collateral-and-borrowing/
- Compound III rates: https://docs.compound.finance/interest-rates/
- Next.js installation: https://nextjs.org/docs/app/getting-started/installation
- Next.js on Vercel: https://vercel.com/docs/frameworks/full-stack/nextjs
