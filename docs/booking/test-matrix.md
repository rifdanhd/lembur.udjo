# Matriks pengujian aktual

Tanggal/waktu eksekusi tersimpan pada JSON evidence. Data memakai fixture lokal, bukan harga/paket resmi. Provider payment dalam suite integrasi dan status paid pada QA browser disimulasikan oleh harness. Smoke test Snap terpisah memakai layanan Midtrans Sandbox nyata.

## Integration / black box pada layanan dan database

| Test ID | Fitur / input atau skenario | Hasil yang diharapkan | Hasil aktual | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| INT-1 | website and local previews keep existing public routes | website and local previews keep existing public routes | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-2 | staff URLs reach the existing protected CRM and preserve queries | staff URLs reach the existing protected CRM and preserve queries | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-3 | ticket hostname cannot reach staff pages or APIs | ticket hostname cannot reach staff pages or APIs | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-4 | karier subdomain serves the careers page and isolates staff, ticket, and API routes | karier subdomain serves the careers page and isolates staff, ticket, and API routes | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-5 | static assets remain accessible, private pages are not cached or indexed | static assets remain accessible, private pages are not cached or indexed | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-6 | staff API retains session handlers and rejects cross-origin writes | staff API retains session handlers and rejects cross-origin writes | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-7 | local subdomains use the same mappings without production redirects | local subdomains use the same mappings without production redirects | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-8 | complete ticket portal routes are isolated and the original reservation remains reachable | complete ticket portal routes are isolated and the original reservation remains reachable | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-9 | ticket API allowlist keeps visitor checkout separate from staff and website | ticket API allowlist keeps visitor checkout separate from staff and website | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-10 | retired logo is unavailable on ticket host while website assets remain unchanged | retired logo is unavailable on ticket host while website assets remain unchanged | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-11 | booking alias has the same visitor isolation and serves webhook POST directly | booking alias has the same visitor isolation and serves webhook POST directly | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-12 | verified cutover redirects customer GET only and leaves old webhook POST and API intact | verified cutover redirects customer GET only and leaves old webhook POST and API intact | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-13 | 10 simultaneous buyers cannot oversell 5 seats; totals and 15-minute hold come from server | 10 simultaneous buyers cannot oversell 5 seats; totals and 15-minute hold come from server | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-14 | concurrent retries create exactly one order; changed payload cannot reuse its key | concurrent retries create exactly one order; changed payload cannot reuse its key | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-15 | inactive and past sessions cannot be booked, and inactive examples remain hidden | inactive and past sessions cannot be booked, and inactive examples remain hidden | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-16 | expired reservation releases quota exactly once under concurrent expiry | expired reservation releases quota exactly once under concurrent expiry | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-17 | concurrent signed webhook replay issues tickets and converts reserved quota only once | concurrent signed webhook replay issues tickets and converts reserved quota only once | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-18 | valid signature with forged success cannot override provider pending; bad signature never calls provider | valid signature with forged success cannot override provider pending; bad signature never calls provider | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-19 | wrong amount and challenged capture cannot issue tickets | wrong amount and challenged capture cannot issue tickets | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-20 | late settlement goes to manual review without overselling or issuing tickets | late settlement goes to manual review without overselling or issuing tickets | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-21 | provider expiry releases hold and full refunds revoke tickets without reopening used capacity | provider expiry releases hold and full refunds revoke tickets without reopening used capacity | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-22 | gateway timeout never retries a possibly created payment or releases its quota early | gateway timeout never retries a possibly created payment or releases its quota early | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-23 | buyer cannot overwrite another customer's profile and receipts never expose customer PII or QR secrets | buyer cannot overwrite another customer's profile and receipts never expose customer PII or QR secrets | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-24 | database rate limiting remains atomic under concurrent requests | database rate limiting remains atomic under concurrent requests | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-25 | visitor registration hashes passwords; login, session expiry and server-side revocation work | visitor registration hashes passwords; login, session expiry and server-side revocation work | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-26 | orders are account-owned; matching email never claims historical orders; another account cannot replay an order | orders are account-owned; matching email never claims historical orders; another account cannot replay an order | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-27 | date-specific prices, product sessions and checkout share authoritative configuration | date-specific prices, product sessions and checkout share authoritative configuration | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-28 | disabled and unconfigured product sessions cannot bypass checkout, including stale carts | disabled and unconfigured product sessions cannot bypass checkout, including stale carts | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-29 | earliest available day skips sold out dates; unavailable days have no invented price; WIB boundary | earliest available day skips sold out dates; unavailable days have no invented price; WIB boundary | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-30 | admin cannot shrink held quota or move a reserved session; price constraints and audit are persisted | admin cannot shrink held quota or move a reserved session; price constraints and audit are persisted | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-31 | paid tickets are item-bound, downloadable PDFs contain QR; unpaid orders cannot download | paid tickets are item-bound, downloadable PDFs contain QR; unpaid orders cannot download | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-32 | concurrent QR/manual check-in permits exactly one entry and records individual staff | concurrent QR/manual check-in permits exactly one entry and records individual staff | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-33 | refunded tickets and inactive staff cannot check in; staff sessions revoke immediately | refunded tickets and inactive staff cannot check in; staff sessions revoke immediately | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-34 | Google verified identity never links matching local email or accepts unverified email | Google verified identity never links matching local email or accepts unverified email | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-35 | password reset is hashed, single-use under concurrency and revokes every visitor session | password reset is hashed, single-use under concurrency and revokes every visitor session | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-36 | configured categories, program photo and policy come from DB; inactive category closes checkout | configured categories, program photo and policy come from DB; inactive category closes checkout | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-37 | checkout rejects client pricing, fractional/negative quantities, duplicate lines, missing consent and totals above 20 | checkout rejects client pricing, fractional/negative quantities, duplicate lines, missing consent and totals above 20 | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-38 | same-origin checks reject missing, opaque and sibling origins even behind TLS termination | same-origin checks reject missing, opaque and sibling origins even behind TLS termination | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-39 | request body limit works without Content-Length and rejects invalid JSON | request body limit works without Content-Length and rejects invalid JSON | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-40 | order capabilities are scope-bound and signature verification rejects tampering | order capabilities are scope-bound and signature verification rejects tampering | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-41 | checkout redirects allow only the sandbox hosted payment domain | checkout redirects allow only the sandbox hosted payment domain | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-42 | production keys and missing settings cannot enable sandbox sales | production keys and missing settings cannot enable sandbox sales | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-43 | cart planning rejects impossible dates and oversized or duplicate selections; account redirect stays internal | cart planning rejects impossible dates and oversized or duplicate selections; account redirect stays internal | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |
| INT-44 | sandbox request returns to the account order page and shares the server reservation deadline | sandbox request returns to the account order page and shares the server reservation deadline | All assertions passed on disposable local PostgreSQL | PASS | [TAP](evidence/integration.tap) |

