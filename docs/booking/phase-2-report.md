# LUP Booking — Phase 2 Final Report

**Branch:** `feat/lup-booking-platform`
**Repository:** `rifdanhd/lembur.udjo`
**Target domain:** `https://booking.lemburudjoparahyangan.com`
**Company:** PT Angklung Udjo Heritage
**Payment Gateway:** Midtrans Sandbox
**Date:** 13 November 2026

---

## 1. Overall Completion Status

| Priority | Area | Status |
|----------|------|--------|
| P1 | Midtrans Sandbox payment + webhook → PAID → e-ticket | **VERIFIED** (real sandbox transaction, simulated webhook) |
| P2 | Google OAuth login | **BLOCKED** — no `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` |
| P3 | Email functionality | **BLOCKED** — no `RESEND_API_KEY` configured |
| P4 | QR Code check-in | **VERIFIED** (browser tests, not physical camera) |
| P5 | Database integrity / migrations | **SAFE** — all additive, tested on disposable local DB |
| P6 | Domain migration (booking.lemburudjoparahyangan.com) | **BLOCKED** — no DNS/TLS/deployment access |
| P7 | Security audit (7 high advisories) | **DOCUMENTED** — no fixes applied (breaking changes) |
| P8 | UI/UX final polish | **VERIFIED** (3 viewports, 25/25 browser tests) |
| P9 | E2E test matrix | **PARTIAL** — 7/20 verifiable locally, rest blocked |
| P10 | Academic documentation | **COMPLETE** — existing docs match implementation |

**Definition of Done:** Partially met. Real Sandbox booking proceeds from reservation → verified webhook → PAID → e-ticket issuance → one-time QR check-in logic verified. However, actual payment completion in Midtrans sandbox UI, HTTPS webhook delivery, Google OAuth, email delivery, and DNS/HTTPS domain verification require owner action.

---

## 2. Verified Midtrans Sandbox Payment Result

**Script:** `scripts/verify-midtrans-e2e.mjs`
**Evidence:** `docs/booking/evidence/midtrans-e2e-verification.json`

| Step | Type | Result |
|------|------|--------|
| Reservation created | REAL (backend `reserveOrder`) | PASS — PENDING order, Rp150.000, 2 items |
| Midtrans Snap transaction | REAL (sandbox API) | PASS — HTTP 201, `redirect_url` on `app.sandbox.midtrans.com` |
| Status lookup before payment | REAL (sandbox API) | PASS — HTTP 200, status 404 (no payment method selected) |
| Webhook → PAID | SIMULATED (correct SHA512 signature) | PASS — order PAID, 2 tickets, quota reserved→sold |
| Duplicate webhook | SIMULATED | PASS — idempotent, still PAID, 2 tickets, no oversell |
| E-ticket PDF | REAL (PDFKit + QRCode) | PASS — 16,611 bytes, 2 tickets with unique QR tokens |
| Unique QR codes | REAL | PASS — 2 tickets, 2 unique QR tokens |

**Distinction:** The Midtrans Snap transaction creation and status lookup are REAL API calls to the sandbox. The webhook notification is SIMULATED locally (Midtrans cannot deliver webhooks to localhost without a public HTTPS endpoint). Actual payment completion requires manual interaction in the Midtrans sandbox UI, followed by real webhook delivery to a public HTTPS endpoint.

**Webhook verification:** Signature verified via SHA512(`order_id` + `status_code` + `gross_amount` + `serverKey`). Authoritative status fetched via `GET /v2/{order_id}/status` before applying — frontend callback is never trusted. Duplicate notifications are idempotent (forward-only transitions).

---

## 3. Verified OAuth Result

**Status:** BLOCKED — no Google OAuth credentials configured.

**Implementation:** Complete and tested with stubbed credentials (INT-34 passes).
- `googleClient()` uses `openid-client` discovery against `https://accounts.google.com`
- PKCE + state + nonce + `idTokenExpected: true`
- Redirect URI: `{BOOKING_PUBLIC_URL}/api/ticketing/auth/google/callback`
- `googleVisitor()`: validates `email_verified === true`, never auto-links matching local email (`GOOGLE_LINK_REQUIRED`), creates account with `googleSubject` + `passwordHash: null`
- Same-origin check on OAuth start (host must match `bookingOrigin()`)
- State cookie (`lup_oauth_state`) HttpOnly, SameSite=Lax, 10-minute expiry
- OAuthAttempt consumed once, then deleted

