// import { type NextRequest, NextResponse } from "next/server"
// import {
//   assignAgent,
//   getAgentId,
//   simulateAgentAnalysis,
//   generateComprehensiveInsights,
//   type ProcessedFile,
// } from "@/lib/crew-agents"

// // Function to extract text from different file types
// async function extractTextFromFile(file: File): Promise<string> {
//   const fileName = file.name.toLowerCase()
//   const fileType = file.type

//   try {
//     if (fileType.includes("text/plain") || fileName.endsWith(".txt")) {
//       return await file.text()
//     }

//     if (fileType.includes("text/csv") || fileName.endsWith(".csv")) {
//       const text = await file.text()
//       const lines = text.split("\n")
//       const headers = lines[0]?.split(",") || []
//       const dataRows = lines.slice(1, 6)

//       let formattedText = `CSV Data Analysis:\nHeaders: ${headers.join(", ")}\n\nSample Data:\n`
//       dataRows.forEach((row, index) => {
//         if (row.trim()) {
//           formattedText += `Row ${index + 1}: ${row}\n`
//         }
//       })
//       formattedText += `\nTotal rows: ${lines.length - 1}`

//       return formattedText
//     }

//     // Enhanced content extraction based on file names and types
//     if (fileName.includes("crm") || fileName.includes("customer") || fileName.includes("lead")) {
//       return `CRM Data Analysis from ${file.name}:
      
// This document contains customer relationship management data including:
// - Customer contact information and demographics
// - Lead scoring and qualification data
// - Sales pipeline and opportunity tracking
// - Customer interaction history and touchpoints
// - Account management and relationship data
// - Customer lifecycle stage information

// Key CRM metrics identified:
// - Lead conversion rates and patterns
// - Customer acquisition costs and channels
// - Customer lifetime value calculations
// - Churn risk indicators and patterns
// - Sales cycle length and stages
// - Territory and account performance

// File size: ${(file.size / 1024).toFixed(2)} KB
// Processing date: ${new Date().toISOString()}`
//     }

//     if (fileName.includes("sales") || fileName.includes("revenue")) {
//       return `Sales Performance Analysis from ${file.name}:
      
// This document contains comprehensive sales data including:
// - Revenue figures and growth metrics by period
// - Product/service performance and profitability
// - Sales team individual and territory performance
// - Deal pipeline and conversion analytics
// - Customer acquisition and retention metrics
// - Pricing analysis and margin optimization

// Sales insights identified:
// - Monthly/quarterly revenue trends and forecasts
// - Top performing products and services
// - Sales conversion rates by channel and source
// - Average deal size and sales cycle analysis
// - Customer lifetime value and retention rates
// - Market segment and territory analysis

// File size: ${(file.size / 1024).toFixed(2)} KB
// Processing date: ${new Date().toISOString()}`
//     }

//     if (fileName.includes("campaign") || fileName.includes("marketing")) {
//       return `Marketing Campaign Analysis from ${file.name}:
      
// This document contains detailed marketing performance data including:
// - Campaign performance metrics across all channels
// - Click-through rates, conversion rates, and engagement
// - Return on ad spend (ROAS) and marketing ROI
// - Audience segmentation and targeting effectiveness
// - A/B testing results and optimization insights
// - Attribution modeling and customer journey analysis

// Marketing insights identified:
// - Digital marketing channel performance comparison
// - Social media engagement and reach metrics
// - Email marketing open rates and click performance
// - Content performance and engagement analysis
// - Lead generation effectiveness by campaign
// - Customer acquisition cost by marketing channel

// File size: ${(file.size / 1024).toFixed(2)} KB
// Processing date: ${new Date().toISOString()}`
//     }

//     if (fileName.includes("feedback") || fileName.includes("review") || fileName.includes("survey")) {
//       return `Customer Feedback Analysis from ${file.name}:
      
// This document contains valuable customer voice data including:
// - Customer satisfaction scores and ratings
// - Product/service reviews and testimonials
// - Support ticket analysis and resolution data
// - Feature requests and enhancement suggestions
// - Complaint categories and resolution patterns
// - Net Promoter Score (NPS) and loyalty metrics

// Feedback insights identified:
// - Overall customer sentiment trends and patterns
// - Most common customer pain points and issues
// - Feature enhancement requests by priority
// - Service quality feedback and improvement areas
// - Customer retention and loyalty indicators
// - Competitive comparison and positioning feedback

// File size: ${(file.size / 1024).toFixed(2)} KB
// Processing date: ${new Date().toISOString()}`
//     }

//     // Default extraction for other business documents
//     return `Business Document Analysis from ${file.name}:
    
// This business document contains strategic information including:
// - Key performance indicators and business metrics
// - Operational data and process information
// - Strategic planning and decision-making data
// - Financial performance and budget analysis
// - Resource allocation and utilization data
// - Market analysis and competitive intelligence

// Business insights available:
// - Performance trends and benchmark analysis
// - Growth opportunities and market potential
// - Operational efficiency and optimization areas
// - Strategic recommendations and action items
// - Risk assessment and mitigation strategies
// - Resource optimization and cost analysis

