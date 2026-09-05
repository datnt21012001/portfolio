<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { PhDownloadSimple, PhList, PhX } from '@phosphor-icons/vue'
import ThemeToggle from './ThemeToggle.vue'
import LocaleToggle from './LocaleToggle.vue'
import { person, nav, ui } from '../data/content'
import { useActiveSection } from '../composables/useActiveSection'

const { active } = useActiveSection(['impact', 'runtimes', 'experience', 'work', 'contact'])

const open = ref(false)

/**
 * The panel is a disclosure, not a modal: it pushes nothing, traps nothing and
 * covers no content the reader was already looking at, so it needs no focus
 * trap. Escape still closes it, because a keyboard user who opened it needs a
 * way out that is not "tab through five links".
 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- First stop in the tab order. Visually hidden until focused, then it lands
       in the header where a sighted keyboard user can see it. -->
  <a
    href="#main"
    class="sr-only rounded-edge focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-4 focus-visible:z-60 focus-visible:inline-flex focus-visible:h-10 focus-visible:items-center focus-visible:bg-accent focus-visible:px-4 focus-visible:text-[13px] focus-visible:font-medium focus-visible:text-on-accent"
  >
    {{ ui.skipToContent }}
  </a>

  <header
    class="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper"
  >
    <nav class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
      <a
        href="#top"
        class="text-[14px] font-medium tracking-tight whitespace-nowrap text-ink transition-colors duration-200 hover:text-accent"
      >
        {{ person.name }}
      </a>

      <ul class="ml-auto hidden items-center gap-6 md:flex lg:gap-8">
        <li v-for="item in nav" :key="item.href">
          <a
            :href="item.href"
            :aria-current="active === item.href.slice(1) ? 'true' : undefined"
            class="relative text-[13.5px] transition-colors duration-200"
            :class="
              active === item.href.slice(1)
                ? 'text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-accent after:content-[\'\']'
                : 'text-soft hover:text-ink'
            "
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <LocaleToggle />
        <ThemeToggle />
        <a
          :href="person.cv"
          download
          class="hidden h-9 items-center gap-1.5 rounded-edge bg-accent px-3.5 text-[13px] font-medium whitespace-nowrap text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px sm:inline-flex"
        >
          <PhDownloadSimple :size="14" weight="bold" aria-hidden="true" />
          {{ ui.downloadCv }}
        </a>

        <!-- 36px box, so the tap target clears the 24px CSS-px web minimum with
             room to spare on a phone. -->
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-edge border border-line text-soft transition-colors duration-200 hover:border-line-strong hover:text-ink active:translate-y-px md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? ui.closeMenu : ui.openMenu"
          @click="open = !open"
        >
          <PhX v-if="open" :size="17" weight="bold" aria-hidden="true" />
          <PhList v-else :size="17" weight="bold" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- Slide-down disclosure. Height-animated rather than transform-animated so
         it displaces the page edge cleanly; grid-rows 0fr->1fr keeps it to a
         single animatable property and needs no measured pixel height. -->
    <div
      id="mobile-nav"
      :inert="!open"
      class="grid overflow-hidden border-line transition-[grid-template-rows,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden"
      :class="open ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr] border-t-0'"
    >
      <div class="min-h-0">
        <ul class="mx-auto max-w-7xl px-5 py-2 sm:px-8">
          <li v-for="item in nav" :key="item.href" class="border-b border-line last:border-b-0">
            <a
              :href="item.href"
              :aria-current="active === item.href.slice(1) ? 'true' : undefined"
              class="flex items-center py-3.5 text-[15px] transition-colors duration-200"
              :class="active === item.href.slice(1) ? 'text-accent' : 'text-soft hover:text-ink'"
              @click="open = false"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="mx-auto max-w-7xl px-5 pt-1 pb-4 sm:px-8 sm:hidden">
          <a
            :href="person.cv"
            download
            class="inline-flex h-10 items-center gap-1.5 rounded-edge bg-accent px-4 text-[13.5px] font-medium text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
            @click="open = false"
          >
            <PhDownloadSimple :size="14" weight="bold" aria-hidden="true" />
            {{ ui.downloadCv }}
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
