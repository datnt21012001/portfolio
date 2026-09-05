<script setup lang="ts">
import { person, ui } from '../data/content'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-surface">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-9 text-[13px] leading-relaxed text-faint sm:flex-row sm:items-start sm:justify-between sm:px-8"
    >
      <p>{{ person.name }}, {{ person.location }}</p>
      <p class="max-w-[52ch] sm:text-right">
        {{ ui.credits }}
        {{ year }}
      </p>
    </div>
  </footer>
</template>
