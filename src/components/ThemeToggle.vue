<script setup lang="ts">
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="grid h-9 w-9 place-items-center rounded-edge border border-line text-soft transition-colors duration-200 hover:border-accent hover:text-accent active:translate-y-px"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <PhMoon v-if="isDark" :size="16" weight="regular" aria-hidden="true" />
    <PhSun v-else :size="16" weight="regular" aria-hidden="true" />
  </button>
</template>
