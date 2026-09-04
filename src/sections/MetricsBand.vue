<script setup lang="ts">
import { metrics } from '../data/content'
</script>

<template>
  <section class="border-y border-line bg-surface">
    <div class="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-14">
      <dl class="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
        <div v-for="(m, i) in metrics" :key="m.label" v-reveal="i" class="border-t border-line pt-5">
          <dt class="num text-[1.7rem] leading-none font-medium text-ink sm:text-[2.05rem]">
            {{ m.value
            }}<span class="ml-1.5 text-[0.9rem] font-normal text-faint">{{ m.unit }}</span>
          </dt>
          <dd class="mt-3 max-w-[26ch] text-[13.5px] leading-snug text-soft">{{ m.label }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
