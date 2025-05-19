"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export type RedditPost = {
  id: string
  title: string
  selftext: string
  permalink: string
  author: string
  subreddit: string
  created_utc: number
  score: number
  relevanceScore?: number
}

export async function searchRedditPosts(query = "müllbeutel"): Promise<RedditPost[]> {
  const token = await getAccessToken()
  const encodedQuery = encodeURIComponent(query)

  try {
    // Use a proxy approach to avoid CORS and blocking issues
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`https://oauth.reddit.com/search.json?q=${encodedQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "deiss-bot/1.0 by dein_username",
      },
    })
    if (!response.ok) {
      console.log(await response.json())
      throw new Error(`Reddit API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data || !data.data.children) {
      return []
    }

    // Extract relevant post data
    const posts: RedditPost[] = data.data.children
      .filter((child: any) => child.data)
      .map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext || "",
        permalink: child.data.permalink,
        author: child.data.author,
        subreddit: child.data.subreddit_name_prefixed || child.data.subreddit,
        created_utc: child.data.created_utc,
        score: child.data.score,
      }))

    // Rate posts for relevance using AI
    const ratedPosts = await ratePostsRelevance(posts)

    // Sort by relevance score and take top 5
    return ratedPosts.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)).slice(0, 5)
  } catch (error) {
    console.error("Error fetching Reddit posts:", error)
    return []
  }
}

async function ratePostsRelevance(posts: RedditPost[]): Promise<RedditPost[]> {
  try {
    // Prepare batch of posts for rating
    const postsForRating = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.selftext.substring(0, 500), // Limit content length
    }))
    console.log(postsForRating)

    // Use AI to rate posts
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Rate the following Reddit posts on a scale from 0 to 10 based on how relevant they are to waste management, 
        trash bags (Müllbeutel), or recycling topics, invites to or stories about garbage collection actions, 
        and how suitable they would be for promoting DEISS products. The topics must be connected to individual recycling 
        needs and not just news articles about recycling plants. All posts must be in German.
        
        Posts:
        ${JSON.stringify(postsForRating, null, 2)}
        
        Return ONLY a JSON array with objects containing the post id and a relevanceScore from 0 to 10.
        Example format:
        [
          {"id": "abc123", "relevanceScore": 8},
          {"id": "def456", "relevanceScore": 3}
        ]
        DO NOT GIVE ME ANY EXPLANATION OR ANY OTHER TEXT. I NEED A RAW JSON FORMAT FOR further processing
      `,
    })
    console.log(text)

    // Parse AI response
    let ratings = []
    try {
      ratings = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI ratings:", text)
      // Default to 5 if parsing fails
      ratings = posts.map((post) => ({ id: post.id, relevanceScore: 5 }))
    }

    // Merge ratings with posts
    return posts.map((post) => {
      const rating = ratings.find((r: any) => r.id === post.id)
      return {
        ...post,
        relevanceScore: rating ? rating.relevanceScore : 5,
      }
    })
  } catch (error) {
    console.error("Error rating posts:", error)
    // Return posts with default rating
    return posts.map((post) => ({ ...post, relevanceScore: 5 }))
  }
}

export async function generateCommentsForPost(post: RedditPost): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Generate 3 different comments that could be posted on this Reddit post to promote DEISS trash bags or waste management products.
        Each comment should be helpful, relevant to the post content, and subtly promote DEISS products without being too sales-focused.
        Promote the features of the DEISS trash bags, e.g. their recyclability or the compostability of the Bioline products which are 
        suitable for the compost bin.
        Share your experiences and and personal anecdotes when you used the bags.

        
        Reddit Post:
        Title: ${post.title}
        Content: ${post.selftext.substring(0, 1000)}
        
        Return ONLY a JSON array with 3 comment strings.
        Example format:
        [
          "Comment 1 text here...",
          "Comment 2 text here...",
          "Comment 3 text here..."
        ]
        DO NOT GIVE ME ANY EXPLANATION OR ANY OTHER TEXT. I NEED A RAW JSON FORMAT FOR further processing
      `,
    })

    // Parse AI response
    let comments = []
    try {
      comments = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI comments:", text)
      // Default comments if parsing fails
      comments = [
        "Ich habe ähnliche Probleme gehabt und DEISS Müllbeutel haben mir wirklich geholfen. Sie sind reißfest und umweltfreundlich!",
        "DEISS bietet hochwertige Lösungen für genau dieses Problem. Ihre Produkte sind langlebig und nachhaltig.",
        "Hast du schon mal DEISS Recycling-Säcke ausprobiert? Sie sind perfekt für diese Situation und schonen die Umwelt.",
      ]
    }

    return comments.slice(0, 3)
  } catch (error) {
    console.error("Error generating comments:", error)
    return [
      "Ich habe ähnliche Probleme gehabt und DEISS Müllbeutel haben mir wirklich geholfen. Sie sind reißfest und umweltfreundlich!",
      "DEISS bietet hochwertige Lösungen für genau dieses Problem. Ihre Produkte sind langlebig und nachhaltig.",
      "Hast du schon mal DEISS Recycling-Säcke ausprobiert? Sie sind perfekt für diese Situation und schonen die Umwelt.",
    ]
  }
}

const clientId = "cR362Pr1vPlH-i0Th7_cJQ"
const clientSecret = "qHrjvYMYtMPb94BS9lBpP9KUyfmcAQ"

async function getAccessToken() {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "deiss-bot/1.0 by dein_username",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token-Anfrage fehlgeschlagen: ${response.status} – ${errorText}`)
  }

  const data = await response.json()
  return data.access_token
}
