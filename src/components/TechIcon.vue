<script setup lang="ts">
import { computed } from 'vue'
import {
  siPhp,
  siLaravel,
  siNodedotjs,
  siNestjs,
  siGo,
  siPostgresql,
  siMysql,
  siRedis,
  siRabbitmq,
  siDocker,
  siLinux,
  siGithubactions,
  siCaddy,
  siVuedotjs,
  siTypescript,
  siTailwindcss,
  siSwagger,
  siBun,
} from 'simple-icons'

/**
 * Explicit named imports so the bundler ships eighteen paths, not the whole
 * simple-icons catalogue. Marks render in currentColor: eighteen saturated brand
 * colours would be the loudest thing on the page and would say nothing extra.
 */
const PATHS: Record<string, string> = {
  php: siPhp.path,
  laravel: siLaravel.path,
  nodedotjs: siNodedotjs.path,
  nestjs: siNestjs.path,
  go: siGo.path,
  postgresql: siPostgresql.path,
  mysql: siMysql.path,
  redis: siRedis.path,
  rabbitmq: siRabbitmq.path,
  docker: siDocker.path,
  linux: siLinux.path,
  githubactions: siGithubactions.path,
  caddy: siCaddy.path,
  vuedotjs: siVuedotjs.path,
  typescript: siTypescript.path,
  tailwindcss: siTailwindcss.path,
  swagger: siSwagger.path,
  bun: siBun.path,
}

const props = defineProps<{ slug: string; title: string }>()
const path = computed(() => PATHS[props.slug] ?? '')
</script>

<template>
  <svg
    v-if="path"
    viewBox="0 0 24 24"
    class="h-4 w-4 shrink-0"
    fill="currentColor"
    role="img"
    :aria-label="title"
  >
    <path :d="path" />
  </svg>
</template>
