# H&H Hair & Cosmetics Backend API v1

Node.js + Express.js + MySQL + Sequelize ORM backend for the H&H Hair & Cosmetics React/Vite ecommerce storefront.

## Roles

Only two roles exist:

- `USER` — customer storefront account. Can manage profile/addresses, wishlist, cart, COD checkout, orders, returns and reviews.
- `SUPERADMIN` — full administration access to customers, catalogue, categories, subcategories, products, variants, images, inventory, orders, coupons, banners, settings, reviews, support messages, subscribers and reports.

Public registration can only create `USER`. A user cannot promote themselves to `SUPERADMIN` through the API.

## Payment

The backend accepts **Cash on Delivery only**. The order API validates `paymentMethod: "COD"`. No card, PayPal, Klarna or online-payment secret is stored or processed.

## Requirements

- Node.js 20+
- MySQL 8+
- npm

## Quick start with Sequelize seed

```bash
cp .env.example .env
```

Create the empty database:

```sql
CREATE DATABASE hh_cosmetics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update DB credentials and JWT secrets in `.env`, then:

```bash
npm install
npm run db:reset
npm run dev
```

`db:reset` is blocked when `NODE_ENV=production`.

API base URL:

```text
http://localhost:4000/api/v1
```

Health endpoint:

```text
GET /api/v1/health
```

## Alternative: import complete MySQL SQL file

A complete schema + dummy-data import is included:

```text
database/hh_cosmetics_full_import.sql
```

Windows/MySQL example:

```bash
mysql -u root -p < database/hh_cosmetics_full_import.sql
```

Then configure `.env` and run:

```bash
npm install
npm run dev
```

Do **not** run the destructive SQL import on a production database containing real data.

## Demo accounts

### Superadmin

```text
Email: admin@hhcosmetics.co.uk
Password: Admin@12345
```

### Customer

```text
Email: customer@example.com
Password: User@12345
```

Change these credentials before any real deployment.

## Postman

Import both files from the `postman/` directory:

```text
HH-Hair-Cosmetics-API-v1.postman_collection.json
HH-Hair-Cosmetics-Local.postman_environment.json
```

The collection contains customer and superadmin requests. The customer/admin login requests automatically save access/refresh tokens to collection variables.

## Main ecommerce modules

- Authentication: register, login, access/refresh token rotation, logout, forgot/reset password
- Customer profile and password change
- Multiple saved UK delivery addresses and default address
- Public category/subcategory catalogue
- Product listing, search, filters, sorting and pagination
- Product details, variants and multiple images
- Inventory/stock control
- Wishlist
- Persistent customer cart
- Backend-authoritative checkout quote
- Coupons (`PERCENT` and `FIXED`)
- Standard/Express delivery calculation
- Cash on Delivery checkout
- Order history, detail, public tracking, cancellation and return request
- Order status history
- Verified-purchase review support and superadmin moderation
- Home banners / simple CMS settings
- Contact form and newsletter subscriptions
- Admin dashboard and activity log
- Customer management/blocking
- Admin catalogue CRUD
- Product variant CRUD
- Product image records + local image-upload endpoint
- Inventory adjustments and inventory logs
- Order processing with controlled status transitions
- Coupon/banner/settings management
- Sales, top-product and inventory reports

## Order status flow

Normal flow:

```text
PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
```

Customer cancellation is allowed while the order is `PENDING` or `CONFIRMED`. Admin cancellation restores reserved stock. A delivered customer order can move to `RETURN_REQUESTED`; when the superadmin marks it `RETURNED`, stock is restored and payment status is recorded as `REFUNDED`.

## COD totals

Totals are calculated on the backend, not trusted from the frontend:

```text
subtotal
- coupon discount
+ delivery fee
+ COD fee
= total amount
```

Defaults match the H&H frontend demo:

```text
Free standard delivery: £45+
Standard delivery: £4.95
Express delivery: £7.95
COD fee: £0.00
Currency: GBP
```

These values are seeded into the `settings` table and can be changed through the superadmin settings API. `.env` values are used as fallbacks when a setting is missing.

## Product images

For quick development, dummy seed data uses `placehold.co` image URLs. Superadmin can either store an external image URL in a product-image record or upload an image with:

```text
POST /api/v1/admin/uploads/images
multipart/form-data field: image
```

Uploaded files are served from `/uploads/<filename>`.

For production, replace local uploads with S3/CloudFront or another managed object store.

## API response shape

Successful response:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": []
}
```

## Security included

- Helmet security headers
- CORS allow-list
- Global and auth rate limiting
- JWT access + refresh tokens
- Refresh-token rotation and revocation
- Password hashing with Node.js `crypto.scrypt`
- SHA-256 hashed refresh/reset tokens in MySQL
- Joi request validation
- Superadmin role middleware
- Transactional COD order creation
- Row locking and stock re-check during order creation
- Backend price/discount/delivery calculations
- Upload file type/size limits
- Soft deletes for catalogue records
- Admin activity logging

## Production notes

Before production:

1. Use long random `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values.
2. Remove/change demo credentials and data.
3. Set `NODE_ENV=production`.
4. Restrict `FRONTEND_URL` to your real frontend domains.
5. Use HTTPS behind Nginx/ALB/Cloudflare.
6. Use migrations/change-management instead of destructive resets.
7. Configure transactional email for password-reset tokens.
8. Move image storage to S3 or equivalent.
9. Set up database backups and monitoring.

See `docs/API_ENDPOINTS.md` for endpoint reference and `docs/FRONTEND_INTEGRATION.md` for the React/Vite integration flow.
