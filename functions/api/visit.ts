import { readGeo } from '../../server/geo'
import { isBot, rateLimited } from '../../server/guard'
import { parseVisit } from '../../server/payload'
import { arrivalEmbed, send } from '../../server/discord'
import { parseUserAgent } from '../../server/ua'
import { readBody, silent, type Env } from '../../server/http'

/** Fired once when a visitor loads the page. This is the message that matters:
 *  it arrives while they are still reading. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const userAgent = request.headers.get('User-Agent') ?? ''
  const geo = readGeo(request)

  if (isBot(userAgent) || rateLimited(geo.ip)) return silent()

  const visit = parseVisit(await readBody(request))
  if (!visit) return silent()

  if (!env.DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL is not set; visit not reported')
    return silent()
  }

  // The visitor should not wait on Discord to finish rendering their page.
  waitUntil(send(env.DISCORD_WEBHOOK_URL, arrivalEmbed(visit, geo, parseUserAgent(userAgent))))

  return silent()
}
