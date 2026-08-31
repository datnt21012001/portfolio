import { describe, expect, it } from 'vitest'
import { formatDwell, parseEvent, parseVisit } from './payload'

describe('parseVisit', () => {
  const valid = { visitId: 'a3f9c2', path: '/', referrer: null, utm: {} }

  it('accepts a well formed body', () => {
    expect(parseVisit(valid)).toEqual(valid)
  })

  it('rejects a visit id that is not six lowercase hex characters', () => {
    for (const visitId of ['A3F9C2', 'a3f9c', 'a3f9c22', 'zzzzzz', '', 42, null]) {
      expect(parseVisit({ ...valid, visitId })).toBeNull()
    }
  })

  it('rejects anything that is not an object', () => {
    for (const body of [null, undefined, 'a3f9c2', 42, [valid]]) {
      expect(parseVisit(body)).toBeNull()
    }
  })

  it('defaults a missing path rather than reporting undefined', () => {
    expect(parseVisit({ visitId: 'a3f9c2' })?.path).toBe('/')
  })

  it('truncates free text to 200 characters', () => {
    const long = `https://x.example/${'a'.repeat(500)}`
    expect(parseVisit({ ...valid, referrer: long })?.referrer).toHaveLength(200)
  })

  it('strips control characters that would break out of a code span', () => {
    const parsed = parseVisit({ ...valid, referrer: 'https://x.example\n`@everyone' })
    expect(parsed?.referrer).toBe('https://x.example`@everyone')
  })

  it('keeps only the five known utm keys', () => {
    const parsed = parseVisit({
      ...valid,
      utm: { source: 'linkedin', medium: 'profile', evil: 'dropped', campaign: '' },
    })
    expect(parsed?.utm).toEqual({ source: 'linkedin', medium: 'profile' })
  })

  it('survives a utm value that is not a string', () => {
    expect(parseVisit({ ...valid, utm: { source: { toString: 'no' } } })?.utm).toEqual({})
  })
})

describe('parseEvent', () => {
  const valid = { visitId: 'a3f9c2', dwellMs: 1000, clicks: [] }

  it('accepts a well formed body', () => {
    expect(parseEvent(valid)).toEqual(valid)
  })

  it('keeps only known click targets, deduplicated and in order', () => {
    const parsed = parseEvent({
      ...valid,
      clicks: ['cv', 'email', 'cv', 'drop-database', 'linkedin'],
    })
    expect(parsed?.clicks).toEqual(['cv', 'email', 'linkedin'])
  })

  it('clamps dwell time into a plausible range', () => {
    expect(parseEvent({ ...valid, dwellMs: -5000 })?.dwellMs).toBe(0)
    expect(parseEvent({ ...valid, dwellMs: 99e9 })?.dwellMs).toBe(6 * 60 * 60 * 1000)
  })

  it('treats a non-finite or missing dwell time as zero', () => {
    for (const dwellMs of [NaN, Infinity, '600', undefined]) {
      expect(parseEvent({ ...valid, dwellMs })?.dwellMs).toBe(0)
    }
  })

  it('treats a non-array clicks field as no clicks', () => {
    expect(parseEvent({ ...valid, clicks: 'cv' })?.clicks).toEqual([])
  })
})

describe('formatDwell', () => {
  it('renders seconds below a minute', () => {
    expect(formatDwell(45_000)).toBe('45s')
    expect(formatDwell(0)).toBe('0s')
  })

  it('renders minutes and seconds', () => {
    expect(formatDwell(134_000)).toBe('2m 14s')
  })

  it('drops seconds past an hour', () => {
    expect(formatDwell(3_780_000)).toBe('1h 3m')
  })
})
