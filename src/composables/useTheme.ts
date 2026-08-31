import { ref, onMounted } from 'vue'

type Theme = 'light' | 'dark'

const isDark = ref(false)

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  isDark.value = theme === 'dark'
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* private mode: the class still applies for this session */
  }
}

export function useTheme() {
  onMounted(() => {
    const root = document.documentElement
    isDark.value = root.classList.contains('dark')
      ? true
      : root.classList.contains('light')
        ? false
        : systemPrefersDark()
  })

  function toggle() {
    apply(isDark.value ? 'light' : 'dark')
  }

  return { isDark, toggle }
}
