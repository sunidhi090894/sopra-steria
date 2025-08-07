// // Simulated AI agents for business intelligence
// export interface AgentAnalysis {
//   insights: string[]
//   recommendations: string[]
//   confidence: number
//   keyMetrics: Record<string, any>
// }

// export interface ProcessedFile {
//   name: string
//   size: number
//   type: string
//   uploadDate: string
//   agent: string
//   agentId: string
//   content: string
//   agentAnalysis: AgentAnalysis
// }

// // Simulate different AI agents based on file content/name
// export function assignAgent(fileName: string, content: string): string {
//   const lowerName = fileName.toLowerCase()
//   const lowerContent = content.toLowerCase()

//   if (lowerName.includes("crm") || lowerName.includes("customer") || lowerName.includes("lead")) {
//     return "CRM Intelligence Agent"
//   }
//   if (lowerName.includes("sales") || lowerName.includes("revenue") || lowerContent.includes("sales")) {
//     return "Sales Performance Agent"
//   }
//   if (lowerName.includes("marketing") || lowerName.includes("campaign") || lowerContent.includes("marketing")) {
//     return "Marketing Campaign Agent"
//   }
//   if (lowerName.includes("feedback") || lowerName.includes("review") || lowerContent.includes("feedback")) {
//     return "Customer Feedback Agent"
//   }
//   if (lowerName.includes("operations") || lowerName.includes("process") || lowerContent.includes("operations")) {
//     return "Operations Intelligence Agent"
//   }

//   // Default to CRM agent
//   return "CRM Intelligence Agent"
// }

// export function getAgentId(agentName: string): string {
//   const agentMap: Record<string, string> = {
//     "CRM Intelligence Agent": "crm-agent",
//     "Sales Performance Agent": "sales-agent",
//     "Marketing Campaign Agent": "marketing-agent",
//     "Customer Feedback Agent": "feedback-agent",
//     "Operations Intelligence Agent": "operations-agent",
//   }
//   return agentMap[agentName] || "crm-agent"
// }

// // Simulate agent analysis based on content
// export function simulateAgentAnalysis(agentName: string, content: string): AgentAnalysis {
//   const baseInsights = [
//     "Document contains valuable business data",
//     "Key patterns identified in the content",
//     "Actionable metrics extracted successfully",
//   ]

//   const baseRecommendations = [
//     "Consider implementing data-driven decision making",
//     "Monitor key performance indicators regularly",
//     "Establish clear measurement frameworks",
//   ]

//   // Agent-specific analysis
//   switch (agentName) {
//     case "CRM Intelligence Agent":
//       return {
//         insights: [
//           "Customer engagement patterns show strong potential",
//           "Lead conversion opportunities identified",
//           "Customer satisfaction metrics are trackable",
//         ],
//         recommendations: [
//           "Implement automated lead scoring system",
//           "Develop customer retention strategies",
//           "Create personalized engagement campaigns",
//         ],
//         confidence: 92,
//         keyMetrics: {
//           totalLeads: 1250,
//           conversionRate: 18.5,
//           customerSatisfaction: 4.2,
//         },
//       }

//     case "Sales Performance Agent":
//       return {
//         insights: [
//           "Revenue trends show consistent growth patterns",
//           "Product performance varies across segments",
//           "Sales cycle optimization opportunities exist",
//         ],
//         recommendations: [
//           "Focus on high-performing product lines",
//           "Optimize sales funnel conversion rates",
//           "Implement predictive sales forecasting",
//         ],
//         confidence: 89,
//         keyMetrics: {
//           totalRevenue: 2450000,
//           growthRate: 15.3,
//           avgDealSize: 12500,
//         },
//       }

//     case "Marketing Campaign Agent":
//       return {
//         insights: [
//           "Campaign performance shows strong ROI potential",
//           "Audience segmentation opportunities identified",
//           "Channel effectiveness varies significantly",
//         ],
//         recommendations: [
//           "Reallocate budget to high-performing channels",
//           "Develop targeted audience segments",
//           "Implement A/B testing for campaigns",
//         ],
//         confidence: 87,
//         keyMetrics: {
//           campaignROI: 3.2,
//           clickThroughRate: 2.8,
//           conversionRate: 4.1,
//         },
//       }

//     case "Customer Feedback Agent":
//       return {
//         insights: [
//           "Customer sentiment analysis reveals key themes",
//           "Product satisfaction scores are measurable",
//           "Support ticket patterns show improvement areas",
//         ],
//         recommendations: [
//           "Address common customer pain points",
//           "Implement proactive customer support",
//           "Develop customer success programs",
//         ],
//         confidence: 94,
//         keyMetrics: {
//           satisfactionScore: 4.1,
//           npsScore: 67,
//           responseTime: 2.3,
//         },
//       }

//     case "Operations Intelligence Agent":
//       return {
//         insights: [
//           "Process efficiency metrics show optimization potential",
//           "Resource utilization patterns identified",
//           "Bottleneck analysis reveals key constraints",
//         ],
//         recommendations: [
//           "Automate repetitive manual processes",
//           "Optimize resource allocation strategies",
//           "Implement continuous improvement frameworks",
//         ],
//         confidence: 85,
//         keyMetrics: {
//           efficiency: 78.5,
//           utilization: 82.3,
//           costSavings: 125000,
//         },
//       }

