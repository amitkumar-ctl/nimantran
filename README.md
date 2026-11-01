# Nimantran: wedding invitation websites with RSVP

Couples create a wedding invitation website (every function, venue maps, live
countdown, RSVP, UPI shagun), publish it and share one link on WhatsApp.
Guests RSVP without an account, and couples see a live guest list with a
headcount per function and an Excel/CSV export.

> **Brand name:** "Nimantran" is a working name. Change it in
> `src/config/site.ts` (one place) and it updates the logo, titles, meta tags,
> share images and footer.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Cache Components, Turbopack) | Server-rendered HTML for SEO, route handlers for the API, one deployment |
| UI | **React 19**, **TypeScript** | |
| Styling | **Tailwind CSS v4** with a **single global stylesheet** (`src/app/globals.css`) | Design tokens + 4 invite themes as CSS variables (`[data-theme]`) |
| Server state | **TanStack Query** | Dashboard lists, guest list, mutations, caching, refetching |
| Client state | **Zustand** (`src/stores/editor-store.ts`) | Invite editor draft that drives the live preview |
| Validation | **Zod** (`src/lib/validation.ts`) | Same schemas validate forms in the browser and requests on the server |
| Database | **MongoDB + Mongoose** | Users, invites, RSVPs |
| Auth | **Sign in with Google** (Google Identity Services) + email/password (bcrypt); session = signed JWT in an **httpOnly cookie** (`jose`) | No paid auth service needed |
| Fonts | Self-hosted with `next/font/local` (Inter, Cormorant Garamond, Great Vibes, Tiro Devanagari Hindi) | No layout shift, no request to Google |

**Why not Redux?** All server data is handled by TanStack Query and the only
complex client state (the editor draft) fits in a small Zustand store. Redux
would add boilerplate without solving a problem this app has.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Environment variables (`.env.local`):

