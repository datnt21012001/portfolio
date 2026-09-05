<script setup lang="ts">
import { runtimes, ui } from '../data/content'
</script>

<template>
  <!-- Sits on paper like the impact grid above it, so the rule is what separates
       them. The argument here only works once those four numbers have been read. -->
  <section id="runtimes" class="border-t border-line">
    <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4">
          <div class="lg:sticky lg:top-24">
            <h2
              v-reveal="0"
              class="mt-6 max-w-[16ch] text-[1.95rem] leading-tight font-medium tracking-[-0.03em] text-ink sm:text-[2.5rem]"
            >
              {{ runtimes.headline }}
            </h2>
            <p v-reveal="1" class="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-soft">
              {{ runtimes.intro }}
            </p>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div
            v-for="(item, i) in runtimes.points"
            :key="item.title"
            v-reveal="i"
            class="border-t border-line py-8 first:border-t-0 first:pt-0 lg:py-9"
          >
            <h3 class="text-[1.15rem] font-medium text-ink">{{ item.title }}</h3>
            <p class="mt-3 max-w-[66ch] text-[15px] leading-relaxed text-soft">{{ item.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
