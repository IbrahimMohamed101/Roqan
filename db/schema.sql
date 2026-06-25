create table if not exists categories (
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

create table if not exists products (
  id bigserial primary key,
  category_id bigint not null references categories(id) on delete restrict,
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

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('new', 'confirmed', 'shipped', 'cancelled');
  end if;
end $$;

create table if not exists orders (
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
  status order_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists store_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);
create index if not exists products_active_idx on products(is_active);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists order_items_order_id_idx on order_items(order_id);
