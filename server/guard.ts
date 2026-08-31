/**
 * Both routes are public POSTs that cause an outbound Discord message, so they
 * are the flood surface. Neither defence here is authoritative and that is
 * deliberate: a portfolio does not warrant a KV namespace or a Durable Object.
 */

/**
 * Link-preview crawlers come first because they are the ones that would
 * actually fire in practice, every time the portfolio URL is pasted into a
 * chat. The search crawlers follow.
 */
const BOTS =
  /\b(?:bot|crawler|spider|crawl|slurp|preview|headless|monitor|scrape|fetcher|python-requests|curl|wget|axios|okhttp|go-http-client)\b|(?:discordbot|slackbot|twitterbot|facebookexternalhit|whatsapp|telegrambot|linkedinbot|embedly|quora link preview|bitlybot|skypeuripreview|pinterest|redditbot|applebot|googlebot|bingbot|yandex|duckduckbot|baiduspider|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexitybot|lighthouse|pagespeed|chrome-lighthouse)/i

export function isBot(userAgent: string): boolean {
  // A request with no User-Agent at all is never a real browser.
  return !userAgent.trim() || BOTS.test(userAgent)
}

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

/**
 * Per-IP token bucket in isolate memory. Cloudflare gives no guarantee about
 * how long an isolate lives or which one serves a request, so this blunts a
 * naive loop from one address and nothing more. It is not a rate limiter.
 */
const hits = new Map<string, number[]>()

export function rateLimited(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }

  recent.push(now)
  hits.set(ip, recent)

  // Unbounded growth is the only way this map can hurt anything, so evict any
  // address whose window has fully expired whenever the map gets large.
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key)
    }
  }

  return false
}

/** Test seam: the bucket is module state, which would otherwise leak between tests. */
export function resetRateLimit(): void {
  hits.clear()
}
