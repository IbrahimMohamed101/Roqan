/**
 * Slug utility functions for consistent slug handling across products, categories, and shipping governorates.
 * Rules:
 * - Lowercase only
 * - Replace spaces and underscores with hyphens
 * - Remove invalid symbols (keep only alphanumeric and hyphens)
 * - Collapse repeated hyphens
 * - Remove leading/trailing hyphens
 * - For Arabic names, generate fallback slugs with type prefix
 */

import { query } from "@/lib/db";

/**
 * Normalize a slug string according to URL-safe rules.
 * Handles uppercase, spaces, symbols, and returns clean slugs.
 *
 * @param input - Raw slug input (may include uppercase, spaces, symbols, etc.)
 * @returns Normalized slug (lowercase, hyphens, alphanumeric only)
 */
export function normalizeSlug(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Check if the input contains significant Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(input)) {
    // Input is primarily Arabic; we can't generate a valid English slug from it
    // Return empty so a fallback slug will be generated
    return "";
  }

  // Convert to lowercase
  let slug = input.toLowerCase();

  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, "-");

  // Remove any characters that aren't alphanumeric or hyphens
  slug = slug.replace(/[^a-z0-9-]/g, "");

  // Collapse consecutive hyphens into a single hyphen
  slug = slug.replace(/-+/g, "-");

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}

/**
 * Generate a fallback slug for Arabic or invalid names.
 * Uses entity type prefix + timestamp-based suffix for uniqueness.
 *
 * @param entityType - "product", "category", or "governorate"
 * @returns A slug like "product-20260624-001"
 */
export function generateFallbackSlug(entityType: "product" | "category" | "governorate"): string {
  // Use a timestamp-based suffix for uniqueness without database calls
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  // Add a small random component to minimize collision risk
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const suffix = `${dateStr}-${random}`;

  return `${entityType}-${suffix}`;
}

/**
 * Ensure a slug is unique in the given table.
 * If the slug already exists, appends a number (e.g., slug-2, slug-3).
 * On edit, excludes the current item ID.
 *
 * @param baseSlug - The normalized slug to check
 * @param tableName - Table name (products, categories, shipping_governorates)
 * @param excludeId - (Optional) ID of the current item to exclude (for edits)
 * @returns A unique slug safe to insert/update
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  tableName: "products" | "categories" | "shipping_governorates",
  excludeId?: string | number,
): Promise<string> {
  if (!baseSlug) {
    throw new Error("Base slug cannot be empty");
  }

  // Check if baseSlug already exists
  let existsQuery = `select exists(select 1 from ${tableName} where slug = $1)`;
  let params: (string | number)[] = [baseSlug];

  if (excludeId) {
    // When editing, exclude the current record by ID
    const idColumn = tableName === "shipping_governorates" ? "id::text" : "id";
    existsQuery = `select exists(select 1 from ${tableName} where slug = $1 and ${idColumn} != $2)`;
    params = [baseSlug, excludeId];
  }

  const result = await query<{ exists: boolean }>(existsQuery, params);
  if (!result.rows[0]?.exists) {
    return baseSlug;
  }

  // Slug exists; try appending numbers
  for (let i = 2; i <= 999; i++) {
    const candidateSlug = `${baseSlug}-${i}`;
    let candidateQuery = `select exists(select 1 from ${tableName} where slug = $1)`;
    let candidateParams: (string | number)[] = [candidateSlug];

    if (excludeId) {
      const idColumn = tableName === "shipping_governorates" ? "id::text" : "id";
      candidateQuery = `select exists(select 1 from ${tableName} where slug = $1 and ${idColumn} != $2)`;
      candidateParams = [candidateSlug, excludeId];
    }

    const candidateResult = await query<{ exists: boolean }>(candidateQuery, candidateParams);
    if (!candidateResult.rows[0]?.exists) {
      return candidateSlug;
    }
  }

  // Should rarely happen; fallback to timestamp-based
  return generateFallbackSlug(tableName === "products" ? "product" : tableName === "categories" ? "category" : "governorate");
}

/**
 * Process slug input for create/update operations.
 * - If slug is empty, return empty (caller generates fallback or auto-generates from name)
 * - If slug is provided, normalize it
 * - Ensure uniqueness
 *
 * @param inputSlug - Raw slug from form (may be empty or contain special chars)
 * @param tableName - Which table this slug is for
 * @param entityName - The entity name (for fallback slug generation if needed)
 * @param excludeId - (Optional) Current item ID for edit mode
 * @returns Promise of final slug to save
 */
export async function processSlug(
  inputSlug: string,
  tableName: "products" | "categories" | "shipping_governorates",
  entityName: string,
  excludeId?: string | number,
): Promise<string> {
  // If slug is empty, generate fallback from name or use a timestamp-based slug
  if (!inputSlug || !inputSlug.trim()) {
    const normalized = normalizeSlug(entityName);
    if (normalized) {
      // Name is in English; use it as base
      return ensureUniqueSlug(normalized, tableName, excludeId);
    } else {
      // Name is likely Arabic; generate fallback
      const fallback = generateFallbackSlug(
        tableName === "products" ? "product" : tableName === "categories" ? "category" : "governorate",
      );
      return ensureUniqueSlug(fallback, tableName, excludeId);
    }
  }

  // Slug is provided; normalize it
  const normalized = normalizeSlug(inputSlug);
  if (!normalized) {
    // Admin entered something that normalized to nothing (likely all special chars)
    // Fall back to generating from entity name
    return processSlug("", tableName, entityName, excludeId);
  }

  // Ensure normalized slug is unique
  return ensureUniqueSlug(normalized, tableName, excludeId);
}
