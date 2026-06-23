import "server-only";

import { hasDatabaseUrl, query } from "@/lib/db";
import { storeConfig } from "@/lib/storeConfig";

export type StoreSettings = {
  storeName: string;
  storeDescription: string;
  storeLogoUrl: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  location: string;
  address: string;
  termsUrl: string;
  privacyUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export const defaultStoreSettings: StoreSettings = {
  storeName: storeConfig.nameAr,
  storeDescription: storeConfig.tagline,
  storeLogoUrl: "/rooqan-logo.jpeg",
  whatsappNumber: storeConfig.whatsapp,
  phoneNumber: storeConfig.phone,
  email: storeConfig.email,
  location: "القاهرة",
  address: storeConfig.address,
  termsUrl: "/terms",
  privacyUrl: "/privacy-policy",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
};

const settingKeys: Record<keyof StoreSettings, string> = {
  storeName: "store_name",
  storeDescription: "store_description",
  storeLogoUrl: "store_logo_url",
  whatsappNumber: "whatsapp_number",
  phoneNumber: "phone_number",
  email: "email",
  location: "location",
  address: "address",
  termsUrl: "terms_url",
  privacyUrl: "privacy_url",
  facebookUrl: "facebook_url",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
};

export const getStoreSettings = async (): Promise<StoreSettings> => {
  if (!hasDatabaseUrl()) return defaultStoreSettings;

  try {
    const result = await query<{ key: string; value: string }>(
      "select key, value from store_settings",
    );
    const values = new Map(result.rows.map((row) => [row.key, row.value.trim()]));
    const settings = { ...defaultStoreSettings };

    for (const [property, key] of Object.entries(settingKeys) as Array<
      [keyof StoreSettings, string]
    >) {
      const value = values.get(key);
      if (value !== undefined) settings[property] = value;
    }

    return settings;
  } catch (error) {
    console.error("Failed to load store settings; using safe defaults.", error);
    return defaultStoreSettings;
  }
};

export const storeSettingEntries = (settings: StoreSettings) =>
  (Object.entries(settingKeys) as Array<[keyof StoreSettings, string]>).map(
    ([property, key]) => [key, settings[property]] as const,
  );
