"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, FileText, FileSpreadsheet, Brain, X, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  onProcessingStatusChange: (status: "idle" | "processing" | "completed") => void
  onDataProcessed: (data: any) => void
}

export function FileUpload({ onFilesUploaded, onProcessingStatusChange, onDataProcessed }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles])
      onFilesUploaded([...files, ...acceptedFiles])
      toast({
        title: "✨ Files uploaded successfully!",
        description: `${acceptedFiles.length} file(s) ready for AI analysis`,
      })
    },
    [files, onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/plain": [".txt"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  const getFileIcon = (file: File) => {
    if (file.type.includes("csv") || file.type.includes("spreadsheet")) {
      return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
    }
    if (file.type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    }
    if (file.type.includes("image")) {
      return <Brain className="h-5 w-5 text-blue-500" />
    }
    return <File className="h-5 w-5 text-gray-500" />
  }

  const getFileType = (file: File) => {
    const fileName = file.name.toLowerCase()
    if (file.type.includes("csv") || fileName.includes("csv")) return "CRM Data"
    if (file.type.includes("pdf") || fileName.includes("sales") || fileName.includes("report")) return "Sales Report"
    if (file.type.includes("spreadsheet") || fileName.includes("campaign") || fileName.includes("marketing"))
      return "Campaign Data"
    if (file.type.includes("image")) return "Scanned Document"
    if (file.type.includes("text") || fileName.includes("meeting") || fileName.includes("notes")) return "Meeting Notes"
    if (fileName.includes("feedback") || fileName.includes("review") || fileName.includes("customer"))
      return "Customer Feedback"
    return "Business Document"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "CRM Data": "bg-blue-100 text-blue-700 border-blue-200",
      "Sales Report": "bg-green-100 text-green-700 border-green-200",
      "Campaign Data": "bg-purple-100 text-purple-700 border-purple-200",
      "Scanned Document": "bg-orange-100 text-orange-700 border-orange-200",
      "Meeting Notes": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Customer Feedback": "bg-pink-100 text-pink-700 border-pink-200",
      "Business Document": "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[type as keyof typeof colors] || colors["Business Document"]
  }

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload some files first",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    onProcessingStatusChange("processing")
    setProgress(0)

    const steps = [
      "🔍 Scanning document structure...",
      "📄 Extracting text content...",
      "🧠 Analyzing with AI agents...",
      "🔗 Building knowledge connections...",
      "✨ Finalizing insights...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])

      // Smooth progress animation
      const targetProgress = ((i + 1) / steps.length) * 100
      const currentProgress = (i / steps.length) * 100

      for (let p = currentProgress; p <= targetProgress; p += 2) {
        setProgress(p)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))

      const response = await fetch("/api/process-files", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setProcessing(false)
        onProcessingStatusChange("completed")
        onDataProcessed(result)

        toast({
          title: "🎉 Analysis Complete!",
          description: `Successfully processed ${result.totalFiles} document(s). Ready for AI insights!`,
        })
      } else {
        throw new Error(result.error || "Processing failed")
      }
    } catch (error) {
      setProcessing(false)
      onProcessingStatusChange("idle")
      toast({
        title: "Processing failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesUploaded(newFiles)
  }

  const clearAllFiles = () => {
    setFiles([])
    onFilesUploaded([])
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02] shadow-lg"
            : "border-gray-300 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50 hover:shadow-md"
        }`}
      >
        <input {...getInputProps()} />

        {/* Animated Upload Icon */}
        <div className="relative mb-6">
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-20 ${isDragActive ? "bg-indigo-400 animate-pulse" : "bg-gray-300"}`}
          />
          <div
            className={`relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragActive
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 scale-110 shadow-lg"
                : "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-indigo-400 hover:to-purple-400 hover:scale-105"
            }`}
          >
            <Upload
              className={`h-8 w-8 text-white transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`}
            />
          </div>
        </div>

        {isDragActive ? (
          <div className="space-y-2">
            <p className="text-xl font-semibold text-indigo-600">Drop your files here!</p>
            <p className="text-indigo-500">Release to upload your business documents</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Drag & drop your business files here</p>
              <p className="text-gray-500">or click to browse and select files</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["CSV", "PDF", "Excel", "Word", "TXT", "Images"].map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="px-3 py-1 text-xs font-medium border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Files List */}
      {files.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <File className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Uploaded Files</h3>
                  <p className="text-sm text-gray-500">
                    {files.length} document{files.length !== 1 ? "s" : ""} ready
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getFileIcon(file)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className={`text-xs font-medium border ${getTypeColor(getFileType(file))}`}>
                          {getFileType(file)}
                        </Badge>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Processing Status */}
      {processing && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Processing Your Documents</h3>
                  <p className="text-indigo-600 font-medium">{currentStep}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-indigo-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/50" />
              </div>

              <p className="text-sm text-gray-600">
                Processing {files.length} document{files.length !== 1 ? "s" : ""} with AI agents...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Process Button */}
      <div className="flex justify-center">
        <Button
          onClick={processFiles}
          disabled={files.length === 0 || processing}
          size="lg"
          className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
              Processing Documents...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-3" />
              Analyze with AI Agents
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
