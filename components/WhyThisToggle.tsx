"use client";

import { useState } from "react";
import type { Resource, Intent } from "@/lib/types";

export default function WhyThisToggle({
  resource,
  intent,
}: Readonly<{
  resource: Resource;
  intent: Intent;
}>) {
  const [open, setOpen] = useState(false);

  const matchedCommunities = resource.communities.filter((c) =>
    intent.communities.includes(c)
  );
  const problemMatch = resource.problems.includes(intent.problem);
  const urgencyMatch = resource.urgency === intent.urgency;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-1 text-xs text-muted transition hover:text-accent"
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▸
        </span>
        {open ? "Hide explanation" : "Why this?"}
      </button>
      <div
        className={
          "overflow-hidden transition-all duration-300 " +
          (open ? "max-h-40" : "max-h-0")
        }
      >
        <div className="mt-2 rounded-xl border border-edge bg-surface p-3 text-xs leading-relaxed text-soft" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <p>
            Matched because:{" "}
            {matchedCommunities.length > 0 && (
              <span>
                community match (
                <span className="text-success">
                  {matchedCommunities.join(", ")}
                </span>
                ){problemMatch || urgencyMatch ? ", " : ""}
              </span>
            )}
            {problemMatch && (
              <span>
                problem match (
                <span className="text-success">{intent.problem}</span>)
                {urgencyMatch ? ", " : ""}
              </span>
            )}
            {urgencyMatch && (
              <span>
                urgency match (
                <span className="text-success">{intent.urgency}</span>)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
