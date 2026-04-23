"use client";

import { useDeferredValue, useState } from "react";

import { compactUsdFormatter, integerFormatter, usdFormatter } from "@/lib/format";
import type { ClaimState, Program, RepositoryType } from "@/lib/types";

const ALL_FILTERS = "all";

type ProgramBoardProps = {
  claimStates: ClaimState[];
  languages: string[];
  programs: Program[];
  repositoryTypes: RepositoryType[];
};

export function ProgramBoard({
  claimStates,
  languages,
  programs,
  repositoryTypes,
}: ProgramBoardProps) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(ALL_FILTERS);
  const [repositoryType, setRepositoryType] = useState(ALL_FILTERS);
  const [claimState, setClaimState] = useState(ALL_FILTERS);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visiblePrograms = programs.filter((program) => {
    const matchesQuery =
      deferredQuery.length === 0 ||
      [
        program.owner,
        program.repo,
        program.language,
        program.repositoryType,
        ...program.tags,
      ].some((entry) => entry.toLowerCase().includes(deferredQuery));
    const matchesLanguage =
      language === ALL_FILTERS || program.language === language;
    const matchesRepositoryType =
      repositoryType === ALL_FILTERS ||
      program.repositoryType === repositoryType;
    const matchesClaimState =
      claimState === ALL_FILTERS || program.claimState === claimState;

    return (
      matchesQuery &&
      matchesLanguage &&
      matchesRepositoryType &&
      matchesClaimState
    );
  });

  const visibleFunding = visiblePrograms.reduce(
    (runningTotal, program) => runningTotal + program.totalFundedUsd,
    0,
  );
  const visibleClaimed = visiblePrograms.filter(
    (program) => program.claimState === "Claimed",
  ).length;

  return (
    <section id="leaderboard" className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#3f6a5f]">
            Leaderboard
          </p>
          <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[#11201f] sm:text-5xl">
            Search by repo type, language, and payout control before you send a
            dollar.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#4a5b59] sm:text-base">
          The dataset below is seeded mock content, but the filters and
          leaderboard structure match the production shape you described.
        </p>
      </div>

      <div className="panel p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.7fr_repeat(3,minmax(0,1fr))]">
          <label className="space-y-2">
            <span className="field-label">Search repositories</span>
            <input
              className="field-control"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="next.js, curl, go, security..."
              type="search"
              value={query}
            />
          </label>

          <label className="space-y-2">
            <span className="field-label">Language</span>
            <select
              className="field-control"
              onChange={(event) => setLanguage(event.target.value)}
              value={language}
            >
              <option value={ALL_FILTERS}>All languages</option>
              {languages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="field-label">Repository type</span>
            <select
              className="field-control"
              onChange={(event) => setRepositoryType(event.target.value)}
              value={repositoryType}
            >
              <option value={ALL_FILTERS}>All types</option>
              {repositoryTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="field-label">Claim status</span>
            <select
              className="field-control"
              onChange={(event) => setClaimState(event.target.value)}
              value={claimState}
            >
              <option value={ALL_FILTERS}>Any status</option>
              {claimStates.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="data-chip">
            {integerFormatter.format(visiblePrograms.length)} visible programs
          </span>
          <span className="data-chip">
            {compactUsdFormatter.format(visibleFunding)} visible funding
          </span>
          <span className="data-chip">
            {integerFormatter.format(visibleClaimed)} claimed programs
          </span>
          <span className="data-chip">
            USDC on Ethereum, modeled for bug-bounty use
          </span>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[2rem] border border-black/8 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur md:block">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#f2e9dd]">
            <tr className="text-left">
              <th className="table-head">Repository</th>
              <th className="table-head">Type</th>
              <th className="table-head">Funding</th>
              <th className="table-head">Yield</th>
              <th className="table-head">Control</th>
            </tr>
          </thead>
          <tbody>
            {visiblePrograms.map((program) => (
              <tr className="border-t border-black/8" key={program.id}>
                <td className="table-cell align-top">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#132422]">
                        {program.owner}/{program.repo}
                      </span>
                      <span className="status-pill">{program.claimState}</span>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-[#546765]">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {program.tags.map((tag) => (
                        <span className="tag-pill" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="table-cell align-top">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#132422]">
                      {program.repositoryType}
                    </p>
                    <p className="text-sm text-[#546765]">{program.language}</p>
                  </div>
                </td>
                <td className="table-cell align-top">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-[#132422]">
                      {usdFormatter.format(program.totalFundedUsd)}
                    </p>
                    <p className="text-sm text-[#546765]">
                      {integerFormatter.format(program.donors)} donors and{" "}
                      {integerFormatter.format(program.openBounties)} open
                      bounties
                    </p>
                  </div>
                </td>
                <td className="table-cell align-top">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#132422]">
                      {program.custody.strategy}
                    </p>
                    <p className="text-sm text-[#546765]">
                      {program.custody.currentApr === null
                        ? "No yield route configured yet"
                        : `${program.custody.currentApr.toFixed(1)}% modeled APR`}
                    </p>
                  </div>
                </td>
                <td className="table-cell align-top">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#132422]">
                      {program.payoutAuthority}
                    </p>
                    <p className="text-sm text-[#546765]">
                      {program.custody.executionPolicy}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {visiblePrograms.map((program) => (
          <article className="panel p-5" key={program.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em] text-[#11201f]">
                  {program.owner}/{program.repo}
                </p>
                <p className="mt-1 text-sm text-[#546765]">
                  {program.repositoryType} · {program.language}
                </p>
              </div>
              <span className="status-pill">{program.claimState}</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#455856]">
              {program.description}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="field-label">Funding</p>
                <p className="text-lg font-semibold text-[#11201f]">
                  {usdFormatter.format(program.totalFundedUsd)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="field-label">Control</p>
                <p className="text-sm font-semibold text-[#11201f]">
                  {program.payoutAuthority}
                </p>
              </div>
              <div className="space-y-1">
                <p className="field-label">Yield route</p>
                <p className="text-sm text-[#455856]">
                  {program.custody.strategy}
                </p>
              </div>
              <div className="space-y-1">
                <p className="field-label">Bounties</p>
                <p className="text-sm text-[#455856]">
                  {integerFormatter.format(program.openBounties)} open
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {program.tags.map((tag) => (
                <span className="tag-pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
