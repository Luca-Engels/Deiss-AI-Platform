import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-gray-200 animate-pulse"></div>
        </div>
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 mt-8 mb-2">Lade Inhalte...</h3>
      <p className="text-gray-500 text-center max-w-md">
        Wir bereiten die relevantesten Reddit-Beiträge für dich vor. Dies kann einen Moment dauern.
      </p>
    </div>
  )
}
