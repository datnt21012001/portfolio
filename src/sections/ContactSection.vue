<script setup lang="ts">
import { PhArrowRight, PhEnvelopeSimple, PhLinkedinLogo, PhPhone } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { person, contact, ui } from '../data/content'

// Read through .value here because this is script, not template. The contact
// details themselves are the same in both languages - they are spread in from
// the English module - but the list is computed anyway so it cannot go stale if
// that ever stops being true.
const links = computed(() => [
  {
    icon: PhEnvelopeSimple,
    label: person.value.email,
    href: `mailto:${person.value.email}`,
    external: false,
  },
  {
    icon: PhPhone,
    label: person.value.phone,
    href: `tel:${person.value.phoneHref}`,
    external: false,
  },
  {
    icon: PhLinkedinLogo,
    label: person.value.linkedinLabel,
    href: person.value.linkedin,
    external: true,
  },
])
</script>

<template>
  <section id="contact" class="border-t border-line">
    <div class="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <h2
        v-reveal="0"
        class="mt-6 max-w-[16ch] text-[2.3rem] leading-[1.05] font-medium tracking-[-0.035em] text-ink sm:text-[3.1rem]"
      >
        {{ contact.headline }}
      </h2>

      <p v-reveal="1" class="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-soft">
        {{ contact.body }}
      </p>

      <a
        v-reveal="2"
        :href="`mailto:${person.email}`"
        class="group mt-9 inline-flex h-11 items-center gap-2 rounded-edge bg-accent px-5 text-[14.5px] font-medium whitespace-nowrap text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
      >
        {{ ui.getInTouch }}
        <PhArrowRight
          :size="15"
          weight="bold"
          aria-hidden="true"
          class="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </a>

      <ul v-reveal="3" class="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-3">
        <li v-for="link in links" :key="link.href" class="border-t border-line-strong pt-4">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="group inline-flex items-center gap-2.5 text-[14.5px] text-ink transition-colors duration-200 hover:text-accent"
          >
            <component
              :is="link.icon"
              :size="16"
              weight="regular"
              aria-hidden="true"
              class="shrink-0 text-faint transition-colors duration-200 group-hover:text-accent"
            />
            <span class="break-all">{{ link.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
