import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import * as en from './profile'
import * as vi from './profile.vi'

/**
 * The locale-aware view of `profile.ts`. Every export here has the same name and
 * the same shape as the one it wraps, so a section swaps
 * `from '../data/profile'` for `from '../data/content'` and nothing else
 * changes: Vue unwraps a computed ref in a template, so `hero.headline` keeps
 * working exactly as it did.
 *
 * `profile.vi.ts` is typed against `profile.ts`, which is what stops the two
 * drifting - add a field on one side and the build fails until the other side
 * answers it. That check is the reason the translation is a parallel module
 * rather than strings scattered through the components.
 *
 * `vite.config.ts` still reads `profile.ts` directly for the JSON-LD. Structured
 * data describes the page as a search engine indexes it, and that is the English
 * one; a client-side toggle does not change the indexed document.
 */
const active = computed(() => (useLocale().locale.value === 'vi' ? vi : en))

export const person = computed(() => active.value.person)
export const hero = computed(() => active.value.hero)
export const metrics = computed(() => active.value.metrics)
export const impact = computed(() => active.value.impact)
export const experience = computed(() => active.value.experience)
export const featured = computed(() => active.value.featured)
export const clientWork = computed(() => active.value.clientWork)
export const stack = computed(() => active.value.stack)
export const alsoUse = computed(() => active.value.alsoUse)
export const runtimes = computed(() => active.value.runtimes)
export const howIWork = computed(() => active.value.howIWork)
export const contact = computed(() => active.value.contact)
export const nav = computed(() => active.value.nav)
export const ui = computed(() => active.value.ui)
