import { NextResponse } from "next/server";

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
      body: JSON.stringify({ model, messages, max_tokens: 150 }),
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
  const { resource, intent } = await request.json();
  if (!resource || !intent) {
    return NextResponse.json({ error: "Resource and intent are required" }, { status: 400 });
  }

  const staticFallback = `${resource.name} is recommended because it addresses ${intent.problem.replace("-", " ")} and is designed for the ${resource.communities.join(", ")} community.`;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ explanation: staticFallback });
  }

  const messages = [
    {
      role: "system",
      content: "You write empathetic, concise explanations (1-2 sentences max). Explain why a resource was recommended for someone. Be warm but not condescending. No jargon.",
    },
    {
      role: "user",
      content: `Resource: ${resource.name} - ${resource.description}\nUser needs help with: ${intent.problem}\nCommunities: ${intent.communities.join(", ")}\nUrgency: ${intent.urgency}`,
    },
  ];

  for (const model of MODELS) {
    const explanation = await callLLM(apiKey, model, messages);
    if (explanation) {
      return NextResponse.json({ explanation });
    }
  }

  return NextResponse.json({ explanation: staticFallback });
}
