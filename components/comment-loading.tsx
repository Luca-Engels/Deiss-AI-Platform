import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function CommentLoading() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-700">Generiere Kommentare...</h3>
        <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
          Unsere KI erstellt passende Kommentare für diesen Reddit-Beitrag. Dies kann einen Moment dauern.
        </p>
      </CardContent>
    </Card>
  )
}
