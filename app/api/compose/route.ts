import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt?.trim()) {
    return NextResponse.json({ title: "", description: "" });
  }

  try {
    const client = new Anthropic({
      authToken: process.env.ANTHROPIC_AUTH_TOKEN,
      apiKey: process.env.ANTHROPIC_API_KEY || undefined,
    });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `You are writing a property notice for residents. Based on the context below, generate a concise notice title and description.

Context: ${prompt}

Respond with valid JSON only (no markdown):
{"title": "short title under 60 chars", "description": "clear notice description 1-3 sentences"}`,
        },
      ],
    });

    let text = msg.content[0].type === "text" ? msg.content[0].text.trim() : "{}";
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ title: parsed.title ?? "", description: parsed.description ?? "" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "api_error" }, { status: 500 });
  }
}
