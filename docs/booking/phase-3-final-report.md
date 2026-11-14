> **Catatan historis:** hasil di bawah berasal dari iterasi sebelumnya, bukan eksekusi terbaru. Gunakan [verifikasi 14 November 2026](phase-2-completion-2026-11-14.md). Laporan Phase 2 lama memakai webhook/provider terkontrol; itu bukan bukti payment end-to-end nyata. Run nyata terbaru, status domain/OAuth, dan advisory berada pada laporan baru.

# LUP Booking Platform — Phase 3 Final Deliverables Report

**Branch:** `feat/lup-booking-platform`
**Latest commit:** `b05446e` — `feat: Phase 3 booking platform UI/UX redesign and documentation`
**Repository:** `https://github.com/rifdanhd/lembur.udjo`
**Branch URL:** `https://github.com/rifdanhd/lembur.udjo/tree/feat/lup-booking-platform`
**Compare URL:** `https://github.com/rifdanhd/lembur.udjo/compare/main...feat/lup-booking-platform`
**Company:** PT Angklung Udjo Heritage
**Target domain:** `https://booking.lemburudjoparahyangan.com`
**Date:** 13 November 2026

---

## 1. GitHub Synchronization

| Item | Status |
|------|--------|
| Branch `feat/lup-booking-platform` | ✅ Pushed to origin |
| Latest commit | `b05446e` |
| Remote | `https://github.com/rifdanhd/lembur.udjo` (fetch + push) |
| Working tree | Clean |
| Merge to `main` | ❌ Not performed (per instructions) |
| Pull Request | ❌ Not created (owner to review and create when ready) |

---

## 2. Phase 3 — UI/UX Redesign Completed

### Design System (`components/ticketing/PortalTheme.module.css`)

- **Color palette:** Forest `#3d2a1f`, Forest-light `#6d4c41`, Bamboo `#a56b3e`, Bamboo-light `#c8915d`, Cream `#faf8f3`, Surface `#ffffff`
- **Border radius:** `var(--radius-xl)` (1rem), `var(--radius-2xl)` (1.25rem)
- **Shadows:** sm, md, lg with forest-based opacity
- **Typography:** Barlow Condensed (local font), font-playfair alias
- **Focus rings:** Bamboo-colored outline with offset

### Booking Homepage (`app/(site)/(ticket-portal)/beranda-tiket/page.tsx`)

- Premium hero section with authentic LUP imagery (`/Hero.ecoland.jpg`)
- Dark gradient overlay, forest text on white buttons
- Three feature cards (pilih pengalaman, pilih tanggal & sesi, tentukan jumlah)
- Horizontal category navigation with active state styling
- Program catalog grid (up to 6 categories) with starting prices from backend
- "Ada rencana khusus?" contact section

### Category Catalog (`app/(site)/(ticket-portal)/order-tickets/page.tsx`)

- Existing implementation preserved and styled with new design tokens
- Category pills with active/inactive states
- Program cards with images, descriptions, starting prices

### Date Selector (`components/ticketing/DateBookingSelector.tsx`)

- Eiger-style horizontal date cards
- Each card: day name, date number, month abbreviation, price, availability status
- Left/right navigation arrows with smooth scroll
- Calendar picker (date input)
- Month/year heading
- Selected date indicator with bamboo background and white text
- Sold-out and unavailable states visually distinct
- Keyboard navigation (ArrowLeft/Right/Home/End)
- Active date visually prominent with bamboo brand colors
- Mobile: horizontal swipe, compact cards, touch-friendly

### Login Modal (`components/ticketing/LoginModal.tsx`)

- **Desktop:** Two-column modal — left: cultural photo + invitation + registration link; right: login heading, email form, Google button, password reset
- **Mobile:** Single-column modal (responsive grid)
- Close button, backdrop click to dismiss
- Preserves existing OAuth implementation (openid-client, PKCE, state, nonce)

### Customer Dashboard (`app/(site)/(ticket-portal)/account/page.tsx`)

- Welcome section with visitor name
- Three stat cards: Tiket aktif, Menunggu pembayaran, Riwayat kunjungan
- Quick navigation: Profil, Reservasi, E-ticket
- Upcoming reservations (PAID, future dates)
- Reservation history (past dates)
- Empty state with call-to-action

### Checkout (`components/ticketing/PortalFlow.tsx` — `PortalCheckout`)

- Customer information: full name, email (read-only), WhatsApp, consent
- Booking summary: program, date, session, quantity, price breakdown, total
- Payment action: clear button, loading state, error handling
- Desktop: two-column layout (form left, summary right)
- Mobile: single-column layout
- Prevents duplicate submission (busy state)
- Midtrans Sandbox integration preserved
- Blocker messages for checkout restrictions

