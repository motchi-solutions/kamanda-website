# Kamanda Management LLC

A professional management and business consultancy website supporting organizations across the UAE, KSA, the wider Gulf region, and globally. The site presents project management, construction support, technology adoption advisory, and business coordination. Specialist technology implementation can be coordinated through delivery partners including Motchi Solutions.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS v4, and React Compiler. Manrope and Cormorant Garamond are loaded with `next/font`. Interface icons use Lucide through `react-icons/lu`. See [direct dependencies](docs/DEPENDENCIES.md).

## Local development

Use Node.js 20.9 or newer (the installed Next.js minimum) and npm. Use a supported Node LTS release for deployment.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Before changing Next.js code, read `AGENTS.md` and the relevant version-matched guide under `node_modules/next/dist/docs/`.

### Environment variables

No environment variable is required to start development. The production origin, `https://www.kamandagroup.com`, is set in `src/lib/site.ts`. Development uses `http://localhost:3000`, Vercel Previews use their branch URL, and search engines may index only Vercel Production. `SITE_URL` optionally overrides the origin, for example for another local port. Environment files are ignored by Git; do not commit secrets. `NODE_ENV` is managed by Next.js scripts.

### Contact environment variables

Only the two `NEXT_PUBLIC_*` site keys are public. All other contact variables stay server-side. Set them in `.env.local` and the appropriate Vercel environments; never commit real secrets.

```dotenv
# Server only — Brevo API key, verified sender and enquiry inbox
BREVO_API_KEY=
CONTACT_FROM_EMAIL=no-reply@kamandagroup.com
CONTACT_TO_EMAIL=info@kamandagroup.com

# Server only — added by Vercel when the shared Upstash store is connected; salt is your own (32+ characters)
KV_REST_API_URL=
KV_REST_API_TOKEN=
CONTACT_HASH_SALT=

# Cloudflare Turnstile — site key is public and embedded at build time; redeploy after changing
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
# Server only
TURNSTILE_SECRET_KEY=

# Server only — exact allowed hostnames, comma-separated (origin and Turnstile checks)
CONTACT_ALLOWED_HOSTNAMES=localhost
```

Create one Cloudflare Turnstile widget (Managed mode) with the production, preview and `localhost` hostnames. Local `.env.local` can use Cloudflare's test keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) with `CONTACT_ALLOWED_HOSTNAMES=localhost`; Vercel Production uses the real keys with `CONTACT_ALLOWED_HOSTNAMES=kamandagroup.com,www.kamandagroup.com`. An explicit hostname list replaces the default `SITE_URL` hostname. The Google reCAPTCHA variables (`NEXT_PUBLIC_RECAPTCHA_*`, `GCP_PROJECT_ID`, `GOOGLE_RECAPTCHA_API_KEY`, `RECAPTCHA_V3_MIN_SCORE`) are no longer used and can be removed from Vercel.

`SITE_URL` must match the intended origin; use `http://localhost:3000` for local work. Vercel supplies `VERCEL=1`; do not set it on an untrusted non-Vercel host. Outside Vercel, production IP trust must be adapted explicitly. Full provider setup, no-JavaScript behavior, and failure/retry policies are in [docs/contact.md](docs/contact.md).

### Scripts

| Command         | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Local Next.js development server                        |
| `npm run lint`  | ESLint with Next.js and TypeScript rules                |
| `npm run build` | Production compilation, type checking, and prerendering |
| `npm run start` | Serve an existing production build                      |

Validation completed during the latest source review: ESLint passes, local image references resolve, and relative documentation links resolve. A final production build and browser/responsive review have not been verified in this workspace. A Vercel deployment has been reported, but the live URL is showing older content; its deployed commit and production-domain assignment still need verification.

## Project map

```text
src/
  app/                     Routes, root layout, global CSS, metadata endpoints
    ae/ sa/                Thin regional homepage routes
    about/ services/       Shared routes
  components/
    layout/                Navbar, nav links, mobile menu, footer, site intro
    pages/home/            Home composition, services preview, metrics, contact
    pages/about/           About page and working approach
    pages/services/        Service content and detailed sections
    ui/                    Shared hero, reveal, and contact CTA
  lib/                     Region definitions, cookie reader, site URL/config
  proxy.ts                 Region cookie and root-entry geo redirect
public/                    Brand, skyline, app icon, and social assets
docs/                      Architecture, dependencies, handoff notes
.github/CODEOWNERS         Ownership assigned to websites-admin
```

## Regional routing and SEO

- `/`: default UAE content and skyline; eligible Saudi visitors may redirect to `/sa`.
- `/ae`: explicit UAE homepage.
- `/sa`: Saudi skyline with the same page text and sections.
- `/about` and `/services`: shared URLs; navigation uses the region cookie.

The proxy records `kamanda-region` on homepage requests and uses `x-vercel-ip-country` for Saudi redirects at `/`, with crawler exclusions. Metadata is determined only by the route, never cookies, IP, or client state. Regional routes have their own canonical/social metadata; shared pages retain shared canonicals. See [architecture](docs/architecture.md) for exact behavior.

## Page experience