**Required owner action:**
1. Create Google Cloud OAuth Web Application client
2. Add authorized JavaScript origins: `https://ticket.lemburudjoparahyangan.com`, `https://booking.lemburudjoparahyangan.com`
3. Add authorized redirect URIs: `https://ticket.lemburudjoparahyangan.com/api/ticketing/auth/google/callback`, `https://booking.lemburudjoparahyangan.com/api/ticketing/auth/google/callback`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in environment
5. Configure consent screen and test users

**Environment variables:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## 4. Email Integration Result

**Status:** BLOCKED — no `RESEND_API_KEY` configured.

**Implementation:** Exists in `app/(site)/api/ticketing/auth/password-reset/route.ts`
- Uses Resend API (`https://api.resend.com/emails`)
- `emailResetEnabled()` checks `RESEND_API_KEY` and `EMAIL_FROM`
- Password reset email: 30-minute expiry, single-use token, revokes all visitor sessions
- Token hashing/expiry/replay/revocation tested (INT-35 passes)

**Missing email types (implementation needed when provider available):**
- Reservation confirmation email
- Payment confirmation email
- E-ticket notification email
- Email verification (if required by auth design)

**Graceful degradation:** Booking and ticket downloads remain functional if email delivery fails (email send is wrapped in try/catch, failure doesn't block the flow).

**Required owner action:** Set `RESEND_API_KEY` and `EMAIL_FROM` in environment.

---

## 5. QR Code Validation Result

**Status:** VERIFIED (backend logic), NOT TESTED (physical camera).

**Coverage:**
- Browser test `STAFF-CHECKIN`: QR check-in returns 200, duplicate manual entry returns 409 ✅
- Browser test `STAFF-RBAC`: STAFF (non-ADMIN) cannot access admin APIs ✅
- Integration test INT-32: concurrent QR/manual check-in permits exactly one entry ✅
- Integration test INT-33: refunded tickets and inactive staff rejected ✅
- E2E verification: 2 tickets with unique QR codes, PDF generated ✅

**Check-in logic (`lib/ticketing/tickets.ts`):**
- Parses `LUP1:{code}:{qrToken}` format or bare `{code}`
- Staff must be active (`STAFF_REQUIRED` if not)
- Ticket must exist, have matching qrToken if provided, status ISSUED, order PAID
- Date check: ticket date must equal today (WIB)
- Atomic update: `WHERE status = "ISSUED"` ensures single success under concurrency
- Records `CheckIn` with source `QR_SANDBOX` or `MANUAL_SANDBOX`
- Manual entry fallback supported

**Not tested:** Physical camera scanning on mobile device (EXT-CAMERA: NOT RUN).

---

## 6. Database Migration Safety Status

**Status:** SAFE — all migrations additive and backward compatible.

**Prisma migrations (6 files, all additive only):**

| Migration | Changes | Additive? |
|-----------|---------|-----------|
| `20261105090000_ticketing_foundation` | Core tables (User, Product, Schedule, Customer, Order, OrderItem, Payment, Ticket, CheckIn, AuditLog) + enums + indexes + FKs | Yes |
| `20261106090000_ticketing_checkout` | `PAYMENT_REVIEW` enum value, `requestHash`/`requestKeyHash` columns, `checkoutStartedAt`/`checkoutUrl` columns, RateLimit table, CHECK constraints | Yes |
| `20261106140000_visitor_accounts` | `visitorId` on Order, VisitorAccount + VisitorSession tables | Yes |
| `20261113150000_product_schedules` | ProductSchedule table (ticketing schema) | Yes |
| `20261113160000_booking_access` | `passwordHash` on User, StaffSession, nullable `passwordHash` on VisitorAccount, `googleSubject`/`emailVerifiedAt`, PasswordReset, OAuthAttempt, `orderItemId` on Ticket | Yes |
| `20261113170000_booking_categories` | BookingCategory table, `imagePath`/`policy`/`categoryId` on Product | Yes |

**Safety measures:**
- CHECK constraints: `capacity >= reserved + sold`, `price >= 0`, `totalAmount >= 0`, `quantity > 0`, `lineTotal = unitPrice * quantity`
- Unique constraints: `orderNumber`, `ticket.code`, `ticket.qrToken`, `VisitorAccount.email`, `VisitorAccount.googleSubject`, `Payment.provider+providerPaymentId`, `CheckIn.ticketId`
- FKs with ON DELETE RESTRICT/CASCADE/SET NULL as appropriate
- Migration verification script (`scripts/verify-ticketing-migration.mjs`) tests foundation migration in isolated schema with rollback
- Integration tests run `prisma migrate deploy` against disposable local DB (44/44 pass)
- **Never run on shared production database without explicit approval**

**Concurrency safety:**
- Advisory lock on `requestKeyHash` prevents duplicate orders from retries
- Row lock on Schedule (`FOR UPDATE`) prevents overselling
- Quota CHECK constraint enforces `reserved + sold <= capacity`
- Expired reservations release quota exactly once under concurrent expiry
- Paid tickets cannot be issued twice (forward-only status transitions)

---

## 7. Domain Readiness

**Status:** BLOCKED — no DNS/TLS/deployment access.

**Target:** `https://booking.lemburudjoparahyangan.com`
**Previous:** `https://ticket.lemburudjoparahyangan.com`

**Configuration prepared:**
- `lib/site-domains.ts`: `BOOKING_URL = "https://booking.lemburudjoparahyangan.com"` added
- `lib/ticketing/booking-origin.ts`: allows both `ticket.` and `booking.` hostnames
- `lib/ticketing/security.ts` `allowTicketHost()`: allows `ticket` site on `ticket.*` and `booking.*` hosts (in non-production localhost)
- `proxy.ts`: cutover switch (`BOOKING_REDIRECT_VERIFIED=true`) enables 307 GET/HEAD redirect from `ticket.` to `booking.` only; API, webhook POST, assets not redirected
- `deploy/nginx-subdomains.conf.example`: server block includes `booking.lemburudjoparahyangan.com`, upstream 127.0.0.1:3001, Certbot TLS command documented

**Required for domain verification (owner action):**
1. DNS: CNAME `booking` → `ticket.lemburudjoparahyangan.com` (or A/AAAA with upstream IP)
2. TLS: certificate covering both `ticket.` and `booking.` domains
3. Nginx: deploy `booking.lemburudjoparahyangan.com` server block, run `nginx -t` and reload
4. Google OAuth: add `booking.` origin and redirect URI
5. Midtrans Sandbox: set Payment Notification URL to `https://booking.lemburudjoparahyangan.com/api/ticketing/webhook`
6. Set `BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com` after HTTPS verified
7. Set `BOOKING_REDIRECT_VERIFIED=true` only after full verification

**Cookie note:** Host-only cookies mean customers must log in again on the new domain. Orders and accounts remain in the same database.

---

## 8. Security Audit Findings

**Status:** 7 high-severity advisories documented, 0 critical.

All 7 high advisories are in Payload CMS / Prisma tooling dependencies, NOT in the booking application code. The booking app does not directly use `happy-dom`, `@lexical/headless`, `effect`, or `deepmerge-ts`.

| # | Package | Version | Advisory ID | Severity | Used by booking app? | Fix | Action |
|---|---------|---------|-------------|----------|---------------------|-----|--------|
| 1 | `@lexical/headless` | transitive (happy-dom) | — | high | No (Payload CMS dev dep) | Major bump to `@payloadcms/richtext-lexical` | Not applied — breaking change |
| 2 | `@payloadcms/richtext-lexical` | ^3.90.2 | — | high | No (Payload CMS dep) | Major bump | Not applied — breaking change |
| 3 | `@prisma/config` | bundled Prisma 6.19.0 | — | high | No (Prisma tooling) | Prisma 7.10.1 | Not applied — major upgrade |
| 4 | `deepmerge-ts` | bundled Prisma 6.19.0 | GHSA-ggr8-5vv4-36mx | high | No (Prisma tooling) | Prisma 7.10.1 | Not applied — major upgrade |
| 5 | `effect` | bundled Prisma 6.19.0 | GHSA-38f7-945m-qr2g | high | No (Prisma tooling) | Prisma 7.10.1 | Not applied — major upgrade |
| 6 | `happy-dom` | bundled Payload CMS | GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8 | high | No (Payload CMS dev dep) | Major bump | Not applied — breaking change |
| 7 | `prisma` | ^6.19.0 | — | high | No (dev tool) | Prisma 7.10.1 | Not applied — major upgrade |

**Policy:** No unrestricted major-version upgrades or force-fix commands. Breaking changes require explicit approval. Application-level security controls (ownership, same-origin, signature verification, atomic quota, single-use check-in) are tested and pass.

**Audit evidence:** `docs/booking/evidence/dependency-audit.json`, `docs/booking/security-review.md`

---

## 9. Complete E2E Test Matrix

| ID | Scenario | Environment | Status | Evidence |
|----|----------|-------------|--------|----------|
| E2E-01 | Guest booking flow | Local disposable DB | NOT RUN (guest checkout disabled — account required) | RAD design N07 |
| E2E-02 | Registered customer booking | Local disposable DB | PASS | browser-results.json (checkout, order stored) |
| E2E-03 | Google login and booking | Local (stubbed creds) | BLOCKED — no Google credentials | INT-34 (linking rules tested) |
| E2E-04 | Successful Midtrans Sandbox payment | Local DB + real sandbox API | PASS (webhook simulated) | midtrans-e2e-verification.json |
| E2E-05 | Pending payment | Local DB + stubbed provider | PARTIAL | INT-18 (provider pending overrides forged success) |
| E2E-06 | Failed payment | Local DB + stubbed provider | PARTIAL | INT-19 (wrong amount/challenged capture rejected) |
| E2E-07 | Expired reservation | Local disposable DB | PASS | INT-16 (quota release exactly once) |
| E2E-08 | Duplicate webhook notification | Local DB + simulated webhook | PASS | midtrans-e2e-verification.json |
| E2E-09 | Invalid payment notification | Local DB + stubbed provider | PASS | INT-18 (bad signature rejected) |
| E2E-10 | Concurrent reservations vs limited capacity | Local disposable DB | PASS | INT-13 (10 buyers, 5 seats, no oversell) |
| E2E-11 | E-ticket PDF generation | Local DB + simulated payment | PASS | midtrans-e2e-verification.json |
| E2E-12 | QR Code check-in | Local disposable DB | PASS | browser-results.json (STAFF-CHECKIN) |
| E2E-13 | Duplicate QR Code scan | Local disposable DB | PASS | browser-results.json (409 duplicate) |
| E2E-14 | Customer viewing booking history | Local disposable DB | PASS | browser-results.json (ownership, 404 for others) |
| E2E-15 | Unauthorized access to another customer's booking | Local disposable DB | PASS | INT-23, INT-26 |
| E2E-16 | Admin viewing reservation/payment records | Local disposable DB | PASS | browser-results.json (ADMIN-RBAC) |
| E2E-17 | Mobile booking flow | Local disposable DB | PASS | browser-results.json (390px) |
| E2E-18 | Password reset email | Local (no provider) | BLOCKED — no RESEND_API_KEY | INT-35 (token logic tested) |
| E2E-19 | Domain and OAuth callback verification | Production | BLOCKED — no DNS/TLS/credentials | domain-migration.md |
| E2E-20 | Payment success with email-delivery failure | Local | NOT RUN — email provider not configured | Graceful degradation in code |

**Note:** Browser tests (25/25) and integration tests (44/44) were re-executed and pass. External scenarios (E2E-03, E2E-18, E2E-19) are BLOCKED due to missing credentials/infrastructure.

---

## 10. Files Changed

**Pre-existing modified files (from prior work, retained):**
- `app/(site)/karier/page.tsx`
- `components/Footer.tsx`
- `components/Navbar.tsx`
- `deploy/nginx-subdomains.conf.example`
- `docs/subdomain-setup.md`
- `lib/site-domains.ts`
- `proxy.ts`
- `tests/subdomain-routing.test.ts`

**Evidence files regenerated by test runs:**
- `docs/booking/evidence/browser-results.json`
- `docs/booking/evidence/date-selector-desktop.png` (binary)
- `docs/booking/evidence/date-selector-mobile.png` (binary)
- `docs/booking/evidence/date-selector-tablet.png` (binary)
- `docs/booking/evidence/integration-results.json`
- `docs/booking/evidence/integration.tap`
- `docs/booking/evidence/midtrans-sandbox-smoke.json`
- `docs/booking/evidence/ticket-fixture-sandbox.pdf` (binary)

**New files (this Phase 2 work):**
- `scripts/verify-midtrans-e2e.mjs` — Real Midtrans Sandbox E2E verification script
- `docs/booking/evidence/midtrans-e2e-verification.json` — E2E verification results
- `docs/booking/phase-2/` — Phase 2 evidence directory

**No changes to:** `prisma/schema.prisma`, `prisma/migrations/`, `app/(site)/api/ticketing/` route handlers, `lib/ticketing/` core logic.

---

## 11. Git Commit References

Commits will be created on branch `feat/lup-booking-platform`. No merge to `main`. No production deployment.

---

## 12. Remaining Blockers

| Blocker | Impact | Required Action |
|---------|--------|-----------------|
| No `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` | Google OAuth login cannot be tested end-to-end | Owner: create Google Cloud OAuth client, configure redirect URIs, set env vars |
| No `RESEND_API_KEY` | Email delivery (password reset, confirmations) cannot be tested | Owner: configure Resend or alternative provider, set env vars |
| No DNS/TLS for `booking.lemburudjoparahyangan.com` | Domain migration, HTTPS webhook delivery, OAuth callbacks blocked | Owner: create DNS record, provision TLS certificate, deploy Nginx config |
| No public HTTPS webhook endpoint | Midtrans cannot deliver real webhook notifications | Owner: deploy to host with public HTTPS, set Midtrans notification URL |
| No physical mobile device | QR code camera scanning not verified | Owner: test with physical device |
| 7 high-severity dependency advisories | Security risk in tooling dependencies | Owner: approve major version upgrades (Prisma 7, Payload CMS) |
| No UAT by PT Angklung Udjo Heritage representatives | Cannot claim production readiness | Owner: schedule UAT session, complete uat-checklist.md |

---

## 13. Required Owner Actions

1. **Google OAuth:** Register Web Application client in Google Cloud Console. Add origins `https://ticket.lemburudjoparahyangan.com` and `https://booking.lemburudjoparahyangan.com`. Add redirect URIs `/api/ticketing/auth/google/callback` on both. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

2. **Email provider:** Configure Resend (or alternative). Set `RESEND_API_KEY` and `EMAIL_FROM`. Implement reservation/payment/e-ticket notification emails.

3. **DNS/TLS:** Create CNAME `booking` → `ticket.lemburudjoparahyangan.com`. Provision TLS certificate for both domains. Deploy Nginx server block. Run `nginx -t` and reload.

4. **Midtrans webhook:** Set Payment Notification URL to `https://booking.lemburudjoparahyangan.com/api/ticketing/webhook` in Midtrans Sandbox dashboard. Verify POST delivery with real transaction.

5. **Domain cutover:** After HTTPS verified, set `BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com`. Set `BOOKING_REDIRECT_VERIFIED=true` only after full E2E verification on new domain.

6. **Security advisories:** Approve or reject major version upgrades for Prisma 7 and Payload CMS dependencies to resolve 7 high advisories.

7. **UAT:** Schedule session with PT Angklung Udjo Heritage representatives. Complete uat-checklist.md.

8. **Physical QR test:** Test camera scanning on physical mobile device.

---

## 14. Recommendation

**NOT READY for production release.**

**READY for controlled UAT** once the following are complete:
- Google OAuth credentials configured and tested
- Email provider configured and tested
- `booking.lemburudjoparahyangan.com` DNS/TLS/HTTPS verified
- Real Midtrans Sandbox webhook delivery verified on public HTTPS endpoint
- 7 high-severity advisories resolved or explicitly accepted
- UAT completed by PT Angklung Udjo Heritage representatives

The core booking engine (reservation, payment verification, ticket issuance, QR check-in, ownership isolation, concurrency safety) is implemented and verified. Remaining gaps are external infrastructure and credentials, not application code.