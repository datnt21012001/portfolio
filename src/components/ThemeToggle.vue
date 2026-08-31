<script setup lang="ts">
import { PhSun, PhMoon } from '@phosphor-icons/vue'
import { useTheme } from '../composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="grid h-9 w-9 place-items-center rounded-edge border border-line text-soft transition-colors duration-200 hover:border-line-strong hover:text-ink active:translate-y-px"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <PhMoon v-if="isDark" :size="17" weight="regular" />
    <PhSun v-else :size="17" weight="regular" />
  </button>
</template>
