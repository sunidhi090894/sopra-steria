// app/api/chat/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { messages, processedData } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("GEMINI_API_KEY environment variable is not set.");
      return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Build the AI's persona and context
    let systemInstruction = "You are a specialized business intelligence AI assistant. Your purpose is to analyze documents and provide detailed, actionable insights based on the content provided.";

    // Append the full extracted content from the processed files
    if (processedData && processedData.extractedContent) {
        systemInstruction += `\n\n--- Start of Documents for Analysis ---\n\n`;
        systemInstruction += processedData.extractedContent;
        systemInstruction += `\n\n--- End of Documents for Analysis ---\n\n`;
        systemInstruction += `\n\nBased on the documents provided, answer the user's questions. Be specific and reference the content from the documents directly. If the information is not present, state that clearly.`;
    } else {
        systemInstruction += "\n\nNo documents have been provided for analysis. Respond to general questions as a helpful assistant.";
    }

    // Format messages for the API call
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Prepend the system instruction to the messages array to set the context for the model.
    // NOTE: The Gemini API prefers system instructions to be in a separate parameter
    // in the SDK, but in this implementation, we will prepend it to the message history.
    const finalMessages = [{ role: "user", parts: [{ text: systemInstruction }] }, ...formattedMessages];
    
    console.log("Sending prompt to Gemini API:", JSON.stringify(finalMessages, null, 2));

    const result = await model.generateContent({
        contents: finalMessages,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
        },
    });

    const reply = result.response.text();
    console.log("Gemini API reply:", reply);

    if (!reply) {
      return NextResponse.json({ error: "Gemini API returned no reply." }, { status: 502 });
    }

    return NextResponse.json({
      message: {
        id: `${Date.now()}`,
        role: "assistant",
        content: reply,
      }
    }, { status: 200 });

  } catch (err) {
    console.error("Gemini API call failed:", err);
    return NextResponse.json({ error: "Internal server error during API call" }, { status: 500 });
  }
}