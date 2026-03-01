"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { routeResources } from "@/lib/rules";
import type { Intent, Urgency } from "@/lib/types";
import ResourceCard from "@/components/ResourceCard";

type TabKey = "all" | Urgency;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",    label: "All"    },
  { key: "low",    label: "Low"    },
  { key: "medium", label: "Medium" },
  { key: "high",   label: "High"   },
  { key: "crisis", label: "Crisis" },
];

const tabBadgeStyle: Record<string, string> = {
  low:    "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high:   "bg-red-100 text-red-500",
  crisis: "bg-red-500 text-white",
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab]   = useState<TabKey>("all");
  const [showCount, setShowCount]   = useState(10);

  const intent: Intent | null = useMemo(() => {
    const q = searchParams.get("q");
    if (!q) return null;
    try { return JSON.parse(decodeURIComponent(q)) as Intent; }
    catch { return null; }
  }, [searchParams]);

  const allResults = useMemo(() => {
    if (!intent) return [];
    return routeResources(intent);
  }, [intent]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allResults.length };
    for (const r of allResults) {
      counts[r.resource.urgency] = (counts[r.resource.urgency] ?? 0) + 1;
    }
    return counts;
  }, [allResults]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return allResults;
    return allResults.filter((r) => r.resource.urgency === activeTab);
  }, [allResults, activeTab]);

  const displayed = filtered.slice(0, showCount);
  const hasMore   = filtered.length > showCount;

  if (!intent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-bright">No results to show</h1>
        <p className="mt-2 text-soft">Head back and tell us what you need.</p>
        <Link
          href="/flow"
          className="mt-6 rounded-full bg-accent px-6 py-2.5 font-medium text-white transition hover:bg-accent-light"
        >
          Start over
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">

        {/* ── Page header ── */}
        <div className="flex items-end justify-between">
          <div>
            <Link
              href="/flow"
              className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-soft"
            >
              ← Back
            </Link>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-bright">
              Resources
            </h1>
          </div>
          <Link
            href="/flow"
            style={{ boxShadow: "0 6px 14px rgba(91,124,250,0.35)" }}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-light active:translate-y-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" />
            </svg>
            New Search
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-6 flex items-center gap-0.5 border-b border-edge">
          {TABS.map(({ key, label }) => {
            const count = tabCounts[key] ?? 0;
            if (key !== "all" && count === 0) return null;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setShowCount(10); }}
                className={`relative flex cursor-pointer items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition
                  ${isActive
                    ? "text-bright after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t after:bg-accent"
                    : "text-muted hover:text-soft"
                  }`}
              >
                {label}
                {key !== "all" && count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${tabBadgeStyle[key] ?? "bg-surface text-soft"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <span className="ml-auto pb-2.5 text-xs text-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── List ── */}
        <div className="mt-4 space-y-3">
          {displayed.map((scored, index) => (
            <div
              key={scored.resource.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ResourceCard
                resource={scored.resource}
                intent={intent}
                rank={index + 1}
              />
            </div>
          ))}
          {displayed.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              No resources in this category.
            </p>
          )}
        </div>

        {/* ── Load more ── */}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowCount((c) => c + 5)}
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
              className="cursor-pointer rounded-full border border-edge bg-card px-6 py-2.5 text-sm font-medium text-soft transition-all duration-200 hover:-translate-y-px hover:border-accent/40 hover:text-accent active:translate-y-0"
            >
              Show more
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-soft">Loading results…</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
