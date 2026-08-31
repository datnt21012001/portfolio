/**
 * The only module that performs network I/O. Everything it renders is either
 * read from the request by the server or has been through `payload.ts`; the
 * three free-text fields are fenced in code spans so that markdown, mentions
 * and @everyone cannot escape the value they arrived in.
 */

import type { ClickTarget, EventPayload, VisitPayload } from './payload'
import { formatDwell } from './payload'
import { placeOf, type Geo } from './geo'
import type { ClientInfo } from './ua'

/** `--c-accent` in the light theme, and a muted slate for the quieter message. */
const ARRIVAL_COLOUR = 0xb8452b
const DEPARTURE_COLOUR = 0x64748b

const CLICK_LABELS: Record<ClickTarget, string> = {
  cv: 'Downloaded CV',
  email: 'Opened email',
  phone: 'Tapped phone',
  linkedin: 'Opened LinkedIn',
}

type Field = { name: string; value: string; inline?: boolean }

/** Wraps a value so its content cannot be read as markup. Backticks inside the
 *  value are stripped rather than escaped, because a code span has no escape. */
function code(value: string): string {
  return `\`${value.replace(/`/g, "'")}\``
}

function field(name: string, value: string | null, inline = true): Field[] {
  return value ? [{ name, value, inline }] : []
}

function source(visit: VisitPayload): string {
  const utm = Object.entries(visit.utm)
  if (utm.length) {
    return utm.map(([key, value]) => `${key}: ${code(value)}`).join('\n')
  }
  return visit.referrer ? code(visit.referrer) : 'Direct / no referrer'
}

export function arrivalEmbed(visit: VisitPayload, geo: Geo, client: ClientInfo) {
  const place = placeOf(geo)

  return {
    title: `${geo.flag ? `${geo.flag} ` : ''}Someone is reading the portfolio`,
    color: ARRIVAL_COLOUR,
    fields: [
      ...field('IP', code(geo.ip)),
      ...field('Location', place),
      ...field('ISP', geo.isp),
      ...field('Local time', geo.localTime),
      ...field('Device', `${client.device} - ${client.os}`),
      ...field('Browser', client.browser),
      ...field('Landed on', code(visit.path), false),
      ...field('Came from', source(visit), false),
    ],
    footer: { text: `visit ${visit.visitId}` },
    timestamp: new Date().toISOString(),
  }
}

export function departureEmbed(event: EventPayload, geo: Geo) {
  const place = placeOf(geo)
  const clicks = event.clicks.length
    ? event.clicks.map((c) => `- ${CLICK_LABELS[c]}`).join('\n')
    : 'Nothing clicked'

  return {
    title: `${geo.flag ? `${geo.flag} ` : ''}Visit ended`,
    color: DEPARTURE_COLOUR,
    fields: [
      { name: 'Stayed', value: formatDwell(event.dwellMs), inline: true },
      ...field('IP', code(geo.ip)),
      ...field('Location', place),
      { name: 'Actions', value: clicks, inline: false },
    ],
    footer: { text: `visit ${event.visitId}` },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Failures are swallowed on purpose. A visitor must never see an error because
 * a webhook was revoked, and there is no retry worth the latency: the message
 * is a notification, not a record.
 */
export async function send(webhookUrl: string, embed: object): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'portfolio',
        embeds: [embed],
        // The embeds carry no user input outside code spans, but a webhook that
        // cannot ping is one less thing to get wrong later.
        allowed_mentions: { parse: [] },
      }),
    })

    if (!response.ok) {
      console.error(`discord webhook ${response.status}: ${await response.text()}`)
    }
  } catch (error) {
    console.error('discord webhook failed', error)
  }
}
