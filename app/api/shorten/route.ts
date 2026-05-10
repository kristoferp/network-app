import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  authToken: process.env.ANTHROPIC_AUTH_TOKEN,
  apiKey: process.env.ANTHROPIC_API_KEY || undefined,
});

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  const text = [title, description].filter(Boolean).join("\n\n");
  if (!text.trim()) {
    return NextResponse.json({ shortened: "" });
  }

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Shorten this notice to fit in a single SMS (max 160 characters). Keep the most important info. Return ONLY the shortened text, no explanation:\n\n${text}`,
      },
    ],
  });

  const shortened =
    msg.content[0].type === "text" ? msg.content[0].text.trim() : text.slice(0, 160);

  return NextResponse.json({ shortened });
}
