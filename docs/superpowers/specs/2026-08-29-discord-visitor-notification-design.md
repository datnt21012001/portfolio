# Discord visitor notification — design

Date: 2026-08-29
Status: implemented

## Goal

When someone opens the portfolio, send a Discord message with who they are and
where they came from. When they leave, send a second message with how long they
stayed and what they clicked.

## Why a server-side endpoint

The Discord webhook URL is a bearer credential: anyone holding it can post to the
channel. The site is a static bundle, so a URL placed in client code is public.
The webhook therefore lives only in a Cloudflare Pages Function, and the browser
talks to that function instead.

Cloudflare also supplies the geo data for free on `request.cf` (city, region,
country, timezone, ASN, lat/long) plus `CF-Connecting-IP`. No third-party geo API
is called, so there is nothing to rate-limit, nothing to pay for, and nothing for
an ad blocker to intercept.

## Two messages, not one, and not five

| Message | Trigger | Contents |
| --- | --- | --- |
| 1 — arrival | page load | IP, city/region/country, ISP (ASN org), local time, device/browser/OS, referrer + UTM, landing path |
| 2 — departure | `pagehide` or tab hidden, via `sendBeacon` | dwell time, list of clicked targets |

Both carry the same six-character visit ID in the footer, and message 2 repeats
IP and city, so a pair can be matched by eye without scrolling.

Message 1 fires eagerly so the notification arrives while the visitor is still
reading. Message 2 is best-effort: a browser killed mid-page will not send it.
That is acceptable — it carries the bonus data, never the primary signal.

## Components

```
functions/api/visit.ts      POST - arrival message
functions/api/event.ts      POST - departure message
server/geo.ts               CF-Connecting-IP + request.cf, with local-dev fallback
server/ua.ts                User-Agent -> { browser, os, device }
server/discord.ts           embed builders + webhook POST
server/payload.ts           request body validation (both routes)
server/guard.ts             bot filter + in-memory rate limit
server/http.ts              body cap + the uniform 204 response
src/composables/useVisitorPing.ts   arrival ping, click capture, departure beacon
```

Each `_lib` module is a pure function over its inputs except `discord.ts`, which
is the only module that performs network I/O. `functions/api/*` are thin: parse,
guard, delegate, respond.

Resolved during implementation: Cloudflare's routing documentation describes no
convention for underscore-prefixed helper files inside `functions/`, so the
fallback was taken and the modules live in a repo-root `server/`, imported by
relative path. Verified against `wrangler pages dev` - `GET /server/discord`
returns the SPA fallback, and no `.ts` file reaches `dist/`.

## Data flow

1. `useVisitorPing` mounts. If `localStorage` holds a visit record newer than 30
   minutes, it reuses that visit ID and skips the arrival POST. Otherwise it
   generates a new six-hex-character ID, stores it, and POSTs `{ visitId, path,
   referrer, utm }` to `/api/visit`.
2. `visit.ts` reads IP and geo from the request itself, parses the User-Agent
   header, builds the arrival embed, and POSTs it to the webhook. The client's
   body contributes only the visit ID, path, referrer and UTM values.
3. A single delegated `click` listener on `document` resolves
   `event.target.closest('a')` and maps its `href` to one of four targets:
   `cv` (path matches `person.cv` or ends in `.pdf`), `email` (`mailto:`),
   `phone` (`tel:`), `linkedin` (host contains `linkedin.com`). Anything else is
   ignored. Hits accumulate in memory and in the `localStorage` record.
4. On `pagehide`, or on `visibilitychange` to hidden, a once-only guard fires
   `navigator.sendBeacon('/api/event', blob)` with `{ visitId, dwellMs, clicks }`.
   `visibilitychange` is included because iOS Safari does not reliably fire
   `pagehide`.
5. `event.ts` validates, builds the departure embed, and posts it.

