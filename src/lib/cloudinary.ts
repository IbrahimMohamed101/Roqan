import "server-only";

import { createHash } from "crypto";

const CLOUDINARY_UPLOAD_FOLDER = "rooqan/products";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("إعدادات Cloudinary غير مكتملة على الخادم.");
  }

  return { cloudName, apiKey, apiSecret };
};

const signUploadParams = (params: Record<string, string>, apiSecret: string) => {
  const payload = Object.entries(params)
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
};

export const uploadProductImage = async (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("يُسمح برفع ملفات الصور فقط.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = {
    folder: CLOUDINARY_UPLOAD_FOLDER,
    timestamp,
  };
  const signature = signUploadParams(params, apiSecret);
  const uploadFormData = new FormData();

  uploadFormData.append("file", file);
  uploadFormData.append("api_key", apiKey);
  uploadFormData.append("timestamp", timestamp);
  uploadFormData.append("folder", CLOUDINARY_UPLOAD_FOLDER);
  uploadFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadFormData,
    },
  );
  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "تعذر رفع الصورة إلى Cloudinary.");
  }

  return result.secure_url;
};

export const isUploadedImageFile = (value: FormDataEntryValue | null): value is File =>
  value instanceof File && value.size > 0;
