<script setup lang="ts">
import { clientWork } from '../data/profile'
</script>

<template>
  <section class="border-t border-line bg-surface py-20 sm:py-28">
    <div class="mx-auto max-w-[1240px] px-5 sm:px-8">
      <h2
        v-reveal="0"
        class="max-w-[24ch] text-[1.9rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2.4rem]"
      >
        Work shipped under other names
      </h2>
      <p v-reveal="1" class="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-soft">
        Most of it sits behind an NDA, so the clients stay unnamed and the systems speak instead.
      </p>

      <!-- Breadth without a wall of rows: flick through it. Kept inside the page
           gutter so the first card lines up with the heading above it. -->
      <div
        v-reveal="0"
        class="mt-11 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--c-line-strong)_transparent] [scrollbar-width:thin]"
      >
        <article
          v-for="project in clientWork"
          :key="project.name"
          class="flex w-[19rem] shrink-0 snap-start flex-col rounded-edge border border-line bg-paper p-6 transition-colors duration-300 hover:border-line-strong sm:w-[21.5rem]"
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
