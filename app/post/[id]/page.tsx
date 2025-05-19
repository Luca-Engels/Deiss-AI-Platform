import { searchRedditPosts, generateCommentsForPost } from "@/app/services/reddit-service"
import { PostComments } from "@/components/post-comments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DeissLogo } from "@/components/deiss-logo"
import { Suspense } from "react"
import { SimpleLoading } from "@/components/simple-loading"

export default async function PostPage({ params }: { params: { id: string } }) {
  // Fetch all posts and find the one with matching ID
  const allPosts = await searchRedditPosts()
  const post = allPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
          <DeissLogo />
        </div>

        <Card className="mb-8 border-emerald-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-white">
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <div className="text-sm text-gray-500 mt-2">
              <span>{post.subreddit}</span> • <span>u/{post.author}</span> •
              <span> {new Date(post.created_utc * 1000).toLocaleDateString("de-DE")}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              {post.selftext ? (
                <p className="whitespace-pre-line">{post.selftext}</p>
              ) : (
                <p className="text-gray-500 italic">Kein Textinhalt verfügbar.</p>
              )}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" asChild>
                <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                  Auf Reddit ansehen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generierte Kommentare für DEISS-Produkte</h2>
          <p className="text-gray-600 mb-6">
            Wählen Sie einen Kommentar aus, um ihn in die Zwischenablage zu kopieren und zum Reddit-Beitrag zu gelangen.
          </p>

          <Suspense fallback={<SimpleLoading />}>
            <CommentsWrapper postId={post.id} redditUrl={`https://www.reddit.com${post.permalink}`} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function CommentsWrapper({ postId, redditUrl }: { postId: string; redditUrl: string }) {
  // Fetch all posts and find the one with matching ID
  const allPosts = await searchRedditPosts()
  const post = allPosts.find((p) => p.id === postId)

  if (!post) {
    return null
  }

  // Generate comments for this post
  const comments = await generateCommentsForPost(post)

  return <PostComments comments={comments} redditUrl={redditUrl} />
}
