# Portfolio - Nguyen Thanh Dat

Single-page portfolio for a backend engineer. Vue 3 + Vite + Tailwind v4, static output.

```bash
bun install
bun run dev       # http://localhost:5173
bun run build     # -> dist/
bun run preview
```

## Design decisions

**Palette "Slate + Ember".** Cool neutral ground, one warm accent (`--c-accent`).
The accent is confined to: the primary CTA, the measured result numbers, period
labels, link rules, and the single ember panel in the impact grid. It appears
nowhere else, in either theme. All colours are semantic tokens in
`src/styles/main.css`, swapped under `.dark` and `prefers-color-scheme: dark`.

**One radius.** `rounded-edge` (4px) on every card, image, button and chip.

**The language question is answered on the page, not dodged.** The CV is
Laravel-heavy and the roles being applied for are Node. `RuntimeStance.vue`
states that ratio outright and then makes the case that matters: the four
results in the impact grid are aggregate tables, composite indexes and a
container boundary, none of which belong to a language. Section order is load
bearing - the argument sits directly after the numbers it leans on.

**Photography is real and monochrome.** Portrait and the MIA-POS screenshot are
his own; the building is by Vinayak Sharma on Unsplash. Greyscale keeps them
from competing with the accent, and no image on the page is a mockup.

**Motion is CSS-only and motivated.** A single `v-reveal` directive
(`src/directives/reveal.ts`) fades content up as it enters the viewport, so the
page resolves in reading order. It uses IntersectionObserver, never a scroll
listener, unobserves after firing, and collapses to static under
`prefers-reduced-motion`. The hidden state is applied by JS at mount, so with
JS disabled everything renders.

## Content

Every visible string lives in `src/data/profile.ts`. Editing that file is the
whole content workflow. No figure on the page is invented; all of them come from
the CV in `public/cv/`.

## Verified

- WCAG AA contrast on all body text, light and dark (measured, not assumed)
- No horizontal overflow at 390 / 834 / 1440
- Keyboard focus ring on all 23 interactive stops (the runtimes section adds none)
- Brand marks are imported by name, not by barrel (18 paths, not the catalogue)

## Visitor notification

Two Discord messages per visit: one on arrival carrying IP, location, ISP,
device and referrer, one on departure carrying dwell time and which of the four
tracked links were clicked. Both footers carry the same six-character visit id,
so a pair can be matched by eye.

The webhook URL is a bearer credential, so it never enters the bundle. The
browser talks to `functions/api/{visit,event}.ts` instead, and those hold the
secret. Geo comes from `request.cf` at the edge, so no third-party API is
called and nothing in the message can be forged by the visitor.

`server/` holds the logic and is deliberately outside `functions/`: Cloudflare
documents no convention for non-routed helpers inside the functions directory,
so the modules live where routing cannot reach them. `server/payload.ts` is the
trust boundary - ids are pattern-matched, dwell time is clamped, click targets
come from a closed set, and the three free-text fields are truncated there and
fenced in code spans at render time, so no visitor string can carry markdown or
a mention into the channel.

Clicks are captured by one delegated listener on the document, so no section
component knows any of this exists.

One visit is one arrival and one departure however many tabs it spans: the
"already departed" flag lives in the stored visit record, not in a per-tab
variable, and the departing tab re-reads that record so it also reports clicks
made in a sibling tab. The cost is that reloading mid-visit sends the departure
early, and time spent after the reload goes unreported - one accurate pair was
preferred to two messages that have to be added up.

`compatibility_date` is pinned in `wrangler.jsonc`. Left unset, Cloudflare picks
a default that moves forward over time, so a later deploy could land on
different runtime behaviour with no change to the code.

Set the secret before the first deploy:

```bash
bunx wrangler pages secret put DISCORD_WEBHOOK_URL --project-name=portfolio-datnt
```

`bun run dev` never posts - the composable is inert outside `import.meta.env.PROD`,
and Vite does not run Pages Functions anyway. To exercise the endpoints, copy
`.env.example` to `.env` and run `bun run dev:cf`.

`bun run build` gates on both before it emits anything:

```bash
bun run test              # the pure modules under server/
bun run typecheck:server  # functions/ and server/, against workers-types
bun run build:app         # skip the gate when iterating on the page itself
```

## Deploy

Static output. Cloudflare Pages:

```bash
SITE_URL=https://your-domain.example bun run build
bunx wrangler pages deploy dist --project-name=portfolio-datnt
```

`SITE_URL` is what injects `<link rel="canonical">`, `og:url`, and the absolute
`og:image` needed for link previews. Build without it and those tags are simply
omitted, which is correct but gives no social card. There is deliberately no
default domain: a canonical pointing at a host you do not own tells search
engines the real page lives somewhere else.

That command is the manual path. `.github/workflows/deploy.yml` does the same
thing on every push to `main`, gated on `bun run build`, so a failing test or a
type error stops the deploy rather than shipping. Pull requests run the identical
gate and skip the upload.

Three settings on the GitHub repo, under Settings → Secrets and variables → Actions:

| Name | Kind | Notes |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | secret | Token with the **Cloudflare Pages: Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | secret | The account the Pages project lives in |
| `SITE_URL` | variable | Origin to build canonical tags from; omit and they are omitted |

`DISCORD_WEBHOOK_URL` is deliberately absent from that list. It is a runtime
binding the deployed Function reads, not a build input, so it is set once on the
project with `wrangler pages secret put` and never travels through CI.
