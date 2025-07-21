"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, Target, MessageSquare, FileText, CheckCircle } from "lucide-react"

interface DataOverviewProps {
  files: File[]
  processingStatus: "idle" | "processing" | "completed"
  processedData: any
}

export function DataOverview({ files, processingStatus, processedData }: DataOverviewProps) {
  if (processingStatus === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Overview</CardTitle>
          <CardDescription>Upload and process your files to see insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No data processed yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (processingStatus === "processing") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Data</CardTitle>
          <CardDescription>AI agents are analyzing your files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Extracting insights from {files.length} files...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const insights = processedData?.extractedInsights

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Data Processing Complete
          </CardTitle>
          <CardDescription>
            Successfully processed {processedData?.totalFiles} files and extracted key insights
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CRM Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.crmData?.totalLeads?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{insights?.crmData?.conversionRate}% conversion rate</p>
          </CardContent>
        </Card>

        {/* Sales Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${insights?.salesData?.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{insights?.salesData?.growthRate}% from last period</p>
          </CardContent>
        </Card>

        {/* Campaign Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.campaignData?.totalROI}x</div>
            <p className="text-xs text-muted-foreground">{insights?.campaignData?.avgCTR}% average CTR</p>
          </CardContent>
        </Card>

        {/* Feedback Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.feedback?.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">{insights?.feedback?.overallSentiment} sentiment</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best performing segments and products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Top Customer Segment</span>
              <Badge variant="secondary">{insights?.crmData?.topPerformingSegment}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Best Product</span>
              <Badge variant="secondary">{insights?.salesData?.topProduct}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Top Campaign</span>
              <Badge variant="secondary">{insights?.campaignData?.bestPerformingCampaign}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback Analysis</CardTitle>
            <CardDescription>Common themes from customer feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">Common Issues:</span>
              <div className="mt-2 space-y-1">
                {insights?.feedback?.commonIssues?.map((issue: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-sm font-medium">Overall Sentiment</span>
              <div className="mt-2">
                <Progress value={84} className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">84% positive feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
