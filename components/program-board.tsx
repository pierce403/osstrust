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

  const maxFunding = programs.reduce(
    (max, p) => Math.max(max, p.totalFundedUsd),
    0,
  );

  return (
    <section id="leaderboard" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div className="board-header">
        <div className="board-header-text">
          <p className="section-eyebrow">Leaderboard</p>
          <h2 className="section-title">
            Find repos worth funding.
          </h2>
        </div>
        <p className="board-header-meta">
          Filter by language, type, and payout control before you commit
          a dollar. Data is seeded mock content matching the production
          shape.
        </p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-field" style={{ flex: 2 }}>
          <label className="filter-label" htmlFor="search-repos">Search repositories</label>
          <input
            id="search-repos"
            className="filter-control"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="next.js, curl, go, security..."
            type="search"
            value={query}
          />
        </div>

        <div className="filter-field">
          <label className="filter-label" htmlFor="filter-lang">Language</label>
          <select
            id="filter-lang"
            className="filter-control"
            onChange={(event) => setLanguage(event.target.value)}
            value={language}
          >
            <option value={ALL_FILTERS}>All languages</option>
            {languages.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label" htmlFor="filter-type">Repository type</label>
          <select
            id="filter-type"
            className="filter-control"
            onChange={(event) => setRepositoryType(event.target.value)}
            value={repositoryType}
          >
            <option value={ALL_FILTERS}>All types</option>
            {repositoryTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label" htmlFor="filter-claim">Claim status</label>
          <select
            id="filter-claim"
            className="filter-control"
            onChange={(event) => setClaimState(event.target.value)}
            value={claimState}
          >
            <option value={ALL_FILTERS}>Any status</option>
            {claimStates.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary chips */}
      <div className="filter-summary">
        <span className="summary-chip">
          <span className="summary-chip-dot" />
          {integerFormatter.format(visiblePrograms.length)} programs
        </span>
        <span className="summary-chip">
          <span className="summary-chip-dot" />
          {compactUsdFormatter.format(visibleFunding)} funded
        </span>
        <span className="summary-chip">
          <span className="summary-chip-dot" />
          {integerFormatter.format(visibleClaimed)} claimed
        </span>
        <span className="summary-chip">USDC on Ethereum</span>
      </div>

      {/* Desktop table */}
      <div className="board-table-wrap" style={{ display: "none" }} id="board-desktop">
        {/* Hidden by default, shown via media query below */}
      </div>

      <div className="board-table-wrap" style={{}} aria-label="Program leaderboard table">
        <div style={{ overflowX: "auto" }}>
          <table className="board-table">
            <thead className="board-thead">
              <tr>
                <th className="board-th" style={{ width: "2.5rem" }}>#</th>
                <th className="board-th">Repository</th>
                <th className="board-th">Type</th>
                <th className="board-th">Funding</th>
                <th className="board-th">Yield</th>
                <th className="board-th">Control</th>
                <th className="board-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {visiblePrograms.map((program, index) => {
                const barPct = (program.totalFundedUsd / maxFunding) * 100;
                const isTop = index < 3;
                return (
                  <tr className="board-tr" key={program.id}>
                    <td className="board-td">
                      <span className={`board-rank ${isTop ? "board-rank-top" : ""}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="board-td">
                      <p className="repo-name">
                        {program.owner}/{program.repo}
                      </p>
                      <p className="repo-desc">{program.description}</p>
                      <div className="tag-row">
                        {program.tags.map((tag) => (
                          <span className="tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="board-td">
                      <p className="type-label">{program.repositoryType}</p>
                      <p className="lang-label">{program.language}</p>
                    </td>
                    <td className="board-td">
                      <p className="funding-value">
                        {usdFormatter.format(program.totalFundedUsd)}
                      </p>
                      <p className="funding-sub">
                        {integerFormatter.format(program.donors)} donors ·{" "}
                        {integerFormatter.format(program.openBounties)} open
                      </p>
                      <div className="funding-bar-wrap">
                        <div
                          className="funding-bar-fill"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="board-td">
                      <p className="yield-strategy">{program.custody.strategy}</p>
                      {program.custody.currentApr !== null ? (
                        <p className="yield-apr">
                          {program.custody.currentApr.toFixed(1)}% APR
                        </p>
                      ) : (
                        <p className="yield-none">No yield configured</p>
                      )}
                    </td>
                    <td className="board-td">
                      <p className="control-label">{program.payoutAuthority}</p>
                      <p className="control-policy">
                        {program.custody.executionPolicy}
                      </p>
                    </td>
                    <td className="board-td">
                      <span
                        className={`badge ${
                          program.claimState === "Claimed"
                            ? "badge-claimed"
                            : "badge-unclaimed"
                        }`}
                      >
                        <span className="badge-dot" />
                        {program.claimState}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mobile-board" aria-label="Program leaderboard cards">
        {visiblePrograms.map((program, index) => {
          const isTop = index < 3;
          return (
            <article className="mobile-card" key={program.id}>
              <div className="mobile-card-top">
                <div style={{ flex: 1 }}>
                  <p className="repo-name">
                    {program.owner}/{program.repo}
                  </p>
                  <p className="repo-desc" style={{ marginTop: "0.25rem" }}>
                    {program.description}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                  <span className={`mobile-card-rank ${isTop ? "mobile-card-rank-top" : ""}`}>
                    #{index + 1}
                  </span>
                  <span
                    className={`badge ${
                      program.claimState === "Claimed"
                        ? "badge-claimed"
                        : "badge-unclaimed"
                    }`}
                  >
                    <span className="badge-dot" />
                    {program.claimState}
                  </span>
                </div>
              </div>

              <div className="mobile-stats-grid">
                <div>
                  <p className="mobile-stat-label">Funding</p>
                  <p className="mobile-stat-value">
                    {usdFormatter.format(program.totalFundedUsd)}
                  </p>
                </div>
                <div>
                  <p className="mobile-stat-label">Open bounties</p>
                  <p className="mobile-stat-value">
                    {integerFormatter.format(program.openBounties)}
                  </p>
                </div>
                <div>
                  <p className="mobile-stat-label">Control</p>
                  <p className="mobile-stat-value">{program.payoutAuthority}</p>
                </div>
                <div>
                  <p className="mobile-stat-label">Yield</p>
                  <p className="mobile-stat-value">
                    {program.custody.currentApr !== null
                      ? `${program.custody.currentApr.toFixed(1)}% APR`
                      : "None"}
                  </p>
                </div>
              </div>

              <div className="tag-row" style={{ marginTop: "0.75rem" }}>
                {program.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

    </section>
  );
}
