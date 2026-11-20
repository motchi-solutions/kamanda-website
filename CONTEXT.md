# Project context: Kamanda website

Read this with [AGENTS.md](AGENTS.md) before every task. This file holds the rules that apply only to this project.

## Project

- Website for Kamanda Management LLC, a management and business consultancy for the UAE, KSA and the Gulf. Production origin: `https://kamandagroup.com`.
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, React Compiler, `next/font` (Manrope, Cormorant Garamond), Lucide icons via `react-icons/lu`, PDFKit for legal PDFs. Node 26 (`.nvmrc`).
- Branch model: develop flow. `develop` deploys to Vercel Preview, `main` to Production.
- Architecture, contact form and imagery notes are in [docs/](docs/).

## Commands

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Build | `npm run build` |
| Dependency tracker | `npm run dependencies:inventory` |
| Skill tracker | `npm run skills:inventory` |

## Project-specific rules

- Analytics: Vercel Web Analytics via `src/lib/analytics.ts` and `src/components/analytics/site-analytics.tsx` (Production only, path plus `utm_*` tags). Enable it in the Vercel project's Analytics tab.
- Spam protection: Cloudflare Turnstile. Server check in `src/lib/turnstile.ts`, client hook in `src/lib/use-turnstile.ts`. Needs `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- `SITE_URL` sets canonical, social, sitemap and robots URLs. Never ship a localhost value to production.
- Only the two `NEXT_PUBLIC_*` contact keys are public. All other contact variables stay server-side. See [README.md](README.md) and [docs/contact.md](docs/contact.md).
- Technology and AI enquiries also notify Motchi. Do not change recipients without asking.
- Motchi is mentioned as a technology partner. Keep that wording factual.
- The footer credit links to Motchi with tracking tags: `https://www.motchi.ca/?utm_source=kamanda&utm_medium=referral&utm_campaign=client-footer`. Keep this format if you change the footer.

## Design skills

The design skills in `.agents/skills/` were imported from motchi-website for later clean-up passes. Use only the ones that fit the task. This client's brand and approved content always win over skill defaults. Never invent content, reviews, prices or claims.

Suggested order for major UI work: hallmark (audit only) > frontend-design > better-layout > design-systems-frontend-architecture > frontend-ui-engineering > modern-web-guidance > ux-writing > apple-design > unslop (final polish) > web-design-guidelines (final QA) > untangle-codebase (only for real structural problems).

- modern-web-guidance: run only `.agents/skills/modern-web-guidance/mwg search|list|retrieve`. It is offline with telemetry off. Never run `npx modern-web-guidance`.
- web-design-guidelines fetches its rules from GitHub. The hallmark and unslop helpers can open browsers, download images or call image APIs. All of these need explicit approval first.
