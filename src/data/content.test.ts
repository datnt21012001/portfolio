import { describe, expect, it } from 'vitest'
import { useLocale } from '../composables/useLocale'
import * as en from './profile'
import * as vi from './profile.vi'
import * as content from './content'

/**
 * The type system already refuses a translation of the wrong shape. What it
 * cannot see is a field that was spread in from English and never translated,
 * or a toggle that changes the stored value without changing what a section
 * reads. Both are silent failures that look fine in a build log.
 */

/** Fields that are the same in both languages on purpose: an address, a link,
 *  a product name, a measured number, an icon slug. */
const NOT_LANGUAGE = new Set([
  'email',
  'phone',
  'phoneHref',
  'linkedin',
  'linkedinLabel',
  'cv',
  'name',
  'href',
  'hrefLabel',
  'slug',
  'value',
  'unit',
  'tone',
  'scale',
  'before',
  'after',
  'company',
  'period',
  'stack',
  'portraitAlt',
])

/** Words that are genuinely the same in both languages. Listed one by one so
 *  that adding to this set is a decision rather than an accident. */
const SAME_IN_BOTH = new Set([
  'Backend',
  'Senior Backend Developer',
  'Team Leader (Backend)',
  'Backend Developer, middle level',
  'Junior Full-Stack Developer',
  'Backend Developer, fresher to junior',
])

function proseOf(node: unknown, key = ''): string[] {
  if (typeof node === 'string') return NOT_LANGUAGE.has(key) ? [] : [node]
  if (Array.isArray(node)) return node.flatMap((v) => proseOf(v, key))
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => proseOf(v, k))
  }
  return []
}

describe('the two locales', () => {
  it('expose exactly the same exports', () => {
    expect(Object.keys(vi).sort()).toEqual(Object.keys(en).sort())
  })

  it('leave no prose untranslated', () => {
    const untranslated: string[] = []

    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      const a = proseOf(en[key])
      const b = proseOf((vi as Record<string, unknown>)[key])
      // Same number of prose strings, in the same order, and none identical:
      // an identical string here means English survived into the translation.
      expect(b.length, `${key} has a different number of prose strings`).toBe(a.length)
      a.forEach((text, i) => {
        if (text === b[i] && !SAME_IN_BOTH.has(text)) {
          untranslated.push(`${key}: ${text.slice(0, 60)}`)
        }
      })
    }

    expect(untranslated).toEqual([])
  })
})

describe('the toggle', () => {
  it('switches what a section reads, not just the stored value', () => {
    const { locale, toggle } = useLocale()

    expect(locale.value).toBe('en')
    expect(content.hero.value.headline).toBe(en.hero.headline)

    toggle()
    expect(locale.value).toBe('vi')
    // The section-facing value has to move with it; this is the part a build
    // cannot check and a broken wiring would leave the page in English.
    expect(content.hero.value.headline).toBe(vi.hero.headline)
    expect(content.ui.value.downloadCv).toBe(vi.ui.downloadCv)

    toggle()
    expect(locale.value).toBe('en')
    expect(content.hero.value.headline).toBe(en.hero.headline)
  })
})
