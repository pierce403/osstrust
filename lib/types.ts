export type ClaimState = "Claimed" | "Unclaimed";

export type RepositoryType =
  | "Developer Tool"
  | "Framework"
  | "Infrastructure"
  | "Library"
  | "Security";

export type PayoutAuthority =
  | "Dual control"
  | "Marketplace"
  | "Repo owner";

export type CustodyStrategy = "Compound III supply" | "Idle Safe buffer";

export type ExecutionPolicy =
  | "Delay modifier plus guardian Safe"
  | "Repo owner Safe with challenge window"
  | "OSSTrust-managed payout multisig";

export type Program = {
  claimState: ClaimState;
  custody: {
    asset: "USDC";
    chain: "Ethereum";
    currentApr: number | null;
    executionPolicy: ExecutionPolicy;
    strategy: CustodyStrategy;
  };
  description: string;
  donors: number;
  id: string;
  language: string;
  openBounties: number;
  owner: string;
  payoutAuthority: PayoutAuthority;
  repo: string;
  repositoryType: RepositoryType;
  slug: string;
  stars: number;
  tags: string[];
  totalFundedUsd: number;
};

export type OperatingPrinciple = {
  body: string;
  eyebrow: string;
  title: string;
};

export type LaunchPhase = {
  detail: string;
  step: string;
  title: string;
};
