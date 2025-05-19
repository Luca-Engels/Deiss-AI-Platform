import { Loader2 } from "lucide-react"

export function SimpleLoading() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
    </div>
  )
}
