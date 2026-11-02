# React/Vite Frontend Integration

The backend was designed around the H&H ecommerce v7 storefront structure.

## 1. Frontend environment

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## 2. Replace local dummy products

Current frontend dummy product arrays can be replaced with:

```text
GET /catalog/products
GET /catalog/products/:slug
GET /catalog/categories
```

Backend product objects expose category, subcategory, variants and image arrays.

## 3. Authentication

Login/register response returns:

```json
{
  "data": {
    "user": {},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Send access token:

```http
Authorization: Bearer ACCESS_TOKEN
```

When access token expires, call `POST /auth/refresh`, replace both tokens, then retry the failed request.

## 4. Cart

For logged-in users, replace `localStorage` cart logic with:

```text
GET /cart
POST /cart/items
PATCH /cart/items/:itemId
DELETE /cart/items/:itemId
```

Before displaying the final checkout amount, call:

```text
POST /cart/quote
```

Do not calculate the authoritative total only in the browser.

## 5. Checkout

The frontend currently shows card/PayPal/Klarna demo choices. For this backend version, update checkout UI to show only:

```text
Cash on Delivery
```

Place order:

```http
POST /orders
```

```json
{
  "addressId": 1,
  "shippingMethod": "STANDARD",
  "paymentMethod": "COD",
  "couponCode": "HH10",
  "customerNote": "Optional note"
}
```

Or pass a complete `shippingAddress` object instead of `addressId`.

## 6. Account pages

- Profile -> `/users/me`
- Addresses -> `/users/addresses`
- Wishlist -> `/users/wishlist`
- Orders -> `/orders`
- Order detail -> `/orders/:id`
- Track order -> `/orders/track`

## 7. Admin frontend

A future admin React app can use the same login endpoint. Only a token whose user role is `SUPERADMIN` can access `/admin/*` routes.

Suggested admin modules:

- Dashboard
- Categories
- Subcategories
- Products
- Product variants
- Inventory
- Customers
- Orders
- Coupons
- Banners
- Reviews
- Contact messages
- Newsletter subscribers
- Settings
- Reports
- Admin activity log

## 8. Image handling

Upload image:

```http
POST /admin/uploads/images
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
image=<file>
```

Use returned URL in `POST /admin/products/:productId/images`.
