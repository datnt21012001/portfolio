import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { person, hero, stack } from './src/data/profile'

/** Set once at deploy time. Everything origin-dependent below is skipped when
 *  it is absent, rather than guessed. */
const BASE = process.env.SITE_URL?.replace(/\/+$/, '')

/**
 * Social cards and canonical tags need an absolute origin, which is only known
 * at deploy time. Build with SITE_URL set and they are injected; build without
 * it and they are simply absent, which is correct. Never a hardcoded domain:
 * a canonical pointing at a host you do not own tells Google to rank that host.
 */
function siteUrl(): Plugin {
  const anchor = '<meta property="og:image" content="/img/portrait-1200.jpg" />'
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      if (!BASE) return html
      return html.replace(
        anchor,
        [
          `<link rel="canonical" href="${BASE}/" />`,
          `<meta property="og:url" content="${BASE}/" />`,
          `<meta property="og:image" content="${BASE}/img/portrait-1200.jpg" />`,
        ].join('\n    '),
      )
    },
  }
}

/**
 * schema.org Person, built from `profile.ts` rather than written out again, so
 * the structured data cannot drift from the page it describes. A recruiter who
 * searches the name is the reader here, and this is what lets a search engine
 * answer with a person rather than a page title.
 *
 * `url` and `image` only appear with SITE_URL, for the same reason the canonical
 * does: an absolute URL naming the wrong host is worse than no absolute URL.
 */
function structuredData(): Plugin {
  return {
    name: 'structured-data',
    transformIndexHtml(html) {
      const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        jobTitle: person.role,
        description: hero.subtext,
        email: `mailto:${person.email}`,
        telephone: person.phoneHref,
        address: {
          '@type': 'PostalAddress',
          addressLocality: person.location.split(',')[0]?.trim(),
          addressCountry: 'VN',
        },
        sameAs: [person.linkedin],
        knowsAbout: stack.flatMap((group) => group.items.map((item) => item.name)),
      }

      if (BASE) {
        data.url = `${BASE}/`
        data.image = `${BASE}/img/portrait-1200.jpg`
      }

      // `<` is escaped because a value containing `</script>` would otherwise
      // close the block early and drop the rest of the document into the page.
      const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
      return html.replace(
        '</head>',
        `  <script type="application/ld+json">\n${json}\n    </script>\n  </head>`,
      )
    },
  }
}

/**
 * The body font is discovered only after the CSS parses, which leaves a frame
 * of unstyled or invisible text on a cold load. Preloading it removes that hop.
 *
 * Only the latin subset, and only the text face: the other subsets carry
 * unicode-range rules the browser resolves by itself, and preloading glyph sets
 * no visitor of an English page will render would spend bandwidth to save
 * nothing. The filename is read from the bundle because Vite hashes it.
 */
function fontPreload(): Plugin {
  return {
    name: 'font-preload',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((name) =>
        /geist-latin-wght-normal-[^/]*\.woff2$/.test(name),
      )
      if (!file) return html

      return html.replace(
        '</head>',
        `  <link rel="preload" as="font" type="font/woff2" href="/${file}" crossorigin />\n  </head>`,
      )
    },
  }
}

/**
 * Cloudflare Pages answers an unmatched path with index.html, so without a real
 * robots.txt a crawler asking for one is handed the portfolio as text/html. A
 * static file takes precedence over that fallback and ends the ambiguity.
 *
 * The sitemap needs an absolute origin, so it is emitted only with SITE_URL,
 * and robots.txt only points at it when it exists.
 */
function crawlerFiles(): Plugin {
  return {
    name: 'crawler-files',
    generateBundle() {
      const lines = ['User-agent: *', 'Allow: /']
      if (BASE) lines.push(`Sitemap: ${BASE}/sitemap.xml`)

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${lines.join('\n')}\n` })

      if (!BASE) return

      // One page, so one entry. lastmod is the build date: the content changes
      // when the site is rebuilt and at no other time.
      const lastmod = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${BASE}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n` +
          `</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), siteUrl(), structuredData(), fontPreload(), crawlerFiles()],
  build: { target: 'es2022', cssTarget: 'safari16' },
})