//     default:
//       return {
//         insights: baseInsights,
//         recommendations: baseRecommendations,
//         confidence: 80,
//         keyMetrics: {},
//       }
//   }
// }

// // Generate comprehensive insights from all processed files
// export function generateComprehensiveInsights(processedFiles: ProcessedFile[]) {
//   const allInsights = processedFiles.flatMap((file) => file.agentAnalysis.insights)
//   const allRecommendations = processedFiles.flatMap((file) => file.agentAnalysis.recommendations)
//   const avgConfidence =
//     processedFiles.reduce((sum, file) => sum + file.agentAnalysis.confidence, 0) / processedFiles.length

//   return {
//     totalFiles: processedFiles.length,
//     processedFiles,
//     agentsSummary: {
//       totalAgents: new Set(processedFiles.map((f) => f.agentId)).size,
//       averageConfidence: avgConfidence,
//       totalInsights: allInsights.length,
//       totalRecommendations: allRecommendations.length,
//     },
//     extractedInsights: {
//       crmData: {
//         totalLeads: 1250,
//         conversionRate: 18.5,
//         topPerformingSegment: "Enterprise Clients",
//       },
//       salesData: {
//         totalRevenue: 2450000,
//         growthRate: 15.3,
//         topProduct: "Premium Analytics Suite",
//       },
//       campaignData: {
//         totalROI: 3.2,
//         avgCTR: 2.8,
//         bestPerformingCampaign: "Q4 Digital Campaign",
//       },
//       feedback: {
//         satisfactionScore: 4.1,
//         overallSentiment: "Positive",
//         commonIssues: ["Response Time", "Feature Requests", "Integration Issues"],
//       },
//     },
//   }
// }

// export function assignAgentToDocument() {
//   console.log("assignAgentToDocument function - placeholder")
// }

// export function processWithAgent() {
//   console.log("processWithAgent function - placeholder")
// }



// lib/crew-agents.ts
// Updated to prepare data for AI analysis instead of providing static data

export interface AgentAnalysis {
  insights: string[]
  recommendations: string[]
  confidence: number
  keyMetrics: Record<string, any>
}

export interface ProcessedFile {
  name: string
  size: number
  type: string
  uploadDate: string
  agent: string
  agentId: string
  content: string // Now contains the full, parsed content
}

// Assigns agents based on the document's name or content
export function assignAgent(fileName: string, content: string): string {
  const lowerName = fileName.toLowerCase();
  const lowerContent = content.toLowerCase();

  if (lowerName.includes("crm") || lowerContent.includes("crm") || lowerContent.includes("customer")) {
    return "CRM Intelligence Agent";
  }
  if (lowerName.includes("sales") || lowerContent.includes("sales") || lowerContent.includes("revenue")) {
    return "Sales Performance Agent";
  }
  if (lowerName.includes("marketing") || lowerContent.includes("marketing") || lowerContent.includes("campaign")) {
    return "Marketing Campaign Agent";
  }
  if (lowerName.includes("feedback") || lowerContent.includes("feedback") || lowerContent.includes("review")) {
    return "Customer Feedback Agent";
  }
  if (lowerName.includes("operations") || lowerContent.includes("operations") || lowerContent.includes("process")) {
    return "Operations Intelligence Agent";
  }

  // Default to a general agent
  return "General Business Agent";
}

export function getAgentId(agentName: string): string {
  const agentMap: Record<string, string> = {
    "CRM Intelligence Agent": "crm-agent",
    "Sales Performance Agent": "sales-agent",
    "Marketing Campaign Agent": "marketing-agent",
    "Customer Feedback Agent": "feedback-agent",
    "Operations Intelligence Agent": "operations-agent",
    "General Business Agent": "general-agent"
  };
  return agentMap[agentName] || "general-agent";
}

// These functions will now be placeholders as the actual work will be done by the Gemini API in the chat route.
export function simulateAgentAnalysis(agentName: string, content: string): any {
  // This function is no longer used for generating real data, 
  // but is kept to maintain the existing data structure for the frontend.
  // The real analysis happens in the chat route.
  return {
    insights: ["AI analysis is pending..."],
    recommendations: ["AI analysis is pending..."],
    confidence: 0,
    keyMetrics: {}
  };
}

export function generateComprehensiveInsights(processedFiles: ProcessedFile[]) {
  // This function is also no longer generating hardcoded data.
  // Instead, it consolidates the processed file information for the chat route.
  const allContent = processedFiles.map(f => f.content).join("\n\n---\n\n");
  const agentSummary = {
    totalAgents: new Set(processedFiles.map(f => f.agentId)).size,
    totalFiles: processedFiles.length,
  };

  return {
    totalFiles: processedFiles.length,
    processedFiles,
    agentsSummary: agentSummary,
    extractedContent: allContent, // Pass the full content to the chat route
  };
}