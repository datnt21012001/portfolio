import { describe, expect, it } from 'vitest'
import { readBody, silent } from './http'

function post(body: string, headers: Record<string, string> = {}): Request {
  return new Request('https://example.com/api/visit', { method: 'POST', body, headers })
}

describe('readBody', () => {
  it('parses a well formed body', async () => {
    await expect(readBody(post('{"visitId":"a3f9c2"}'))).resolves.toEqual({ visitId: 'a3f9c2' })
  })

  it('returns null rather than throwing on malformed JSON', async () => {
    await expect(readBody(post('{"visitId":'))).resolves.toBeNull()
    await expect(readBody(post(''))).resolves.toBeNull()
    await expect(readBody(post('not json at all'))).resolves.toBeNull()
  })

  it('refuses a body over the cap without reading it', async () => {
    const oversized = JSON.stringify({ visitId: 'a3f9c2', pad: 'x'.repeat(4000) })
    await expect(readBody(post(oversized))).resolves.toBeNull()
  })

  it('refuses a body whose declared length is over the cap', async () => {
    // The declared length is checked first, so a lying header is rejected before
    // the request is drained rather than after.
    await expect(readBody(post('{}', { 'Content-Length': '999999' }))).resolves.toBeNull()
  })

  it('accepts a body right at the cap', async () => {
    const pad = 'x'.repeat(2048 - JSON.stringify({ pad: '' }).length)
    const body = JSON.stringify({ pad })
    expect(body.length).toBe(2048)
    await expect(readBody(post(body))).resolves.toEqual({ pad })
  })

  it('passes through a JSON scalar, which the payload parsers then reject', async () => {
    await expect(readBody(post('"a3f9c2"'))).resolves.toBe('a3f9c2')
    await expect(readBody(post('null'))).resolves.toBeNull()
  })
})

describe('silent', () => {
  it('says nothing about what happened, in every case', () => {
    const response = silent()
    expect(response.status).toBe(204)
    expect(response.body).toBeNull()
  })
})
