"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isUploadedImageFile, uploadProductImage } from "@/lib/cloudinary";
import { hasDatabaseUrl, query } from "@/lib/db";
import type { OrderStatus } from "@/types/order";

const boolFromForm = (formData: FormData, key: string) => formData.get(key) === "on";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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
  /^\/dashboard(?:\/(?:products|categories))?(?:\?[A-Za-z0-9%=&_.~+\-]*)?$/;

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

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "تعذر تنفيذ الإجراء الآن.";

const validateSlug = (slug: string) => {
  if (!slug || !slugPattern.test(slug)) {
    throw new Error("الـ slug مطلوب ويجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط.");
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

export const saveCategory = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/categories");

  try {
    await requireAdmin();
    requireDatabase();

    const id = String(formData.get("id") ?? "");
    const slug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      throw new Error("اسم الفئة مطلوب.");
    }
    validateSlug(slug);

    const uploadedImage = formData.get("imageFile");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (isUploadedImageFile(uploadedImage)) {
      imageUrl = await uploadProductImage(uploadedImage);
    }

    if (imageUrl) validateHttpsUrl(imageUrl);

    const values = [
      slug,
      name,
      String(formData.get("icon") ?? "").trim() || "•",
      String(formData.get("description") ?? "").trim(),
      Number(formData.get("sortOrder") ?? 0),
      boolFromForm(formData, "isActive"),
      imageUrl || null,
    ];

    if (id) {
      await query(
        `
          update categories
          set slug = $1, name = $2, icon = $3, description = $4, sort_order = $5, is_active = $6, image_url = $7, updated_at = now()
          where id = $8
        `,
        [...values, Number(id)],
      );
    } else {
      await query(
        `
          insert into categories (slug, name, icon, description, sort_order, is_active, image_url)
          values ($1, $2, $3, $4, $5, $6, $7)
        `,
        values,
      );
    }

    revalidatePath("/");
    revalidatePath("/dashboard/categories");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
  }

  redirect(withNotice(returnTo, "success", "تم حفظ الفئة بنجاح."));
};

export const saveProduct = async (formData: FormData) => {
  const returnTo = getReturnTo(formData, "/dashboard/products");

  try {
    await requireAdmin();
    requireDatabase();

    const id = String(formData.get("id") ?? "");
    const slug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const categoryId = numberFromForm(formData.get("categoryId"));
    const price = numberFromForm(formData.get("price"));
    const stock = numberFromForm(formData.get("stock") ?? 0);
    const uploadedImage = formData.get("imageFile");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (!name) {
      throw new Error("اسم المنتج مطلوب.");
    }
    validateSlug(slug);
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
            is_new = $11,
            is_active = $12,
            updated_at = now()
          where id = $13
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
            is_new,
            is_active
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
        values,
      );
    }

    revalidatePath("/");
    revalidatePath("/dashboard/products");
  } catch (error) {
    redirect(withNotice(returnTo, "error", getErrorMessage(error)));
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
