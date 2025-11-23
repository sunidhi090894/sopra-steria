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

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // New, more detailed system instruction to simulate agentic behavior
    let systemInstruction = `
      You are a master business intelligence agent. Your job is to answer the user's question by directing a team of specialized AI agents to analyze the provided documents.
      Your team consists of:
      - **Sales Performance Agent:** Specializes in analyzing sales reports, revenue trends, and growth metrics.
      - **CRM Intelligence Agent:** Focuses on customer data, leads, conversion rates, and retention strategies.
      - **Marketing Campaign Agent:** Analyzes campaign ROI, click-through rates, and audience segmentation.
      - **Customer Feedback Agent:** Interprets customer satisfaction scores, sentiment analysis, and support feedback.
      - **Operations Intelligence Agent:** Looks at process efficiency, resource utilization, and cost savings.

      Follow these steps to produce a high-quality, agentic response:
      1.  **Analyze the User's Query**: Understand what the user is asking for.
      2.  **Analyze Documents**: Carefully read and understand the content provided in the documents section below.
      3.  **Determine Relevance**: Based on the user's query and the documents' content, determine which of your specialized agents are relevant.
      4.  **Generate Report**: Create a detailed report that **only includes sections for the relevant agents**. Do not generate a section for an agent if the documents do not contain relevant information for that agent.
      5.  **Synthesize Findings**: For each relevant agent, provide an in-depth analysis including key metrics, insights, and specific recommendations based *only* on the document content.

      Here are the documents for your analysis:
    `;

    // Append the full extracted content from the processed files
    if (processedData && processedData.extractedContent) {
        systemInstruction += `\n\n--- Start of Documents for Analysis ---\n\n`;
        systemInstruction += processedData.extractedContent;
        systemInstruction += `\n\n--- End of Documents for Analysis ---\n\n`;
        systemInstruction += `\n\nNow, based on the documents above, answer the user's questions as a master business intelligence agent.`;
    } else {
        systemInstruction += "\n\nNo documents have been provided for analysis. Respond to general questions as a helpful AI assistant.";
    }

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const finalMessages = [{ role: "user", parts: [{ text: systemInstruction }] }, ...formattedMessages];
    
    console.log("Sending prompt to Gemini API with agentic instructions:", JSON.stringify(finalMessages, null, 2));

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




// import { type NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(request: NextRequest) {
//   if (request.method !== "POST") {
//     return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
//   }

//   try {
//     const { messages, processedData } = await request.json();

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json({ error: "Messages array required" }, { status: 400 });
//     }

//     const API_KEY = process.env.GEMINI_API_KEY;
//     if (!API_KEY) {
//       console.error("GEMINI_API_KEY environment variable is not set.");
//       return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
//     }

//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

//     // New, more detailed system instruction to simulate agentic behavior
//     let systemInstruction = `
//       You are a master business intelligence agent overseeing a team of specialized AI agents.
//       Your primary task is to receive documents and a user's question, then orchestrate a response by simulating the collaboration of your team.
//       Your team consists of:
//       - **Sales Performance Agent:** Specializes in analyzing sales reports, revenue trends, and growth metrics.
//       - **CRM Intelligence Agent:** Focuses on customer data, leads, conversion rates, and retention strategies.
//       - **Marketing Campaign Agent:** Analyzes campaign ROI, click-through rates, and audience segmentation.
//       - **Customer Feedback Agent:** Interprets customer satisfaction scores, sentiment analysis, and support feedback.
//       - **Operations Intelligence Agent:** Looks at process efficiency, resource utilization, and cost savings.

//       Based on the user's question, you will direct your team to analyze the provided documents. Your final response should synthesize the findings from each relevant agent in a structured, in-depth format.

//       Here is the step-by-step process you must follow:
//       1.  **Document Analysis**: Read and parse all content provided in the documents section.
//       2.  **Agent Tasking**: For the user's question, identify which of your specialized agents are relevant and perform a detailed analysis for each.
//       3.  **Insight Generation**: For each relevant agent, extract key metrics, provide actionable insights, and suggest specific recommendations based *only* on the document content.
//       4.  **Final Synthesis**: Combine all the agent findings into a single, comprehensive response. Use clear headings for each agent's contribution.

//       Here are the documents for your analysis:
//     `;