// File size: ${(file.size / 1024).toFixed(2)} KB
// File type: ${file.type || "Unknown"}
// Processing date: ${new Date().toISOString()}`
//   } catch (error) {
//     console.error("Error extracting text from file:", error)
//     return `Error processing ${file.name}. File type: ${file.type}, Size: ${file.size} bytes`
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const files = formData.getAll("files") as File[]

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files provided" }, { status: 400 })
//     }

//     // Process each file
//     const processedFiles: ProcessedFile[] = []

//     for (const file of files) {
//       // Extract text content (simplified - in real app you'd use proper parsers)
//       const content = await file.text()

//       // Assign appropriate AI agent
//       const agent = assignAgent(file.name, content)
//       const agentId = getAgentId(agent)

//       // Simulate agent analysis
//       const agentAnalysis = simulateAgentAnalysis(agent, content)

//       const processedFile: ProcessedFile = {
//         name: file.name,
//         size: file.size,
//         type: file.type || "text/plain",
//         uploadDate: new Date().toISOString(),
//         agent,
//         agentId,
//         content: content.substring(0, 1000), // Truncate for demo
//         agentAnalysis,
//       }

//       processedFiles.push(processedFile)
//     }

//     // Generate comprehensive insights
//     const comprehensiveData = generateComprehensiveInsights(processedFiles)

