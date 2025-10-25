"use client"

import { useState } from "react"
import { Video } from "lucide-react"
import AppLayout from "@/components/AppLayout"
import FileUpload from "@/components/FileUpload"
import VerificationResults from "@/components/VerificationResults"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DeepfakeDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResults(null)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }

  const handleVerify = async () => {
    setAnalyzing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 350)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setAnalyzing(false)
      
      const isAuthentic = Math.random() > 0.6
      setResults({
        isAuthentic,
        confidence: Math.floor(Math.random() * 15) + 85,
        metrics: [
          { label: "Deepfake Probability", value: `${Math.floor(Math.random() * 50) + 20}%` },
          { label: "Face Swap Detection", value: isAuthentic ? "Not Detected" : "Detected" },
          { label: "Lip-Sync Analysis", value: isAuthentic ? "Natural" : "Synthetic" },
          { label: "Frame Consistency", value: `${Math.floor(Math.random() * 20) + 80}%` },
        ],
      })
    }, 3500)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setProgress(0)
  }

  const handleDownload = () => {
    const report = {
      file: file?.name,
      timestamp: new Date().toISOString(),
      results: results,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deepfake-detection-report-${Date.now()}.json`
    a.click()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Deepfake Detection</h1>
          <p className="text-muted-foreground">
            Upload a video to detect deepfake content, face swaps, and AI-generated videos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Video</h2>
              <FileUpload
                accept="video/*"
                onFileSelect={handleFileSelect}
                preview={
                  preview ? (
                    <div className="space-y-4">
                      <video
                        src={preview}
                        controls
                        className="w-full rounded-lg"
                        style={{ maxHeight: "400px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <p className="text-sm text-muted-foreground">{file?.name}</p>
                    </div>
                  ) : undefined
                }
                onClear={handleClear}
              />

              {preview && !results && (
                <Button
                  className="mt-4 w-full"
                  onClick={handleVerify}
                  disabled={analyzing}
                >
                  {analyzing ? "Analyzing..." : "Detect Deepfake"}
                </Button>
              )}

              {analyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing video frames...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </Card>

            {/* Info Card */}
            <Card className="p-6">
              <h3 className="mb-3 font-semibold">What we check:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Face swap and replacement detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Lip-sync inconsistencies and artifacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Frame-by-frame consistency analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>AI-generated video detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Facial expression authenticity</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {results ? (
              <VerificationResults {...results} onDownload={handleDownload} />
            ) : (
              <Card className="flex h-full min-h-[400px] flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Results Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a video and click detect to see analysis results here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
