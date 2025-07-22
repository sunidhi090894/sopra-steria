import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages, processedData } = await req.json()

    // Create context from processed data
    let context = "You are an AI business intelligence assistant powered by Google Gemini. "

    if (processedData && processedData.processedFiles) {
      context += `You have access to the following processed business documents:\n\n`

      processedData.processedFiles.forEach((file: any, index: number) => {
        context += `Document ${index + 1}: ${file.name}\n`
        context += `- Type: ${file.type}\n`
        context += `- Analyzed by: ${file.agent}\n`
        context += `- Key Insights: ${file.agentAnalysis.insights.join(", ")}\n`
        context += `- Recommendations: ${file.agentAnalysis.recommendations.join(", ")}\n`
        context += `- Content Preview: ${file.content.substring(0, 200)}...\n\n`
      })

      if (processedData.extractedInsights) {
        context += `\nKey Business Metrics:\n`
        context += `- Total Leads: ${processedData.extractedInsights.crmData?.totalLeads}\n`
        context += `- Conversion Rate: ${processedData.extractedInsights.crmData?.conversionRate}%\n`
        context += `- Total Revenue: $${processedData.extractedInsights.salesData?.totalRevenue?.toLocaleString()}\n`
        context += `- Growth Rate: ${processedData.extractedInsights.salesData?.growthRate}%\n`
        context += `- Campaign ROI: ${processedData.extractedInsights.campaignData?.totalROI}x\n`
        context += `- Customer Satisfaction: ${processedData.extractedInsights.feedback?.satisfactionScore}/5\n`
      }
    }

    context += `\nProvide detailed, actionable insights based on the document analysis. Be specific and reference the actual data when possible.`

    const result = await streamText({
      model: google("gemini-1.5-pro-latest"),
      system: context,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
