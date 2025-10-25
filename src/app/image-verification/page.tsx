"use client"

import { useState } from "react"
import { Image as ImageIcon, ZoomIn, ZoomOut } from "lucide-react"
import AppLayout from "@/components/AppLayout"
import FileUpload from "@/components/FileUpload"
import VerificationResults from "@/components/VerificationResults"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ImageVerification() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [zoom, setZoom] = useState(1)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setResults(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleVerify = async () => {
    setAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setAnalyzing(false)
      
      // Mock results
      const isAuthentic = Math.random() > 0.5
      setResults({
        isAuthentic,
        confidence: Math.floor(Math.random() * 20) + 80,
        metrics: [
          { label: "AI-Generated Likelihood", value: `${Math.floor(Math.random() * 40) + 10}%` },
          { label: "Manipulation Score", value: `${Math.floor(Math.random() * 30) + 5}%` },
          { label: "Noise Analysis", value: "Normal" },
          { label: "Metadata Integrity", value: isAuthentic ? "Verified" : "Modified" },
        ],
      })
    }, 3000)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setProgress(0)
    setZoom(1)
  }

  const handleDownload = () => {
    // Mock download
    const report = {
      file: file?.name,
      timestamp: new Date().toISOString(),
      results: results,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `image-verification-report-${Date.now()}.json`
    a.click()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Image Verification</h1>
          <p className="text-muted-foreground">
            Upload an image to verify its authenticity and detect AI-generated or manipulated content.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              <FileUpload
                accept="image/*"
                onFileSelect={handleFileSelect}
                preview={
                  preview ? (
                    <div className="space-y-4">
                      <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto max-h-[400px] object-contain transition-transform"
                          style={{ transform: `scale(${zoom})` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{file?.name}</p>
                      </div>
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
                  {analyzing ? "Analyzing..." : "Verify Image"}
                </Button>
              )}

              {analyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing image...</span>
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
                  <span>AI-generated image detection using advanced neural networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Digital manipulation and editing artifacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Metadata analysis for tampering signs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Noise pattern analysis and inconsistencies</span>
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
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Results Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload an image and click verify to see analysis results here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
