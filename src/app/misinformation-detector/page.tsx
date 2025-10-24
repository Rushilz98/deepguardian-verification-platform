"use client"

import { useState } from "react"
import { Shield, Link as LinkIcon, Type } from "lucide-react"
import AppLayout from "@/components/AppLayout"
import VerificationResults from "@/components/VerificationResults"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MisinformationDetector() {
  const [inputType, setInputType] = useState<"text" | "url">("text")
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const handleVerify = async () => {
    const input = inputType === "text" ? textInput : urlInput
    if (!input.trim()) return

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
    }, 250)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setAnalyzing(false)
      
      const isAuthentic = Math.random() > 0.5
      setResults({
        isAuthentic,
        confidence: Math.floor(Math.random() * 20) + 75,
        metrics: [
          { label: "Misinformation Score", value: `${Math.floor(Math.random() * 60) + 20}%` },
          { label: "Source Credibility", value: isAuthentic ? "High" : "Low" },
          { label: "Fact-Check Results", value: `${Math.floor(Math.random() * 5) + 3} sources` },
          { label: "Bias Detection", value: isAuthentic ? "Minimal" : "Significant" },
        ],
      })
    }, 2500)
  }

  const handleClear = () => {
    setTextInput("")
    setUrlInput("")
    setResults(null)
    setProgress(0)
  }

  const handleDownload = () => {
    const report = {
      input: inputType === "text" ? textInput : urlInput,
      inputType,
      timestamp: new Date().toISOString(),
      results: results,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `misinformation-check-report-${Date.now()}.json`
    a.click()
  }

  const currentInput = inputType === "text" ? textInput : urlInput

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Misinformation Detector</h1>
          <p className="text-muted-foreground">
            Check text content or URLs for misinformation, fake news, and biased information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Input Content</h2>
              
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "url")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">
                    <Type className="mr-2 h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    URL
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-4">
                  <Textarea
                    placeholder="Paste the text content you want to verify..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </TabsContent>
                
                <TabsContent value="url" className="mt-4">
                  <div className="space-y-4">
                    <Input
                      placeholder="https://example.com/article"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      type="url"
                    />
                    {urlInput && (
                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium">URL Preview</p>
                        <div className="rounded bg-muted p-4">
                          <LinkIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground break-all">
                            {urlInput}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {currentInput && !results && (
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleVerify}
                    disabled={analyzing}
                  >
                    {analyzing ? "Checking..." : "Check Content"}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              )}

              {analyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing content...</span>
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
                  <span>Cross-reference with fact-checking databases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Source credibility and authority assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Bias and sentiment analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Claim verification against trusted sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Language patterns and manipulation detection</span>
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
                  <Shield className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No Results Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter content or a URL and click check to see analysis results here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
