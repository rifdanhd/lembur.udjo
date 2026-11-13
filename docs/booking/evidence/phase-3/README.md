# Screenshot Evidence — Phase 3

## Evidence Directory

`docs/booking/evidence/phase-3/`

## Required Screenshots

All screenshots must be captured from the **actual running application** (local dev server or Vercel preview deployment). Do not use generated mockups.

| # | Page | Viewport | Description |
|---|------|----------|-------------|
| 1 | Booking homepage (`/`) | Desktop (1440px) | Premium hero, categories, program cards |
| 2 | Booking homepage (`/`) | Mobile (390px) | Responsive hero, stacked categories |
| 3 | Category selector | Desktop | Horizontal category navigation with active state |
| 4 | Date selector | Desktop | Eiger-style horizontal date cards with selected state |
| 5 | Date selector | Mobile (390px) | Horizontal swipe date cards, touch-friendly |
| 6 | Login modal | Desktop | Two-column: photo (left) + form (right) |
| 7 | Login modal | Mobile (390px) | Single-column form layout |
| 8 | Ticket detail page | Desktop | Ticket card with QR code, status badge |
| 9 | Cart | Desktop | Cart summary with item list and total |
| 10 | Checkout | Desktop | Two-column: customer info (left) + summary (right) |
| 11 | Payment state | Desktop | Payment success/pending state |
| 12 | Customer dashboard | Desktop | Welcome, upcoming reservations, quick actions |
| 13 | E-ticket page | Desktop | Ticket with QR code, download PDF button |
| 14 | Admin dashboard | Desktop | Order management panel with status cards |

## Screenshot Capture Method

Use the existing Playwright test infrastructure or manually capture from the running application:

```bash
# Local development
npm run dev -- --hostname booking.lemburudjoparahyangan.com
# Navigate to each page and capture screenshots at 1440px and 390px viewports
```

Or via Vercel preview deployment:
1. Open the preview URL from Vercel Dashboard
2. Capture screenshots at desktop and mobile viewports
3. Save as PNG to `docs/booking/evidence/phase-3/`

## Current Status

**NOT YET CAPTURED** — Screenshots need to be captured from the running preview deployment after owner verifies the deployment is accessible.

Existing Phase 2 screenshots (for reference):
- `docs/booking/evidence/date-selector-desktop.png`
- `docs/booking/evidence/date-selector-tablet.png`
- `docs/booking/evidence/date-selector-mobile.png`
- `docs/booking/evidence/ticket-fixture-sandbox.pdf`
