import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Social cards and canonical tags need an absolute origin, which is only known
 * at deploy time. Build with SITE_URL set and they are injected; build without
 * it and they are simply absent, which is correct. Never a hardcoded domain:
 * a canonical pointing at a host you do not own tells Google to rank that host.
 */
function siteUrl(): Plugin {
  const base = process.env.SITE_URL?.replace(/\/+$/, '')
  const anchor = '<meta property="og:image" content="/img/portrait-1200.jpg" />'
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      if (!base) return html
      return html.replace(
        anchor,
        [
          `<link rel="canonical" href="${base}/" />`,
          `<meta property="og:url" content="${base}/" />`,
          `<meta property="og:image" content="${base}/img/portrait-1200.jpg" />`,
        ].join('\n    '),
      )
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), siteUrl()],
  build: { target: 'es2022', cssTarget: 'safari16' },
})
