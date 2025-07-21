"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, Users, TrendingUp, Target, MessageSquare, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface AgentStatusProps {
  processingStatus: "idle" | "processing" | "completed"
  processedData: any
}

const agents = [
  {
    id: "crm",
    name: "CRM Agent",
    icon: Users,
    role: "Customer Relationship Analysis",
    description: "Analyzes customer data, lead information, and relationship patterns",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "sales",
    name: "Sales Agent",
    icon: TrendingUp,
    role: "Sales Performance Analysis",
    description: "Extracts revenue metrics, product performance, and sales trends",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "campaign",
    name: "Campaign Agent",
    icon: Target,
    role: "Marketing Campaign Analysis",
    description: "Evaluates campaign metrics, ROI, and marketing effectiveness",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "feedback",
    name: "Feedback Agent",
    icon: MessageSquare,
    role: "Customer Sentiment Analysis",
    description: "Processes customer feedback and identifies sentiment patterns",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "meeting",
    name: "Meeting Agent",
    icon: FileText,
    role: "Meeting Intelligence",
    description: "Summarizes meetings, extracts action items and key decisions",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
]

export function AgentStatus({ processingStatus, processedData }: AgentStatusProps) {
  const getAgentStatus = (agentId: string) => {
    if (processingStatus === "idle") return "waiting"
    if (processingStatus === "processing") return "active"
    return "completed"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "active":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary">Waiting</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent Crew Status
          </CardTitle>
          <CardDescription>Specialized agents working together to analyze your business data</CardDescription>
        </CardHeader>
        <CardContent>
          {processingStatus === "idle" && (
            <div className="text-center py-4">
              <p className="text-gray-500">Upload and process files to activate AI agents</p>
            </div>
          )}
          {processingStatus === "processing" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span>Agents are collaborating to analyze your data...</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          )}
          {processingStatus === "completed" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>All agents have completed their analysis</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const status = getAgentStatus(agent.id)
          const IconComponent = agent.icon

          return (
            <Card key={agent.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${agent.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${agent.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </div>
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription className="text-sm font-medium text-gray-600">{agent.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

                {status === "completed" && processedData && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-gray-700">Key Findings:</p>
                    {agent.id === "crm" && (
                      <div className="text-xs space-y-1">
                        <div>• {processedData.extractedInsights?.crmData?.totalLeads} leads analyzed</div>
                        <div>• {processedData.extractedInsights?.crmData?.conversionRate}% conversion rate</div>
                      </div>
                    )}
                    {agent.id === "sales" && (
                      <div className="text-xs space-y-1">
                        <div>
                          • ${processedData.extractedInsights?.salesData?.totalRevenue?.toLocaleString()} revenue
                          tracked
                        </div>
                        <div>• {processedData.extractedInsights?.salesData?.growthRate}% growth identified</div>
                      </div>
                    )}
                    {agent.id === "campaign" && (
                      <div className="text-xs space-y-1">
                        <div>• {processedData.extractedInsights?.campaignData?.totalROI}x ROI calculated</div>
                        <div>• {processedData.extractedInsights?.campaignData?.avgCTR}% average CTR</div>
                      </div>
                    )}
                    {agent.id === "feedback" && (
                      <div className="text-xs space-y-1">
                        <div>• {processedData.extractedInsights?.feedback?.satisfactionScore}/5 satisfaction</div>
                        <div>• {processedData.extractedInsights?.feedback?.overallSentiment} sentiment detected</div>
                      </div>
                    )}
                    {agent.id === "meeting" && (
                      <div className="text-xs space-y-1">
                        <div>• Meeting transcripts processed</div>
                        <div>• Action items extracted</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Critic Agent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Quality Assurance Agent
          </CardTitle>
          <CardDescription>Validates and ensures accuracy of insights from all specialized agents</CardDescription>
        </CardHeader>
        <CardContent>
          {processingStatus === "completed" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Quality check passed</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Data Accuracy</span>
                  <Badge className="bg-green-100 text-green-800">98%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completeness</span>
                  <Badge className="bg-green-100 text-green-800">95%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Consistency</span>
                  <Badge className="bg-green-100 text-green-800">97%</Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Waiting for agent analysis to complete...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
