<script setup lang="ts">
import { impact } from '../data/profile'

/** 7/5 then 5/7. Four items, four cells, no filler tile. */
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

const tones: Record<string, string> = {
  panel: 'bg-panel text-on-panel border-panel',
  accent: 'bg-accent text-on-accent border-accent',
  surface: 'bg-surface text-ink border-line',
}
</script>

<template>
  <section id="impact" class="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
    <div class="max-w-[42ch]">
      <h2
        v-reveal="0"
        class="text-[1.9rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2.4rem]"
      >
        What I actually changed
      </h2>
      <p v-reveal="1" class="mt-4 text-[1.0625rem] leading-relaxed text-soft">
        Four problems from the last year, with the numbers that came out the other side.
      </p>
    </div>

    <div class="mt-11 grid gap-4 lg:grid-cols-12">
      <article
        v-for="(c, i) in impact"
        :key="c.title"
        v-reveal="i"
        :class="[spans[i], tones[c.tone]]"
        class="flex flex-col rounded-edge border p-6 sm:p-8"
      >
        <p class="num flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            class="text-[1.05rem] font-normal line-through decoration-[1.5px]"
            :class="{
              'text-on-panel-soft': c.tone === 'panel',
              'text-on-accent': c.tone === 'accent',
              'text-soft': c.tone === 'surface',
            }"
          >
            {{ c.before }}
          </span>
          <span
            class="leading-none font-medium"
            :class="[
              c.scale === 'sm' ? 'text-[1.5rem] sm:text-[1.85rem]' : 'text-[2.1rem] sm:text-[2.6rem]',
              c.tone === 'surface' ? 'text-accent' : '',
            ]"
          >
            {{ c.after }}
          </span>
        </p>

        <h3 class="mt-6 text-[1.0625rem] font-medium">{{ c.title }}</h3>

        <p
          class="mt-2.5 max-w-[52ch] text-[14.5px] leading-relaxed"
          :class="{
            'text-on-panel-soft': c.tone === 'panel',
            'text-on-accent opacity-80': c.tone === 'accent',
            'text-soft': c.tone === 'surface',
          }"
        >
          {{ c.body }}
        </p>

        <p
          class="mt-auto pt-7 text-[12.5px]"
          :class="{
            'text-on-panel-soft': c.tone === 'panel',
            'text-on-accent opacity-70': c.tone === 'accent',
            'text-faint': c.tone === 'surface',
          }"
        >
          {{ c.context }}
        </p>
      </article>
    </div>
  </section>
</template>
