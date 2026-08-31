import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './directives/reveal'

createApp(App).directive('reveal', vReveal).mount('#app')
