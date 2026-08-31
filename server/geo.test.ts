import { describe, expect, it } from 'vitest'
import { flagOf, placeOf, readGeo, type Geo } from './geo'

/** A Request carrying the fields Cloudflare would have attached at the edge. */
function edgeRequest(headers: Record<string, string>, cf?: Record<string, string>): Request {
  const request = new Request('https://example.com/api/visit', { method: 'POST', headers })
  if (cf) Object.defineProperty(request, 'cf', { value: cf })
  return request
}

describe('flagOf', () => {
  it('converts an ISO country code to regional indicators', () => {
    expect(flagOf('VN')).toBe('🇻🇳')
    expect(flagOf('us')).toBe('🇺🇸')
  })

  it('returns null for the codes that are not a country', () => {
    expect(flagOf(null)).toBeNull()
    expect(flagOf('XX')).toBeNull()
    expect(flagOf('VNM')).toBeNull()
    expect(flagOf('')).toBeNull()
  })
})

describe('readGeo', () => {
  it('reads IP and geo from the edge, never from the body', () => {
    const geo = readGeo(
      edgeRequest(
        { 'CF-Connecting-IP': '14.161.25.103' },
        {
          city: 'Da Nang',
          region: 'Da Nang',
          country: 'VN',
          asOrganization: 'Viettel Group',
          timezone: 'Asia/Ho_Chi_Minh',
        },
      ),
    )

    expect(geo.ip).toBe('14.161.25.103')
    expect(geo.city).toBe('Da Nang')
    expect(geo.isp).toBe('Viettel Group')
    expect(geo.flag).toBe('🇻🇳')
    expect(geo.localTime).toMatch(/\d{2}:\d{2}/)
  })

  it('degrades to nulls under wrangler pages dev, where cf is absent', () => {
    const geo = readGeo(edgeRequest({}))

    expect(geo.ip).toBe('unknown')
    expect(geo.city).toBeNull()
    expect(geo.flag).toBeNull()
    expect(geo.localTime).toBeNull()
  })

  it('does not let an unknown timezone throw the request away', () => {
    const geo = readGeo(edgeRequest({}, { timezone: 'Mars/Olympus' }))

    expect(geo.timezone).toBe('Mars/Olympus')
    expect(geo.localTime).toBeNull()
  })

  it('treats a blank header as absent rather than reporting an empty string', () => {
    expect(readGeo(edgeRequest({ 'CF-Connecting-IP': '  ' })).ip).toBe('unknown')
  })
})

describe('placeOf', () => {
  const base: Geo = {
    ip: '1.1.1.1',
    city: null,
    region: null,
    country: null,
    flag: null,
    isp: null,
    timezone: null,
    localTime: null,
  }

  it('joins the parts it has', () => {
    expect(placeOf({ ...base, city: 'Hanoi', region: 'Ha Noi', country: 'VN' })).toBe(
      'Hanoi, Ha Noi, VN',
    )
  })

  it('collapses the repeat Cloudflare reports for municipalities', () => {
    expect(placeOf({ ...base, city: 'Da Nang', region: 'Da Nang', country: 'VN' })).toBe(
      'Da Nang, VN',
    )
  })

  it('returns null when it has nothing, so the row is omitted', () => {
    expect(placeOf(base)).toBeNull()
  })
})
