"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingText = "جار الحفظ...",
  className = "btn-primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingText : children}
    </button>
  );
}
