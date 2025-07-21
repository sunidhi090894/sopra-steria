"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Users,
  TrendingUp,
  Target,
  MessageSquare,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  BarChart3,
} from "lucide-react"

interface AgentDashboardProps {
  processedData: any
  processingStatus: "idle" | "processing" | "completed"
}

export function AgentDashboard({ processedData, processingStatus }: AgentDashboardProps) {
  const agents = [
    {
      id: "crm-agent",
      name: "CRM Intelligence Agent",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Customer relationship analysis and lead optimization",
    },
    {
      id: "sales-agent",
      name: "Sales Performance Agent",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Revenue analysis and sales forecasting",
    },
    {
      id: "marketing-agent",
      name: "Marketing Campaign Agent",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Campaign ROI and audience insights",
    },
    {
      id: "feedback-agent",
      name: "Customer Feedback Agent",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Sentiment analysis and voice of customer",
    },
    {
      id: "operations-agent",
      name: "Operations Intelligence Agent",
      icon: Settings,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "Process optimization and efficiency analysis",
    },
  ]

  const getAgentStatus = (agentId: string) => {
    if (processingStatus === "idle") return "waiting"
    if (processingStatus === "processing") return "active"

    // Check if this agent was used
    const wasUsed = processedData?.processedFiles?.some((file: any) => file.agentId === agentId)
    return wasUsed ? "completed" : "unused"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "active":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "unused":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
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
      case "unused":
        return <Badge variant="outline">Not Used</Badge>
      default:
        return <Badge variant="destructive">Error</Badge>
    }
  }

  const getAgentResults = (agentId: string) => {
    return processedData?.processedFiles?.find((file: any) => file.agentId === agentId)?.agentAnalysis
  }

  if (processingStatus === "idle") {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent Crew
          </CardTitle>
          <CardDescription>Specialized AI agents ready to analyze your business documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Upload and process documents to activate AI agents</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent Crew Status
          </CardTitle>
          <CardDescription>Specialized agents analyzing your business data</CardDescription>
        </CardHeader>
        <CardContent>
          {processingStatus === "processing" && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span>Agents are collaborating to analyze your data...</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          )}

          {processingStatus === "completed" && processedData?.agentsSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">{processedData.agentsSummary.totalAgents}</div>
                <div className="text-sm text-gray-600">Agents Deployed</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">
                  {Math.round(processedData.agentsSummary.averageConfidence)}%
                </div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{processedData.totalFiles}</div>
                <div className="text-sm text-gray-600">Documents Analyzed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const status = getAgentStatus(agent.id)
          const IconComponent = agent.icon
          const results = getAgentResults(agent.id)

          return (
            <Card key={agent.id} className={`border-0 shadow-lg ${agent.bgColor} ${agent.borderColor} border`}>
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
                <CardDescription className="text-sm">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {status === "completed" && results && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BarChart3 className="h-4 w-4" />
                      Analysis Results
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Key Insights:</div>
                      <div className="space-y-1">
                        {results.insights.slice(0, 2).map((insight: string, index: number) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-1">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Top Recommendation:</div>
                      <div className="text-xs text-gray-700 flex items-start gap-1">
                        <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{results.recommendations[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-600">Confidence</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">{results.confidence}%</Badge>
                    </div>
                  </div>
                )}

                {status === "unused" && (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">No relevant documents for this agent</p>
                  </div>
                )}

                {status === "waiting" && (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">Waiting for document processing...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
