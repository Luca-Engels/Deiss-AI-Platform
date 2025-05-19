"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Search, Star } from "lucide-react"
import Link from "next/link"
import { searchRedditPosts, type RedditPost } from "@/app/services/reddit-service"
import { SimpleLoading } from "./simple-loading"

export function RedditPostList({ initialPosts }: { initialPosts: RedditPost[] }) {
  const [posts, setPosts] = useState<RedditPost[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState("müllbeutel")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchRedditPosts(searchQuery)
      setPosts(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <Card className="p-4 border-emerald-100 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Suchbegriff eingeben..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-emerald-200 focus-visible:ring-emerald-500"
            disabled={isSearching}
          />
          <Button type="submit" disabled={isSearching} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suche...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Suchen
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Top 5 relevante Reddit-Beiträge</h2>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          {posts.length} Ergebnisse
        </Badge>
      </div>

      {isSearching ? (
        <SimpleLoading />
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Keine Beiträge gefunden. Versuchen Sie einen anderen Suchbegriff.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow border-emerald-100 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-white">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <RelevanceScore score={post.relevanceScore || 0} />
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-4">
                <p className="text-gray-600 line-clamp-3">
                  {post.selftext ? post.selftext : "Kein Textinhalt verfügbar."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  <span>{post.subreddit}</span> • <span>{formatDate(post.created_utc)}</span>
                </div>
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                  <Link href={`/post/${post.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Kommentare generieren
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function RelevanceScore({ score }: { score: number }) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 8) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (score >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${getColor()}`}>
      <Star className="h-3.5 w-3.5 fill-current" />
      <span>{score}/10</span>
    </Badge>
  )
}
