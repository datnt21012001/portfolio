<script setup lang="ts">
import { PhArrowRight, PhDownloadSimple } from '@phosphor-icons/vue'
import { person, hero, ui } from '../data/content'
</script>

<template>
  <section id="top" class="border-b border-line">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <div
        class="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24 min-h-[calc(100dvh-4rem)]"
      >
        <!-- Copy. Left-weighted, deliberately not centred. -->
        <div class="lg:col-span-7 lg:pr-8">
          <p v-reveal="0" class="text-[13.5px] text-faint">{{ person.location }}</p>

          <h1
            v-reveal="0"
            class="mt-5 max-w-[19ch] text-[2.4rem] leading-[1.04] font-medium tracking-[-0.035em] text-ink sm:text-[3.1rem] lg:text-[3.6rem]"
          >
            {{ hero.headline }}
          </h1>

          <p v-reveal="1" class="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-soft">
            {{ hero.subtext }}
          </p>

          <div v-reveal="2" class="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              class="group inline-flex h-11 items-center gap-2 rounded-edge bg-accent px-5 text-[14.5px] font-medium whitespace-nowrap text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
            >
              {{ ui.getInTouch }}
              <PhArrowRight
                :size="15"
                weight="bold"
                aria-hidden="true"
                class="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
            <a
              :href="person.cv"
              download
              class="inline-flex h-11 items-center gap-2 rounded-edge border border-line-strong px-5 text-[14.5px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:border-accent hover:text-accent active:translate-y-px"
            >
              <PhDownloadSimple :size="15" weight="bold" aria-hidden="true" />
              {{ ui.downloadCv }}
            </a>
          </div>
        </div>

        <!-- Portrait. Offset down a step so the composition is not a tidy 50/50. -->
        <div v-reveal="1" class="lg:col-span-5 lg:mt-12">
          <picture class="block">
              <source
                type="image/webp"
                srcset="/img/portrait-720.webp 720w, /img/portrait-1200.webp 1200w"
                sizes="(max-width: 1023px) 100vw, 42vw"
              />
              <img
                src="/img/portrait-1200.jpg"
                srcset="/img/portrait-720.jpg 720w, /img/portrait-1200.jpg 1200w"
                sizes="(max-width: 1023px) 100vw, 42vw"
                width="1200"
                height="1500"
                :alt="ui.portraitAlt"
                fetchpriority="high"
                decoding="async"
                class="w-full rounded-edge border border-line object-cover"
              />
          </picture>
        </div>
      </div>
    </div>
  </section>
</template>
