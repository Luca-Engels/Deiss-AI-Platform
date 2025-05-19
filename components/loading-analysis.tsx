import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LinkIcon } from "lucide-react"

export function LoadingAnalysis() {
  return (
    <Card className="border-emerald-100 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-white pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-emerald-600" />
          Link Analyse
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-emerald-200 animate-pulse"></div>
            </div>
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mt-8 mb-2">Analysiere Link...</h3>
          <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
            Wir extrahieren den Inhalt und analysieren ihn mit KI, um relevante DEISS Produkte zu empfehlen. Dies kann
            einen Moment dauern.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
