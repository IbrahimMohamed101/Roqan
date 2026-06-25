# Database Reset/Rebuild Plan

This project lost the `products` table, so the safest recovery is to rebuild the app database from the schema in a clean Neon branch or a new database, then point a dev environment at it and test before touching production.

Do not run the reset SQL against production until a Neon backup/snapshot or branch exists and the target `DATABASE_URL` has been confirmed.

## Destructive Warning

Running [db/reset-rebuild.sql](../db/reset-rebuild.sql) permanently deletes all app-managed data in the target database:

- products
- categories
- orders
- order items
- store settings
- shipping prices
- all dashboard-managed data

Cloudinary uploaded images will still exist in Cloudinary, but their database links will be lost unless products, categories, or settings are re-added with those URLs.

## Required Database Objects

Extension:

- `pgcrypto`, used for `gen_random_uuid()`

Enum:

- `order_status`: `new`, `confirmed`, `shipped`, `cancelled`

Tables:

- `categories`: `id`, `slug`, `name`, `icon`, `description`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`
- `products`: `id`, `category_id`, `slug`, `name`, `description`, `image_url`, `price`, `old_price`, `stock`, `featured`, `best_seller`, `is_new`, `is_active`, `created_at`, `updated_at`
- `orders`: `id`, `public_id`, `customer_name`, `customer_phone`, `alternate_phone`, `governorate`, `city`, `address`, `notes`, `subtotal`, `shipping`, `total`, `status`, `created_at`, `updated_at`
- `order_items`: `id`, `order_id`, `product_id`, `product_slug`, `product_name`, `quantity`, `unit_price`, `total_price`, `created_at`
- `store_settings`: `key`, `value`, `updated_at`
- `shipping_governorates`: `id`, `name`, `slug`, `delivery_fee`, `is_active`, `sort_order`, `created_at`, `updated_at`

Indexes and constraints are recreated by the reset script, including unique slugs, foreign keys, price/stock checks, and order/shipping lookup indexes.

## Existing Migration Order

For a fresh database without using the reset script, apply:

1. `db/schema.sql`
2. `db/migrations/2026-06-16-add-order-alternate-phone.sql`
3. `db/migrations/2026-06-23-add-category-image.sql`
4. `db/migrations/2026-06-23-add-shipping-governorates.sql`

The base schema already includes `orders.alternate_phone`, `categories.image_url`, and `orders.shipping`; the migrations remain useful as idempotent guards for older databases.

## Preferred Safe Strategy

1. Create a new clean Neon branch or a new Neon database.
2. Confirm the branch/database is not production.
3. Apply `db/reset-rebuild.sql` to that new target.
4. Point local `.env.local` or a Vercel preview environment at the new target.
5. Run the app validation and smoke tests.
6. Only after a successful test, decide whether to promote/swap the clean database or reset production.

## Backup First

Recommended Neon path:

1. In Neon, create a protected backup/snapshot or branch from the current production branch.
2. Name it with date/time and purpose, for example `pre-reset-2026-06-25`.
3. Verify you can see the branch/snapshot before applying any destructive SQL.

Optional logical backup with `pg_dump`:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=backup-pre-reset.dump
```

For a plain SQL backup:

```bash
pg_dump "$DATABASE_URL" --file=backup-pre-reset.sql
```

Do not paste or expose the actual `DATABASE_URL` in chat, logs, or tickets.

## Reset SQL

The prepared reset script is [db/reset-rebuild.sql](../db/reset-rebuild.sql).

It:

- Drops only this app's known tables and enum.
- Uses dependency-safe drop order.
- Recreates `pgcrypto`, `order_status`, all tables, indexes, constraints, and defaults.
- Seeds all Egyptian shipping governorates with a `60` EGP default fee.
- Seeds default `store_settings` rows expected by the dashboard/settings flow.

It does not seed products/categories by default. That avoids silently replacing real catalog data with demo products. For demo/dev catalog data after reset, run the existing guarded seed:

```bash
SEED_DATABASE=true npm run db:seed
```

## App Code Validation Notes

Checked code expectations:

- Product/category catalog queries in `src/lib/catalog.ts` require `categories`, `products`, `categories.image_url`, product flags, prices, stock, active state, and timestamps.
- Checkout/order creation in `src/lib/orders.ts` requires product stock locking, `orders.alternate_phone`, `orders.shipping`, `order_items`, and `order_status`.
- Dashboard order filters require `orders.status::order_status`, `orders.alternate_phone`, `orders.shipping`, and order item JSON aggregation.
- Dashboard product/category forms require product `image_url`, category `image_url`, slugs, sort order, active flags, and Cloudinary image URL storage.
- Shipping dashboard requires `shipping_governorates.id` as UUID plus `name`, `slug`, `delivery_fee`, `is_active`, and `sort_order`.
- Settings dashboard requires `store_settings` key/value rows and supports image/logo URLs.
- WhatsApp/order summary logic reads order item names, quantities, shipping, total, phone, alternate phone, and address fields.

## Local/Dev Test Checklist

Run only against a confirmed local/dev database first:

1. Apply [db/reset-rebuild.sql](../db/reset-rebuild.sql).
2. Optionally run `SEED_DATABASE=true npm run db:seed` for demo catalog data.
3. Start the app with the dev database URL.
4. Verify homepage loads.
5. Verify dashboard login works.
6. Add a category.
7. Upload or save a category image URL.
8. Add a product.
9. Upload or save a product image URL.
10. Edit a shipping governorate fee.
11. Place a test order.
12. Confirm the order appears in the dashboard.
13. Save settings.
14. Verify checkout and order confirmation.

After local/dev smoke testing, run:

```bash
npm run build
npm run lint
npx tsc --noEmit
git diff --check
```

## Manual Production Instructions

Do not execute these until explicitly approved:

1. Confirm the exact production Vercel `DATABASE_URL` target without exposing it.
2. Create a Neon backup/snapshot or branch from production first.
3. Confirm the backup exists and is restorable.
4. Apply [db/reset-rebuild.sql](../db/reset-rebuild.sql) to production only after approval.
5. Redeploy Vercel if needed so pooled connections reconnect cleanly.
6. Re-add products, categories, settings, and any Cloudinary image links from the dashboard.
7. Reconfigure shipping prices if they differ from the seeded `60` EGP defaults.
8. Run a production smoke test: homepage, category page, product page, checkout, order confirmation, dashboard orders, dashboard products, dashboard categories, dashboard settings, and dashboard shipping.

## Risk Summary

- The reset deletes all app-managed relational data in the target database.
- Existing Cloudinary assets are not deleted, but database references to them are removed.
- Existing order history is lost from the reset target unless restored from backup.
- Products/categories must be re-added or seeded before checkout can place real orders.
- It is safe to run on production only after backup, target confirmation, and explicit approval.