| Variable | What it is |
|---|---|
| `MONGODB_URI` | MongoDB connection string. The [MongoDB Atlas](https://www.mongodb.com/atlas) free tier works. |
| `AUTH_SECRET` | 32+ character random string for signing login cookies: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | Public URL, e.g. `https://nimantran.in`. Used for canonical URLs, sitemap and share links. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | *(optional)* Google OAuth client ID. The Google button is hidden when empty. |

### Setting up Sign in with Google

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create (or pick) a project.
2. **APIs & Services → OAuth consent screen**: app name, support email, logo. Publish it.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.**
4. Under **Authorized JavaScript origins** add `http://localhost:3000` and your live domain (e.g. `https://nimantran.in`).
   No redirect URIs are needed: the button uses a popup and returns a signed ID token.
5. Copy the client ID into `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and restart / redeploy.

How it works: Google's button gives the browser a signed ID token → `POST /api/auth/google`
verifies the signature against Google's public keys, the issuer, that the token was
issued for *your* client ID, expiry and `email_verified` → finds the user by Google ID,
links an existing account with the same verified email, or creates a new one → sets the
session cookie. Google-only accounts have no password; logging in with a password shows
"This account uses Google". (`GOOGLE_JWKS_URL` exists only so automated tests can use a
local key server. Don't set it in production.)

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Templates

12 designs, all defined in **`src/lib/themes.ts`** (one entry each):

| Category | Designs |
|---|---|
| Traditional | Royal Maroon (mandala), Marigold Haldi (genda phool), Peacock Royale (mor-pankh) |
| Regional | Sindoor Red (jharokha arch, Bengali/Rajasthani), Kasavu Gold (oil lamp, South Indian), Mughal Emerald (Mughal arch, nikah) |
| Pastel & modern | Mehndi Garden (botanical wreath), Midnight Sangeet (moon & stars), Blush Rose (light, florals), Ivory Minimal (monogram), Lavender Lotus (lotus) |
| Destination | Goa Sunset (sun over the sea) |

A design = colours (become CSS variables) + crest artwork (SVG, `components/invite/Ornaments.tsx`)
+ border style (double, corners, arch, kasavu bands, single) + light/dark hero. Each design also
pre-fills the right ceremonies for its tradition (Haldi→Reception; Mehndi/Nikah/Walima;
Engagement/Muhurtham/Reception; Welcome party→Beach wedding) and a fitting blessing line.
**To add a design:** add its id to `TEMPLATE_IDS` and an entry to `TEMPLATES`. The gallery,
template pages, sitemap, pickers and WhatsApp preview colours all update automatically.

## Pages

| Route | What | Rendering |
|---|---|---|
| `/` | Landing page (features, how it works, templates, FAQ) | Static HTML |
| `/templates`, `/templates/[theme]` | Gallery grouped by tradition + one page per design (12) | Static HTML |
| `/wedding-invitation-wording` | Hindi & English wording guide (SEO content) | Static HTML |
| `/signup`, `/login` | Auth | Static shell + client form |
| `/dashboard` | Couple's invites, create new | Client (TanStack Query) |
| `/dashboard/invites/[id]` | Editor with live phone preview | Client (Zustand + TanStack Query) |
| `/dashboard/invites/[id]/guests` | RSVP stats, per-function headcount, CSV export | Client |
| `/i/[slug]` | **Public invite** guests open from WhatsApp | Server-rendered per request from a cached lookup |
| `/i/[slug]/opengraph-image` | WhatsApp/LinkedIn preview card with names + date | Generated PNG |

API (route handlers in `src/app/api`): `auth/{signup,login,google,logout,me}`,
`invites` (list/create), `invites/[id]` (get/update/delete),
`invites/[id]/rsvps` (`?format=csv` for download), and the public
`public/invites/[slug]/rsvp`.

## SEO

- Marketing pages are **prerendered static HTML** with real content (≈300–800
  words each), one `<h1>`, unique titles/descriptions and canonical URLs.
- **Structured data (JSON-LD):** Organization, WebSite, WebApplication and
  FAQPage on the home page, ItemList on templates, BreadcrumbList on each
  template, Article on the wording guide.
- `sitemap.xml` and `robots.txt` are generated (`src/app/sitemap.ts`,
  `src/app/robots.ts`). The dashboard and API are disallowed.
- Open Graph + Twitter cards everywhere; every invite gets its own
  generated preview image.
- **Couples' invites are private:** `noindex, nofollow`, left out of the
  sitemap, and the URL has a random suffix (`aarav-weds-meera-k3x9q2`) so
  it can't be guessed. Link previews still work because WhatsApp reads the
  Open Graph tags.
- Best next SEO step: add more guide pages like the wording guide (e.g. "haldi
  invitation wording", "wedding hashtag ideas", "how to make a wedding
  website"). Each one is a new way to be found.

## Payments (Premium, Razorpay)

Off by default. While on, designing and previewing is free, and an invite must be paid for (Premium, one-time) before it can be published and opened by guests. Premium also adds a short link (`getnimantran.com/amit-nikita`), no "Made with Nimantran" footer, unlimited family cards (unpaid invites get 1 watermarked sample) and the guest list download. Each account can have one invite. Invites created before `PAYWALL_START` (default 1 Nov 2026, IST) stay live for free with their old limits. With `PAYMENTS_ENABLED=false` nothing about Premium is shown and there are no limits.

To switch it on:
1. Activate your Razorpay account (KYC). Razorpay checks that the site has Pricing, Terms, Privacy, Refund policy and Contact pages: all exist.
2. Razorpay → Account & Settings → API Keys: put `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the environment (start with `rzp_test_` keys).
3. Razorpay → Webhooks → Add webhook: URL `https://<your domain>/api/payments/webhook`, events `payment.captured`, `order.paid`, `refund.processed`, and a secret you also set as `RAZORPAY_WEBHOOK_SECRET`.
4. Set `PAYMENTS_ENABLED=true` (and `PREMIUM_PRICE_PAISE` / `PREMIUM_MRP_PAISE`), then redeploy.
5. Make one test payment with the test keys (Razorpay's test UPI ID `success@razorpay` works), then swap in live keys.

Refunds: issue them in the Razorpay dashboard; the webhook takes Premium away and unpublishes the invite (it goes back to a private draft).

## Security notes

- Passwords hashed with bcrypt (12 rounds). Login timing doesn't reveal
  whether an email exists.
- Session cookie is `httpOnly`, `secure` in production, `sameSite=lax`.
- Every API route checks ownership; another user's invite returns 404.
- Inputs validated with Zod on the server, and partial updates only touch the
  fields that were sent.
- RSVP endpoint: honeypot field + per-IP rate limit (10 per 10 min, per
  instance; use Upstash Redis or similar if you run many instances).
- CSV export is protected against spreadsheet formula injection.

## Deploying

**Vercel** (simplest): import the repo, add the three environment variables,
deploy. Use MongoDB Atlas for the database and allow Vercel's IPs (or
`0.0.0.0/0`) in Atlas network access. Any Node host (Railway, Render, a VPS
with `npm run build && npm start`) also works.

## Project structure

```
src/
  app/
    (marketing)/        landing, templates, wording guide (+ header/footer layout)
    (auth)/             login, signup
    dashboard/          couple's area (protected by src/proxy.ts)
    i/[slug]/           public invite page + OG image
    api/                route handlers
    globals.css         the only stylesheet
    layout.tsx          fonts, default metadata, providers
    sitemap.ts robots.ts opengraph-image.tsx icon.svg not-found.tsx
  components/
    invite/             InviteView (shared by public page + editor preview), RsvpForm, Countdown, Shagun
    marketing/          header/footer, phone preview, JSON-LD
    ui/                 Logo, AuthForm
  config/site.ts        brand name, URL, description
  lib/                  db, models, auth, validation, data access, formatting, OG image
  stores/               Zustand editor store
  proxy.ts              redirects logged-out users away from /dashboard
```

## Ideas for next versions

- Razorpay payments for premium templates and removing the footer credit
- AI-generated artwork (borders, motifs, couple caricature) with text kept as
  real HTML so names are always spelled correctly
- Photo gallery, background music, "our story" section
- WhatsApp reminders to guests who haven't replied
- Hindi / regional-language interface
- Forgot-password flow (email via Resend)