## Browser / HTTP

| Test ID | Fitur / input atau skenario | Hasil yang diharapkan | Hasil aktual | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| UI-desktop-1 | Earliest available date and responsive width (1440px) | Sold-out disabled; earliest available selected; no page overflow | 2026-11-15 selected, 2026-11-14 disabled | PASS | [JSON](evidence/browser-results.json) |
| UI-desktop-2 | Keyboard changes date, session and price | Next available date and IDR 63,000 | 2026-11-17, 13:00 WIB, Rp63.000 | PASS | [JSON](evidence/browser-results.json) |
| UI-desktop-3 | Calendar rejects sold-out day | Selection unchanged and error announced | Selection unchanged; live message shown | PASS | [JSON](evidence/browser-results.json) |
| UI-desktop-4 | Selected date/session survives cart | Selected schedule and quantity persisted | Correct date, scheduleId and quantity stored | PASS | [JSON](evidence/browser-results.json) |
| UI-desktop-5 | Checkout reads current backend session price | 2 × 63,000 = 126,000 | Rp126.000 rendered from configured session | PASS | [JSON](evidence/browser-results.json) |
| CHECKOUT-HTTP | Browser submits checkout through real reservation API | Owned PENDING order stored with total 126000 and selected schedule | Order stored, total 126000, correct visitor; fake gateway key intentionally cannot pay | PASS | [JSON](evidence/browser-results.json) |
| UI-tablet-1 | Earliest available date and responsive width (768px) | Sold-out disabled; earliest available selected; no page overflow | 2026-11-15 selected, 2026-11-14 disabled | PASS | [JSON](evidence/browser-results.json) |
| UI-tablet-2 | Keyboard changes date, session and price | Next available date and IDR 63,000 | 2026-11-17, 13:00 WIB, Rp63.000 | PASS | [JSON](evidence/browser-results.json) |
| UI-tablet-3 | Calendar rejects sold-out day | Selection unchanged and error announced | Selection unchanged; live message shown | PASS | [JSON](evidence/browser-results.json) |
| UI-tablet-4 | Selected date/session survives cart | Selected schedule and quantity persisted | Correct date, scheduleId and quantity stored | PASS | [JSON](evidence/browser-results.json) |
| UI-tablet-5 | Checkout reads current backend session price | 2 × 63,000 = 126,000 | Rp126.000 rendered from configured session | PASS | [JSON](evidence/browser-results.json) |
| UI-mobile-1 | Earliest available date and responsive width (390px) | Sold-out disabled; earliest available selected; no page overflow | 2026-11-15 selected, 2026-11-14 disabled | PASS | [JSON](evidence/browser-results.json) |
| UI-mobile-2 | Keyboard changes date, session and price | Next available date and IDR 63,000 | 2026-11-17, 13:00 WIB, Rp63.000 | PASS | [JSON](evidence/browser-results.json) |
| UI-mobile-3 | Calendar rejects sold-out day | Selection unchanged and error announced | Selection unchanged; live message shown | PASS | [JSON](evidence/browser-results.json) |
| UI-mobile-4 | Selected date/session survives cart | Selected schedule and quantity persisted | Correct date, scheduleId and quantity stored | PASS | [JSON](evidence/browser-results.json) |
| UI-mobile-5 | Checkout reads current backend session price | 2 × 63,000 = 126,000 | Rp126.000 rendered from configured session | PASS | [JSON](evidence/browser-results.json) |
| AUTH-MODAL | Login dialog keyboard close | Escape closes dialog | Dialog closed | PASS | [JSON](evidence/browser-results.json) |
| TICKET-PDF | Owned paid booking PDF route | Authenticated owner receives PDF | 200 application/pdf, valid PDF header; provider simulated in harness | PASS | [JSON](evidence/browser-results.json) |
| TICKET-OWNER | Another browser cannot download ticket | 404 | 404 | PASS | [JSON](evidence/browser-results.json) |
| DATE-ERROR | Catalog network error disables booking | Error with retry, booking disabled | Error shown; booking disabled | PASS | [JSON](evidence/browser-results.json) |
| DATE-EMPTY | Empty backend schedules | Empty message, booking disabled | Empty message shown; no fictional prices | PASS | [JSON](evidence/browser-results.json) |
| STAFF-RBAC | Check-in STAFF cannot read admin catalog or orders | 401 for both admin APIs | 401 / 401 | PASS | [JSON](evidence/browser-results.json) |
| STAFF-CHECKIN | Authenticated QR endpoint and duplicate manual entry | 200 then 409 | 200 first QR check-in; 409 duplicate code; no physical camera claim | PASS | [JSON](evidence/browser-results.json) |
| ADMIN-RBAC | Individual ADMIN reads catalog and booking monitor | 200 for both APIs | 200 / 200 | PASS | [JSON](evidence/browser-results.json) |
| AUTH-REGISTER-LOGOUT | Email registration and secure logout | 201 register, 200 logout, session null | 201 / 200 / null | PASS | [JSON](evidence/browser-results.json) |

