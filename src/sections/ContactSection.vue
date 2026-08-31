<script setup lang="ts">
import { PhArrowUpRight, PhEnvelopeSimple, PhLinkedinLogo, PhPhone } from '@phosphor-icons/vue'
import { person, contact } from '../data/profile'

const links = [
  { icon: PhEnvelopeSimple, label: person.email, href: `mailto:${person.email}`, external: false },
  { icon: PhPhone, label: person.phone, href: `tel:${person.phoneHref}`, external: false },
  { icon: PhLinkedinLogo, label: person.linkedinLabel, href: person.linkedin, external: true },
]
</script>

<template>
  <section id="contact" class="border-t border-line">
    <div class="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
      <h2
        v-reveal="0"
        class="max-w-[16ch] text-[2.2rem] leading-[1.08] font-medium tracking-[-0.03em] text-ink sm:text-[3rem]"
      >
        {{ contact.headline }}
      </h2>

      <p v-reveal="1" class="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-soft">
        {{ contact.body }}
      </p>

      <a
        v-reveal="2"
        :href="`mailto:${person.email}`"
        class="mt-9 inline-flex h-11 items-center gap-2 rounded-edge bg-accent px-5 text-[14.5px] font-medium whitespace-nowrap text-on-accent transition-opacity duration-200 hover:opacity-90 active:translate-y-px"
      >
        Get in touch
        <PhArrowUpRight :size="16" weight="bold" />
      </a>

      <ul v-reveal="3" class="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-3">
        <li v-for="link in links" :key="link.href" class="border-t border-line pt-4">
          <a
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="group inline-flex items-center gap-2.5 text-[14.5px] text-ink transition-colors duration-200 hover:text-accent"
          >
            <component :is="link.icon" :size="17" weight="regular" class="shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
            <span class="break-all">{{ link.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
