<script setup lang="ts">
import { impact, ui } from '../data/content'

/** 7/5, then 5/7, then a full-width fifth. Five items, five cells, no filler
 *  tile - and spans has to stay as long as `impact`, or the extra tile drops to
 *  a single grid column and the row breaks. */
const spans = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-12',
]

/**
 * Three tones, and every text colour in each of them is full-strength.
 *
 * The previous accent tile printed its body at opacity-80 and its context line
 * at opacity-70 over a saturated fill, which measured 3.95:1 and 3.39:1 - both
 * below AA for body text. The accent tile is now a tint carrying normal ink
 * instead, so the accent still marks the tile without the text paying for it.
 */
const tones: Record<string, string> = {
  panel: 'bg-panel border-panel',
  accent: 'bg-accent-quiet border-accent',
  surface: 'bg-surface border-line',
}
const titleTone: Record<string, string> = {
  panel: 'text-on-panel',
  accent: 'text-ink',
  surface: 'text-ink',
}
const bodyTone: Record<string, string> = {
  panel: 'text-on-panel-soft',
  accent: 'text-soft',
  surface: 'text-soft',
}
</script>

<template>
  <section id="impact" class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
    <div class="mt-6 max-w-[42ch]">
      <h2
        v-reveal="0"
        class="text-[1.95rem] leading-tight font-medium tracking-[-0.03em] text-ink sm:text-[2.5rem]"
      >
        {{ ui.impactHeading }}
      </h2>
      <p v-reveal="1" class="mt-4 text-[1.0625rem] leading-relaxed text-soft">
        {{ ui.impactIntro }}
      </p>
    </div>

    <div class="mt-11 grid gap-3 lg:grid-cols-12">
      <article
        v-for="(c, i) in impact"
        :key="c.title"
        v-reveal="i"
        :class="[spans[i], tones[c.tone]]"
        class="flex flex-col rounded-edge border p-6 sm:p-8"
      >
        <!-- The old number struck through, the new one beside it: one
             measurement, not two figures. No icon needed to say "became". -->
        <p class="num flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-[1.05rem] font-normal line-through decoration-[1.5px]"
            :class="c.tone === 'panel' ? 'text-on-panel-soft' : 'text-faint'"
          >
            {{ c.before }}
          </span>
          <span
            class="leading-none font-medium"
            :class="[
              c.scale === 'sm' ? 'text-[1.5rem] sm:text-[1.85rem]' : 'text-[2.1rem] sm:text-[2.6rem]',
              c.tone === 'panel' ? 'text-on-panel' : 'text-accent',
            ]"
          >
            {{ c.after }}
          </span>
        </p>

        <h3 class="mt-6 text-[1.0625rem] font-medium" :class="titleTone[c.tone]">{{ c.title }}</h3>

        <p class="mt-2.5 max-w-[52ch] text-[14.5px] leading-relaxed" :class="bodyTone[c.tone]">
          {{ c.body }}
        </p>

        <p
          class="mt-auto pt-7 text-[12.5px] leading-relaxed"
          :class="c.tone === 'panel' ? 'text-on-panel-soft' : 'text-faint'"
        >
          {{ c.context }}
        </p>
      </article>
    </div>
  </section>
</template>
