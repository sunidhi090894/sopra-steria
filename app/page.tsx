"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { Brain, Upload, MessageSquare, Sparkles, TrendingUp } from "lucide-react"
import { EnhancedChatInterface } from "@/components/enhanced-chat-interface"

export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "completed">("idle")
  const [processedData, setProcessedData] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none select-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%239C92AC' fillOpacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container mx-auto px-4 py-8 relative">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                AI Business Intelligence
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="text-indigo-600 font-medium">Powered by Advanced AI Agents</span>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your business documents into actionable insights with intelligent AI analysis
          </p>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{uploadedFiles.length}</div>
              <div className="text-xs text-gray-600">Documents</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {processingStatus === "completed" ? "✓" : processingStatus === "processing" ? "⏳" : "○"}
              </div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{processingStatus === "completed" ? "🤖" : "💤"}</div>
              <div className="text-xs text-gray-600">AI Ready</div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="upload" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-2 h-12 p-1 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 h-10 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Upload className="h-4 w-4" />
                Upload & Process
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-2 h-10 text-sm font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageSquare className="h-4 w-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="mt-0">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Upload Your Business Data</CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Drag and drop your documents to unlock AI-powered business insights
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <FileUpload
                  onFilesUploaded={setUploadedFiles}
                  onProcessingStatusChange={setProcessingStatus}
                  onDataProcessed={setProcessedData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <EnhancedChatInterface
              isDataReady={processingStatus === "completed"}
              processedData={processedData}
              uploadedFiles={uploadedFiles}
            />
          </TabsContent>
        </Tabs>

        {/* Feature highlights for empty state */}
        {processingStatus === "idle" && uploadedFiles.length === 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Powerful AI-Driven Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Document Analysis</h3>
                <p className="text-gray-600 text-sm">
                  AI agents automatically extract insights from your business documents
                </p>
              </div>

              <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Natural Conversations</h3>
                <p className="text-gray-600 text-sm">
                  Ask questions in plain English and get detailed business insights
                </p>
              </div>

              <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
                <p className="text-gray-600 text-sm">
                  Get specific recommendations to improve your business performance
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
