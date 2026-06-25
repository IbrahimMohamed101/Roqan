"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isUploadedImageFile, uploadProductImage } from "@/lib/cloudinary";
import { hasDatabaseUrl, query } from "@/lib/db";
import type { OrderStatus } from "@/types/order";
import {
  defaultStoreSettings,
  storeSettingEntries,
  type StoreSettings,
} from "@/lib/storeSettings";
import { normalizeWhatsAppNumber } from "@/lib/storeConfig";
import { processSlug } from "@/lib/slug";

const boolFromForm = (formData: FormData, key: string) => formData.get(key) === "on";
const allowedOrderStatuses: OrderStatus[] = [
  "new",
  "confirmed",
  "shipped",
  "cancelled",
];

const nullableNumber = (value: FormDataEntryValue | null) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const numberFromForm = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const requireAdmin = async () => {
  if (!(await isAdminAuthenticated())) {
    throw new Error("غير مصرح بتنفيذ هذا الإجراء. سجّل الدخول أولًا.");
  }
};

const requireDatabase = () => {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL غير مضبوط. اربط Neon أولًا لتفعيل التعديل.");
  }
};

const dashboardPathPattern =
  /^\/dashboard(?:\/(?:products|categories|settings))?(?:\?[A-Za-z0-9%=&_.~+\-]*)?$/;

const getReturnTo = (formData: FormData, fallback: string) => {
  const value = String(formData.get("returnTo") ?? "");
  return dashboardPathPattern.test(value) ? value : fallback;
};

const withNotice = (path: string, key: "success" | "error", message: string) => {
  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.delete("success");
  params.delete("error");
  params.set(key, message);
  return `${pathname}?${params.toString()}`;
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    console.error("Dashboard database action failed.", error);
    return "تعذر حفظ البيانات الآن. راجع إعدادات قاعدة البيانات وحاول مرة أخرى.";
  }

  return error instanceof Error ? error.message : "تعذر تنفيذ الإجراء الآن.";
};

const sanitizeUserError = (error: unknown) => {
  // Known safe messages (already in Arabic) are returned as-is.
  if (error instanceof Error) {
    const msg = error.message;
    const known = [
      "يُسمح برفع ملفات الصور فقط.",
      "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.",
      "رابط الصورة يجب أن يكون رابط HTTPS صحيحًا.",
      "اسم الفئة مطلوب.",
      "اسم المنتج مطلوب.",
      "تعذر إنشاء رابط فريد. برجاء المحاولة مرة أخرى.",
      missingCategoryImageMigrationMessage,
    ];

    if (known.includes(msg)) return msg;
  }

  // Fallback generic message shown to users (no technical details in URL)
  return "حدث خطأ أثناء حفظ التغييرات. حاول مرة أخرى لاحقًا.";
};

const missingCategoryImageMigrationMessage =
  "لم يتم تطبيق تحديث قاعدة البيانات الخاص بصور الفئات. برجاء تطبيق migration قبل استخدام صور الفئات.";

const requireCategoryImageColumn = async () => {
  try {
    const result = await query<{ exists: boolean }>(
      `
        select exists (
          select 1
          from information_schema.columns
          where table_schema = 'public'
            and table_name = 'categories'
            and column_name = 'image_url'
        ) as exists
      `,
    );

    if (!result.rows[0]?.exists) {
      console.error("Category save blocked: public.categories.image_url is missing.");
      throw new Error(missingCategoryImageMigrationMessage);
    }
  } catch (error) {
    if (error instanceof Error && error.message === missingCategoryImageMigrationMessage) {
      throw error;
    }

    console.error("Failed to verify the category image database migration.", error);
    throw new Error("تعذر التحقق من تحديث قاعدة البيانات الخاص بصور الفئات.");
  }
};

const validateHttpsUrl = (value: string) => {
  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error("رابط الصورة يجب أن يكون رابط HTTPS صحيحًا.");
  }
};

const validateOptionalUrl = (value: string, label: string, allowInternal = false) => {
  if (!value || (allowInternal && value.startsWith("/"))) return;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error();
  } catch {
    throw new Error(`${label} يجب أن يكون رابط HTTPS صحيحًا${allowInternal ? " أو مسارًا داخليًا يبدأ بـ /" : ""}.`);
  }
};

