"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  onProcessingStatusChange: (status: "idle" | "processing" | "completed") => void
  onDataProcessed: (data: any) => void
}

export function FileUpload({ onFilesUploaded, onProcessingStatusChange, onDataProcessed }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles]
      setFiles(newFiles)
      onFilesUploaded(newFiles)
      setError(null)
    },
    [files, onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesUploaded(newFiles)
  }

  const processFiles = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setError(null)
    onProcessingStatusChange("processing")

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/process-files", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process files")
      }

      const data = await response.json()

      setProcessingProgress(100)
      setTimeout(() => {
        onDataProcessed(data)
        onProcessingStatusChange("completed")
        setIsProcessing(false)
        setProcessingProgress(0)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsProcessing(false)
      setProcessingProgress(0)
      onProcessingStatusChange("idle")
      clearInterval(progressInterval)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📄"
    if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) return "📊"
    if (file.type.includes("csv")) return "📈"
    return "📝"
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              isDragActive ? "text-indigo-600" : "text-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className={`h-8 w-8 ${isDragActive ? "text-indigo-600" : "text-gray-400"}`} />
            </div>

            {isDragActive ? (
              <div>
                <p className="text-lg font-medium text-indigo-600 mb-2">Drop files here</p>
                <p className="text-sm text-gray-500">Release to upload your business documents</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Drag & drop your business files here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                <Button variant="outline" className="mx-auto bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-400">Supports: TXT, CSV, PDF, Excel files (max 10MB each)</div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Files ({files.length})
            </CardTitle>
            <CardDescription>Review your files before processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.type || "Unknown"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Section */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            {isProcessing ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  <span className="font-medium text-gray-900">Processing files...</span>
                </div>
                <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-gray-600">AI agents are analyzing your business documents</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Button
                  onClick={processFiles}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={files.length === 0}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Process Files with AI
                </Button>
                <p className="text-sm text-gray-600">Start AI analysis to extract business insights</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
