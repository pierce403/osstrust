import { NextResponse } from "next/server";

import { programs } from "@/lib/programs";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const language = searchParams.get("language");
  const repositoryType = searchParams.get("repositoryType");
  const claimState = searchParams.get("claimState");

  const filteredPrograms = programs.filter((program) => {
    const matchesQuery =
      query.length === 0 ||
      [
        program.owner,
        program.repo,
        program.language,
        program.repositoryType,
        ...program.tags,
      ].some((entry) => entry.toLowerCase().includes(query));

    const matchesLanguage =
      language === null || language.length === 0 || program.language === language;
    const matchesRepositoryType =
      repositoryType === null ||
      repositoryType.length === 0 ||
      program.repositoryType === repositoryType;
    const matchesClaimState =
      claimState === null ||
      claimState.length === 0 ||
      program.claimState === claimState;

    return (
      matchesQuery &&
      matchesLanguage &&
      matchesRepositoryType &&
      matchesClaimState
    );
  });

  return NextResponse.json({
    count: filteredPrograms.length,
    programs: filteredPrograms,
  });
}
