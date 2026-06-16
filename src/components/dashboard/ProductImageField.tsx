"use client";

import { ChangeEvent, useEffect, useState } from "react";

type ProductImageFieldProps = {
  defaultValue?: string;
  inputClass: string;
};

export function ProductImageField({
  defaultValue = "",
  inputClass,
}: ProductImageFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [previewUrl, setPreviewUrl] = useState(defaultValue);
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(
    () => () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    },
    [objectUrl],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl("");
    }

    if (!file) {
      setPreviewUrl(imageUrl);
      return;
    }

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
  };

  return (
    <div className="grid gap-3 lg:col-span-2">
      <input
        className={inputClass}
        name="imageUrl"
        onChange={handleUrlChange}
        placeholder="رابط الصورة أو ارفع صورة"
        type="url"
        value={imageUrl}
      />
      <input
        accept="image/*"
        className={inputClass}
        name="imageFile"
        onChange={handleFileChange}
        type="file"
      />
      {previewUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--soft-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="معاينة صورة المنتج"
            className="h-full w-full object-cover"
            src={previewUrl}
          />
        </div>
      ) : null}
    </div>
  );
}
