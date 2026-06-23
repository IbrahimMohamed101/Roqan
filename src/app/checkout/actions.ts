"use server";

import { createOrder, buildWhatsAppOrderMessage } from "@/lib/orders";
import { createWhatsAppUrl } from "@/lib/storeConfig";
import { getStoreSettings } from "@/lib/storeSettings";
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
    const [order, settings] = await Promise.all([createOrder(payload), getStoreSettings()]);
    return {
      ok: true,
      orderId: order.publicId,
      whatsappUrl: createWhatsAppUrl(
        buildWhatsAppOrderMessage(order, settings.storeName),
        settings.whatsappNumber,
      ),
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
