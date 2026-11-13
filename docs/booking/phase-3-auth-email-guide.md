# Phase 3 — Authentication & Email Setup Guide

## Overview

The LUP Booking Platform supports email-based registration/login, Google OAuth, and password reset. These features require external credentials that must be configured by the system owner. No credentials should ever be committed to version control or shared in public documentation.

---

## 1. Google OAuth Setup

### Prerequisites

- Google Cloud Console access
- A Google Cloud project

### Steps

1. **Create OAuth client**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Click **Create Credentials** → **OAuth client ID**
   - Select **Web application**
   - Name: `LUP Booking Platform`

2. **Configure authorized JavaScript origins**
   Add both domains:
   ```
   https://ticket.lemburudjoparahyangan.com
   https://booking.lemburudjoparahyangan.com
   ```

3. **Configure authorized redirect URIs**
   Add both callback endpoints:
   ```
   https://ticket.lemburudjoparahyangan.com/api/ticketing/auth/google/callback
   https://booking.lemburudjoparahyangan.com/api/ticketing/auth/google/callback
   ```

4. **Configure consent screen**
   - Go to APIs & Services → OAuth consent screen
   - Select **External** user type
   - Add required scopes: `openid`, `email`, `profile`
   - Add test users (for testing before publishing)

5. **Copy credentials**
   - Copy **Client ID** and **Client Secret**
   - **Never commit these to GitHub**

### Environment variables

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `GOOGLE_CLIENT_ID` | OAuth client ID | `.env.local` (local), Vercel Env (production/preview) |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | `.env.local` (local), Vercel Env (production/preview) |

### Implementation notes

- Uses `openid-client` library with PKCE, state, and nonce for security
- `email_verified` must be `true` for Google accounts
- Google accounts are **not** auto-linked to existing local email accounts (`GOOGLE_LINK_REQUIRED` error if email matches)
- New Google users get `passwordHash: null` (passwordless login)
- OAuth state is single-use with 10-minute expiry

### Verification

1. Set both environment variables
2. Restart the application
3. Navigate to `/masuk`
4. Click "Masuk dengan Google"
5. Complete Google consent flow
6. Verify account creation and redirect

---

## 2. Email Setup (Resend)

### Prerequisites

- Resend account (https://resend.com)
- Verified domain or email sender

### Steps

1. **Create API key**
   - Go to Resend Dashboard → API Keys
   - Create a new key with "Send" permissions
   - Copy the key (starts with `re_`)

2. **Verify sender domain/email**
   - Go to Resend Dashboard → Domains
   - Add and verify your domain (`lemburudjoparahyangan.com`)
   - Or add a single sender email

3. **Environment variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key | `re_1234567890abcdef` |
| `EMAIL_FROM` | Sender name and address | `Lembur Udjo <noreply@lemburudjoparahyangan.com>` |

### What email sends

- **Password reset**: Password reset link with 30-minute expiry, single-use token
- **Reservation confirmation**: (planned, not yet implemented)
- **Payment confirmation**: (planned, not yet implemented)
- **E-ticket notification**: (planned, not yet implemented)

### Graceful degradation

If email delivery fails:
- Password reset token is still created in database
- User sees a generic message ("If email is registered, a reset link will be sent")
- Booking and ticket downloads remain functional
- Email send failure is logged but does not block the flow

### Verification

1. Set `RESEND_API_KEY` and `EMAIL_FROM`
2. Navigate to `/lupa-sandi`
3. Enter a registered email
4. Check the email inbox for the reset link
5. Click the link and verify password reset works

---

## 3. Environment Variable Summary

All variables must be set in:

- **Local**: `.env.local` (gitignored, never commit)
- **Vercel Preview/Production**: Vercel Project Settings → Environment Variables

| Variable | Required for | Example value |
|----------|-------------|---------------|
| `GOOGLE_CLIENT_ID` | Google OAuth | `1234567890-abcdef.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | `GOCSPX-xxxxxxxxxxxxxxxxxxxx` |
| `RESEND_API_KEY` | Email delivery | `re_1234567890abcdef` |
| `EMAIL_FROM` | Email delivery | `Lembur Udjo <noreply@lemburudjoparahyangan.com>` |
| `MIDTRANS_SERVER_KEY` | Midtrans Sandbox | `Mid-server-xxxxxxxxxxxxxxxx` |
| `MIDTRANS_CLIENT_KEY` | Midtrans Sandbox | `Mid-client-xxxxxxxxxxxxxxxx` |
| `MIDTRANS_IS_PRODUCTION` | Payment mode | `false` |
| `TICKETING_SANDBOX_ENABLED` | Sandbox mode | `true` |
| `TICKETING_SALES_APPROVED` | Sales enabled | `true` |
| `TICKETING_SECRET` | App signing secret | 32+ random characters |
| `TICKETING_CRON_SECRET` | Cron job secret | 32+ random characters |
| `BOOKING_PUBLIC_URL` | Public URL | `https://booking.lemburudjoparahyangan.com` |
| `BOOKING_REDIRECT_VERIFIED` | Domain redirect | `false` |

### Security reminders

- **Never** commit `.env.local` to GitHub (it is gitignored)
- **Never** paste real API keys into documentation or issues
- Rotate secrets immediately if accidentally exposed
- Use different secrets for local, preview, and production

---

## 4. Testing Checklist

- [ ] Google OAuth login works on local dev
- [ ] Google OAuth login works on preview domain
- [ ] Password reset email is received
- [ ] Password reset link is single-use
- [ ] Password reset revokes all existing sessions
- [ ] OAuth state cannot be reused (replay protection)
- [ ] Google account with unverified email is rejected
- [ ] Google email matching local account triggers link required error
