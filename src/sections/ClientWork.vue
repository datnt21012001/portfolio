<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { clientWork, ui } from '../data/content'
import { useLocale } from '../composables/useLocale'

/**
 * The rail used to be swipe-or-trackpad only: nothing inside a card is
 * focusable, and the scroller itself was not, so a keyboard user could not
 * reach the projects past the fold at all.
 *
 * Two things fix that, and both are required rather than either/or. The
 * container is a labelled, focusable region, so arrow keys scroll it once
 * tabbed to. And the paired buttons give a single-pointer alternative to the
 * drag - which is what WCAG 2.2 asks for, and what a mouse user without a
 * horizontal wheel needs anyway.
 */
const rail = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function measure() {
  const el = rail.value
  if (!el) return
  atStart.value = el.scrollLeft <= 1
  // 1px of slack: fractional layout widths mean scrollLeft rarely lands exactly.
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}

function page(direction: -1 | 1) {
  const el = rail.value
  if (!el) return
  const card = el.querySelector('article')
  // Fall back to most of a viewport if the rail is somehow empty.
  const step = card ? card.getBoundingClientRect().width + 12 : el.clientWidth * 0.8
  el.scrollBy({ left: step * direction, behavior: 'smooth' })
}

let ro: ResizeObserver | null = null
const { locale } = useLocale()

// A locale switch rewrites every card, which changes the rail's scrollWidth
// without changing its own box - so a ResizeObserver on the rail never fires
// for it and the end-of-rail state would go stale. Wait a frame for the new
// text to lay out, then re-measure.
watch(locale, () => requestAnimationFrame(measure))

onMounted(() => {
  measure()
  rail.value?.addEventListener('scroll', measure, { passive: true })
  // Catches viewport resize and orientation change, which do alter the box.
  ro = new ResizeObserver(measure)
  if (rail.value) ro.observe(rail.value)
})

onBeforeUnmount(() => {
  rail.value?.removeEventListener('scroll', measure)
  ro?.disconnect()
  ro = null
})
</script>

<template>
  <section class="border-t border-line bg-surface py-20 sm:py-28">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            v-reveal="0"
            class="max-w-[24ch] text-[1.95rem] leading-tight font-medium tracking-[-0.03em] text-ink sm:text-[2.5rem]"
          >
            {{ ui.workHeading }}
          </h2>
          <p v-reveal="1" class="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-soft">
            {{ ui.workIntro }}
          </p>
        </div>

        <!-- Paired controls. Disabled at each end rather than hidden, so the
             control set does not reflow as you page through it. -->
        <div v-reveal="1" class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-edge border border-line text-soft transition-colors duration-200 hover:border-accent hover:text-accent active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
            :aria-label="ui.scrollPrev"
            :disabled="atStart"
            @click="page(-1)"
          >
            <PhArrowLeft :size="16" weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-edge border border-line text-soft transition-colors duration-200 hover:border-accent hover:text-accent active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
            :aria-label="ui.scrollNext"
            :disabled="atEnd"
            @click="page(1)"
          >
            <PhArrowRight :size="16" weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Breadth without a wall of rows: flick through it. Kept inside the page
           gutter so the first card lines up with the heading above it. -->
      <div
        ref="rail"
        v-reveal="0"
        role="region"
        tabindex="0"
        :aria-label="ui.workHeading"
        class="rail mt-11 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4"
      >
        <article
          v-for="project in clientWork"
          :key="project.name"
          class="flex w-76 shrink-0 snap-start flex-col rounded-edge border border-line bg-paper p-6 transition-colors duration-300 hover:border-line-strong sm:w-86"
        >
          <p class="num text-[12.5px] text-accent">{{ project.period }}</p>
          <h3 class="mt-3 text-[1.05rem] leading-snug font-medium text-ink">{{ project.name }}</h3>
          <p class="mt-1.5 text-[13px] text-faint">{{ project.client }}</p>
          <p class="mt-4 text-[14px] leading-relaxed text-soft">{{ project.body }}</p>

          <ul class="mt-auto flex flex-wrap gap-1.5 pt-7">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="num rounded-edge border border-line px-2 py-1 text-[11.5px] text-soft"
            >
              {{ tech }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
