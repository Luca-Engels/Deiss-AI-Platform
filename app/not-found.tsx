import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeissLogo } from "@/components/deiss-logo"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <DeissLogo className="mb-8" />
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Seite nicht gefunden</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Die von Ihnen gesuchte Seite existiert nicht oder wurde möglicherweise entfernt.
      </p>
      <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
        <Link href="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  )
}