### E-Ticket Pages

- **`tiket-saya/page.tsx`:** Ticket cards with status badges (ISSUED/USED/CANCELLED), ticket code, program name, date/session, PDF download link, order link
- **`pesanan/[orderNumber]/page.tsx`:** Order status with payment info, ticket list, Midtrans status check

---

## 3. Test Results

### Integration Tests (44/44 PASS)

| Category | Count |
|----------|-------|
| Concurrency/quota | 4 tests |
| Payment/webhook | 8 tests |
| Auth/ownership | 6 tests |
| Catalog/checkout | 10 tests |
| QR/check-in | 4 tests |
| Other | 12 tests |

### Browser E2E Tests (25/25 PASS)

| Viewport | Tests |
|----------|-------|
| Desktop (1440px) | 6 |
| Tablet (768px) | 5 |
| Mobile (390px) | 5 |
| Auth/QR/Admin | 9 |

### Other Tests

| Test | Result |
|------|--------|
| TypeScript (`tsc --noEmit`) | PASS |
| Lint (`eslint`) | PASS (0 errors, 24 pre-existing warnings) |
| Production build (`next build --webpack`) | PASS |
| Hero/media regression (13/13) | PASS |

### External Tests (Blocked — require owner action)

| Test ID | Scenario | Status | Blocker |
|---------|----------|--------|---------|
| E2E-03 | Google login and booking | BLOCKED | No `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` |
| E2E-18 | Password reset email | BLOCKED | No `RESEND_API_KEY` |
| E2E-19 | Domain and OAuth callback | BLOCKED | No DNS/TLS/credentials |

---

## 4. Preview Deployment

### Vercel Preview

- **Platform:** Vercel (project: `lemburudjo-parahyangan-id`)
- **Preview:** Automatically created for branch `feat/lup-booking-platform`
- **How to access:** Vercel Dashboard → Project → Deployments → branch `feat/lup-booking-platform`
- **URL pattern:** `https://lemburudjo-parahyangan-id-git-feat-lup-booking-platform-*.vercel.app`

### Public Website Status

**NOT UPDATED.** The public website `ticket.lemburudjoparahyangan.com` still shows the previous implementation. Changes are only on the branch and preview deployment.

**Reason:** No merge to `main`, no production deploy, no DNS changes (per delivery rules).

---

## 5. Domain Readiness

### Target: `https://booking.lemburudjoparahyangan.com`

| Item | Status | Required Action |
|------|--------|-----------------|
| DNS CNAME `booking` | Not configured | Create CNAME → `ticket.lemburudjoparahyangan.com` or Vercel target |
| HTTPS/TLS | Not provisioned | Provision certificate for both domains |
| Google OAuth origins | Not registered | Add both domains to Google Cloud Console |
| Midtrans webhook URL | Not configured | Set to `https://booking.lemburudjoparahyangan.com/api/ticketing/webhook` |
| `BOOKING_PUBLIC_URL` | Not set | Set to `https://booking.lemburudjoparahyangan.com` after HTTPS verified |
| `BOOKING_REDIRECT_VERIFIED` | `false` | Set to `true` only after full E2E verification |

### Migration Rules (Owner Approval Required)

- Do not change live DNS without approval
- Do not modify live Nginx/Vercel configuration without approval
- Do not switch Midtrans to Production
- Do not run destructive database migrations
- Keep old domain (`ticket.`) available until new domain verified

---

## 6. Authentication & Email Setup

### Google OAuth (BLOCKED — no credentials)

**Required:** Google Cloud Console OAuth Web Application client

- Authorized origins: `https://ticket.lemburudjoparahyangan.com`, `https://booking.lemburudjoparahyangan.com`
- Authorized redirect URIs: both domains + `/api/ticketing/auth/google/callback`
- Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Guide:** `docs/booking/phase-3-auth-email-guide.md`

### Email (BLOCKED — no provider)

**Required:** Resend API key

- Env vars: `RESEND_API_KEY`, `EMAIL_FROM`
- Password reset email implemented (30-min expiry, single-use, session revocation)
- Reservation/payment/e-ticket emails planned but not yet implemented

**Guide:** `docs/booking/phase-3-auth-email-guide.md`

---

## 7. Security Findings

### Dependency Advisories (7 high)

All in Payload CMS / Prisma tooling, NOT in booking application code. No fixes applied (breaking changes require owner approval).

| Advisory | Package | Action |
|----------|---------|--------|
| 7 high | `@lexical/headless`, `@payloadcms/richtext-lexical`, `@prisma/config`, `deepmerge-ts`, `effect`, `happy-dom`, `prisma` | Owner decision on major version upgrades |

