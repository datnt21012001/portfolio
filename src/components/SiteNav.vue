<script setup lang="ts">
import { PhDownloadSimple } from '@phosphor-icons/vue'
import ThemeToggle from './ThemeToggle.vue'
import { person, nav } from '../data/profile'
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper"
  >
    <nav class="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8">
      <a
        href="#top"
        class="font-mono text-[13px] tracking-tight whitespace-nowrap text-ink transition-colors duration-200 hover:text-accent"
      >
        {{ person.name }}
      </a>

      <ul class="ml-auto hidden items-center gap-5 md:flex lg:gap-7">
        <li v-for="item in nav" :key="item.href">
          <a
            :href="item.href"
            class="text-[13.5px] text-soft transition-colors duration-200 hover:text-ink"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <ThemeToggle />
        <a
          :href="person.cv"
          download
          class="inline-flex h-9 items-center gap-1.5 rounded-edge bg-ink px-3.5 text-[13px] font-medium whitespace-nowrap text-paper transition-opacity duration-200 hover:opacity-88 active:translate-y-px"
        >
          <PhDownloadSimple :size="15" weight="bold" />
          Download CV
        </a>
      </div>
    </nav>
  </header>
</template>
