<script setup lang="ts">
import { experience, ui } from '../data/content'
</script>

<template>
  <section id="experience" class="border-t border-line bg-surface">
    <div class="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      <h2
        v-reveal="0"
        class="max-w-[20ch] text-[1.9rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2.4rem]"
      >
        {{ ui.experienceHeading }}
      </h2>

      <div class="mt-12">
        <article
          v-for="(job, i) in experience"
          :key="job.company"
          v-reveal="0"
          class="grid gap-x-10 gap-y-4 border-t border-line py-9 lg:grid-cols-12 lg:py-11"
        >
          <!-- Meta rail -->
          <div class="lg:col-span-4">
            <h3 class="text-[1.15rem] font-medium text-ink">{{ job.company }}</h3>
            <p class="num mt-1.5 text-[13px] text-accent">{{ job.period }}</p>
            <p class="mt-1 text-[13px] text-faint">{{ job.meta }}</p>
          </div>

          <!-- Detail -->
          <div class="lg:col-span-8">
            <p class="text-[15px] font-medium text-ink">{{ job.role }}</p>
            <ul class="mt-3.5 space-y-2.5">
              <li
                v-for="point in job.points"
                :key="point"
                class="relative max-w-[68ch] pl-6 text-[14.5px] leading-relaxed text-soft before:absolute before:top-[0.72em] before:left-0 before:h-px before:w-3 before:bg-line-strong before:content-['']"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
