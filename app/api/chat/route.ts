import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // In Next.js App Router, the method is usually inferred, but this check matches the provided example.
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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // --- Build Comprehensive System Context ---
    // Start with the general chatbot context from environment variables
    let comprehensiveSystemContext = process.env.CHATBOT_CONTEXT || "You are a helpful AI assistant.";

    // Append the detailed context from processedData
    if (processedData && processedData.processedFiles) {
      comprehensiveSystemContext += `\n\nYou have access to the following processed business documents:\n\n`;

      processedData.processedFiles.forEach((file: any, index: number) => {
        comprehensiveSystemContext += `Document ${index + 1}: ${file.name}\n`;
        comprehensiveSystemContext += `- Type: ${file.type}\n`;
        comprehensiveSystemContext += `- Analyzed by: ${file.agent}\n`;
        comprehensiveSystemContext += `- Key Insights: ${file.agentAnalysis.insights.join(", ")}\n`;
        comprehensiveSystemContext += `- Recommendations: ${file.agentAnalysis.recommendations.join(", ")}\n`;
        // Ensure this 'content' field is populated with actual parsed text from process-files/route.ts
        comprehensiveSystemContext += `- Content Preview: ${file.content.substring(0, 200)}...\n\n`;
      });

      if (processedData.extractedInsights) {
        comprehensiveSystemContext += `\nKey Business Metrics:\n`;
        comprehensiveSystemContext += `- Total Leads: ${processedData.extractedInsights.crmData?.totalLeads}\n`;
        comprehensiveSystemContext += `- Conversion Rate: ${processedData.extractedInsights.crmData?.conversionRate}%\n`;
        comprehensiveSystemContext += `- Total Revenue: $${processedData.extractedInsights.salesData?.totalRevenue?.toLocaleString()}\n`;
        comprehensiveSystemContext += `- Growth Rate: ${processedData.extractedInsights.salesData?.growthRate}%\n`;
        comprehensiveSystemContext += `- Campaign ROI: ${processedData.extractedInsights.campaignData?.totalROI}x\n`;
        comprehensiveSystemContext += `- Customer Satisfaction: ${processedData.extractedInsights.feedback?.satisfactionScore}/5\n`;
      }
    }
    // Final instruction for the AI, appended to the comprehensive context
    comprehensiveSystemContext += `\n\nProvide detailed, actionable insights based on the document analysis. Be specific and reference the actual data when possible.`;


    // Prepare messages for the Gemini API
    let contentToSend: any[] = [];

    // Prepend the comprehensive system context as the first user message,
    // as per the structure of the example you provided.
    // Note: Gemini API often has a dedicated 'system_instruction' parameter in SDKs,
    // but direct REST API calls using 'contents' array typically use 'user' or 'model' roles.
    contentToSend.push({ role: "user", parts: [{ text: comprehensiveSystemContext }] });

    // Add the rest of the user's chat messages
    messages.forEach((msg: any) => {
        contentToSend.push({
            role: msg.role === "user" ? "user" : "model", // Map roles as per Gemini API expectation
            parts: [{ text: msg.content }],
        });
    });

    // --- Optional Debugging: Uncomment to see the full payload sent to Gemini ---
    // console.log("DEBUG: Full Payload Contents to Gemini API:", JSON.stringify(contentToSend, null, 2));


    // Retry mechanism for Gemini API 503 errors
    const maxRetries = 3;
    let attempt = 0;
    let lastError;
    let data = null;
    let reply = null;
    while (attempt < maxRetries) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: contentToSend,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (response.ok) {
        data = await response.json();
        console.log("Gemini API raw response:", JSON.stringify(data, null, 2));
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Gemini API reply:", reply);
        if (!reply) {
          console.error("Gemini API returned no reply. Full response:", JSON.stringify(data, null, 2));
        }
        break;
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.code === 503) {
            attempt++;
            lastError = errorJson;
            console.warn(`Gemini API 503 error (attempt ${attempt}): ${errorJson.error.message}`);
            await new Promise(res => setTimeout(res, 1000 * attempt));
            continue;
          } else {
            console.error("Gemini API error:", errorText);
            return NextResponse.json({ error: `Gemini API Error: ${errorText}` }, { status: response.status });
          }
        } catch (e) {
          // Not JSON, treat as fatal
          console.error("Gemini API error (non-JSON):", errorText);
          return NextResponse.json({ error: `Gemini API Error: ${errorText}` }, { status: response.status });
        }
      }
    }

    if (!reply) {
      console.error("Gemini API failed after retries or returned no valid answer", lastError || data);
      return NextResponse.json({ error: "Gemini API unavailable or returned no valid answer. Check logs for details." }, { status: 502 });
    }

    // Return the message in the format expected by useChat (message property)
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