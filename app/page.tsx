import { searchRedditPosts } from "@/app/services/reddit-service"
import { RedditPostList } from "@/components/reddit-post-list"
import { DeissLogo } from "@/components/deiss-logo"
import { Suspense } from "react"
import { SimpleLoading } from "@/components/simple-loading"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <DeissLogo />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reddit Analyzer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finden Sie relevante Reddit-Beiträge über Müllbeutel und Abfallmanagement und fördern Sie DEISS-Produkte mit
            KI-generierten Kommentaren.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<SimpleLoading />}>
            <PostListWrapper />
          </Suspense>
        </div>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} DEISS Reddit Analyzer. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </main>
  )
}

async function PostListWrapper() {
  const posts = await searchRedditPosts()
  return <RedditPostList initialPosts={posts} />
}
