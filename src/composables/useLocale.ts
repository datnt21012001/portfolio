import { ref } from 'vue'

export type Locale = 'en' | 'vi'

/** Module scope, so every component reads one value - the same shape as useTheme. */
const locale = ref<Locale>('en')

function stored(): Locale | null {
  try {
    const raw = globalThis.localStorage?.getItem('locale')
    return raw === 'en' || raw === 'vi' ? raw : null
  } catch {
    // Private mode. The default below still applies for this session.
    return null
  }
}

/**
 * A browser set to Vietnamese is most likely a Vietnamese recruiter, and they
 * are half the reason the translation exists. An explicit choice always wins
 * over the guess, and the guess is only ever made once.
 */
function detect(): Locale {
  return stored() ?? (globalThis.navigator?.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en')
}

function apply(next: Locale, persist: boolean) {
  locale.value = next
  // Screen readers pick pronunciation from this, and it is what tells a
  // translation tool the page is already in the reader's language. Guarded so
  // the module can be imported outside a browser, which is what makes the
  // switch testable at all.
  if (typeof document !== 'undefined') document.documentElement.lang = next
  if (!persist) return
  try {
    globalThis.localStorage?.setItem('locale', next)
  } catch {
    /* private mode: the choice holds for this session only */
  }
}

// Runs once when the module is first imported, before any component mounts, so
// the first paint is already in the right language.
apply(detect(), false)

export function useLocale() {
  function toggle() {
    apply(locale.value === 'en' ? 'vi' : 'en', true)
  }

  return { locale, toggle }
}