### Critical Secrets (owner action required)

Hardcoded in `.env.local` (gitignored, exists on disk):

- Neon database password
- `CRM_PASSWORD="admin123"`
- Midtrans server/client keys
- `PAYLOAD_SECRET`, `CRM_SECRET`, `TICKETING_SECRET`, `TICKETING_CRON_SECRET`
- `VERCEL_OIDC_TOKEN`

**Action:** Remove from `.env.local`, rotate, inject via platform secret manager.

### Application Controls

All implemented and tested: ownership isolation, same-origin checks, SHA512 webhook signature, authoritative status verification, idempotent webhooks, atomic quota, single-use tickets, rate limiting.

---

## 8. Remaining Blockers

| Blocker | Impact | Required Owner Action |
|---------|--------|----------------------|
| No `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` | Google OAuth cannot be tested | Create Google Cloud OAuth client, configure redirect URIs, set env vars |
| No `RESEND_API_KEY` | Email delivery cannot be tested | Configure Resend, set env vars |
| No DNS/TLS for `booking.lemburudjoparahyangan.com` | Domain migration blocked | Create DNS record, provision TLS, deploy config |
| No public HTTPS webhook endpoint | Midtrans webhook delivery blocked | Deploy to host with public HTTPS, set Midtrans notification URL |
| 7 high-severity dependency advisories | Security risk in tooling | Approve/reject Prisma 7 / Payload CMS upgrades |
| Hardcoded secrets in `.env.local` | Security risk | Remove and rotate all credentials |
| No UAT by PT Angklung Udjo Heritage | Cannot claim production readiness | Schedule UAT session, complete uat-checklist.md |
| No physical mobile device test | QR camera scanning not verified | Test with physical device |

---

## 9. Recommendation

**NOT READY for production release.**

**READY for controlled UAT** once the following are complete:

1. Google OAuth credentials configured and tested
2. Email provider configured and tested
3. `booking.lemburudjoparahyangan.com` DNS/TLS/HTTPS verified
4. Real Midtrans Sandbox webhook delivery verified on public HTTPS endpoint
5. 7 high-severity advisories resolved or explicitly accepted
6. Hardcoded secrets removed and rotated
7. UAT completed by PT Angklung Udjo Heritage representatives

The core booking engine (reservation, payment verification, ticket issuance, QR check-in, ownership isolation, concurrency safety) is implemented and verified. Remaining gaps are external infrastructure and credentials, not application code.

---

## 10. Files Changed in Phase 3

**Modified (18):**
- `app/(site)/(ticket-portal)/account/page.tsx` — Customer dashboard redesign
- `app/(site)/(ticket-portal)/beranda-tiket/page.tsx` — Premium booking homepage
- `app/(site)/(ticket-portal)/tiket-saya/page.tsx` — E-ticket page redesign
- `components/ticketing/DateBookingSelector.tsx` — Eiger-style date cards
- `components/ticketing/LoginModal.tsx` — Two-column login modal
- `components/ticketing/PortalFlow.tsx` — Checkout redesign
- `components/ticketing/PortalTheme.module.css` — Design system tokens
- `components/ticketing/VisitorAuthForm.tsx` — Auth form styling
- `docs/booking/evidence/browser-results.json` — Regenerated
- `docs/booking/evidence/date-selector-*.png` — Regenerated
- `docs/booking/evidence/integration-results.json` — Regenerated
- `docs/booking/evidence/integration.tap` — Regenerated
- `docs/booking/evidence/ticket-fixture-sandbox.pdf` — Regenerated
- `docs/booking/rad-design.md` — Phase 3 requirements and iteration log
- `lib/ticketing/midtrans.ts` — Sandbox notification override (from Phase 2)
- `scripts/test-booking-browser.mjs` — Test regex fix

**Added (5):**
- `docs/booking/evidence/phase-3/README.md` — Screenshot evidence manifest
- `docs/booking/phase-3-auth-email-guide.md` — Auth/email setup guide
- `docs/booking/phase-3-preview-deployment.md` — Preview deployment guide
- `docs/booking/phase-3-security-review.md` — Security findings review
- `scripts/test-midtrans-delivery.mjs` — Midtrans delivery test script

---

## 11. Next Steps for Owner

1. Review the preview deployment on Vercel
2. Configure Google OAuth credentials and environment variables
3. Configure email provider (Resend)
4. Set up DNS/TLS for `booking.lemburudjoparahyangan.com`
5. Configure Midtrans webhook URL
6. Remove hardcoded secrets and rotate credentials
7. Address or accept 7 high-severity dependency advisories
8. Schedule UAT with PT Angklung Udjo Heritage representatives
9. Create Pull Request and merge to `main` when ready for production
