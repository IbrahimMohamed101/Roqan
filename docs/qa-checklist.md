# Manual QA Checklist

Run this checklist on the final deployment URL and, when useful, locally.

## Public Store

- [ ] Home page renders hero, categories, product sections, and WhatsApp CTA.
- [ ] Header navigation works on desktop and mobile.
- [ ] Footer links work, including policy pages.
- [ ] Categories page lists active categories.
- [ ] Category detail page lists products for that category.
- [ ] Product listing cards show image, price, stock state, and add-to-cart button.
- [ ] Product detail page shows image, price, stock state, related products, and WhatsApp action.
- [ ] Search returns matching products by name/category/description.
- [ ] Search empty state appears for unmatched terms.
- [ ] Offers page lists discounted products or a useful empty state.
- [ ] Contact page shows correct WhatsApp, email, and address.

## Cart

- [ ] Add product to cart.
- [ ] Increase quantity.
- [ ] Decrease quantity.
- [ ] Remove product.
- [ ] Clear cart.
- [ ] Quantity does not exceed current stock.
- [ ] Out-of-stock product cannot be added.
- [ ] Cart summary subtotal, shipping, and total look correct.

## Checkout

- [ ] Checkout page uses RTL layout correctly.
- [ ] Notice bar appears: `متاح المعاينة قبل الاستلام`.
- [ ] Contact step shows name, phone, and alternate phone fields.
- [ ] Shipping step shows governorate dropdown.
- [ ] Detailed address is required.
- [ ] Notes field is optional.
- [ ] Payment step shows cash on delivery only.
- [ ] Cart summary shows product thumbnail, quantity, price, subtotal, shipping, and total.
- [ ] Confirm button is disabled when cart is empty.
- [ ] Missing name shows Arabic validation error.
- [ ] Missing phone shows Arabic validation error.
- [ ] Missing governorate shows Arabic validation error.
- [ ] Missing address shows Arabic validation error.
- [ ] Insufficient stock shows Arabic error from server.
- [ ] Successful checkout redirects to order confirmation.

## Order Confirmation And WhatsApp

- [ ] Confirmation page shows order code.
- [ ] Confirmation page shows order summary.
- [ ] WhatsApp button opens a prefilled message.
- [ ] Fallback WhatsApp message works if session storage is unavailable.

## Dashboard Auth

- [ ] Admin login works with valid credentials.
- [ ] Invalid login shows Arabic error.
- [ ] Protected dashboard redirects unauthenticated users.
- [ ] Logout works.

## Orders Dashboard

- [ ] New checkout appears in orders dashboard.
- [ ] Order code is visible.
- [ ] Customer name is visible.
- [ ] Phone is visible.
- [ ] Alternate phone is visible when provided.
- [ ] Address is visible.
- [ ] Notes are visible when provided.
- [ ] Items and quantities are visible.
- [ ] Subtotal, shipping, and total are visible.
- [ ] Status badge is visible.
- [ ] Created date is visible.
- [ ] Search by order code works.
- [ ] Search by customer name works.
- [ ] Search by customer phone works.
- [ ] Status filter works.
- [ ] Pagination works when enough orders exist.
- [ ] Status update works and shows success feedback.
- [ ] WhatsApp contact button opens order details.

## Products Dashboard

- [ ] Product search by name works.
- [ ] Product search by slug works.
- [ ] Category filter works.
- [ ] Active/inactive filter works.
- [ ] Stock filter works.
- [ ] Product image thumbnail appears.
- [ ] Current stock appears.
- [ ] Active/inactive badge appears.
- [ ] Product create works.
- [ ] Product edit works.
- [ ] Product deactivate asks for confirmation.
- [ ] Product deactivate works.
- [ ] Cloudinary image upload works.
- [ ] External HTTPS image URL fallback works.
- [ ] Product form errors show useful Arabic feedback.

## Categories Dashboard

- [ ] Category search by name works.
- [ ] Category search by slug works.
- [ ] Product count appears.
- [ ] Active/inactive badge appears.
- [ ] Category create works.
- [ ] Category edit works.
- [ ] Category deactivate asks for confirmation.
- [ ] Category deactivate works.

## Mobile And Responsive

- [ ] Home page is readable on mobile.
- [ ] Product cards fit on mobile.
- [ ] Cart page is usable on mobile.
- [ ] Checkout form and summary stack cleanly on mobile.
- [ ] Dashboard navigation works on mobile.
- [ ] Dashboard forms are usable on mobile.

## SEO And Policies

- [ ] `/robots.txt` loads.
- [ ] `/sitemap.xml` loads.
- [ ] Product detail pages include valid basic structured data.
- [ ] Shipping policy page loads.
- [ ] Return/exchange policy page loads.
- [ ] Privacy policy page loads.
- [ ] Terms page loads.

