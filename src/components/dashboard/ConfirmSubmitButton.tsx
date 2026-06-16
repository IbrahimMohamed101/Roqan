"use client";

import { MouseEvent } from "react";
import { useFormStatus } from "react-dom";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  message: string;
  pendingText?: string;
  className?: string;
};

export function ConfirmSubmitButton({
  children,
  message,
  pendingText = "جار التنفيذ...",
  className = "btn-secondary",
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  return (
    <button className={className} disabled={pending} onClick={handleClick} type="submit">
      {pending ? pendingText : children}
    </button>
  );
}
