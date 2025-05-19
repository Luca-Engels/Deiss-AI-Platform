"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ExternalLink, CheckCircle, AlertTriangle, Info, LinkIcon } from "lucide-react"
import { analyzeLink } from "@/app/actions/analyze-link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { SimpleLoading } from "./simple-loading"

type AnalysisResult = {
  isRelevant: boolean
  analysis: string
  recommendation: string
  limitedAnalysis?: boolean
}

export function LinkAnalyzer() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Bitte geben Sie einen Link ein.")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch (e) {
      setError("Bitte geben Sie eine gültige URL ein (z.B. https://example.com)")
      return
    }

    try {
      setIsAnalyzing(true)
      setError(null)
      setResult(null)

      const analysisResult = await analyzeLink(url)
      setResult(analysisResult)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Bei der Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-white pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-emerald-600" />
            Link Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="LinkedIn oder Reddit Link einfügen..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 border-emerald-200 focus-visible:ring-emerald-500"
                disabled={isAnalyzing}
              />
              <Button type="submit" disabled={isAnalyzing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  "Analysieren"
                )}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <SimpleLoading />
      ) : (
        result && (
          <Card className="border-emerald-100 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-white pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                {result.isRelevant ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Analyse Ergebnis
                  </>
                ) : (
                  <>
                    <Info className="h-5 w-5 text-blue-500" />
                    Analyse Ergebnis
                  </>
                )}
              </CardTitle>
              <Badge
                className={
                  result.isRelevant
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                }
              >
                {result.isRelevant ? "Relevant" : "Nicht direkt relevant"}
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {result.limitedAnalysis && (
                  <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Wir konnten nicht auf den vollständigen Inhalt der Seite zugreifen. Die Analyse basiert nur auf
                      der URL.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {result.isRelevant ? (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <Info className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {result.isRelevant ? "Relevanter Inhalt gefunden!" : "Inhalt ist nicht direkt relevant"}
                    </h3>
                    <p className="text-gray-700">{result.analysis}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Badge className="bg-emerald-600">DEISS</Badge>
                    Empfehlung:
                  </h3>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>

                {result.isRelevant && (
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-medium text-emerald-800 mb-2">DEISS Produkte für Ihre Anforderungen:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <ProductCard
                        name="DEISS Premium Müllbeutel"
                        description="Reißfeste Qualität für professionelle Anwendungen"
                      />
                      <ProductCard
                        name="DEISS Recycling-Säcke"
                        description="Umweltfreundliche Lösung für nachhaltiges Abfallmanagement"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-emerald-200 hover:bg-emerald-50"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      Original Link <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}

function ProductCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-white p-4 rounded border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-900">{name}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <Button variant="link" className="text-emerald-600 p-0 h-auto mt-2" size="sm">
        Mehr erfahren
      </Button>
    </div>
  )
}
