<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { locale, toggle } = useLocale()
</script>

<template>
  <!-- Shows the language it will switch *to*, not the one being read: the label
       is a button, so it should name its own action. Same 9-unit box as the
       theme toggle beside it, with a text label rather than an icon because no
       flag stands for a language. -->
  <button
    type="button"
    class="grid h-9 min-w-9 place-items-center rounded-edge border border-line px-2 font-mono text-[12px] tracking-tight text-soft transition-colors duration-200 hover:border-line-strong hover:text-ink active:translate-y-px"
    :aria-label="locale === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'"
    :lang="locale === 'en' ? 'vi' : 'en'"
    @click="toggle"
  >
    {{ locale === 'en' ? 'VI' : 'EN' }}
  </button>
</template>
