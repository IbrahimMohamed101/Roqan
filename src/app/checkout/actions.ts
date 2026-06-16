"use server";

import { createOrder, buildWhatsAppOrderMessage } from "@/lib/orders";
import { createWhatsAppUrl } from "@/lib/storeConfig";
import type { CheckoutPayload } from "@/types/order";

type CheckoutResult =
  | {
      ok: true;
      orderId: string;
      whatsappUrl: string;
    }
  | {
      ok: false;
      error: string;
    };

export const submitCheckout = async (
  payload: CheckoutPayload,
): Promise<CheckoutResult> => {
  try {
    const order = await createOrder(payload);
    return {
      ok: true,
      orderId: order.publicId,
      whatsappUrl: createWhatsAppUrl(buildWhatsAppOrderMessage(order)),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "تعذر إرسال الطلب الآن. حاول مرة أخرى.",
    };
  }
};