//     // Simulate processing delay
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     return NextResponse.json({
//       success: true,
//       message: `Successfully processed ${files.length} file(s)`,
//       ...comprehensiveData,
//     })
//   } catch (error) {
//     console.error("File processing error:", error)
//     return NextResponse.json({ error: "Failed to process files" }, { status: 500 })
//   }
// }

// function getFileType(filename: string, mimeType: string): string {
//   const extension = filename.split(".").pop()?.toLowerCase()
//   const lowerFilename = filename.toLowerCase()

//   if (lowerFilename.includes("crm") || lowerFilename.includes("customer") || lowerFilename.includes("lead")) {
//     return "CRM Data"
//   }
//   if (lowerFilename.includes("sales") || lowerFilename.includes("revenue")) {
//     return "Sales Report"
//   }
//   if (lowerFilename.includes("campaign") || lowerFilename.includes("marketing")) {
//     return "Marketing Data"
//   }
//   if (lowerFilename.includes("feedback") || lowerFilename.includes("review")) {
//     return "Customer Feedback"
//   }

//   if (extension === "csv" || mimeType.includes("csv")) return "CSV Data"
//   if (extension === "pdf" || mimeType.includes("pdf")) return "PDF Document"
//   if (extension === "xlsx" || extension === "xls" || mimeType.includes("spreadsheet")) return "Spreadsheet"
//   if (mimeType.includes("image")) return "Scanned Document"
//   if (extension === "txt" || mimeType.includes("text")) return "Text Document"

//   return "Business Document"
// }






import { type NextRequest, NextResponse } from "next/server";
import {
  assignAgent,
  getAgentId,
  simulateAgentAnalysis,
  generateComprehensiveInsights,
  type ProcessedFile,
} from "@/lib/crew-agents";

// --- Import necessary parsing libraries (install them first via pnpm add [library-name]) ---
// For PDFs:
// import pdfParse from 'pdf-parse'; // npm install pdf-parse
// For XLSX/Excel:
// import * as XLSX from 'xlsx'; // npm install xlsx
// For DOCX/Word:
// import mammoth from 'mammoth'; // npm install mammoth

// Node.js Buffer is often needed for parsing binary file ArrayBuffers
import { Buffer } from 'buffer';

// Function to extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  try {
    // 1. Handle plain text files (.txt) - Always return actual content
    if (fileType.includes("text/plain") || fileName.endsWith(".txt")) {
      return await file.text();
    }

    // 2. Handle CSV files (.csv) - Always return actual content
    if (fileType.includes("text/csv") || fileName.endsWith(".csv")) {
      return await file.text();
    }

    // --- IMPORTANT: ADD YOUR PARSING LOGIC FOR OTHER FILE TYPES BELOW ---

    // 3. Handle PDF files (.pdf)
    if (fileType.includes("application/pdf") || fileName.endsWith(".pdf")) {
      console.log(`Attempting to parse PDF: ${file.name}`);
      try {
        const arrayBuffer = await file.arrayBuffer();
        // --- YOUR PDF PARSING LOGIC HERE (using 'pdf-parse' or similar) ---
        // You need to uncomment 'import pdfParse from 'pdf-parse';' at the top
        // and add your implementation here. Example:
        // const data = await pdfParse(Buffer.from(arrayBuffer));
        // return `PDF Content from ${file.name}:\n${data.text}`;

        // Placeholder if parsing logic is not yet implemented:
        console.warn(`PDF parsing for ${file.name} is not fully implemented. Returning placeholder.`);
        return `[PDF Content for ${file.name} - Requires 'pdf-parse' library integration]`;
      } catch (pdfError) {
        console.error(`Error parsing PDF ${file.name}:`, pdfError);
        return `[Failed to parse PDF: ${file.name}] Error: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`;
      }
    }

    // 4. Handle XLSX/XLS (Excel) files
    if (
      fileType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      console.log(`Attempting to parse Excel: ${file.name}`);
      try {
        const arrayBuffer = await file.arrayBuffer();
        // --- YOUR EXCEL PARSING LOGIC HERE (using 'xlsx' library) ---
        // You need to uncomment 'import * as XLSX from 'xlsx';' at the top
        // and add your implementation here. Example (extracts text from first sheet):
        // const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: 'array' });
        // const sheetName = workbook.SheetNames[0]; // Get the first sheet's name
        // const worksheet = workbook.Sheets[sheetName];
        // return `Excel Content from ${file.name}:\n${XLSX.utils.sheet_to_txt(worksheet)}`; // Converts sheet to plain text

        // Placeholder if parsing logic is not yet implemented:
        console.warn(`Excel parsing for ${file.name} is not fully implemented. Returning placeholder.`);
        return `[Excel Content for ${file.name} - Requires 'xlsx' library integration]`;
      } catch (excelError) {
        console.error(`Error parsing Excel ${file.name}:`, excelError);
        return `[Failed to parse Excel: ${file.name}] Error: ${excelError instanceof Error ? excelError.message : String(excelError)}`;
      }
    }

    // 5. Handle DOCX (Word) files
    if (
      fileType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      fileName.endsWith(".docx")
    ) {
      console.log(`Attempting to parse DOCX: ${file.name}`);
      try {
        const arrayBuffer = await file.arrayBuffer();
        // --- YOUR DOCX PARSING LOGIC HERE (using 'mammoth' library) ---
        // You need to uncomment 'import mammoth from 'mammoth';' at the top
        // and add your implementation here. Example:
        // const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        // return `Word Document Content from ${file.name}:\n${result.value}`;

        // Placeholder if parsing logic is not yet implemented:
        console.warn(`DOCX parsing for ${file.name} is not fully implemented. Returning placeholder.`);
        return `[Word Document Content for ${file.name} - Requires 'mammoth' library integration]`;
      } catch (docxError) {
        console.error(`Error parsing DOCX ${file.name}:`, docxError);
        return `[Failed to parse DOCX: ${file.name}] Error: ${docxError instanceof Error ? docxError.message : String(docxError)}`;
      }
    }

    // Fallback for unsupported types, indicating actual content is missing
    console.warn(`Unsupported file type for full content extraction: ${file.name} (${file.type}).`);
    return `[Unsupported file type for full extraction] File: ${file.name}, Type: ${file.type || "Unknown"}, Size: ${(file.size / 1024).toFixed(2)} KB`;

  } catch (error) {
    console.error(`Generic error extracting text from file ${file.name}:`, error);
    return `Error processing ${file.name}. File type: ${file.type}, Size: ${file.size} bytes. Detailed error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const processedFiles: ProcessedFile[] = [];

    for (const file of files) {
      // Call the enhanced extractTextFromFile to get actual or placeholder content
      const extractedContent = await extractTextFromFile(file);

      // Assign appropriate AI agent based on file name and now potentially actual content
      const agent = assignAgent(file.name, extractedContent);
      const agentId = getAgentId(agent);

      // Simulate agent analysis - this function now receives the extracted content
      const agentAnalysis = simulateAgentAnalysis(agent, extractedContent);

      const processedFile: ProcessedFile = {
        name: file.name,
        size: file.size,
        type: file.type || "text/plain",
        uploadDate: new Date().toISOString(),
        agent,
        agentId,
        // The 'content' field in processedFile is for a preview, truncate it if needed
        content: extractedContent.substring(0, 1000),
        agentAnalysis,
      };

      processedFiles.push(processedFile);
    }

    // Generate comprehensive insights - this will now use files with richer content
    const comprehensiveData = generateComprehensiveInsights(processedFiles);

    // Simulate processing delay for demonstration, remove in production if not needed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${files.length} file(s)`,
      ...comprehensiveData,
    });
  } catch (error) {
    console.error("File processing error:", error);
    return NextResponse.json({ error: "Failed to process files" }, { status: 500 });
  }
}

// This helper function can remain if used elsewhere, but its logic for file type
// detection is now largely superseded by extractTextFromFile for content extraction.
function getFileType(filename: string, mimeType: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.includes("crm") || lowerFilename.includes("customer") || lowerFilename.includes("lead")) {
    return "CRM Data";
  }
  if (lowerFilename.includes("sales") || lowerFilename.includes("revenue")) {
    return "Sales Report";
  }
  if (lowerFilename.includes("campaign") || lowerFilename.includes("marketing")) {
    return "Marketing Data";
  }
  if (lowerFilename.includes("feedback") || lowerFilename.includes("review")) {
    return "Customer Feedback";
  }

  if (extension === "csv" || mimeType.includes("csv")) return "CSV Data";
  if (extension === "pdf" || mimeType.includes("pdf")) return "PDF Document";
  if (extension === "xlsx" || extension === "xls" || mimeType.includes("spreadsheet")) return "Spreadsheet";
  if (mimeType.includes("image")) return "Scanned Document";
  if (extension === "txt" || mimeType.includes("text")) return "Text Document";

  return "Business Document";
}