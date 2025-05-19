export async function getRedditAccessToken(): Promise<string> {
  const clientId = "Ludax_"
  const clientSecret = "z193cuaUzqyBvylicZm2lxOdLYbKkQ"

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://www.reddit.com/search.json?q=m%C3%BCllbeutel")

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token-Anfrage fehlgeschlagen: ${response.status} ${response.statusText} – ${errorText}`)
  }

  const data = await response.json()
  console.log(data)
  return data.access_token
}
