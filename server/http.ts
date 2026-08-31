/** Shared request/response plumbing for the two API routes. */

export type Env = {
  DISCORD_WEBHOOK_URL?: string
}

/**
 * A body larger than this is not a visitor, so it is not worth parsing. The
 * cap matters because `request.json()` on an unbounded body is the cheapest
 * way to make the function do work an attacker chose.
 */
const BODY_MAX_BYTES = 2048

export async function readBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get('Content-Length') ?? '0')
  if (declared > BODY_MAX_BYTES) return null

  try {
    const text = await request.text()
    if (text.length > BODY_MAX_BYTES) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * Every outcome is 204. The endpoint reports nothing about whether a message
 * was sent, whether the caller was classed as a bot, or whether the body
 * parsed, because none of that is the visitor's business and all of it would
 * help someone probing the filter.
 */
export function silent(): Response {
  return new Response(null, { status: 204 })
}
