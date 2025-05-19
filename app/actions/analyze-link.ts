"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import * as cheerio from "cheerio"
import { getRedditAccessToken } from "./getAccessToken"

// Function to analyze Reddit links
async function analyzeRedditContent(url: string) {
  try {
    // Extract post ID from URL
    const match = url.match(/\/comments\/([a-z0-9]+)\//i)
    if (!match) {
      throw new Error("Ungültige Reddit-URL")
    }

    const postId = match[1]
    const token = await getRedditAccessToken()
    const userAgent = "DEISS-WebApp/1.0"

    // Fetch post data
    const response = await fetch(`https://oauth.reddit.com/api/info?id=t3_${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": userAgent,
      },
    })

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`)
      throw new Error(`Reddit API Fehler: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data || !data.data.children || data.data.children.length === 0) {
      throw new Error("Keine Daten für diesen Reddit-Post gefunden")
    }

    const post = data.data.children[0].data

    // Format the content
    const content = {
      title: post.title,
      text: post.selftext || "",
      url: post.url,
      subreddit: post.subreddit_name_prefixed,
      author: post.author,
    }

    return {
      type: "reddit",
      content: content,
      rawText: `Title: ${content.title}\nText: ${content.text}\nSubreddit: ${content.subreddit}\nAuthor: ${content.author}`,
    }
  } catch (error) {
    console.error("Error analyzing Reddit content:", error)
    throw error
  }
}

// Function to analyze general web content
async function analyzeWebContent(url: string) {
  try {
    // Fetch the content with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Webseite: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script, style elements, etc.
    $("script, style, noscript, iframe").remove()

    // Extract title and meta description
    const title = $("title").text().trim()
    const metaDescription = $('meta[name="description"]').attr("content") || ""

    // Extract main content
    let mainContent = ""

    // Try to find main content containers
    const possibleContentSelectors = [
      "main",
      "article",
      "#content",
      ".content",
      "[role=main]",
      ".main-content",
      "#main-content",
    ]

    for (const selector of possibleContentSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        mainContent = element.text().trim()
        break
      }
    }

    // If no main content found, use body text
    if (!mainContent) {
      mainContent = $("body").text().trim()
    }

    // Clean up the text
    mainContent = mainContent.replace(/\s+/g, " ").trim().substring(0, 8000)

    return {
      type: "web",
      content: {
        title,
        description: metaDescription,
        text: mainContent,
      },
      rawText: `Title: ${title}\nDescription: ${metaDescription}\nContent: ${mainContent.substring(0, 2000)}...`,
    }
  } catch (error) {
    console.error("Error analyzing web content:", error)
    throw error
  }
}

// Function to analyze URL without content
async function analyzeUrlOnly(url: string) {
  // Extract domain and path
  const urlObj = new URL(url)
  const domain = urlObj.hostname
  const path = urlObj.pathname

  return {
    type: "url-only",
    content: {
      domain,
      path,
      fullUrl: url,
    },
    rawText: `URL: ${url}\nDomain: ${domain}\nPath: ${path}`,
  }
}

// Main analysis function
export async function analyzeLink(url: string) {
  try {
    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch (e) {
      throw new Error("Ungültige URL-Format")
    }

    // Determine content type and fetch accordingly
    let contentData
    let limitedAnalysis = false

    try {
      if (url.includes("reddit.com")) {
        contentData = await analyzeRedditContent(url)
      } else {
        contentData = await analyzeWebContent(url)
      }
    } catch (error) {
      console.warn("Failed to fetch content, falling back to URL-only analysis:", error)
      contentData = await analyzeUrlOnly(url)
      limitedAnalysis = true
    }

    // Use Groq to analyze the content
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Analyze the following content from a web page:
        
        URL: ${url}
        Content Type: ${contentData.type}
        ${contentData.rawText}
        
        ${limitedAnalysis ? "Note: Only limited information is available from this URL." : ""}
        
        Determine if this content is related to waste management, trash bags, recycling, or similar topics.
        If it is relevant, provide a brief analysis and recommend DEISS products that would be suitable.
        If it is not directly relevant, explain why and suggest how DEISS products might still be useful in this context.
        
        Format your response as a JSON object with the following structure:
        {
          "isRelevant": boolean,
          "analysis": "brief analysis of the content",
          "recommendation": "recommendation for DEISS products"
        }
      `,
    })

    // Parse the AI response
    let result
    try {
      result = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response:", text)
      // Fallback if parsing fails
      result = {
        isRelevant: false,
        analysis:
          "Die Analyse konnte nicht abgeschlossen werden. Der Inhalt könnte zu komplex sein oder nicht zugänglich.",
        recommendation:
          "DEISS bietet hochwertige Abfallmanagementlösungen für verschiedene Bedürfnisse. Besuchen Sie unsere Website, um mehr über unsere Produkte zu erfahren.",
      }
    }

    return {
      isRelevant: result.isRelevant,
      analysis: result.analysis,
      recommendation: result.recommendation,
      limitedAnalysis: limitedAnalysis,
    }
  } catch (error) {
    console.error("Error analyzing link:", error)
    throw new Error(`Fehler bei der Analyse: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`)
  }
}