## Skenario eksternal yang belum lulus / belum dijalankan

| ID | Skenario | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| EXT-GOOGLE | Google login/logout melalui consent screen nyata | ID token valid, sesi baru, redirect benar | Client ID/Secret lokal belum tersedia; hanya identity/linking rules diuji | BLOCKED |
| EXT-EMAIL | Reset email dikirim dan dibuka | Email diterima, token sekali pakai | Provider email lokal belum tersedia; hashing/expiry/replay/revocation diuji | BLOCKED |
| EXT-PAID | Bayar Snap Sandbox pada reservasi melalui HTTPS publik | Webhook trusted → PAID → e-ticket | Initiation Snap nyata berhasil; payment success nyata dan webhook belum dijalankan | NOT RUN |
| EXT-PENDING | Pending payment dari layanan nyata | Tetap PENDING, tanpa tiket | Status pending dipastikan oleh suite provider stub; gateway smoke belum memilih metode | PARTIAL |
| EXT-FAIL-EXPIRE | Failed/expiry dari layanan nyata | Status terminal, quota release tepat sekali | Suite stub + database lulus; layanan nyata belum dijalankan | PARTIAL |
| EXT-CAMERA | Scan pada kamera ponsel fisik | QR terbaca, check-in sekali | Endpoint QR/manual lulus; perangkat fisik belum diuji | NOT RUN |
| EXT-DOMAIN | DNS/TLS booking dan OAuth/webhook baru | HTTPS + callback/POST langsung berhasil | Domain lama HTTPS 200; booking belum ter-resolve dari lingkungan audit | BLOCKED |
| EXT-UAT | Penerimaan pengguna bisnis | Penguji nyata menyetujui hasil | Checklist disediakan, belum ada sesi UAT | NOT RUN |
