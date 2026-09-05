import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Which section is currently being read, for the nav's active state.
 *
 * IntersectionObserver rather than a scroll listener, for the same reason the
 * reveal directive uses one: no per-frame work on the main thread.
 *
 * The rootMargin crops the viewport to a band just under the sticky header and
 * well above the fold. A section counts as "current" only while it occupies
 * that band, which stops two adjacent sections from both claiming the highlight
 * during a scroll. When several are in the band at once - short sections, or a
 * fast flick - the topmost wins, because that is the one the reader has just
 * arrived at.
 */
export function useActiveSection(ids: string[]) {
  const active = ref<string>('')
  let io: IntersectionObserver | null = null

  onMounted(() => {
    const seen = new Map<string, boolean>()

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting)
        // Document order, so the highest visible section is the one reported.
        const current = ids.find((id) => seen.get(id))
        if (current) active.value = current
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
  })

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })

  return { active }
}
