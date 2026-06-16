import "server-only";

import { randomUUID } from "crypto";
import type { CheckoutPayload, OrderRecord, OrderStatus } from "@/types/order";
import { hasDatabaseUrl, getPool, query } from "@/lib/db";
import { getProducts } from "@/lib/catalog";
import { SHIPPING_FEE } from "@/lib/storeConfig";

type OrderRow = {
  id: number;
  public_id: string;
  customer_name: string;
  customer_phone: string;
  alternate_phone: string | null;
  governorate: string;
  city: string | null;
  address: string;
  notes: string | null;
  subtotal: string;
  shipping: string;
  total: string;
  status: OrderStatus;
  created_at: Date;
};

type OrderItemRow = {
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
};

type OrderWithItemsRow = OrderRow & {
  items: OrderItemRow[] | string | null;
  total_count: string;
};

type LockedProductRow = {
  id: number;
  slug: string;
  name: string;
  price: string;
  stock: number;
  is_active: boolean;
};

const egyptianMobilePattern = /^01[0125][0-9]{8}$/;

const createPublicOrderId = () =>
  `RQ-${randomUUID().replaceAll("-", "").toUpperCase()}`;

const mapOrder = (row: OrderRow, items: OrderItemRow[]): OrderRecord => ({
  id: row.id,
  publicId: row.public_id,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  alternatePhone: row.alternate_phone ?? undefined,
  governorate: row.governorate,
  city: row.city ?? undefined,
  address: row.address,
  notes: row.notes ?? undefined,
  subtotal: Number(row.subtotal),
  shipping: Number(row.shipping),
  total: Number(row.total),
  status: row.status,
  createdAt: row.created_at.toISOString(),
  items: items.map((item) => ({
    productSlug: item.product_slug,
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: Number(item.unit_price),
    totalPrice: Number(item.total_price),
  })),
});

const parseOrderItems = (items: OrderWithItemsRow["items"]) => {
  if (!items) {
    return [] as OrderItemRow[];
  }

  if (typeof items === "string") {
    return JSON.parse(items) as OrderItemRow[];
  }

  return items;
};

export const validateCheckoutPayload = (payload: CheckoutPayload) => {
  const name = typeof payload.name === "string" ? payload.name : "";
  const phone = typeof payload.phone === "string" ? payload.phone : "";
  const governorate =
    typeof payload.governorate === "string" ? payload.governorate : "";
  const address = typeof payload.address === "string" ? payload.address : "";
  const items = Array.isArray(payload.items) ? payload.items : [];
  const required = [
    name,
    phone,
    governorate,
    address,
  ];

  if (required.some((value) => value.trim().length < 2)) {
    return "من فضلك أكمل الاسم، رقم الهاتف، المحافظة، والعنوان التفصيلي.";
  }

  if (!egyptianMobilePattern.test(phone.trim())) {
    return "من فضلك اكتب رقم موبايل مصري صحيح يبدأ بـ 01.";
  }

  if (!items.length) {
    return "السلة فارغة. أضف منتجًا قبل إرسال الطلب.";
  }

  if (
    items.some(
      (item) =>
        typeof item?.slug !== "string" ||
        !item.slug ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99,
    )
  ) {
    return "بيانات السلة غير صحيحة. حدّث الصفحة وحاول مرة أخرى.";
  }

  return "";
};

const normalizeCheckoutItems = (payload: CheckoutPayload) => {
  const itemBySlug = new Map<string, number>();

  for (const item of payload.items) {
    itemBySlug.set(item.slug, (itemBySlug.get(item.slug) ?? 0) + item.quantity);
  }

  return Array.from(itemBySlug.entries())
    .sort(([firstSlug], [secondSlug]) => firstSlug.localeCompare(secondSlug))
    .map(([slug, quantity]) => ({
      slug,
      quantity,
    }));
};

