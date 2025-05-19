"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function PostComments({ comments, redditUrl }: { comments: string[]; redditUrl: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)

      toast({
        title: "Kommentar kopiert!",
        description: "Der Kommentar wurde in die Zwischenablage kopiert.",
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedIndex(null)
      }, 2000)

      // Redirect to Reddit
      window.open(redditUrl, "_blank")
    } catch (err) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Der Kommentar konnte nicht kopiert werden.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <Card
          key={index}
          className={`hover:shadow-md transition-shadow border-l-4 ${
            index === 0 ? "border-l-emerald-500" : index === 1 ? "border-l-teal-500" : "border-l-cyan-500"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge
                  className={`mb-3 ${
                    index === 0
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      : index === 1
                        ? "bg-teal-100 text-teal-800 hover:bg-teal-100"
                        : "bg-cyan-100 text-cyan-800 hover:bg-cyan-100"
                  }`}
                >
                  Vorschlag {index + 1}
                </Badge>
                <p className="text-gray-800 whitespace-pre-line">{comment}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(comment, index)}
                  className="flex-shrink-0 border-emerald-200 hover:bg-emerald-50"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Kopieren
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 text-gray-500"
                  onClick={() => window.open(redditUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Reddit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
