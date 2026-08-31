/**
 * Everything here is read from the request itself, never from the request body.
 * Cloudflare populates `request.cf` at the edge, so a visitor cannot forge any
 * of it; `CF-Connecting-IP` is likewise set by the edge, not by the client.
 */

export type Geo = {
  ip: string
  city: string | null
  region: string | null
  country: string | null
  flag: string | null
  isp: string | null
  timezone: string | null
  localTime: string | null
}

/** The subset of `request.cf` this uses. Declared locally so the module stays
 *  testable without the Workers runtime types. */
type CfProperties = {
  city?: string
  region?: string
  country?: string
  asOrganization?: string
  timezone?: string
}

/** ISO-3166 alpha-2 into the regional indicator pair Discord renders as a flag. */
export function flagOf(country: string | null): string | null {
  if (!country || !/^[A-Za-z]{2}$/.test(country) || country.toUpperCase() === 'XX') return null
  return String.fromCodePoint(
    ...[...country.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  )
}

function nonEmpty(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function localTime(timezone: string | null): string | null {
  if (!timezone) return null
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    }).format(new Date())
  } catch {
    // An unknown zone must not take the request down; the row is simply omitted.
    return null
  }
}

export function readGeo(request: Request): Geo {
  // Absent under `wrangler pages dev`, which is why every field is nullable.
  const cf = ((request as Request & { cf?: CfProperties }).cf ?? {}) as CfProperties

  const country = nonEmpty(cf.country)
  const timezone = nonEmpty(cf.timezone)

  return {
    ip: nonEmpty(request.headers.get('CF-Connecting-IP')) ?? 'unknown',
    city: nonEmpty(cf.city),
    region: nonEmpty(cf.region),
    country,
    flag: flagOf(country),
    isp: nonEmpty(cf.asOrganization),
    timezone,
    localTime: localTime(timezone),
  }
}

/** `Da Nang, Da Nang, VN` with the empty parts dropped, or null if all are. */
export function placeOf(geo: Geo): string | null {
  const parts = [geo.city, geo.region, geo.country].filter((p): p is string => Boolean(p))
  if (!parts.length) return null
  // Cloudflare reports a city and a region of the same name for municipalities.
  const unique = parts.filter((p, i) => parts.indexOf(p) === i)
  return unique.join(', ')
}
