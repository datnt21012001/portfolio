<script setup lang="ts">
import { PhArrowUpRight, PhDownloadSimple } from '@phosphor-icons/vue'
import { person, hero } from '../data/profile'
</script>

<template>
  <section id="top" class="mx-auto max-w-[1240px] px-5 sm:px-8">
    <div
      class="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24 min-h-[calc(100dvh-4rem)]"
    >
      <!-- Copy. Left-weighted, deliberately not centred. -->
      <div class="lg:col-span-7 lg:pr-6">
        <h1
          v-reveal="0"
          class="max-w-[19ch] text-[2.35rem] leading-[1.06] font-medium tracking-[-0.032em] text-ink sm:text-5xl lg:text-[3.4rem]"
        >
          {{ hero.headline }}
        </h1>

        <p v-reveal="1" class="mt-6 max-w-[47ch] text-[1.0625rem] leading-relaxed text-soft">
          {{ hero.subtext }}
        </p>

        <div v-reveal="2" class="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            class="inline-flex h-11 items-center gap-2 rounded-edge bg-accent px-5 text-[14.5px] font-medium whitespace-nowrap text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
          >
            Get in touch
            <PhArrowUpRight :size="16" weight="bold" />
          </a>
          <a
            :href="person.cv"
            download
            class="inline-flex h-11 items-center gap-2 rounded-edge border border-line-strong px-5 text-[14.5px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:bg-surface active:translate-y-px"
          >
            <PhDownloadSimple :size="16" weight="bold" />
            Download CV
          </a>
        </div>
      </div>

      <!-- Portrait. Offset down a step so the composition is not a tidy 50/50. -->
      <div v-reveal="1" class="lg:col-span-5 lg:mt-10">
        <img
          src="/img/portrait-1200.jpg"
          srcset="/img/portrait-720.jpg 720w, /img/portrait-1200.jpg 1200w"
          sizes="(max-width: 1023px) 100vw, 42vw"
          width="1200"
          height="1500"
          alt="Nguyen Thanh Dat"
          fetchpriority="high"
          decoding="async"
          class="w-full rounded-edge border border-line object-cover"
        />
      </div>
    </div>
  </section>
</template>
