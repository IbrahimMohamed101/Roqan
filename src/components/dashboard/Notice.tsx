type NoticeProps = {
  message?: string;
  type?: "success" | "error";
};

export function Notice({ message, type = "success" }: NoticeProps) {
  if (!message) {
    return null;
  }

  const className =
    type === "error"
      ? "border-red-100 bg-red-50 text-[var(--danger)]"
      : "border-green-100 bg-green-50 text-[var(--success)]";

  return (
    <p className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-black ${className}`}>
      {message}
    </p>
  );
}
