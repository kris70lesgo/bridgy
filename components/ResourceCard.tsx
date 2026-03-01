"use client";

import type { Resource, Intent } from "@/lib/types";
import WhyThisToggle from "@/components/WhyThisToggle";

const urgencyBadge: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: "bg-green-100",   text: "text-green-700",  label: "Low"    },
  medium: { bg: "bg-amber-100",   text: "text-amber-700",  label: "Medium" },
  high:   { bg: "bg-red-100",     text: "text-red-500",    label: "High"   },
  crisis: { bg: "bg-red-500",     text: "text-white",      label: "Crisis" },
};

const communityColors: Record<string, string> = {
  adhd:         "bg-violet-100  text-violet-700  border-violet-200",
  autism:       "bg-blue-100    text-blue-700    border-blue-200",
  dyslexia:     "bg-teal-100    text-teal-700    border-teal-200",
  anxiety:      "bg-yellow-100  text-yellow-700  border-yellow-200",
  depression:   "bg-slate-100   text-slate-600   border-slate-200",
  student:      "bg-green-100   text-green-700   border-green-200",
  professional: "bg-indigo-100  text-indigo-700  border-indigo-200",
  parent:       "bg-pink-100    text-pink-600    border-pink-200",
};

const communityInitialColors: Record<string, string> = {
  adhd:         "bg-violet-100  text-violet-700  border-violet-200",
  autism:       "bg-blue-100    text-blue-700    border-blue-200",
  dyslexia:     "bg-teal-100    text-teal-700    border-teal-200",
  anxiety:      "bg-yellow-100  text-yellow-700  border-yellow-200",
  depression:   "bg-slate-100   text-slate-500   border-slate-200",
  student:      "bg-green-100   text-green-700   border-green-200",
  professional: "bg-indigo-100  text-indigo-700  border-indigo-200",
  parent:       "bg-pink-100    text-pink-600    border-pink-200",
};

export default function ResourceCard({
  resource,
  intent,
  rank,
}: Readonly<{
  resource: Resource;
  intent: Intent;
  rank: number;
}>) {
  const badge = urgencyBadge[resource.urgency] ?? urgencyBadge.low;
  const shortAction = resource.nextAction.length > 90
    ? resource.nextAction.slice(0, 90) + "…"
    : resource.nextAction;

  return (
    <div
      className="rounded-2xl border border-edge bg-card px-5 py-4 transition-all duration-200 hover:-translate-y-px hover:border-accent/30"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
    >
      {/* ── Top row ── */}
      <div className="flex items-start gap-4">
        {/* Left block */}
        <div className="min-w-0 flex-1">
          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted">
              #{String(rank).padStart(2, "0")}
            </span>
            <span className="font-semibold text-bright">{resource.name}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
            >
              {badge.label}
            </span>
            {resource.humanSupport && (
              <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                Human Support
              </span>
            )}
          </div>

          {/* Metadata row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-1 text-xs text-muted">
              <svg className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M3.75 3.104c.251.023.501.05.75.082m.75-.082a24.301 24.301 0 014.5 0" />
              </svg>
              {resource.problems.includes(intent.problem)
                ? <strong className="font-medium text-soft">{intent.problem}</strong>
                : resource.problems[0]}
            </span>
            <span className="text-xs text-edge-light">·</span>
            {resource.communities.slice(0, 4).map((c) => (
              <span
                key={c}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${communityColors[c] ?? "border-edge bg-surface text-soft"}`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
            {resource.description}
          </p>

          {/* Next action */}
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-soft">
            <svg className="h-3 w-3 shrink-0 text-accent" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
            {shortAction}
          </p>
        </div>

        {/* Right block */}
        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="flex -space-x-2">
            {resource.communities.slice(0, 3).map((c) => (
              <div
                key={c}
                title={c}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold uppercase ${communityInitialColors[c] ?? "bg-slate-100 text-slate-500"}`}
              >
                {c[0]}
              </div>
            ))}
          </div>
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
            className="rounded-full border border-edge bg-surface px-4 py-1.5 text-xs font-medium text-soft transition-all duration-200 hover:-translate-y-px hover:border-accent/40 hover:text-accent"
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"; }}
          >
            Visit →
          </a>
        </div>
      </div>

      <WhyThisToggle resource={resource} intent={intent} />
    </div>
  );
}
