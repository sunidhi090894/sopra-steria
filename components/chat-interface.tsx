"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User, Lightbulb, ExternalLink } from "lucide-react"

interface ChatInterfaceProps {
  isDataReady: boolean
  processedData: any
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  recommendations?: Recommendation[]
  sources?: Source[]
}

interface Recommendation {
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
}

interface Source {
  type: string
  reference: string
  relevance: number
}

const sampleQuestions = [
  "Why did campaign A perform better than campaign B?",
  "What are customers most unhappy about?",
  "Which product should we focus on next quarter?",
  "What's driving our conversion rate changes?",
  "How can we improve customer satisfaction?",
]

export function ChatInterface({ isDataReady, processedData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateResponse = async (question: string): Promise<Message> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate contextual responses based on the question
    let response = ""
    let recommendations: Recommendation[] = []
    let sources: Source[] = []

    if (question.toLowerCase().includes("campaign")) {
      response = `Based on the analysis of your campaign data, Campaign A outperformed Campaign B primarily due to better audience targeting and timing. Campaign A achieved a ${processedData?.extractedInsights?.campaignData?.avgCTR}% CTR compared to Campaign B's 2.1% CTR.

Key factors contributing to Campaign A's success:
• More precise demographic targeting
• Optimal posting times (2-4 PM weekdays)
• Higher engagement content format
• Better call-to-action placement`

      recommendations = [
        {
          title: "Replicate Campaign A's targeting strategy",
          description: "Apply the same demographic and behavioral targeting parameters to future campaigns",
          confidence: 92,
          priority: "high",
        },
        {
          title: "Optimize posting schedule",
          description: "Schedule all campaigns during 2-4 PM weekday window for maximum engagement",
          confidence: 87,
          priority: "high",
        },
      ]

      sources = [
        { type: "Campaign Data", reference: "Q4_campaign_metrics.xlsx", relevance: 95 },
        { type: "Analytics Report", reference: "engagement_analysis.pdf", relevance: 88 },
      ]
    } else if (question.toLowerCase().includes("unhappy") || question.toLowerCase().includes("satisfaction")) {
      response = `Customer feedback analysis reveals that the primary sources of dissatisfaction are pricing concerns (mentioned in 34% of negative feedback) and feature requests (28% of feedback). Overall satisfaction score is ${processedData?.extractedInsights?.feedback?.satisfactionScore}/5.

Main pain points identified:
• Pricing perceived as too high for small businesses
• Missing integration with popular tools
• Complex onboarding process
• Limited customization options`

      recommendations = [
        {
          title: "Introduce tiered pricing for SMBs",
          description: "Create a more affordable tier specifically for small and medium businesses",
          confidence: 89,
          priority: "high",
        },
        {
          title: "Prioritize top integration requests",
          description: "Focus development on the 3 most requested integrations: Slack, Zapier, and HubSpot",
          confidence: 85,
          priority: "medium",
        },
      ]

      sources = [
        { type: "Customer Feedback", reference: "support_tickets_q4.txt", relevance: 92 },
        { type: "Survey Data", reference: "satisfaction_survey.csv", relevance: 87 },
      ]
    } else if (question.toLowerCase().includes("product")) {
      response = `Based on sales performance analysis, ${processedData?.extractedInsights?.salesData?.topProduct} is currently your top performer with ${processedData?.extractedInsights?.salesData?.growthRate}% growth. However, Product C shows the highest potential for next quarter focus.

Product performance breakdown:
• Product B: Highest current revenue, mature market
• Product C: 45% quarter-over-quarter growth, emerging demand
• Product A: Stable performance, needs innovation
• Product D: Declining, consider sunset strategy`

      recommendations = [
        {
          title: "Double down on Product C marketing",
          description: "Allocate 40% more marketing budget to Product C given its growth trajectory",
          confidence: 91,
          priority: "high",
        },
        {
          title: "Innovate Product A features",
          description: "Invest in R&D for Product A to reignite growth and prevent further decline",
          confidence: 78,
          priority: "medium",
        },
      ]

      sources = [
        { type: "Sales Report", reference: "quarterly_sales_analysis.pdf", relevance: 94 },
        { type: "Market Data", reference: "product_performance.xlsx", relevance: 89 },
      ]
    } else {
      response = `I've analyzed your business data across CRM, sales, campaigns, and customer feedback. Here's what the data shows:

• Total leads: ${processedData?.extractedInsights?.crmData?.totalLeads?.toLocaleString()} with ${processedData?.extractedInsights?.crmData?.conversionRate}% conversion
• Revenue: $${processedData?.extractedInsights?.salesData?.totalRevenue?.toLocaleString()} with ${processedData?.extractedInsights?.salesData?.growthRate}% growth
• Campaign ROI: ${processedData?.extractedInsights?.campaignData?.totalROI}x return on investment
• Customer satisfaction: ${processedData?.extractedInsights?.feedback?.satisfactionScore}/5 overall rating

The data indicates strong performance with opportunities for optimization in customer retention and campaign targeting.`

      recommendations = [
        {
          title: "Focus on customer retention",
          description: "Implement a customer success program to improve satisfaction scores",
          confidence: 85,
          priority: "high",
        },
        {
          title: "Optimize campaign targeting",
          description: "Refine audience segments based on highest converting demographics",
          confidence: 82,
          priority: "medium",
        },
      ]

      sources = [
        { type: "CRM Data", reference: "customer_database.csv", relevance: 90 },
        { type: "Analytics", reference: "business_overview.pdf", relevance: 85 },
      ]
    }

    return {
      id: Date.now().toString(),
      type: "assistant",
      content: response,
      timestamp: new Date(),
      recommendations,
      sources,
    }
  }

  const handleSend = async () => {
    console.log("Sending message:", input)
    if (!input.trim() || !isDataReady) return
    console.log("Processing input:", input)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const assistantMessage = await generateResponse(input)
      console.log("Helloooooooo:", assistantMessage)
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isDataReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Insights Chat
          </CardTitle>
          <CardDescription>Chat with your data to get actionable business insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Process your data first to start chatting</p>
            <p className="text-sm text-gray-400">Upload and process files in the Data Upload tab</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Insights Chat
          </CardTitle>
          <CardDescription>Ask questions about your business data and get AI-powered insights</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Start a conversation about your business data</p>

                {/* Sample Questions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Try asking:</p>
                  <div className="space-y-2">
                    {sampleQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left h-auto p-2 whitespace-normal bg-transparent"
                        onClick={() => handleSampleQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "user" ? "bg-indigo-100" : "bg-gray-100"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>

                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {/* Recommendations */}
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Lightbulb className="h-4 w-4" />
                              Recommendations
                            </div>
                            {message.recommendations.map((rec, index) => (
                              <div key={index} className="bg-white rounded-lg p-3 border">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm">{rec.title}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {rec.confidence}% confidence
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{rec.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                              <ExternalLink className="h-4 w-4" />
                              Sources
                            </div>
                            <div className="space-y-1">
                              {message.sources.map((source, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-xs bg-white rounded p-2 border"
                                >
                                  <span>{source.reference}</span>
                                  <Badge variant="outline">{source.relevance}% relevant</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm text-gray-600">AI agents are analyzing your question...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your business data..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
