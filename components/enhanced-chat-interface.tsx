"use client"

import { useChat } from "ai/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  FileText,
  Sparkles,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Users,
  Target,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  Zap,
} from "lucide-react"

interface EnhancedChatInterfaceProps {
  isDataReady: boolean
  processedData: any
  uploadedFiles: File[]
}

export function EnhancedChatInterface({ isDataReady, processedData, uploadedFiles }: EnhancedChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { processedData },
    initialMessages:
      isDataReady && processedData
        ? [
            {
              id: "welcome",
              role: "assistant",
              content: `Hello! I've successfully analyzed your ${processedData.totalFiles} business document(s) using Google's Gemini AI:

${processedData.processedFiles?.map((file: any) => `• ${file.name} (${file.type}) - Analyzed by ${file.agent}`).join("\n")}

I can help you extract insights, identify trends, and provide recommendations based on your actual document content. What would you like to know about your business data?`,
            },
          ]
        : [],
  })

  const quickQuestions = [
    {
      icon: TrendingUp,
      question: "What are the key trends in my business data?",
      category: "Trends",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      question: "Analyze the performance metrics from my documents",
      category: "Performance",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      question: "What insights about customers can you extract?",
      category: "Customers",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      question: "What opportunities do you see in my data?",
      category: "Opportunities",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: MessageCircle,
      question: "Summarize the key findings from all documents",
      category: "Summary",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Lightbulb,
      question: "What recommendations do you have for improvement?",
      category: "Recommendations",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  if (!isDataReady) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">AI Business Intelligence Chat</CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            Process your business documents to unlock Gemini AI-powered insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse" />
              <Bot className="relative h-16 w-16 text-gray-300 mx-auto" />
            </div>

            {uploadedFiles.length > 0 ? (
              <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg">
                <div className="flex items-center gap-3 text-amber-800 mb-3">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Documents Ready for Processing</span>
                </div>
                <p className="text-amber-700 text-sm mb-4">
                  You have {uploadedFiles.length} file(s) uploaded. Process them to start getting Gemini AI insights.
                </p>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent shadow-sm"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Upload Tab
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-xl text-gray-500 mb-4">No documents uploaded yet</p>
                <p className="text-gray-400 mb-6">Upload your business files to begin Gemini AI analysis</p>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm bg-transparent"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Documents
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Document Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-emerald-900">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Documents Analyzed with Gemini AI
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Your specialized AI agents powered by Google Gemini have analyzed all documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedData?.processedFiles?.map((file: any, index: number) => (
              <div
                key={index}
                className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs shadow-sm">
                    {file.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-medium">Analyzed by {file.agent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Questions */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Quick Insights with Gemini AI
          </CardTitle>
          <CardDescription>Click any question below to get instant AI analysis of your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  onClick={() => handleInputChange({ target: { value: item.question } } as any)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-medium text-indigo-600 mb-1">{item.category}</div>
                      <div className="text-sm text-gray-700 whitespace-normal">{item.question}</div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Chat Interface */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm h-[600px] flex flex-col">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            Gemini AI Business Intelligence Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about your data and get detailed, actionable insights powered by Google Gemini
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl p-4 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-gradient-to-r from-gray-50 to-blue-50 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        {message.content.split("\n").map((line, index) => {
                          if (line.startsWith("• ")) {
                            return (
                              <p key={index} className="text-sm mb-2 flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span>{line.slice(2)}</span>
                              </p>
                            )
                          }
                          if (line.trim() === "") {
                            return <br key={index} />
                          }
                          return (
                            <p key={index} className="text-sm mb-2 leading-relaxed">
                              {line}
                            </p>
                          )
                        })}
                      </div>

                      {message.role === "assistant" && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Zap className="h-3 w-3" />
                            <span>Powered by Google Gemini AI</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">Gemini AI is analyzing your data...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Input */}
          <div className="border-t border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about your business data..."
                  disabled={isLoading}
                  className="h-12 pr-12 text-base border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl shadow-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Zap className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
