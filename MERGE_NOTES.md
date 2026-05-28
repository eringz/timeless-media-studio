# Merge Notes

Base project: ZIP 1 / main repo design.
Feature source: ZIP 2 / old repo features.

## Added from ZIP 2

- Customer service dashboard and login routes:
  - `/customer-service/login`
  - `/customer-service/dashboard`
  - `/admin/customer-service`
  - `/admin/dashboard`
- Live chat widget for public frontend pages only.
- Live chat API routes:
  - `/api/live-chat/start`
  - `/api/live-chat/close`
- Booking/order tracker API routes:
  - `/api/bookings`
  - `/api/bookings/available-dates`
  - `/api/bookings/cancel-email`
  - `/api/send-confirmation`
- PayMongo payment flow:
  - `/api/payment/create-source`
  - `/api/payment/status`
  - `/payment/success`
  - `/payment/failed`
- Booking calendar, payment component, PayMongo config/util files.
- Supabase browser/admin helpers and live chat migration.

## Preserved from ZIP 1

- Main homepage/front-end sections and styling.
- Header, footer, studio, album/media gallery, camera transitions, and ZIP 1 assets.
- ZIP 1 `next.config.ts` image support, with additional watcher ignore rules merged in.

## Validation run

- `npm install --include=optional --ignore-scripts`
- `npm run lint` completed with warnings only.
- `npm run build` completed successfully with Next.js 16.2.6.

## Required environment variables

Copy `.env.local.example` to `.env.local` locally and set the same values in Vercel.
