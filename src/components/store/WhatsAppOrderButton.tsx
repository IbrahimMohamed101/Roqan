"use client";

import { useEffect, useState } from "react";

type WhatsAppOrderButtonProps = {
  orderId: string;
  fallbackUrl: string;
};

export function WhatsAppOrderButton({
  orderId,
  fallbackUrl,
}: WhatsAppOrderButtonProps) {
  const [href, setHref] = useState(fallbackUrl);

  useEffect(() => {
    const storedUrl = window.sessionStorage.getItem(`rooqan-whatsapp-${orderId}`);
    if (storedUrl) {
      setHref(storedUrl);
    }
  }, [orderId]);

  return (
    <a className="btn-primary" href={href} rel="noreferrer" target="_blank">
      إرسال ملخص واتساب
    </a>
  );
}
