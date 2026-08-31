<script setup lang="ts">
import { person } from '../data/profile'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-surface">
    <div
      class="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-9 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8"
    >
      <p>{{ person.name }}, {{ person.location }}</p>
      <p>
        Portrait and product screenshot are mine. Building photograph by Vinayak Sharma on Unsplash.
        {{ year }}
      </p>
    </div>
  </footer>
</template>
