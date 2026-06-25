-- Rooqan database reset/rebuild script
--
-- WARNING: This is destructive when executed.
-- It deletes all app-managed categories, products, orders, order items,
-- store settings, and shipping prices from the target database.
--
-- Intended use:
--   1. Run only against a new Neon branch/database first, or a confirmed dev database.
--   2. Take a Neon backup/snapshot/branch before using on any existing database.
--   3. Verify DATABASE_URL points to the intended target before executing.
--
-- Scope:
--   Only app-owned objects in the public schema are dropped/recreated.

begin;

-- Drop app tables in dependency order. Avoid dropping unrelated schemas/objects.
drop table if exists public.order_items;
drop table if exists public.orders;
drop table if exists public.products;
drop table if exists public.categories;
drop table if exists public.store_settings;
drop table if exists public.shipping_governorates;

-- Drop app enum after dependent tables are gone.
drop type if exists public.order_status;

-- Required extension for shipping_governorates.id default.
create extension if not exists pgcrypto;

create type public.order_status as enum ('new', 'confirmed', 'shipped', 'cancelled');

create table public.categories (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  icon text default '•',
  description text default '',
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id bigserial primary key,
  category_id bigint not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text default '',
  image_url text not null,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price is null or old_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  best_seller boolean not null default false,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id bigserial primary key,
  public_id text not null unique,
  customer_name text not null,
  customer_phone text not null,
  alternate_phone text,
  governorate text not null,
  city text,
  address text not null,
  notes text,
  subtotal numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status public.order_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table public.store_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table public.shipping_governorates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_active_idx on public.products(is_active);
create index products_created_at_idx on public.products(created_at desc);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index shipping_governorates_active_idx on public.shipping_governorates(is_active);
create index shipping_governorates_sort_idx on public.shipping_governorates(sort_order, name);

insert into public.shipping_governorates (name, slug, delivery_fee, is_active, sort_order)
values
  ('القاهرة', 'cairo', 60, true, 1),
  ('الجيزة', 'giza', 60, true, 2),
  ('الإسكندرية', 'alexandria', 60, true, 3),
  ('الدقهلية', 'dakahlia', 60, true, 4),
  ('البحر الأحمر', 'red-sea', 60, true, 5),
  ('البحيرة', 'beheira', 60, true, 6),
  ('الفيوم', 'fyom', 60, true, 7),
  ('الغربية', 'gharbia', 60, true, 8),
  ('الإسماعيلية', 'ismailia', 60, true, 9),
  ('المنوفية', 'menoufia', 60, true, 10),
  ('المنيا', 'minya', 60, true, 11),
  ('القليوبية', 'qalyubia', 60, true, 12),
  ('الوادي الجديد', 'new-valley', 60, true, 13),
  ('السويس', 'suez', 60, true, 14),
  ('أسوان', 'aswan', 60, true, 15),
  ('أسيوط', 'asyut', 60, true, 16),
  ('بني سويف', 'beni-suef', 60, true, 17),
  ('بورسعيد', 'portsaid', 60, true, 18),
  ('دمياط', 'damietta', 60, true, 19),
  ('الشرقية', 'sharqia', 60, true, 20),
  ('جنوب سيناء', 'south-sinai', 60, true, 21),
  ('كفر الشيخ', 'kafr-elkhr', 60, true, 22),
  ('مطروح', 'matrouh', 60, true, 23),
  ('الأقصر', 'luxor', 60, true, 24),
  ('قنا', 'qena', 60, true, 25),
  ('شمال سيناء', 'north-sinai', 60, true, 26),
  ('سوهاج', 'sohag', 60, true, 27);

insert into public.store_settings (key, value, updated_at)
values
  ('store_name', 'روقان', now()),
  ('store_description', 'متجر المنتجات المتنوعة والعصرية', now()),
  ('store_logo_url', '/rooqan-logo.jpeg', now()),
  ('whatsapp_number', '201000000000', now()),
  ('phone_number', '01000000000', now()),
  ('email', 'hello@rooqan.store', now()),
  ('location', 'القاهرة', now()),
  ('address', 'القاهرة، مصر', now()),
  ('terms_url', '/terms', now()),
  ('privacy_url', '/privacy-policy', now()),
  ('facebook_url', '', now()),
  ('instagram_url', '', now()),
  ('tiktok_url', '', now());

commit;
