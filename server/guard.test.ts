import { beforeEach, describe, expect, it } from 'vitest'
import { isBot, rateLimited, resetRateLimit } from './guard'

describe('isBot', () => {
  it('drops the link-preview crawlers that fire when the URL is pasted into a chat', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
      'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
      'Twitterbot/1.0',
      'facebookexternalhit/1.1',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0)',
    ]) {
      expect(isBot(ua)).toBe(true)
    }
  })

  it('drops search and SEO crawlers', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0)',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0)',
      'Mozilla/5.0 (compatible; SemrushBot/7~bl)',
    ]) {
      expect(isBot(ua)).toBe(true)
    }
  })

  it('drops scripted clients', () => {
    for (const ua of ['curl/8.4.0', 'python-requests/2.31.0', 'axios/1.6.0', 'Wget/1.21']) {
      expect(isBot(ua)).toBe(true)
    }
  })

  it('drops a request with no User-Agent, which is never a browser', () => {
    expect(isBot('')).toBe(true)
    expect(isBot('   ')).toBe(true)
  })

  it('lets real browsers through', () => {
    for (const ua of [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
    ]) {
      expect(isBot(ua)).toBe(false)
    }
  })
})

describe('rateLimited', () => {
  beforeEach(resetRateLimit)

  it('allows a normal visit, which is two requests', () => {
    expect(rateLimited('1.1.1.1')).toBe(false)
    expect(rateLimited('1.1.1.1')).toBe(false)
  })

  it('blocks the sixth request inside a minute', () => {
    for (let i = 0; i < 5; i += 1) expect(rateLimited('1.1.1.1')).toBe(false)
    expect(rateLimited('1.1.1.1')).toBe(true)
  })

  it('counts each address separately', () => {
    for (let i = 0; i < 5; i += 1) rateLimited('1.1.1.1')
    expect(rateLimited('2.2.2.2')).toBe(false)
  })

  it('forgives an address once its window has passed', () => {
    const start = 1_000_000
    for (let i = 0; i < 5; i += 1) rateLimited('1.1.1.1', start)
    expect(rateLimited('1.1.1.1', start)).toBe(true)
    expect(rateLimited('1.1.1.1', start + 61_000)).toBe(false)
  })
})
