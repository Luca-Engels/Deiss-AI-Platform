import { LinkAnalyzer } from "@/components/link-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DEISS Link Analyzer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze links from LinkedIn, Reddit, and more to discover high-quality waste management solutions from
            DEISS.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <LinkAnalyzer />
        </div>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} DEISS Link Analyzer. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
