export async function GET() {
  return Response.json({
    status: "active",
    model: "gemini-1.5-flash",
    limits: {
      free_tier: "15 requests per minute",
      daily_limit: "1500 requests per day",
      recommendation: "Wait 1-2 seconds between requests",
    },
    documentation: "https://ai.google.dev/gemini-api/docs/rate-limits",
    upgrade_info: "Configure billing in Google Cloud Console for higher limits",
  })
}
