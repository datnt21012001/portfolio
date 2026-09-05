<script setup lang="ts">
import { PhArrowUpRight } from '@phosphor-icons/vue'
import { featured, ui } from '../data/content'
</script>

<template>
  <section id="work" class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
    <div class="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Real screenshot of the running product, not a mock. -->
      <div v-reveal="0" class="lg:col-span-7">
        <a
          :href="featured.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group block overflow-hidden rounded-edge border border-line transition-colors duration-300 hover:border-accent"
        >
          <picture class="block">
            <source
              type="image/webp"
              srcset="/img/mia-pos-1000.webp 1000w, /img/mia-pos-1800.webp 1800w"
              sizes="(max-width: 1023px) 100vw, 58vw"
            />
            <img
              src="/img/mia-pos-1800.jpg"
              srcset="/img/mia-pos-1000.jpg 1000w, /img/mia-pos-1800.jpg 1800w"
              sizes="(max-width: 1023px) 100vw, 58vw"
              width="1800"
              height="1013"
              :alt="ui.featuredAlt"
              loading="lazy"
              decoding="async"
              class="w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
            />
          </picture>
        </a>
      </div>

      <div class="lg:col-span-5 lg:pt-1">
        <h2
          v-reveal="0"
          class="text-[1.95rem] leading-tight font-medium tracking-[-0.03em] text-ink sm:text-[2.5rem]"
        >
          {{ featured.name }}
        </h2>
        <p v-reveal="1" class="num mt-2 text-[13px] text-accent">
          {{ featured.tagline }}
        </p>

        <p v-reveal="1" class="mt-5 text-[15.5px] leading-relaxed text-soft">{{ featured.body }}</p>

        <ul v-reveal="2" class="mt-7 space-y-3.5">
          <li
            v-for="point in featured.points"
            :key="point"
            class="border-t border-line pt-3.5 text-[14px] leading-relaxed text-soft"
          >
            {{ point }}
          </li>
        </ul>

        <a
          v-reveal="3"
          :href="featured.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group mt-8 inline-flex items-center gap-1.5 border-b border-accent pb-0.5 text-[14.5px] font-medium text-accent transition-opacity duration-200 hover:opacity-75"
        >
          {{ featured.hrefLabel }}
          <PhArrowUpRight
            :size="14"
            weight="bold"
            aria-hidden="true"
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  </section>
</template>
