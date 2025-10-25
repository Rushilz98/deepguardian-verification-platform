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
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 350);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("http://127.0.0.1:5002/api/video/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      clearInterval(interval);
      setProgress(100);
      setAnalyzing(false);

      const overall = data.overall;

      // Map model confidences to 2 decimal places
      const metrics = Object.entries(overall.model_confidences).map(([model, info]) => ({
        label: model,
        value: `${((info as any).confidence * 100).toFixed(2)}%`,
      }));

      // Overall confidence rounded to 2 decimals
      const maxConfidence = Math.max(...Object.values(overall.model_confidences).map((m: any) => m.confidence)) * 100;

      setResults({
        isAuthentic: overall.label === "real",
        confidence: parseFloat(maxConfidence.toFixed(2)), // 2 decimals
        metrics,
      });
    } catch (err) {
      console.error("Video verification failed:", err);
      clearInterval(interval);
      setProgress(0);
      setAnalyzing(false);
    }
  };



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