const textFromForm = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export const saveCategory = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/categories");

  try {
    await requireAdmin();
    requireDatabase();
    await requireCategoryImageColumn();

    const id = String(formData.get("id") ?? "");
    const inputSlug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      throw new Error("اسم الفئة مطلوب.");
    }

    // Process slug: normalize, auto-generate if empty, ensure uniqueness
    const slug = await processSlug(inputSlug, "categories", name, id || undefined);

    const uploadedImage = formData.get("imageFile");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (isUploadedImageFile(uploadedImage)) {
      imageUrl = await uploadProductImage(uploadedImage);
    }

    if (imageUrl) validateHttpsUrl(imageUrl);

    const values = [
      slug,
      name,
      String(formData.get("description") ?? "").trim(),
      Number(formData.get("sortOrder") ?? 0),
      boolFromForm(formData, "isActive"),
      imageUrl || null,
    ];

    if (id) {
      await query(
        `
          update categories
          set slug = $1, name = $2, description = $3, sort_order = $4, is_active = $5, image_url = $6, updated_at = now()
          where id = $7
        `,
        [...values, Number(id)],
      );
    } else {
      await query(
        `
          insert into categories (slug, name, description, sort_order, is_active, image_url)
          values ($1, $2, $3, $4, $5, $6)
        `,
        values,
      );
    }

    revalidatePath("/");
    revalidatePath("/dashboard/categories");
  } catch (error) {
    console.error("Category save failed.", error);
    const userMsg = sanitizeUserError(error);
    redirect(withNotice(returnTo, "error", userMsg));
  }

  redirect(withNotice(returnTo, "success", "تم حفظ الفئة بنجاح."));
};

export const saveProduct = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/products");

  try {
    await requireAdmin();
    requireDatabase();

    const id = String(formData.get("id") ?? "");
    const inputSlug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const categoryId = numberFromForm(formData.get("categoryId"));
    const price = numberFromForm(formData.get("price"));
    const stock = numberFromForm(formData.get("stock") ?? 0);
    const uploadedImage = formData.get("imageFile");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (!name) {
      throw new Error("اسم المنتج مطلوب.");
    }

    // Process slug: normalize, auto-generate if empty, ensure uniqueness
    const slug = await processSlug(inputSlug, "products", name, id || undefined);

    if (!categoryId || categoryId < 1) {
      throw new Error("اختر فئة صحيحة للمنتج.");
    }
    if (price === null || price < 0) {
      throw new Error("سعر المنتج يجب أن يكون رقمًا أكبر من أو يساوي صفر.");
    }
    if (stock === null || stock < 0) {
      throw new Error("المخزون يجب أن يكون رقمًا أكبر من أو يساوي صفر.");
    }

    if (isUploadedImageFile(uploadedImage)) {
      imageUrl = await uploadProductImage(uploadedImage);
    }

    if (!imageUrl) {
      throw new Error("رابط الصورة أو رفع صورة للمنتج مطلوب.");
    }
    validateHttpsUrl(imageUrl);

    const values = [
      slug,
      name,
      categoryId,
      price,
      nullableNumber(formData.get("oldPrice")),
      imageUrl,
      String(formData.get("description") ?? "").trim(),
      stock,
      boolFromForm(formData, "featured"),
      boolFromForm(formData, "bestSeller"),
      boolFromForm(formData, "isBestSeller"),
      boolFromForm(formData, "isNew"),
      boolFromForm(formData, "isActive"),
    ];

    if (id) {
      await query(
        `
          update products
          set
            slug = $1,
            name = $2,
            category_id = $3,
            price = $4,
            old_price = $5,
            image_url = $6,
            description = $7,
            stock = $8,
            featured = $9,
            best_seller = $10,
            is_best_seller = $11,
            is_new = $12,
            is_active = $13,
            updated_at = now()
          where id = $14
        `,
        [...values, Number(id)],
      );
    } else {
      await query(
        `
          insert into products (
            slug,
            name,
            category_id,
            price,
            old_price,
            image_url,
            description,
            stock,
            featured,
            best_seller,
            is_best_seller,
            is_new,
            is_active
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `,
        values,
      );
    }

    revalidatePath("/");
    revalidatePath("/dashboard/products");
  } catch (error) {
    const userMsg = sanitizeUserError(error);
    redirect(withNotice(returnTo, "error", userMsg));
  }

  redirect(withNotice(returnTo, "success", "تم حفظ المنتج بنجاح."));
};

export const deactivateProduct = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/products");

  try {
    await requireAdmin();
    requireDatabase();

    const id = numberFromForm(formData.get("id"));
    if (!id || id < 1) {
      throw new Error("معرّف المنتج غير صحيح.");
    }

    await query("update products set is_active = false, updated_at = now() where id = $1", [id]);
    revalidatePath("/");
    revalidatePath("/dashboard/products");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم إلغاء تفعيل المنتج."));
};

export const deactivateCategory = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/categories");

  try {
    await requireAdmin();
    requireDatabase();

    const id = numberFromForm(formData.get("id"));
    if (!id || id < 1) {
      throw new Error("معرّف الفئة غير صحيح.");
    }

    await query("update categories set is_active = false, updated_at = now() where id = $1", [id]);
    revalidatePath("/");
    revalidatePath("/dashboard/categories");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم إلغاء تفعيل الفئة."));
};