- **Home:** shared photo hero with gold highlights, an aligned 2×2 service-card grid on desktop, vertically aligned service introduction, synchronized metrics, and the secure enquiry form. Service cards use a two-column tablet layout and a single-column mobile layout.
- **About:** alternating text/photo sections, broader consultancy positioning, “How We Manage Our Projects” process cards, specialist partner information, and regional/global support.
- **Services:** sticky section navigation beneath the main navbar, directional arrows for sections above/below the current position, a dash for the active section, and alternating desktop content columns.
- **Shared navigation:** regional home links, active-page states, animated mobile disclosure, keyboard dismissal, and vector brand icons.

## UI, motion, and imagery

Use existing CSS-first Tailwind v4 tokens, modest corner radii, and navy/gold accents on neutral surfaces. Default to Server Components; isolate browser behavior in small Client Components.

The root layout renders a 950 ms CSS logo intro once per document load. Section reveals use IntersectionObserver and the Web Animations API. Off-screen items are prepared before paint and animate once on entry with subtle 700 ms entrances and delays capped at 280 ms. Content already visible during hydration remains steady, avoiding a visible-to-hidden flash. Keyboard focus and printing reveal content immediately. Metrics use a one-time requestAnimationFrame count-up with a shared 1.8-second quadratic ease-out progression (construction hours start at 200,000; the smaller totals start at zero and all finish together), with final values rendered on the server. All motion respects reduced-motion preferences. Hover/focus styles use CSS: service links turn dark gold with a navy underline drawn left to right, and diagonal/hero arrows repeat a gentle nudge while active. The footer uses the brighter hero gold. There is no animation dependency.

Use `next/image`: the skyline is eager with high fetch priority, and below-fold images remain lazy. Never reuse the hero source for lazy content on the same page. All four service cards use supplied local photos; photos display in full color with a subtle scale on hover or focus. No external image hotlinks are used.

## Contact and deployment

The contact form uses server-verified Cloudflare Turnstile bot checks, Upstash Redis rate limits/duplicate protection, and Brevo internal notification plus visitor confirmation. It preserves input on errors and provides accessible loading, inline recovery, and a success panel with reference feedback. Provider configuration is required before sending; unavailable services fail gracefully. See [contact setup, security, error codes, and verified quotas](docs/contact.md).

Deploy to a Next.js-capable platform that supports the Node server and proxy, such as Vercel. A static-only export cannot preserve the cookie-reading shared routes and proxy behavior. Install with `npm ci`, make development dependencies available during the build, configure `SITE_URL`, then build and serve using the scripts above. Google font loading through `next/font/google` needs network access at build time. Production region cookies are secure and require HTTPS. Outside Vercel, geo behavior needs an equivalent trusted country header supplied by the hosting layer; without it, root entry defaults to UAE.

### If the live site shows older content

First distinguish an old deployment from an old image: outdated headings or layouts point to a deployment/source mismatch, while unchanged photos alone may be an optimized-image cache issue.

- Confirm the latest source changes and replacement assets are committed and pushed.
- Compare the commit deployed to production with the commit containing those changes. Repository integration uses `develop`; do not assume that it is the configured production branch.
- Confirm the deployment completed successfully and that the live domain points to that deployment, rather than an earlier deployment or a different project.
- Compare the deployment-specific URL with the live domain before attributing the issue to browser caching.
- For image-only staleness, see [hero imagery and cache troubleshooting](docs/hero-imagery.md). Images use public URLs, so replacing a file at the same path can leave an older optimized copy cached. Renaming the asset and updating its URL gives the replacement a distinct cache key.

The cause of the reported live-site issue has not yet been confirmed.

## Remaining work

- Replace lower-resolution hero and Project Management photos with larger originals when available.
- Configure and manually verify Cloudflare Turnstile, Upstash, and Brevo before accepting live enquiries.
- Perform the separate final production/browser/responsive validation pass.

See [contributing](CONTRIBUTING.md), [architecture](docs/architecture.md), and [dependencies](docs/DEPENDENCIES.md).

Hero source paths, current dimensions, replacement instructions, and localhost cache troubleshooting are documented in [Hero imagery](docs/hero-imagery.md). Heroes reference root-relative public image URLs through `next/image`.

### Social sharing images

Open Graph and Twitter large-image cards use `src/lib/social-metadata.ts`:

| Routes | Image | Dimensions |
| --- | --- | --- |
| `/`, `/about`, `/services` | `/seo/og-default.png` | 1733 × 908 |
| `/ae` | `/seo/og-dubai.png` | 1733 × 908 |
| `/sa` | `/seo/og-riyadh.png` | 1733 × 907 |

Each route has its own social title, description, and Open Graph URL. `SITE_URL` supplies the absolute origin. Image dimensions match the actual PNG files. Social platforms may need to refresh cached page previews after deployment.

Desktop sections (1024 px and above) use `clamp(2rem, 4vw, 3.5rem)` vertical padding, half the smaller-screen spacing formula. Tablet/mobile spacing is unchanged. The footer includes the registered address beneath the gold catchphrase.

Legal placeholders are available at `/terms-of-service` and `/privacy-policy`, linked from the footer. Both are marked noindex and omitted from the sitemap until final content is supplied; update metadata and the sitemap when publishing the completed policies.
