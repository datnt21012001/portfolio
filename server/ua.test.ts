import { describe, expect, it } from 'vitest'
import { parseUserAgent } from './ua'

const AGENTS = {
  chromeMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  firefoxWindows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  edgeWindows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  androidTablet:
    'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
}

describe('parseUserAgent', () => {
  it('reads Chrome on macOS', () => {
    expect(parseUserAgent(AGENTS.chromeMac)).toEqual({
      browser: 'Chrome 131',
      os: 'macOS 10.15.7',
      device: 'Desktop',
    })
  })

  it('reads Safari, which only names itself in Version/', () => {
    expect(parseUserAgent(AGENTS.safariMac).browser).toBe('Safari 17')
  })

  it('reads Firefox on Windows', () => {
    expect(parseUserAgent(AGENTS.firefoxWindows)).toEqual({
      browser: 'Firefox 128',
      os: 'Windows 10/11',
      device: 'Desktop',
    })
  })

  it('does not mistake Edge for Chrome', () => {
    expect(parseUserAgent(AGENTS.edgeWindows).browser).toBe('Edge 131')
  })

  it('reads an iPhone as mobile iOS', () => {
    expect(parseUserAgent(AGENTS.safariIphone)).toEqual({
      browser: 'Safari 17',
      os: 'iOS 17.4',
      device: 'Mobile',
    })
  })

  it('reads an Android phone as mobile', () => {
    expect(parseUserAgent(AGENTS.chromeAndroid)).toEqual({
      browser: 'Chrome 131',
      os: 'Android 14',
      device: 'Mobile',
    })
  })

  it('separates tablets from phones by the absence of Mobile', () => {
    expect(parseUserAgent(AGENTS.androidTablet).device).toBe('Tablet')
    expect(parseUserAgent(AGENTS.ipad).device).toBe('Tablet')
  })

  it('returns honest placeholders for an empty header', () => {
    expect(parseUserAgent('')).toEqual({ browser: 'Unknown', os: 'Unknown', device: 'Desktop' })
  })

  it('returns honest placeholders for something it does not know', () => {
    const parsed = parseUserAgent('SomeNewBrowser/1.0 (Plan9)')
    expect(parsed.browser).toBe('Unknown')
    expect(parsed.os).toBe('Unknown')
  })
})
