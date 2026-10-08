"use client";

import { useEffect, useRef } from "react";
import { mountMatchScore } from "./match-score/engine";
import { FIRMS } from "./match-score/firms";
import { MARKUP } from "./match-score/markup";
import "./match-score/match-score.css";

/** Logo and founding year set in the admin, keyed by firm slug. They fill the table's empty logo / founded fields. */
export type MatchScoreSiteData = Record<string, { logo: string | null; foundedYear: number | null }>;

export function MatchScoreTable({ siteData }: { siteData: MatchScoreSiteData }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const firms = FIRMS.map((f) => ({
      ...f,
      logo: f.logo ?? siteData[f.id]?.logo ?? null,
      founded: f.founded ?? siteData[f.id]?.foundedYear ?? null,
    }));
    return mountMatchScore(ref.current, firms);
  }, [siteData]);

  return <div ref={ref} className="tfi" id="tfi-match" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
