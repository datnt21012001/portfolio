<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import MetricsBand from './sections/MetricsBand.vue'
import ImpactGrid from './sections/ImpactGrid.vue'
import RuntimeStance from './sections/RuntimeStance.vue'
import ExperienceRail from './sections/ExperienceRail.vue'
import FeaturedProject from './sections/FeaturedProject.vue'
import ClientWork from './sections/ClientWork.vue'
import StackGroups from './sections/StackGroups.vue'
import HowIWork from './sections/HowIWork.vue'
import ContactSection from './sections/ContactSection.vue'
import { useVisitorPing } from './composables/useVisitorPing'

useVisitorPing()
</script>

<template>
  <SiteNav />
  <main>
    <HeroSection />
    <MetricsBand />
    <ImpactGrid />
    <RuntimeStance />
    <ExperienceRail />
    <FeaturedProject />
    <ClientWork />
    <StackGroups />
    <HowIWork />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
