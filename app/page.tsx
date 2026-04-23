import { ProgramBoard } from "@/components/program-board";
import { compactUsdFormatter, integerFormatter } from "@/lib/format";
import { claimStateOptions, programs, repositoryTypeOptions } from "@/lib/programs";
import { launchPhases, operatingPrinciples } from "@/lib/site-content";

const totalFunding = programs.reduce(
  (runningTotal, program) => runningTotal + program.totalFundedUsd,
  0,
);
const claimedPrograms = programs.filter(
  (program) => program.claimState === "Claimed",
).length;
const compoundPrograms = programs.filter(
  (program) => program.custody.strategy === "Compound III supply",
).length;

const platformStats = [
  {
    detail: "Seeded example data until live indexing lands.",
    label: "Leaderboard TVL",
    value: compactUsdFormatter.format(totalFunding),
  },
  {
    detail: "GitHub repositories ready for donations.",
    label: "Programs",
    value: integerFormatter.format(programs.length),
  },
  {
    detail: "Repos with maintainer-controlled bounty payouts.",
    label: "Claimed",
    value: integerFormatter.format(claimedPrograms),
  },
  {
    detail: "Programs with Compound III yield routing enabled.",
    label: "Yield-enabled",
    value: integerFormatter.format(compoundPrograms),
  },
];

export default function Home() {
  return (
    <main>
      <div className="page-wrap">

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="hero">
          <div>
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              USDC bug bounties · Ethereum · Safe custody
            </span>

            <h1 className="hero-title">
              Fund the repos{" "}
              <span className="hero-title-accent">you rely on.</span>
            </h1>

            <p className="hero-subtitle">
              OSSTrust ranks GitHub repositories by committed USDC, lets
              maintainers claim their program, and keeps idle treasury funds
              behind a guarded Safe policy instead of an unlocked wallet.
            </p>

            <div className="hero-chips">
              <span className="hero-chip">Ethereum mainnet</span>
              <span className="hero-chip">USDC donations</span>
              <span className="hero-chip">GitHub claims</span>
              <span className="hero-chip">Safe multisig</span>
              <span className="hero-chip">Compound III yield</span>
            </div>

            <div className="hero-actions">
              <a className="btn-primary" href="#leaderboard">
                Explore leaderboard →
              </a>
              <a className="btn-secondary" href="#custody">
                Review custody model
              </a>
            </div>
          </div>

          {/* Treasury flow diagram */}
          <div className="flow-card">
            <div className="flow-card-header">
              <p className="flow-card-label">Treasury flow</p>
              <p className="flow-card-title">
                Donations stay simple. Payout authority does not.
              </p>
            </div>

            <div className="flow-steps">
              <div className="flow-step">
                <div className="flow-step-col">
                  <div className="flow-step-num">01</div>
                  <div className="flow-step-line" />
                </div>
                <div className="flow-step-body">
                  <p className="flow-step-title">Donate in USDC</p>
                  <p className="flow-step-copy">
                    Fund any GitHub repo on Ethereum — it rises on the
                    leaderboard immediately, claimed or not.
                  </p>
                </div>
              </div>

              <div className="flow-step">
                <div className="flow-step-col">
                  <div className="flow-step-num">02</div>
                  <div className="flow-step-line" />
                </div>
                <div className="flow-step-body">
                  <p className="flow-step-title">Claim via GitHub</p>
                  <p className="flow-step-copy">
                    Repo owners authenticate and lock payout control away
                    from the marketplace.
                  </p>
                </div>
              </div>

              <div className="flow-step">
                <div className="flow-step-col">
                  <div className="flow-step-num">03</div>
                  <div className="flow-step-line" />
                </div>
                <div className="flow-step-body">
                  <p className="flow-step-title">Guard the treasury</p>
                  <p className="flow-step-copy">
                    A Safe plus delay policy buffers emergency exits while
                    Compound III keeps idle USDC productive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform stats ──────────────────────────────────── */}
        <section className="stats-grid" aria-label="Platform statistics">
          {platformStats.map((stat) => (
            <div className="stat-cell" key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-detail">{stat.detail}</p>
            </div>
          ))}
        </section>

        {/* ── Operating principles ────────────────────────────── */}
        <section id="custody" aria-label="Custody model">
          <p className="section-eyebrow">Custody model</p>
          <h2 className="section-title">
            Three rules that keep the money safe.
          </h2>
          <p className="section-subtitle">
            Every design decision comes back to one question: who can move
            funds, under what conditions, and how does the audit trail look?
          </p>

          <div className="card-grid-3" style={{ marginTop: "2rem" }}>
            {operatingPrinciples.map((principle) => (
              <article className="content-card" key={principle.title}>
                <p className="card-eyebrow">{principle.eyebrow}</p>
                <h3 className="card-title">{principle.title}</h3>
                <p className="card-body">{principle.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Leaderboard ─────────────────────────────────────── */}
        <ProgramBoard
          claimStates={claimStateOptions}
          languages={[...new Set(programs.map((program) => program.language))]}
          programs={programs}
          repositoryTypes={repositoryTypeOptions}
        />

        {/* ── Roadmap ─────────────────────────────────────────── */}
        <section id="roadmap" aria-label="Launch roadmap">
          <p className="section-eyebrow">Roadmap</p>
          <h2 className="section-title">
            Shipping in three focused phases.
          </h2>
          <p className="section-subtitle">
            Each phase unlocks a self-contained slice of value. You can fund
            and discover repos today. Claims and onchain custody follow.
          </p>

          <div className="card-grid-3" style={{ marginTop: "2rem" }}>
            {launchPhases.map((phase) => (
              <article className="content-card" key={phase.step}>
                <p className="card-eyebrow">Phase {phase.step}</p>
                <h3 className="card-title">{phase.title}</h3>
                <p className="card-body">{phase.detail}</p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
