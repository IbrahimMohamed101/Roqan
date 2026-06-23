# Deployment Checklist

Use this checklist before client delivery or production deployment.

## Database

- [ ] Confirm `DATABASE_URL` points to the intended production database before running any migration.
- [ ] Neon project created.
- [ ] `db/schema.sql` applied successfully.
- [ ] All files in `db/migrations/` applied successfully.
- [ ] `db/migrations/2026-06-16-add-order-alternate-phone.sql` applied.
- [ ] `db/migrations/2026-06-23-add-category-image.sql` applied to production.
- [ ] `categories.image_url` exists after applying the category image migration.
- [ ] Products and categories seeded or added from dashboard.
- [ ] `DATABASE_URL` uses `sslmode=verify-full`.
- [ ] PostgreSQL SSL warning is resolved in local/prod build logs.

## Environment

- [ ] `DATABASE_URL` configured in Vercel.
- [ ] `ADMIN_EMAIL` configured in Vercel.
- [ ] `ADMIN_PASSWORD` configured in Vercel.
- [ ] Strong `AUTH_SECRET` configured in Vercel.
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` configured with country code.
- [ ] `NEXT_PUBLIC_SITE_URL` configured with production domain.
- [ ] `CLOUDINARY_CLOUD_NAME` configured.
- [ ] `CLOUDINARY_API_KEY` configured.
- [ ] `CLOUDINARY_API_SECRET` configured.
- [ ] Cloudinary API secret rotated before production if it was shared.
- [ ] `.env.local` is not committed.

## Build And Deploy

- [ ] `npm install` completes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Vercel project connected.
- [ ] Vercel environment variables saved for Production.
- [ ] Production deployment succeeds.

## Storefront Smoke Test

- [ ] Home page loads.
- [ ] Categories page loads.
- [ ] Category detail page loads.
- [ ] Product detail page loads with image.
- [ ] Search page works.
- [ ] Offers page works.
- [ ] Cart add/remove/quantity works.
- [ ] Out-of-stock product cannot be added.

## Checkout And Orders

- [ ] Checkout validation shows Arabic errors for missing fields.
- [ ] Governorate dropdown works.
- [ ] Alternate phone field is accepted.
- [ ] Successful checkout creates an order.
- [ ] A final test order has been placed against the intended environment.
- [ ] Stock decrements after checkout.
- [ ] Order confirmation page loads.
- [ ] WhatsApp confirmation button opens with order details.
- [ ] WhatsApp number matches the value saved in `/dashboard/settings`.
- [ ] Order appears in admin dashboard.
- [ ] Admin can update order status.

## Admin

- [ ] Dashboard login works.
- [ ] Dashboard logout works.
- [ ] Product create works.
- [ ] Product edit works.
- [ ] Product deactivate works.
- [ ] Cloudinary product image upload works.
- [ ] Store information and contact details in `/dashboard/settings` are correct.
- [ ] Category create works.
- [ ] Category edit works.
- [ ] Category deactivate works.
- [ ] Cloudinary category image upload works.

## SEO And Policy

- [ ] `/robots.txt` loads.
- [ ] `/sitemap.xml` loads.
- [ ] Shipping policy reviewed.
- [ ] Return/exchange policy reviewed.
- [ ] Privacy policy reviewed.
- [ ] Terms and conditions reviewed.
- [ ] Canonical site URL matches production domain.
