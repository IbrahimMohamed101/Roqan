"use server";

import { hasDatabaseUrl, query } from "@/lib/db";

export type Governorate = {
  id: string;
  name: string;
  slug: string;
  deliveryFee: number;
  isActive: boolean;
  sortOrder: number;
};

const FALLBACK_GOVERNORATES: Governorate[] = [
  { id: "cairo", name: "القاهرة", slug: "cairo", deliveryFee: 60, isActive: true, sortOrder: 1 },
  { id: "giza", name: "الجيزة", slug: "giza", deliveryFee: 60, isActive: true, sortOrder: 2 },
];

export const getActiveGovernorates = async (): Promise<Governorate[]> => {
  if (!hasDatabaseUrl()) return FALLBACK_GOVERNORATES;

  // Guard: if migration not applied, return fallback to avoid build-time failures.
  const tableExists = await query<{ exists: boolean }>(
    `select exists (select 1 from information_schema.tables where table_name = 'shipping_governorates') as exists`,
  );
  if (!tableExists.rows[0]?.exists) return FALLBACK_GOVERNORATES;

  const result = await query<{
    id: string;
    name: string;
    slug: string;
    delivery_fee: string;
    is_active: boolean;
    sort_order: number;
  }>(`
    select id, name, slug, delivery_fee, is_active, sort_order
    from shipping_governorates
    where is_active = true
    order by sort_order asc, name asc
  `);

  return result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    deliveryFee: Number(r.delivery_fee),
    isActive: r.is_active,
    sortOrder: r.sort_order,
  }));
};

export const findGovernorateBySlugOrName = async (value: string) => {
  if (!value) return null;
  if (!hasDatabaseUrl()) {
    const found = FALLBACK_GOVERNORATES.find(
      (g) => g.slug === value || g.name === value,
    );
    return found ?? null;
  }

  const result = await query<{
    id: string;
    name: string;
    slug: string;
    delivery_fee: string;
    is_active: boolean;
    sort_order: number;
  }>(
    `select id, name, slug, delivery_fee, is_active, sort_order from shipping_governorates where slug = $1 or name = $1 limit 1`,
    [value],
  );

  if (!result.rows[0]) return null;
  const r = result.rows[0];
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    deliveryFee: Number(r.delivery_fee),
    isActive: r.is_active,
    sortOrder: r.sort_order,
  } as Governorate;
};
