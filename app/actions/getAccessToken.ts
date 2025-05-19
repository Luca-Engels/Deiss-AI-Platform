export async function getRedditAccessToken(): Promise<string> {
  const clientId = "Ludax_";
  const clientSecret = "z193cuaUzqyBvylicZm2lxOdLYbKkQ";

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://www.reddit.com/api/v1/authorize?client_id=jGWH7t_6KkrVvtzhw3ONHg&response_type=code&state=AJHDASDKJ&redirect_uri=https://v0-deiss.vercel.app//&duration=permanent&scope=read", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "windows:jGWH7t_6KkrVvtzhw3ONHg:v1 (by /u/_ludax)"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token-Anfrage fehlgeschlagen: ${response.status} ${response.statusText} – ${errorText}`);
  }

  const data = await response.json();
  console.log(data);
  return data.access_token;
}
