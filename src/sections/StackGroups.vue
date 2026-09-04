<script setup lang="ts">
import TechIcon from '../components/TechIcon.vue'
import { stack, alsoUse, ui } from '../data/content'
</script>

<template>
  <section class="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
    <h2
      v-reveal="0"
      class="max-w-[22ch] text-[1.9rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2.4rem]"
    >
      {{ ui.stackHeading }}
    </h2>

    <div class="mt-11 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(group, i) in stack" :key="group.label" v-reveal="i" class="border-t border-line pt-5">
        <h3 class="text-[13px] font-medium text-faint">{{ group.label }}</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="item in group.items" :key="item.slug" class="flex items-center gap-2.5 text-ink">
            <TechIcon :slug="item.slug" :title="item.name" />
            <span class="text-[14.5px]">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-reveal="0" class="mt-12 border-t border-line pt-5">
      <p class="max-w-[74ch] text-[14px] leading-relaxed text-soft">
        <span class="text-faint">{{ ui.alsoInUse }}</span>
        {{ alsoUse }}
      </p>
    </div>
  </section>
</template>
