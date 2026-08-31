import type { Directive } from 'vue'

/**
 * Scroll reveal via IntersectionObserver. Never a scroll listener: no per-frame
 * work, no React-style state churn, and it unobserves itself once it has fired.
 * Value is the stagger index within the group.
 */
const observed = new WeakMap<Element, IntersectionObserver>()

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      el.classList.add('reveal', 'reveal-in')
      return
    }

    el.classList.add('reveal')
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-i', String(binding.value))
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal-in')
          io.unobserve(entry.target)
          observed.delete(entry.target)
        }
      },
      // threshold 0 so a single crossing pixel counts: elements taller than the
      // viewport, and fast flicks past a section, both still resolve.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    io.observe(el)
    observed.set(el, io)
  },
  unmounted(el) {
    const io = observed.get(el)
    if (io) {
      io.disconnect()
      observed.delete(el)
    }
  },
}
