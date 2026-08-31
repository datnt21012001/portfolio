import { readGeo } from '../../server/geo'
import { isBot, rateLimited } from '../../server/guard'
import { parseEvent } from '../../server/payload'
import { departureEmbed, send } from '../../server/discord'
import { readBody, silent, type Env } from '../../server/http'

/** Fired via sendBeacon as the visitor leaves, carrying dwell time and the
 *  clicks they made. Best-effort by nature: a killed tab sends nothing. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const userAgent = request.headers.get('User-Agent') ?? ''
  const geo = readGeo(request)

  if (isBot(userAgent) || rateLimited(geo.ip)) return silent()

  const event = parseEvent(await readBody(request))
  if (!event) return silent()

  if (!env.DISCORD_WEBHOOK_URL) return silent()

  waitUntil(send(env.DISCORD_WEBHOOK_URL, departureEmbed(event, geo)))

  return silent()
}