The once-only guard is the stored record's `departed` flag rather than a local
variable, so two tabs on one visit produce one departure rather than two, and the
departing tab re-reads the record to pick up clicks made in its sibling. A visit
outliving the TTL reads back as null and still sends: absence of a record is not
evidence that a departure was already sent.

## Trust boundary

Every client-supplied value is either discarded or constrained before it reaches
Discord:

- `visitId` must match `/^[0-9a-f]{6}$/`.
- `dwellMs` must be a finite number, clamped to `[0, 6h]`, and is rendered by the
  server as `2m 14s` — the client never supplies display text.
- `clicks` must be an array of at most 4 unique members of the fixed enum
  `cv | email | phone | linkedin`. Unknown members are dropped.
- `path`, `referrer` and UTM values are truncated to 200 characters and rendered
  inside a Discord code span, so markdown and mention syntax cannot escape.

The three free-text fields — `path`, `referrer`, `utm` — are the only browser
strings that reach the message at all, and they arrive already truncated and
fenced. Everything else in both embeds is either read from the request by the
server or chosen from a closed set. That is what makes it safe for both
endpoints to be unauthenticated.

`referrer` is client-supplied rather than read from the `Referer` header because
the header on a same-origin `fetch` names the portfolio itself; only
`document.referrer` carries the site the visitor actually arrived from.

## Abuse control

Both routes are public POST endpoints that cause an outbound Discord message, so
they are the flood surface. Defences, in order:

- Reject any request whose method is not POST or whose body exceeds 2 KB.
- Drop known bot User-Agents. This includes the link-preview crawlers
  (Discordbot, Slackbot, Twitterbot, facebookexternalhit) that would otherwise
  fire every time the portfolio URL is pasted into a chat, and the search
  crawlers (Googlebot, bingbot, AhrefsBot, SemrushBot).
- A per-IP token bucket held in Worker isolate memory: 5 requests per minute.
  This is best-effort and not shared across isolates, which is stated plainly
  here rather than implied — it blunts a naive loop, it does not stop a
  distributed flood. Adding Cloudflare KV or a Durable Object would make it
  authoritative, and is deliberately out of scope for a portfolio site.
- Discord webhook failures are swallowed. The endpoint returns 204 regardless,
  so a broken webhook never surfaces an error to a visitor.

## Configuration

`DISCORD_WEBHOOK_URL` is the only secret. Set for production with:

```
bunx wrangler pages secret put DISCORD_WEBHOOK_URL --project-name=portfolio-datnt
```

Locally it goes in `.env`, which is added to `.gitignore`.

`vite dev` does not execute Pages Functions, so a `dev:cf` script runs
`wrangler pages dev` against the built output for end-to-end testing. The client
composable is a no-op unless `import.meta.env.PROD`, so ordinary `bun run dev`
never posts to Discord.

`request.cf` is absent or mocked under local `wrangler pages dev`. `geo.ts`
returns an "unknown" record in that case and the embed renders without geo rows
rather than printing `undefined`.

## Testing

The project has no test runner. Vitest is added, covering the pure modules only:

- `ua.ts` — representative Chrome, Safari, Firefox, Android and iPhone strings,
  plus an empty header.
- `payload.ts` — each validation rule above, including the rejection cases.
- `discord.ts` embed builders — field presence with full geo, with absent geo,
  and with an empty click list.
- dwell formatting — sub-minute, multi-minute, and clamping.
- `http.ts` — malformed JSON, a body over the cap, a lying `Content-Length`, and
  a body exactly at the cap.

Network calls and the Pages runtime are not tested.

## Privacy

The full visitor IP is recorded, at the owner's explicit request. Combined with
city and ISP this is personal data under GDPR. It is sent to a private Discord
channel and stored nowhere else; there is no database and no retention policy
beyond Discord's own. Masking the final octet is a one-line change in `geo.ts`
if that position changes.

## Out of scope

Sessions across visits, a dashboard, pageview counts, scroll depth, KV-backed
deduplication, and any consent banner.
