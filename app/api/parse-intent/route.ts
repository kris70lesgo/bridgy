import { NextResponse } from "next/server";
import type { Community, Problem, Urgency } from "@/lib/types";

const VALID_COMMUNITIES: Community[] = ["adhd", "autism", "dyslexia", "anxiety", "depression", "student", "professional", "parent"];
const VALID_PROBLEMS: Problem[] = ["planning", "task-initiation", "focus", "sensory", "social", "emotional-regulation", "time-management", "organization", "motivation", "sleep", "communication", "overwhelm"];
const VALID_URGENCIES: Urgency[] = ["low", "medium", "high", "crisis"];

const MODELS = ["z-ai/glm-4.5", "google/gemini-2.0-flash-001"] as const;

async function callLLM(apiKey: string, model: string, messages: { role: string; content: string }[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 256,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackParse(message));
  }

  const systemPrompt = `You are a structured data extractor. Given a user's message about their needs, extract a JSON object with these exact fields:
- communities: array of matching values from [${VALID_COMMUNITIES.join(", ")}]
- problem: single value from [${VALID_PROBLEMS.join(", ")}] (pick the most relevant)
- timeframe: string like "today", "this-week", "this-month", "ongoing"
- urgency: value from [${VALID_URGENCIES.join(", ")}]
- wantsHumanHelp: boolean

Return ONLY valid JSON. No extra text. No recommendations.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  for (const model of MODELS) {
    const content = await callLLM(apiKey, model, messages);
    if (!content) continue;

    try {
      const parsed = JSON.parse(content);
      const intent = {
        communities: (parsed.communities || []).filter((c: string) => VALID_COMMUNITIES.includes(c as Community)),
        problem: VALID_PROBLEMS.includes(parsed.problem) ? parsed.problem : "focus",
        timeframe: parsed.timeframe || "ongoing",
        urgency: VALID_URGENCIES.includes(parsed.urgency) ? parsed.urgency : "medium",
        wantsHumanHelp: Boolean(parsed.wantsHumanHelp),
      };
      return NextResponse.json(intent);
    } catch {
      continue;
    }
  }

  return NextResponse.json(fallbackParse(message));
}

function fallbackParse(message: string) {
  const lower = message.toLowerCase();
  const communities: Community[] = [];
  if (lower.includes("adhd") || lower.includes("attention")) communities.push("adhd");
  if (lower.includes("autis") || lower.includes("spectrum")) communities.push("autism");
  if (lower.includes("dyslex") || lower.includes("reading")) communities.push("dyslexia");
  if (lower.includes("anxi")) communities.push("anxiety");
  if (lower.includes("depress")) communities.push("depression");
  if (lower.includes("student") || lower.includes("school") || lower.includes("college") || lower.includes("exam") || lower.includes("university")) communities.push("student");
  if (lower.includes("work") || lower.includes("job") || lower.includes("career")) communities.push("professional");
  if (lower.includes("parent") || lower.includes("child") || lower.includes("kid")) communities.push("parent");

  let problem: Problem = "focus";
  if (lower.includes("plan")) problem = "planning";
  else if (lower.includes("start") || lower.includes("begin") || lower.includes("procrastinat")) problem = "task-initiation";
  else if (lower.includes("focus") || lower.includes("concentrat") || lower.includes("distract")) problem = "focus";
  else if (lower.includes("sensor") || lower.includes("noise") || lower.includes("overstimulat")) problem = "sensory";
  else if (lower.includes("social") || lower.includes("friend") || lower.includes("people")) problem = "social";
  else if (lower.includes("emotion") || lower.includes("anger") || lower.includes("frustrat") || lower.includes("meltdown")) problem = "emotional-regulation";
  else if (lower.includes("time") || lower.includes("late") || lower.includes("deadline")) problem = "time-management";
  else if (lower.includes("organiz") || lower.includes("mess") || lower.includes("clutter")) problem = "organization";
  else if (lower.includes("motivat") || lower.includes("energy") || lower.includes("tired")) problem = "motivation";
  else if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("rest")) problem = "sleep";
  else if (lower.includes("communicat") || lower.includes("speak") || lower.includes("talk")) problem = "communication";
  else if (lower.includes("overwhelm") || lower.includes("too much") || lower.includes("burnout")) problem = "overwhelm";

  let urgency: Urgency = "medium";
  if (lower.includes("crisis") || lower.includes("emergency") || lower.includes("suicid") || lower.includes("harm")) urgency = "crisis";
  else if (lower.includes("urgent") || lower.includes("now") || lower.includes("today") || lower.includes("can't")) urgency = "high";
  else if (lower.includes("soon") || lower.includes("this week") || lower.includes("exam")) urgency = "medium";

  return {
    communities: communities.length > 0 ? communities : ["student" as Community],
    problem,
    timeframe: urgency === "crisis" ? "today" : urgency === "high" ? "this-week" : "ongoing",
    urgency,
    wantsHumanHelp: lower.includes("help") || lower.includes("therap") || lower.includes("counsel") || lower.includes("talk to"),
  };
}
