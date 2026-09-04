<script setup lang="ts">
import { howIWork, ui } from '../data/content'
</script>

<template>
  <section class="border-t border-line bg-surface">
    <!-- Full-bleed band. Breaks the column rhythm before the closing sections. -->
    <picture class="block">
      <source
        type="image/webp"
        srcset="/img/structure-1200.webp 1200w, /img/structure-2000.webp 2000w"
        sizes="100vw"
      />
      <img
        src="/img/structure-2000.jpg"
        srcset="/img/structure-1200.jpg 1200w, /img/structure-2000.jpg 2000w"
        sizes="100vw"
        width="2000"
        height="881"
        :alt="ui.structureAlt"
        loading="lazy"
        decoding="async"
        class="h-[34vh] w-full object-cover sm:h-[42vh]"
      />
    </picture>

    <div class="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-4">
          <h2
            v-reveal="0"
            class="text-[1.9rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2.4rem] lg:sticky lg:top-28"
          >
            {{ ui.howIWorkHeading }}
          </h2>
        </div>

        <div class="lg:col-span-8">
          <div
            v-for="(item, i) in howIWork"
            :key="item.title"
            v-reveal="i"
            class="border-t border-line py-8 first:pt-0 first:border-t-0 lg:py-9"
          >
            <h3 class="text-[1.15rem] font-medium text-ink">{{ item.title }}</h3>
            <p class="mt-3 max-w-[66ch] text-[15px] leading-relaxed text-soft">{{ item.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
