import type { LaunchPhase, OperatingPrinciple } from "@/lib/types";

export const operatingPrinciples: OperatingPrinciple[] = [
  {
    body:
      "Every GitHub repository becomes a program with a public treasury balance, claim state, payout policy, and donation history. That keeps the landing page useful before the repo owner ever logs in.",
    eyebrow: "Discovery first",
    title: "Any donor can fund an existing repo and push it onto the board.",
  },
  {
    body:
      "Claiming should map to GitHub repository ownership, not just a wallet signature. Once claimed, maintainers can shut out third-party payout processing while the treasury still sits behind a Safe policy.",
    eyebrow: "Claim rights",
    title: "Maintainers get the social authority. The vault still needs technical guardrails.",
  },
  {
    body:
      "Idle USDC can be routed into Compound III, but only with a sweep policy, explicit accounting, and a hot buffer for near-term payouts. Yield is a bonus, not the trust anchor.",
    eyebrow: "Capital efficiency",
    title: "The treasury can earn, but the payout path has to stay legible.",
  },
];

export const launchPhases: LaunchPhase[] = [
  {
    detail:
      "Ship the leaderboard, filters, claim-state UX, and typed API contracts first. That gives donors somewhere credible to land before onchain plumbing is live.",
    step: "01",
    title: "Public market surface",
  },
  {
    detail:
      "Add GitHub OAuth, verify repository admins, and let claimed programs switch from marketplace-run payouts to maintainer-controlled workflows.",
    step: "02",
    title: "Repo ownership claims",
  },
  {
    detail:
      "Move donation receipts onchain with per-program Safe vaults, delay protection, and an opt-in Compound parking strategy that keeps accounting clean.",
    step: "03",
    title: "Treasury automation",
  },
];
