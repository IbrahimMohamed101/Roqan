# Rooqan E-commerce Store

Arabic RTL e-commerce storefront and admin dashboard for Rooqan. The store uses
Neon PostgreSQL for products, categories, orders, and stock; Cloudinary for
product images; WhatsApp for order follow-up; and cash on delivery only.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Neon PostgreSQL via `pg`
- Cloudinary signed uploads
- Vercel-ready deployment

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Fill the variables in `.env.local`, then run:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Required Environment Variables

Do not commit `.env.local`.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=verify-full&channel_binding=require
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
AUTH_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_WHATSAPP_NUMBER=201000000000
NEXT_PUBLIC_SITE_URL=https://example.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Notes:

- Use Neon with `sslmode=verify-full`.
- `AUTH_SECRET` must be long, random, and unique per environment.
- Rotate Cloudinary/API secrets before production if they were shared during development.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` should be digits only, including country code.
- `NEXT_PUBLIC_SITE_URL` should be the production domain, for example `https://example.com`.

## Neon Database Setup

1. Create a Neon project and database.
2. Copy the pooled or direct connection string.
3. Ensure the connection string uses `sslmode=verify-full`.
4. Run the main schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

If using the Neon SQL editor, paste and run the contents of:

```text
db/schema.sql
```

## Migrations

Run all migration files in `db/migrations/` after the main schema and before
production deployment.

Current migration:

```text
db/migrations/2026-06-16-add-order-alternate-phone.sql
```

SQL:

```sql
alter table orders
add column if not exists alternate_phone text;
```

## Cloudinary Setup

1. Create a Cloudinary account.
2. Copy cloud name, API key, and API secret into `.env.local` and Vercel.
3. Product uploads are signed server-side and saved under:

```text
rooqan/products
```

Images are not stored in Neon or `public/`; only the Cloudinary secure URL is
stored in the `products.image_url` column.

## Admin Login

Admin login is env-based:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

Dashboard routes are under:

```text
/dashboard
/dashboard/products
/dashboard/categories
```

Use a strong admin password and a strong `AUTH_SECRET` in production.

## Products And Categories

Manage products and categories from the dashboard:

- Add/edit products.
- Upload product images to Cloudinary.
- Keep external HTTPS image URL support as a fallback.
- Activate/deactivate products and categories.
- Manage product stock.

Local fallback data still exists in `src/data/` for development only when
`DATABASE_URL` is missing. Production requires a working database.

## Checkout And Orders

Checkout is cash on delivery only.

Customer checkout:

1. Customer adds products to cart.
2. Customer fills contact information, governorate, address, optional alternate phone, and notes.
3. Server validates cart and customer data.
4. Server locks product rows in PostgreSQL, validates stock, decrements stock, creates order, and inserts order items in one transaction.
5. Customer is redirected to order confirmation.
6. WhatsApp confirmation button opens a prefilled order message.

Client-submitted prices are not trusted. Totals are calculated server-side from
current database product prices.

## WhatsApp Flow

The store uses `NEXT_PUBLIC_WHATSAPP_NUMBER` to build WhatsApp links.

- Checkout stores the generated WhatsApp URL in `sessionStorage`.
- The order confirmation page shows a WhatsApp button.
- Dashboard order cards include a WhatsApp button with order details.

## SEO And Policies

Included public readiness routes:

- `/robots.txt`
- `/sitemap.xml`
- `/shipping-policy`
- `/returns-policy`
- `/privacy-policy`
- `/terms`

Review all policy content before client delivery.

## Deployment To Vercel

1. Push the repository.
2. Create a Vercel project.
3. Add all required environment variables in Vercel.
4. Apply `db/schema.sql` to Neon.
5. Apply all migrations in `db/migrations/`.
6. Confirm Cloudinary credentials are set.
7. Confirm `NEXT_PUBLIC_SITE_URL` matches the production domain.
8. Run a production build:

```bash
npm run build
```

9. Deploy.
10. Run the manual QA checklist in `docs/qa-checklist.md`.

## Common Troubleshooting

- **Build shows PostgreSQL SSL warning**: update the real `DATABASE_URL` to use `sslmode=verify-full`.
- **Admin login fails**: check `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET`.
- **Dashboard is empty**: check `DATABASE_URL`, schema, migrations, and product/category data.
- **Cloudinary upload fails**: check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- **Images do not render**: ensure product image URLs are HTTPS and from allowed domains in `next.config.ts`.
- **WhatsApp opens wrong number**: update `NEXT_PUBLIC_WHATSAPP_NUMBER` and redeploy.
- **Checkout fails after migration**: ensure `alternate_phone` migration has been applied on Neon.

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```
# Roqan
