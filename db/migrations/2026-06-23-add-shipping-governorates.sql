-- Create pgcrypto extension for gen_random_uuid (id generation)
create extension if not exists pgcrypto;

-- Table for shipping governorates with delivery fees
create table if not exists shipping_governorates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  delivery_fee numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed common Egyptian governorates with default fee matching current fallback (60)
insert into shipping_governorates (name, slug, delivery_fee, is_active, sort_order)
select * from (values
  ('القاهرة','cairo',60,true,1),
  ('الجيزة','giza',60,true,2),
  ('الإسكندرية','alexandria',60,true,3),
  ('الدقهلية','dakahlia',60,true,4),
  ('البحر الأحمر','red-sea',60,true,5),
  ('البحيرة','beheira',60,true,6),
  ('الفيوم','fyom',60,true,7),
  ('الغربية','gharbia',60,true,8),
  ('الإسماعيلية','ismailia',60,true,9),
  ('المنوفية','menoufia',60,true,10),
  ('المنيا','minya',60,true,11),
  ('القليوبية','qalyubia',60,true,12),
  ('الوادي الجديد','new-valley',60,true,13),
  ('السويس','suez',60,true,14),
  ('أسوان','aswan',60,true,15),
  ('أسيوط','asyut',60,true,16),
  ('بني سويف','beni-suef',60,true,17),
  ('بورسعيد','portsaid',60,true,18),
  ('دمياط','damietta',60,true,19),
  ('الشرقية','sharqia',60,true,20),
  ('جنوب سيناء','south-sinai',60,true,21),
  ('كفر الشيخ','kafr-elkhr',60,true,22),
  ('مطروح','matrouh',60,true,23),
  ('الأقصر','luxor',60,true,24),
  ('قنا','qena',60,true,25),
  ('شمال سيناء','north-sinai',60,true,26),
  ('سوهاج','sohag',60,true,27)
) as t(name, slug, delivery_fee, is_active, sort_order)
on conflict (slug) do update set name = excluded.name, delivery_fee = excluded.delivery_fee, is_active = excluded.is_active, sort_order = excluded.sort_order, updated_at = now();
