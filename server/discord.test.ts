import { describe, expect, it } from 'vitest'
import { arrivalEmbed, departureEmbed } from './discord'
import type { Geo } from './geo'
import type { ClientInfo } from './ua'

const FULL_GEO: Geo = {
  ip: '14.161.25.103',
  city: 'Da Nang',
  region: 'Da Nang',
  country: 'VN',
  flag: '🇻🇳',
  isp: 'Viettel Group',
  timezone: 'Asia/Ho_Chi_Minh',
  localTime: 'Sat, 21:14',
}

const BARE_GEO: Geo = {
  ip: 'unknown',
  city: null,
  region: null,
  country: null,
  flag: null,
  isp: null,
  timezone: null,
  localTime: null,
}

const CLIENT: ClientInfo = { browser: 'Chrome 131', os: 'macOS 10.15.7', device: 'Desktop' }

const VISIT = { visitId: 'a3f9c2', path: '/', referrer: null, utm: {} }

function names(embed: { fields: { name: string }[] }): string[] {
  return embed.fields.map((f) => f.name)
}

function valueOf(embed: { fields: { name: string; value: string }[] }, name: string) {
  return embed.fields.find((f) => f.name === name)?.value
}

describe('arrivalEmbed', () => {
  it('includes every row when geo is complete', () => {
    expect(names(arrivalEmbed(VISIT, FULL_GEO, CLIENT))).toEqual([
      'IP',
      'Location',
      'ISP',
      'Local time',
      'Device',
      'Browser',
      'Landed on',
      'Came from',
    ])
  })

  it('omits geo rows rather than printing undefined when cf is absent', () => {
    const rows = names(arrivalEmbed(VISIT, BARE_GEO, CLIENT))
    expect(rows).not.toContain('Location')
    expect(rows).not.toContain('ISP')
    expect(rows).not.toContain('Local time')
    expect(rows).toContain('Device')
  })

  it('collapses a city and region of the same name', () => {
    expect(valueOf(arrivalEmbed(VISIT, FULL_GEO, CLIENT), 'Location')).toBe('Da Nang, VN')
  })

  it('prefers utm over the referrer when both are present', () => {
    const visit = {
      ...VISIT,
      referrer: 'https://google.com',
      utm: { source: 'linkedin', medium: 'profile' },
    }
    expect(valueOf(arrivalEmbed(visit, FULL_GEO, CLIENT), 'Came from')).toBe(
      'source: `linkedin`\nmedium: `profile`',
    )
  })

  it('says so plainly when there is no referrer at all', () => {
    expect(valueOf(arrivalEmbed(VISIT, FULL_GEO, CLIENT), 'Came from')).toBe(
      'Direct / no referrer',
    )
  })

  it('fences free text so markdown and mentions cannot escape', () => {
    const visit = { ...VISIT, referrer: 'https://x.example/`@everyone`' }
    expect(valueOf(arrivalEmbed(visit, FULL_GEO, CLIENT), 'Came from')).toBe(
      "`https://x.example/'@everyone'`",
    )
  })

  it('carries the visit id in the footer for pairing with the departure', () => {
    expect(arrivalEmbed(VISIT, FULL_GEO, CLIENT).footer.text).toBe('visit a3f9c2')
  })
})

describe('departureEmbed', () => {
  const event = { visitId: 'a3f9c2', dwellMs: 134_000, clicks: [] as never[] }

  it('renders dwell time as text the client never supplied', () => {
    expect(valueOf(departureEmbed(event, FULL_GEO), 'Stayed')).toBe('2m 14s')
  })

  it('lists the clicks by label', () => {
    const value = valueOf(departureEmbed({ ...event, clicks: ['cv', 'email'] }, FULL_GEO), 'Actions')
    expect(value).toBe('- Downloaded CV\n- Opened email')
  })

  it('says nothing was clicked rather than leaving the row empty', () => {
    expect(valueOf(departureEmbed(event, FULL_GEO), 'Actions')).toBe('Nothing clicked')
  })

  it('repeats IP and location so a pair can be matched by eye', () => {
    const rows = names(departureEmbed(event, FULL_GEO))
    expect(rows).toContain('IP')
    expect(rows).toContain('Location')
  })

  it('shares the footer id with the arrival message', () => {
    expect(departureEmbed(event, FULL_GEO).footer.text).toBe(
      arrivalEmbed(VISIT, FULL_GEO, CLIENT).footer.text,
    )
  })
})
