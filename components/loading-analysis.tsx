import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function LoadingAnalysis() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Analysiere Link...</h3>
          <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
            Wir extrahieren den Inhalt und analysieren ihn mit KI, um relevante DEISS Produkte zu empfehlen. Dies kann
            einen Moment dauern.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
