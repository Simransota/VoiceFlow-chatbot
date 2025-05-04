import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: message,
      system: "You are a helpful AI assistant. Answer questions clearly and concisely in 1–2 sentences. Be direct and avoid unnecessary elaboration.",
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
