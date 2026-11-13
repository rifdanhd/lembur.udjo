# Phase 3 — Preview Deployment & Domain Readiness

## 1. Deployment Architecture Verification

The application is hosted on **Vercel** (confirmed via `.vercel/project.json` with project `lemburudjo-parahyangan-id`). A VPS reverse-proxy configuration also exists as documentation (`deploy/nginx-subdomains.conf.example`) but is not the active deployment path.

### Current hosting

| Component | Detail |
|-----------|--------|
| Platform | Vercel |
| Project | `lemburudjo-parahyangan-id` |
| Framework | Next.js 16.4.6 with Payload CMS |
| Build | `next build --webpack` (Webpack, due to Turbopack shared-memory constraints) |
| Output | `.next` directory |
| Database | PostgreSQL (Neon, shared with Payload) via `DATABASE_URL` |
| Schema | `ticketing` schema (additive Prisma migrations) |

### Why the public booking website does not show changes

The public domain `ticket.lemburudjoparahyangan.com` serves the **deployed production build** from the `main` branch. Phase 3 work lives on branch `feat/lup-booking-platform`, which has **not been merged to `main`** and has **not been deployed to Vercel production**. Therefore, the public website continues to show the previous implementation.

Changes are visible **only locally** at `http://localhost:3000` or `http://booking.lemburudjoparahyangan.com:3000` (via `/etc/hosts` pointing to `127.0.0.1`) while `npm run dev` is active.

---

## 2. Preview Deployment

### Approach: Vercel Preview Deployment

Vercel automatically creates a preview deployment for every Git branch push. Since `feat/lup-booking-platform` has been pushed to GitHub, a preview deployment should already exist.

### Preview URL

The exact preview URL is available in the Vercel Dashboard:

1. Open https://vercel.com/dashboard
2. Select project `lemburudjo-parahyangan-id`
3. Go to **Deployments**
4. Find the deployment for branch `feat/lup-booking-platform`
5. The preview URL follows the pattern:
   `https://lemburudjo-parahyangan-id-git-feat-lup-booking-platform-*.vercel.app`

### Pages available on preview

| Page | Path | Description |
|------|------|-------------|
| Booking homepage | `/` | Premium hero, categories, program catalog |
| Category catalog | `/order-tickets` | Horizontal category navigation, program grid |
| Date selector | `/pilih-tiket?kategori=kunjungan&produk=<id>` | Eiger-style horizontal date cards |
| Cart | `/keranjang` | Cart summary, proceed to checkout |
| Checkout | `/checkout` | Customer info, booking summary, Midtrans Sandbox payment |
| Order status | `/pesanan/<orderNumber>` | Payment status, e-ticket download |
| Customer dashboard | `/akun` | Welcome, upcoming reservations, history |
| Profile | `/akun/profile` | Profile management |
| Bookings | `/akun/bookings` | Reservation history |
| Tickets | `/akun/tickets` | E-ticket list with PDF download |
| Login | `/masuk` | Two-column login modal (desktop), single-column (mobile) |
| Admin ticket panel | `/admin/tiket` | Order management, staff check-in |

### Preview limitations

- **Midtrans Sandbox**: Webhook notifications cannot be delivered to preview URLs unless a public HTTPS endpoint is configured in Midtrans Sandbox dashboard.
- **Google OAuth**: Requires `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and authorized redirect URIs configured in Google Cloud Console for the preview domain.
- **Email**: Requires `RESEND_API_KEY`/`EMAIL_FROM` configured in Vercel environment variables.
- **Cookies**: Host-only cookies mean customers must log in again on the preview domain.

---

## 3. Domain Readiness: booking.lemburudjoparahyangan.com

### Current status

| Item | Status |
|------|--------|
| DNS `booking` record | Not configured (not resolvable from internet) |
| HTTPS/TLS | Not provisioned |
| Application routing | Configured in code (`bookingOrigin()` allows `booking.*`) |
| Cookie domain | Host-only (login required again on new domain) |
| Google OAuth callback | Not registered for `booking.*` domain |
| Midtrans notification URL | Not configured |

### Required DNS record

```
Type: CNAME
Name: booking
Value: ticket.lemburudjoparahyangan.com (or Vercel target)
TTL: Automatic
```

Alternative: A/AAAA record pointing to the Vercel deployment IP.

### Required HTTPS/TLS

- Provision a TLS certificate covering both `ticket.lemburudjoparahyangan.com` and `booking.lemburudjoparahyangan.com`
- If using Vercel: add both domains in Vercel Project Settings → Domains
- If using VPS: use Certbot (`certbot --nginx -d ticket.lemburudjoparahyangan.com -d booking.lemburudjoparahyangan.com`)

### Required environment variables

```
BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com
BOOKING_REDIRECT_VERIFIED=false  (set to true only after full verification)
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
RESEND_API_KEY=<from Resend>
EMAIL_FROM="Lembur Udjo <noreply@lemburudjoparahyangan.com>"
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=<sandbox server key>
MIDTRANS_CLIENT_KEY=<sandbox client key>
```

### Midtrans Sandbox webhook

Set Payment Notification URL in Midtrans Sandbox Dashboard:
```
https://booking.lemburudjoparahyangan.com/api/ticketing/webhook
```

### Migration plan (preserve old domain)

1. Keep `ticket.lemburudjoparahyangan.com` active during migration
2. Add `booking.lemburudjoparahyangan.com` DNS + TLS
3. Deploy preview to verify all flows on new domain
4. Set `BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com`
5. Configure Google OAuth redirect URIs for both domains
6. Configure Midtrans webhook URL for new domain
7. Test end-to-end: booking → payment → webhook → e-ticket → check-in
8. Set `BOOKING_REDIRECT_VERIFIED=true` to enable 307 GET/HEAD redirect from `ticket.` to `booking.`
9. Keep webhook POST on old domain functional for existing transactions

### Do NOT do without approval

- ❌ Change live DNS records
- ❌ Modify live Nginx/Vercel configuration
- ❌ Switch Midtrans to Production
- ❌ Run destructive database migrations
- ❌ Merge to `main` or deploy to production

---

## 4. Safe Preview Summary

- **Vercel Preview**: Automatic on branch push, no production impact
- **VPS Staging**: Not required; Vercel preview is sufficient for UI review
- **Production deploy**: Blocked until owner approval and infrastructure readiness
- **Database**: No production migrations; all migrations are additive and tested on disposable local DB
