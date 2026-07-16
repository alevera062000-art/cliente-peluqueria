import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/chatPrompt";
import type { ChatMessage } from "@/types";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400 },
        }),
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Error en la API de Gemini");

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Sin respuesta de Gemini");

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
