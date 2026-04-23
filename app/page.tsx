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
    detail: "Existing GitHub repositories ready for donations.",
    label: "Programs",
    value: integerFormatter.format(programs.length),
  },
  {
    detail: "Repos whose maintainers now control bounty payouts.",
    label: "Claimed",
    value: integerFormatter.format(claimedPrograms),
  },
  {
    detail: "Programs modeled with a Compound parking strategy.",
    label: "Yield-enabled",
    value: integerFormatter.format(compoundPrograms),
  },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="panel grid overflow-hidden bg-[#0f2f30] text-[#f7efe2] lg:grid-cols-[1.25fr_0.95fr]">
          <div className="relative flex flex-col gap-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="eyebrow border-white/12 bg-white/8 text-[#b8e6c6]">
                USDC bounties for open source
              </span>
              <span className="data-chip border-white/12 bg-white/8 text-[#d9e9de]">
                Ethereum
              </span>
              <span className="data-chip border-white/12 bg-white/8 text-[#d9e9de]">
                GitHub claims
              </span>
              <span className="data-chip border-white/12 bg-white/8 text-[#d9e9de]">
                Safe custody
              </span>
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#8ed7aa]">
                osstrust.org
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                Fund the repos you rely on without turning every bounty pool
                into an unlocked wallet.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#cadad1] sm:text-lg">
                OSSTrust ranks GitHub repositories by committed USDC, lets
                maintainers claim their program, and keeps idle treasury funds
                parked behind a guarded Safe policy instead of a single hot key.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a className="action-primary" href="#leaderboard">
                Explore leaderboard
              </a>
              <a className="action-secondary" href="#custody">
                Review custody model
              </a>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-[#102728] px-6 py-8 sm:px-8 lg:border-t-0 lg:border-l lg:border-white/10 lg:px-10 lg:py-12">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#8ed7aa]">
                Treasury flow
              </p>
              <h2 className="max-w-sm text-2xl font-semibold tracking-[-0.03em]">
                Donations stay simple. Payout authority does not.
              </h2>
            </div>

            <div className="stage-flow mt-8 space-y-4">
              <div className="stage-card">
                <span className="stage-index">01</span>
                <div>
                  <p className="stage-title">Donate in USDC</p>
                  <p className="stage-copy">
                    A donor funds an existing GitHub repo on Ethereum and the
                    program rises on the leaderboard immediately.
                  </p>
                </div>
              </div>

              <div className="stage-card">
                <span className="stage-index">02</span>
                <div>
                  <p className="stage-title">Claim by GitHub ownership</p>
                  <p className="stage-copy">
                    Repo owners authenticate with GitHub and can lock payout
                    processing away from the marketplace.
                  </p>
                </div>
              </div>

              <div className="stage-card">
                <span className="stage-index">03</span>
                <div>
                  <p className="stage-title">Guard the treasury</p>
                  <p className="stage-copy">
                    A Safe plus delay policy can buffer emergency exits while a
                    Compound sweep keeps idle USDC productive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {platformStats.map((stat) => (
            <article className="metric-card" key={stat.label}>
              <p className="metric-label">{stat.label}</p>
              <p className="metric-value">{stat.value}</p>
              <p className="metric-detail">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section
          id="custody"
          className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr_0.85fr]"
        >
          {operatingPrinciples.map((principle) => (
            <article className="panel p-6 sm:p-7" key={principle.title}>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-[#3f6a5f]">
                {principle.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#11201f]">
                {principle.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#455856] sm:text-base">
                {principle.body}
              </p>
            </article>
          ))}
        </section>

        <ProgramBoard
          claimStates={claimStateOptions}
          languages={[...new Set(programs.map((program) => program.language))]}
          programs={programs}
          repositoryTypes={repositoryTypeOptions}
        />

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          {launchPhases.map((phase) => (
            <article className="panel p-6 sm:p-7" key={phase.step}>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#3f6a5f]">
                Phase {phase.step}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#11201f]">
                {phase.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#455856] sm:text-base">
                {phase.detail}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
