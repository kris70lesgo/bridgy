"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import type { Community, Problem, Urgency } from "@/lib/types";

const communityOptions = [
  { label: "ADHD", value: "adhd" },
  { label: "Autism", value: "autism" },
  { label: "Dyslexia", value: "dyslexia" },
  { label: "Anxiety", value: "anxiety" },
  { label: "Depression", value: "depression" },
  { label: "Student", value: "student" },
  { label: "Professional", value: "professional" },
  { label: "Parent", value: "parent" },
];

const problemOptions = [
  { label: "Planning", value: "planning" },
  { label: "Getting started", value: "task-initiation" },
  { label: "Staying focused", value: "focus" },
  { label: "Sensory needs", value: "sensory" },
  { label: "Social challenges", value: "social" },
  { label: "Emotional regulation", value: "emotional-regulation" },
  { label: "Time management", value: "time-management" },
  { label: "Organization", value: "organization" },
  { label: "Motivation", value: "motivation" },
  { label: "Sleep", value: "sleep" },
  { label: "Communication", value: "communication" },
  { label: "Overwhelm", value: "overwhelm" },
];

const urgencyOptions = [
  { label: "Low: just exploring", value: "low" },
  { label: "Medium: need help soon", value: "medium" },
  { label: "High: struggling now", value: "high" },
  { label: "Crisis: need help immediately", value: "crisis" },
];

export default function FlowPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"text" | "manual">("manual");
  const [textInput, setTextInput] = useState("");
  const [communities, setCommunities] = useState<string[]>([]);
  const [problem, setProblem] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<string[]>([]);
  const [wantsHumanHelp, setWantsHumanHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCommunity = (value: string) => {
    setCommunities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const selectProblem = (value: string) => {
    setProblem([value]);
  };

  const selectUrgency = (value: string) => {
    setUrgency([value]);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textInput }),
      });
      const intent = await res.json();
      router.push(`/results?q=${encodeURIComponent(JSON.stringify(intent))}`);
    } catch {
      setMode("manual");
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (communities.length === 0 || problem.length === 0 || urgency.length === 0)
      return;
    const intent = {
      communities: communities as Community[],
      problem: problem[0] as Problem,
      timeframe:
        urgency[0] === "crisis"
          ? "today"
          : urgency[0] === "high"
            ? "this-week"
            : "ongoing",
      urgency: urgency[0] as Urgency,
      wantsHumanHelp,
    };
    router.push(`/results?q=${encodeURIComponent(JSON.stringify(intent))}`);
  };

  const canSubmitManual =
    communities.length > 0 && problem.length > 0 && urgency.length > 0;

  return (
    <div className="min-h-screen bg-base px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-soft"
        >
          ← Back
        </Link>

        {/* Header */}
        <h1 className="mt-6 text-3xl font-bold text-bright">
          Tell us what you need
        </h1>
        <p className="mt-2 text-soft">
          We&apos;ll match you with the right tools and resources.
        </p>

        {/* Mode toggle */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setMode(mode === "text" ? "manual" : "text")}
            className="cursor-pointer text-sm text-accent transition hover:text-accent-light"
          >
            {mode === "text"
              ? "Prefer not to type? Answer 3 quick questions."
              : "Want to type instead? Describe what you need."}
          </button>
        </div>

        {mode === "text" ? (
          /* ── Free-text mode ── */
          <div className="mt-6 space-y-4">
            {/* Toolbar */}
            <div
              className="flex items-center gap-1 rounded-t-xl border border-b-0 border-edge bg-card px-3 py-2"
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
            >
              {["B", "I", "U"].map((f) => (
                <button
                  key={f}
                  type="button"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-edge bg-surface text-xs font-semibold text-soft transition hover:border-accent/40 hover:text-accent"
                >
                  {f}
                </button>
              ))}
              <div className="mx-1 h-4 w-px bg-edge" />
              {["📎", "🖼"].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-edge bg-surface text-sm text-soft transition hover:border-accent/40 hover:text-accent"
                >
                  {icon}
                </button>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your message…"
              rows={5}
              className="w-full resize-none rounded-b-xl border border-edge bg-input px-4 py-3.5 text-[15px] text-bright placeholder:text-muted transition-all focus:outline-none"
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#5B7CFA";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(91,124,250,0.18)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
              }}
            />
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={loading || !textInput.trim()}
              style={{ boxShadow: loading || !textInput.trim() ? "none" : "0 6px 14px rgba(91,124,250,0.35)" }}
              className="cursor-pointer rounded-full bg-accent px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:translate-y-0"
            >
              {loading ? "Analyzing…" : "Find resources"}
            </button>
          </div>
        ) : (
          /* ── Manual mode ── */
          <div className="mt-8 space-y-10">
            <QuestionCard
              question="Which communities do you identify with?"
              options={communityOptions}
              selected={communities}
              onSelect={toggleCommunity}
            />
            <QuestionCard
              question="What&apos;s your main challenge right now?"
              options={problemOptions}
              selected={problem}
              onSelect={selectProblem}
            />
            <QuestionCard
              question="How urgent is this?"
              options={urgencyOptions}
              selected={urgency}
              onSelect={selectUrgency}
            />

            {/* Human help toggle */}
            <div>
              <button
                type="button"
                onClick={() => setWantsHumanHelp(!wantsHumanHelp)}
                style={wantsHumanHelp ? { boxShadow: "0 4px 12px rgba(91,124,250,0.25)" } : { boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0 ${
                  wantsHumanHelp
                    ? "border-accent bg-accent text-white"
                    : "border-edge bg-card text-soft hover:border-accent/40 hover:text-bright"
                }`}
              >
                {wantsHumanHelp ? "✓ " : ""}I&apos;d like resources with human support
              </button>
            </div>

            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={!canSubmitManual}
              style={{ boxShadow: canSubmitManual ? "0 6px 14px rgba(91,124,250,0.35)" : "none" }}
              className="cursor-pointer rounded-full bg-accent px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:translate-y-0"
            >
              Find resources
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
