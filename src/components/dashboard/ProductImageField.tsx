"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Notice } from "@/components/dashboard/Notice";

type ProductImageFieldProps = {
  defaultValue?: string;
  inputClass: string;
  // optional: field names for forms
  urlName?: string;
  fileName?: string;
  previewAlt?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;

export function ProductImageField({
  defaultValue = "",
  inputClass,
  urlName = "imageUrl",
  fileName = "imageFile",
  previewAlt = "معاينة صورة المنتج",
}: ProductImageFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [previewUrl, setPreviewUrl] = useState(defaultValue);
  const [objectUrl, setObjectUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    },
    [objectUrl],
  );

  const validateFile = (file: File) => {
    if (!file.type || !file.type.startsWith("image/")) {
      return "برجاء رفع ملف صورة صالح.";
    }
    if (file.size > MAX_BYTES) {
      return "حجم الصورة كبير. برجاء رفع صورة أقل من 5 ميجابايت.";
    }
    return null;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl("");
    }

    if (!file) {
      setPreviewUrl(imageUrl);
      setError(null);
      return;
    }

    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      // clear invalid file selection
      event.currentTarget.value = "";
      setPreviewUrl(imageUrl);
      return;
    }

    setError(null);
    const nextObjectUrl = URL.createObjectURL(file);
    setObjectUrl(nextObjectUrl);
    setPreviewUrl(nextObjectUrl);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextImageUrl = event.target.value;
    setImageUrl(nextImageUrl);

    if (!objectUrl) {
      setPreviewUrl(nextImageUrl);
    }
    setError(null);
  };

  return (
    <div className="grid gap-3 lg:col-span-2">
      <input
        className={inputClass}
        name={urlName}
        onChange={handleUrlChange}
        placeholder="رابط الصورة أو ارفع صورة"
        type="url"
        value={imageUrl}
      />
      <input
        accept="image/*"
        className={inputClass}
        name={fileName}
        onChange={handleFileChange}
        type="file"
      />
      {error ? <Notice message={error} type="error" /> : null}
      {previewUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--soft-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={previewAlt} className="h-full w-full object-cover" src={previewUrl} />
        </div>
      ) : null}
    </div>
  );
}