export const buildWhatsAppOrderMessage = (order: OrderRecord) => {
  const items = order.items
    .map(
      (item) =>
        `- ${item.productName} × ${item.quantity} = ${item.totalPrice} جنيه`,
    )
    .join("\n");

  return [
    "مرحبًا روقان، أريد تأكيد هذا الطلب:",
    `رقم الطلب: ${order.publicId}`,
    `الاسم: ${order.customerName}`,
    `الهاتف: ${order.customerPhone}`,
    order.alternatePhone ? `هاتف إضافي: ${order.alternatePhone}` : "",
    `العنوان: ${order.governorate}${order.city ? ` - ${order.city}` : ""} - ${order.address}`,
    "المنتجات:",
    items,
    `الإجمالي: ${order.total} جنيه`,
    order.notes ? `ملاحظات: ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

export const createOrder = async (payload: CheckoutPayload) => {
  const validationError = validateCheckoutPayload(payload);
  if (validationError) {
    throw new Error(validationError);
  }

  const checkoutItems = normalizeCheckoutItems(payload);
  const publicId = createPublicOrderId();

  if (!hasDatabaseUrl()) {
    const products = await getProducts();
    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const normalizedItems = checkoutItems.map((item) => ({
      ...item,
      product: productBySlug.get(item.slug),
    }));

    const unavailableItem = normalizedItems.find(
      (item) =>
        !item.product ||
        item.product.isActive === false ||
        item.product.stock <= 0 ||
        item.quantity > item.product.stock,
    );

    if (unavailableItem) {
      const productName = unavailableItem.product?.name ?? unavailableItem.slug;
      throw new Error(`الكمية المطلوبة من "${productName}" غير متوفرة حاليا.`);
    }

    const subtotal = normalizedItems.reduce(
      (total, item) => total + (item.product?.price ?? 0) * item.quantity,
      0,
    );
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
    const total = subtotal + shipping;
    const mockOrder: OrderRecord = {
      id: Date.now(),
      publicId,
      customerName: payload.name.trim(),
      customerPhone: payload.phone.trim(),
      alternatePhone: payload.alternatePhone?.trim() || undefined,
      governorate: payload.governorate.trim(),
      city: payload.city?.trim() || undefined,
      address: payload.address.trim(),
      notes: payload.notes?.trim() || undefined,
      subtotal,
      shipping,
      total,
      status: "new",
      createdAt: new Date().toISOString(),
      items: normalizedItems.map((item) => ({
        productSlug: item.product?.slug ?? item.slug,
        productName: item.product?.name ?? item.slug,
        quantity: item.quantity,
        unitPrice: item.product?.price ?? 0,
        totalPrice: (item.product?.price ?? 0) * item.quantity,
      })),
    };

    return mockOrder;
  }

  const client = await getPool().connect();

  try {
    await client.query("begin");
    const lockedItems: Array<{
      product: LockedProductRow;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of checkoutItems) {
      const productResult = await client.query<LockedProductRow>(
        `
          select id, slug, name, price, stock, is_active
          from products
          where slug = $1
          for update
        `,
        [item.slug],
      );
      const product = productResult.rows[0];

      if (!product || !product.is_active) {
        throw new Error(`المنتج "${item.slug}" غير متوفر حاليا.`);
      }

      if (item.quantity > product.stock) {
        throw new Error(`الكمية المطلوبة من "${product.name}" غير متوفرة حاليا. المتاح الآن ${product.stock}.`);
      }

      await client.query(
        "update products set stock = stock - $1, updated_at = now() where id = $2",
        [item.quantity, product.id],
      );

      const unitPrice = Number(product.price);
      lockedItems.push({
        product,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      });
    }

    const subtotal = lockedItems.reduce((total, item) => total + item.totalPrice, 0);
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
    const total = subtotal + shipping;
    const orderResult = await client.query<OrderRow>(
      `
        insert into orders (
          public_id,
          customer_name,
          customer_phone,
          alternate_phone,
          governorate,
          city,
          address,
          notes,
          subtotal,
          shipping,
          total,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new')
        returning *
      `,
      [
        publicId,
        payload.name.trim(),
        payload.phone.trim(),
        payload.alternatePhone?.trim() || null,
        payload.governorate.trim(),
        payload.city?.trim() || null,
        payload.address.trim(),
        payload.notes?.trim() || null,
        subtotal,
        shipping,
        total,
      ],
    );

    const orderId = orderResult.rows[0].id;
    const itemRows: OrderItemRow[] = [];

    for (const item of lockedItems) {
      const itemResult = await client.query<OrderItemRow>(
        `
          insert into order_items (
            order_id,
            product_id,
            product_slug,
            product_name,
            quantity,
            unit_price,
            total_price
          )
          values ($1, $2, $3, $4, $5, $6, $7)
          returning product_slug, product_name, quantity, unit_price, total_price
        `,
        [
          orderId,
          item.product.id,
          item.product.slug,
          item.product.name,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ],
      );
      itemRows.push(itemResult.rows[0]);
    }

    await client.query("commit");
    return mapOrder(orderResult.rows[0], itemRows);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
};

export const getOrderByPublicId = async (publicId: string) => {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const orderResult = await query<OrderRow>(
    "select * from orders where public_id = $1",
    [publicId],
  );

  if (!orderResult.rows[0]) {
    return null;
  }

  const itemResult = await query<OrderItemRow>(
    `
      select product_slug, product_name, quantity, unit_price, total_price
      from order_items
      where order_id = $1
      order by id asc
    `,
    [orderResult.rows[0].id],
  );

  return mapOrder(orderResult.rows[0], itemResult.rows);
};

export type OrderListOptions = {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: OrderStatus | "all";
};

export const getOrders = async ({
  page = 1,
  pageSize = 20,
  query: searchTerm = "",
  status = "all",
}: OrderListOptions = {}) => {
  if (!hasDatabaseUrl()) {
    return {
      orders: [] as OrderRecord[],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }

  const normalizedPage = Math.max(Math.floor(page), 1);
  const normalizedPageSize = Math.min(Math.max(Math.floor(pageSize), 1), 50);
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const filters: string[] = [];
  const params: unknown[] = [];

  if (searchTerm.trim()) {
    params.push(`%${searchTerm.trim()}%`);
    filters.push(
      `(o.public_id ilike $${params.length} or o.customer_name ilike $${params.length} or o.customer_phone ilike $${params.length} or o.alternate_phone ilike $${params.length})`,
    );
  }

  if (status !== "all") {
    params.push(status);
    filters.push(`o.status = $${params.length}::order_status`);
  }

  const whereClause = filters.length ? `where ${filters.join(" and ")}` : "";
  params.push(normalizedPageSize);
  const limitParam = params.length;
  params.push(offset);
  const offsetParam = params.length;

  const orderResult = await query<OrderWithItemsRow>(
    `
      select
        o.*,
        count(*) over() as total_count,
        coalesce(
          json_agg(
            json_build_object(
              'product_slug', oi.product_slug,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total_price', oi.total_price
            )
            order by oi.id asc
          ) filter (where oi.id is not null),
          '[]'
        ) as items
      from orders o
      left join order_items oi on oi.order_id = o.id
      ${whereClause}
      group by o.id
      order by o.created_at desc
      limit $${limitParam} offset $${offsetParam}
    `,
    params,
  );

  const total = Number(orderResult.rows[0]?.total_count ?? 0);
  const orders = orderResult.rows.map((order) => mapOrder(order, parseOrderItems(order.items)));

  return {
    orders,
    total,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    totalPages: Math.max(Math.ceil(total / normalizedPageSize), 1),
  };
};