//     // Append the full extracted content from the processed files
//     if (processedData && processedData.extractedContent) {
//         systemInstruction += `\n\n--- Start of Documents for Analysis ---\n\n`;
//         systemInstruction += processedData.extractedContent;
//         systemInstruction += `\n\n--- End of Documents for Analysis ---\n\n`;
//         systemInstruction += `\n\nNow, based on the documents above, answer the user's questions as a master business intelligence agent.`;
//     } else {
//         systemInstruction += "\n\nNo documents have been provided for analysis. Respond to general questions as a helpful AI assistant.";
//     }

//     const formattedMessages = messages.map((msg: any) => ({
//       role: msg.role === "user" ? "user" : "model",
//       parts: [{ text: msg.content }],
//     }));

//     const finalMessages = [{ role: "user", parts: [{ text: systemInstruction }] }, ...formattedMessages];
    
//     console.log("Sending prompt to Gemini API with agentic instructions:", JSON.stringify(finalMessages, null, 2));

//     const result = await model.generateContent({
//       contents: finalMessages,
//       generationConfig: {
//         temperature: 0.7,
//         maxOutputTokens: 1000,
//       },
//     });

//     const reply = result.response.text();
//     console.log("Gemini API reply:", reply);

//     if (!reply) {
//       return NextResponse.json({ error: "Gemini API returned no reply." }, { status: 502 });
//     }

//     return NextResponse.json({
//       message: {
//         id: `${Date.now()}`,
//         role: "assistant",
//         content: reply,
//       }
//     }, { status: 200 });

//   } catch (err) {
//     console.error("Gemini API call failed:", err);
//     return NextResponse.json({ error: "Internal server error during API call" }, { status: 500 });
//   }
// }




// // app/api/chat/route.ts
// import { type NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(request: NextRequest) {
//   if (request.method !== "POST") {
//     return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
//   }

//   try {
//     const { messages, processedData } = await request.json();

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json({ error: "Messages array required" }, { status: 400 });
//     }

//     const API_KEY = process.env.GEMINI_API_KEY;
//     if (!API_KEY) {
//       console.error("GEMINI_API_KEY environment variable is not set.");
//       return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
//     }

//     // Initialize the Google Generative AI client
//     const genAI = new GoogleGenerativeAI(API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

//     // Build the AI's persona and context
//     let systemInstruction = "You are a specialized business intelligence AI assistant. Your purpose is to analyze documents and provide detailed, actionable insights based on the content provided.";

//     // Append the full extracted content from the processed files
//     if (processedData && processedData.extractedContent) {
//         systemInstruction += `\n\n--- Start of Documents for Analysis ---\n\n`;
//         systemInstruction += processedData.extractedContent;
//         systemInstruction += `\n\n--- End of Documents for Analysis ---\n\n`;
//         systemInstruction += `\n\nBased on the documents provided, answer the user's questions. Be specific and reference the content from the documents directly. If the information is not present, state that clearly.`;
//     } else {
//         systemInstruction += "\n\nNo documents have been provided for analysis. Respond to general questions as a helpful assistant.";
//     }

//     // Format messages for the API call
//     const formattedMessages = messages.map((msg: any) => ({
//       role: msg.role === "user" ? "user" : "model",
//       parts: [{ text: msg.content }],
//     }));

//     // Prepend the system instruction to the messages array to set the context for the model.
//     // NOTE: The Gemini API prefers system instructions to be in a separate parameter
//     // in the SDK, but in this implementation, we will prepend it to the message history.
//     const finalMessages = [{ role: "user", parts: [{ text: systemInstruction }] }, ...formattedMessages];
    
//     console.log("Sending prompt to Gemini API:", JSON.stringify(finalMessages, null, 2));

//     const result = await model.generateContent({
//         contents: finalMessages,
//         generationConfig: {
//             temperature: 0.7,
//             maxOutputTokens: 1000,
//         },
//     });

//     const reply = result.response.text();
//     console.log("Gemini API reply:", reply);

//     if (!reply) {
//       return NextResponse.json({ error: "Gemini API returned no reply." }, { status: 502 });
//     }

//     return NextResponse.json({
//       message: {
//         id: `${Date.now()}`,
//         role: "assistant",
//         content: reply,
//       }
//     }, { status: 200 });

//   } catch (err) {
//     console.error("Gemini API call failed:", err);
//     return NextResponse.json({ error: "Internal server error during API call" }, { status: 500 });
//   }
// }