export const saveShippingGovernorate = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/shipping");

  try {
    await requireAdmin();
    requireDatabase();

    const id = String(formData.get("id") ?? "");
    const inputSlug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const deliveryFee = Number(formData.get("deliveryFee") ?? 0) || 0;
    const sortOrder = numberFromForm(formData.get("sortOrder")) ?? 0;
    const isActive = boolFromForm(formData, "isActive");

    if (!name) throw new Error("اسم المحافظة مطلوب.");

    // Process slug: normalize, auto-generate if empty, ensure uniqueness
    const slug = await processSlug(inputSlug, "shipping_governorates", name, id || undefined);

    if (deliveryFee < 0) throw new Error("سعر التوصيل يجب أن يكون رقمًا أكبر من أو يساوي صفر.");

    if (id) {
      await query(
        `update shipping_governorates set name = $1, slug = $2, delivery_fee = $3, is_active = $4, sort_order = $5, updated_at = now() where id = $6`,
        [name, slug, deliveryFee, isActive, sortOrder, id],
      );
    } else {
      await query(
        `insert into shipping_governorates (slug, name, delivery_fee, is_active, sort_order) values ($1,$2,$3,$4,$5)`,
        [slug, name, deliveryFee, isActive, sortOrder],
      );
    }

    revalidatePath("/dashboard/shipping");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم حفظ المحافظة بنجاح."));
};

export const deactivateShippingGovernorate = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/shipping");

  try {
    await requireAdmin();
    requireDatabase();

    const id = String(formData.get("id") ?? "");
    if (!id) {
      throw new Error("معرّف المحافظة غير صحيح.");
    }

    // toggle active state (UUID)
    await query("update shipping_governorates set is_active = not is_active, updated_at = now() where id = $1", [id]);
    revalidatePath("/dashboard/shipping");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم تحديث حالة المحافظة."));
};

export const updateOrderStatus = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard");

  try {
    await requireAdmin();
    requireDatabase();

    const status = String(formData.get("status") ?? "");
    const id = numberFromForm(formData.get("id"));

    if (!allowedOrderStatuses.includes(status as OrderStatus)) {
      throw new Error("حالة الطلب غير صحيحة.");
    }
    if (!id || id < 1) {
      throw new Error("معرّف الطلب غير صحيح.");
    }

    await query("update orders set status = $1, updated_at = now() where id = $2", [
      status,
      id,
    ]);
    revalidatePath("/dashboard");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم تحديث حالة الطلب."));
};

export const saveStoreSettings = async (formData: FormData) => {
  const returnTo = "/dashboard/settings";

  try {
    await requireAdmin();
    requireDatabase();

    const uploadedLogo = formData.get("storeLogoFile");
    let storeLogoUrl = textFromForm(formData, "storeLogoUrl");
    if (isUploadedImageFile(uploadedLogo)) {
      storeLogoUrl = await uploadProductImage(uploadedLogo);
    }

    const settings: StoreSettings = {
      storeName: textFromForm(formData, "storeName"),
      storeDescription: textFromForm(formData, "storeDescription"),
      storeLogoUrl: storeLogoUrl || defaultStoreSettings.storeLogoUrl,
      whatsappNumber: normalizeWhatsAppNumber(textFromForm(formData, "whatsappNumber")),
      phoneNumber: textFromForm(formData, "phoneNumber"),
      email: textFromForm(formData, "email").toLowerCase(),
      location: textFromForm(formData, "location"),
      address: textFromForm(formData, "address"),
      termsUrl: textFromForm(formData, "termsUrl") || defaultStoreSettings.termsUrl,
      privacyUrl: textFromForm(formData, "privacyUrl") || defaultStoreSettings.privacyUrl,
      facebookUrl: textFromForm(formData, "facebookUrl"),
      instagramUrl: textFromForm(formData, "instagramUrl"),
      tiktokUrl: textFromForm(formData, "tiktokUrl"),
    };

    if (!settings.storeName) throw new Error("اسم المتجر مطلوب.");
    if (settings.whatsappNumber.length < 10) throw new Error("رقم واتساب مطلوب ويجب أن يكون صحيحًا مع كود الدولة.");
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      throw new Error("البريد الإلكتروني غير صحيح.");
    }
    validateOptionalUrl(settings.storeLogoUrl, "رابط الشعار", settings.storeLogoUrl.startsWith("/"));
    validateOptionalUrl(settings.termsUrl, "رابط الشروط", true);
    validateOptionalUrl(settings.privacyUrl, "رابط الخصوصية", true);
    validateOptionalUrl(settings.facebookUrl, "رابط فيسبوك");
    validateOptionalUrl(settings.instagramUrl, "رابط إنستجرام");
    validateOptionalUrl(settings.tiktokUrl, "رابط تيك توك");

    const entries = storeSettingEntries(settings);
    await query(
      `
        insert into store_settings (key, value, updated_at)
        select entry.key, entry.value, now()
        from unnest($1::text[], $2::text[]) as entry(key, value)
        on conflict (key) do update set value = excluded.value, updated_at = now()
      `,
      [entries.map(([key]) => key), entries.map(([, value]) => value)],
    );

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/settings");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم حفظ إعدادات المتجر بنجاح."));
};
