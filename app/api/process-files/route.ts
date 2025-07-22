import { type NextRequest, NextResponse } from "next/server"
import {
  assignAgent,
  getAgentId,
  simulateAgentAnalysis,
  generateComprehensiveInsights,
  type ProcessedFile,
} from "@/lib/crew-agents"

// Function to extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()
  const fileType = file.type

  try {
    if (fileType.includes("text/plain") || fileName.endsWith(".txt")) {
      return await file.text()
    }

    if (fileType.includes("text/csv") || fileName.endsWith(".csv")) {
      const text = await file.text()
      const lines = text.split("\n")
      const headers = lines[0]?.split(",") || []
      const dataRows = lines.slice(1, 6)

      let formattedText = `CSV Data Analysis:\nHeaders: ${headers.join(", ")}\n\nSample Data:\n`
      dataRows.forEach((row, index) => {
        if (row.trim()) {
          formattedText += `Row ${index + 1}: ${row}\n`
        }
      })
      formattedText += `\nTotal rows: ${lines.length - 1}`

      return formattedText
    }

    // Enhanced content extraction based on file names and types
    if (fileName.includes("crm") || fileName.includes("customer") || fileName.includes("lead")) {
      return `CRM Data Analysis from ${file.name}:
      
This document contains customer relationship management data including:
- Customer contact information and demographics
- Lead scoring and qualification data
- Sales pipeline and opportunity tracking
- Customer interaction history and touchpoints
- Account management and relationship data
- Customer lifecycle stage information

Key CRM metrics identified:
- Lead conversion rates and patterns
- Customer acquisition costs and channels
- Customer lifetime value calculations
- Churn risk indicators and patterns
- Sales cycle length and stages
- Territory and account performance

File size: ${(file.size / 1024).toFixed(2)} KB
Processing date: ${new Date().toISOString()}`
    }

    if (fileName.includes("sales") || fileName.includes("revenue")) {
      return `Sales Performance Analysis from ${file.name}:
      
This document contains comprehensive sales data including:
- Revenue figures and growth metrics by period
- Product/service performance and profitability
- Sales team individual and territory performance
- Deal pipeline and conversion analytics
- Customer acquisition and retention metrics
- Pricing analysis and margin optimization

Sales insights identified:
- Monthly/quarterly revenue trends and forecasts
- Top performing products and services
- Sales conversion rates by channel and source
- Average deal size and sales cycle analysis
- Customer lifetime value and retention rates
- Market segment and territory analysis

File size: ${(file.size / 1024).toFixed(2)} KB
Processing date: ${new Date().toISOString()}`
    }

    if (fileName.includes("campaign") || fileName.includes("marketing")) {
      return `Marketing Campaign Analysis from ${file.name}:
      
This document contains detailed marketing performance data including:
- Campaign performance metrics across all channels
- Click-through rates, conversion rates, and engagement
- Return on ad spend (ROAS) and marketing ROI
- Audience segmentation and targeting effectiveness
- A/B testing results and optimization insights
- Attribution modeling and customer journey analysis

Marketing insights identified:
- Digital marketing channel performance comparison
- Social media engagement and reach metrics
- Email marketing open rates and click performance
- Content performance and engagement analysis
- Lead generation effectiveness by campaign
- Customer acquisition cost by marketing channel

File size: ${(file.size / 1024).toFixed(2)} KB
Processing date: ${new Date().toISOString()}`
    }

    if (fileName.includes("feedback") || fileName.includes("review") || fileName.includes("survey")) {
      return `Customer Feedback Analysis from ${file.name}:
      
This document contains valuable customer voice data including:
- Customer satisfaction scores and ratings
- Product/service reviews and testimonials
- Support ticket analysis and resolution data
- Feature requests and enhancement suggestions
- Complaint categories and resolution patterns
- Net Promoter Score (NPS) and loyalty metrics

Feedback insights identified:
- Overall customer sentiment trends and patterns
- Most common customer pain points and issues
- Feature enhancement requests by priority
- Service quality feedback and improvement areas
- Customer retention and loyalty indicators
- Competitive comparison and positioning feedback

File size: ${(file.size / 1024).toFixed(2)} KB
Processing date: ${new Date().toISOString()}`
    }

    // Default extraction for other business documents
    return `Business Document Analysis from ${file.name}:
    
This business document contains strategic information including:
- Key performance indicators and business metrics
- Operational data and process information
- Strategic planning and decision-making data
- Financial performance and budget analysis
- Resource allocation and utilization data
- Market analysis and competitive intelligence

Business insights available:
- Performance trends and benchmark analysis
- Growth opportunities and market potential
- Operational efficiency and optimization areas
- Strategic recommendations and action items
- Risk assessment and mitigation strategies
- Resource optimization and cost analysis

File size: ${(file.size / 1024).toFixed(2)} KB
File type: ${file.type || "Unknown"}
Processing date: ${new Date().toISOString()}`
  } catch (error) {
    console.error("Error extracting text from file:", error)
    return `Error processing ${file.name}. File type: ${file.type}, Size: ${file.size} bytes`
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Process each file
    const processedFiles: ProcessedFile[] = []

    for (const file of files) {
      // Extract text content (simplified - in real app you'd use proper parsers)
      const content = await file.text()

      // Assign appropriate AI agent
      const agent = assignAgent(file.name, content)
      const agentId = getAgentId(agent)

      // Simulate agent analysis
      const agentAnalysis = simulateAgentAnalysis(agent, content)

      const processedFile: ProcessedFile = {
        name: file.name,
        size: file.size,
        type: file.type || "text/plain",
        uploadDate: new Date().toISOString(),
        agent,
        agentId,
        content: content.substring(0, 1000), // Truncate for demo
        agentAnalysis,
      }

      processedFiles.push(processedFile)
    }

    // Generate comprehensive insights
    const comprehensiveData = generateComprehensiveInsights(processedFiles)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${files.length} file(s)`,
      ...comprehensiveData,
    })
  } catch (error) {
    console.error("File processing error:", error)
    return NextResponse.json({ error: "Failed to process files" }, { status: 500 })
  }
}

function getFileType(filename: string, mimeType: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()
  const lowerFilename = filename.toLowerCase()

  if (lowerFilename.includes("crm") || lowerFilename.includes("customer") || lowerFilename.includes("lead")) {
    return "CRM Data"
  }
  if (lowerFilename.includes("sales") || lowerFilename.includes("revenue")) {
    return "Sales Report"
  }
  if (lowerFilename.includes("campaign") || lowerFilename.includes("marketing")) {
    return "Marketing Data"
  }
  if (lowerFilename.includes("feedback") || lowerFilename.includes("review")) {
    return "Customer Feedback"
  }

  if (extension === "csv" || mimeType.includes("csv")) return "CSV Data"
  if (extension === "pdf" || mimeType.includes("pdf")) return "PDF Document"
  if (extension === "xlsx" || extension === "xls" || mimeType.includes("spreadsheet")) return "Spreadsheet"
  if (mimeType.includes("image")) return "Scanned Document"
  if (extension === "txt" || mimeType.includes("text")) return "Text Document"

  return "Business Document"
}
