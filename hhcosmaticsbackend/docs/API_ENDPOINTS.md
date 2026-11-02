# H&H API Endpoint Reference

Base URL: `/api/v1`

`USER` means customer Bearer token is required. `SUPERADMIN` means a Bearer token with role `SUPERADMIN` is required.

## Health and authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API + DB health |
| POST | `/auth/register` | Public | Create customer account |
| POST | `/auth/login` | Public | Customer or superadmin login |
| POST | `/auth/refresh` | Public | Rotate refresh/access token |
| POST | `/auth/logout` | Public | Revoke refresh token |
| POST | `/auth/forgot-password` | Public | Create reset token |
| POST | `/auth/reset-password` | Public | Reset password |

## Public storefront

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/catalog/categories` | Active categories + subcategories |
| GET | `/catalog/categories/:slug` | Category detail |
| GET | `/catalog/products` | Product listing/search/filter/sort/pagination |
| GET | `/catalog/products/:slugOrId` | Product detail + variants/images |
| GET | `/catalog/products/:slugOrId/reviews` | Approved product reviews |
| GET | `/catalog/banners` | Active banners |
| GET | `/catalog/settings` | Public settings |
| POST | `/contact` | Contact form |
| POST | `/newsletter/subscribe` | Subscribe email |
| POST | `/newsletter/unsubscribe` | Unsubscribe email |
| POST | `/orders/track` | Track by order number + email |

Product list query examples: `search`, `category`, `subcategory`, `minPrice`, `maxPrice`, `featured=true`, `new=true`, `sort=newest|price_asc|price_desc|rating|name`, `page`, `limit`.

## Customer account

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/users/me` | Profile + addresses |
| PATCH | `/users/me` | Update profile |
| POST | `/users/change-password` | Change password |
| GET | `/users/addresses` | Saved addresses |
| POST | `/users/addresses` | Add address |
| PATCH | `/users/addresses/:id` | Update address |
| DELETE | `/users/addresses/:id` | Delete address |
| PATCH | `/users/addresses/:id/default` | Set default |
| GET | `/users/wishlist` | Wishlist products |
| POST | `/users/wishlist/:productId` | Add wishlist |
| DELETE | `/users/wishlist/:productId` | Remove wishlist |

## Cart and COD checkout

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cart` | Cart and totals |
| POST | `/cart/items` | Add product/variant |
| PATCH | `/cart/items/:itemId` | Quantity |
| DELETE | `/cart/items/:itemId` | Remove item |
| DELETE | `/cart` | Clear cart |
| POST | `/cart/quote` | Validate stock, coupon, delivery and total |
| POST | `/orders` | Place COD order |

Order payment method accepted by the API: `COD` only.

## Customer orders/reviews

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/orders` | Customer order list |
| GET | `/orders/:id` | Customer order detail |
| POST | `/orders/:id/cancel` | Cancel eligible order |
| POST | `/orders/:id/return-request` | Request return for delivered order |
| POST | `/reviews/products/:productId` | Submit review |
| PATCH | `/reviews/:id` | Edit own review |
| DELETE | `/reviews/:id` | Delete own review |

## Superadmin dashboard/users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/dashboard` | Store KPIs |
| GET | `/admin/activity` | Admin activity log |
| GET | `/admin/users` | Customer list/search/filter |
| GET | `/admin/users/:id` | Customer detail + addresses/orders |
| PATCH | `/admin/users/:id` | Edit customer profile/status |
| PATCH | `/admin/users/:id/status` | ACTIVE/BLOCKED |

## Superadmin catalogue

Categories:

- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `DELETE /admin/categories/:id`
- `POST /admin/categories/:id/restore`

Subcategories:

- `GET /admin/subcategories`
- `POST /admin/subcategories`
- `PATCH /admin/subcategories/:id`
- `DELETE /admin/subcategories/:id`
- `POST /admin/subcategories/:id/restore`

Products:

- `GET /admin/products`
- `GET /admin/products/:id`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/products/:id/restore`

Variants:

- `POST /admin/products/:productId/variants`
- `PATCH /admin/products/:productId/variants/:variantId`
- `DELETE /admin/products/:productId/variants/:variantId`
- `POST /admin/products/:productId/variants/:variantId/restore`

Images/inventory:

- `POST /admin/products/:productId/images`
- `PATCH /admin/products/:productId/images/:imageId`
- `DELETE /admin/products/:productId/images/:imageId`
- `PUT /admin/products/:productId/inventory`
- `PUT /admin/products/:productId/variants/:variantId/inventory`
- `POST /admin/uploads/images` (multipart `image`)

## Superadmin orders

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/orders` | All orders/filter/search |
| GET | `/admin/orders/:id` | Full order detail |
| PATCH | `/admin/orders/:id/status` | Status/payment/tracking workflow |
| PATCH | `/admin/orders/:id/note` | Internal note |

## Superadmin promotions/CMS/support

- `GET/POST /admin/coupons`
- `PATCH/DELETE /admin/coupons/:id`
- `POST /admin/coupons/:id/restore`
- `GET/POST /admin/banners`
- `PATCH/DELETE /admin/banners/:id`
- `POST /admin/banners/:id/restore`
- `GET /admin/settings`
- `PUT /admin/settings/:key`
- `GET /admin/contact-messages`
- `PATCH /admin/contact-messages/:id`
- `GET /admin/newsletter-subscribers`

## Superadmin reviews/reports

- `GET /admin/reviews`
- `PATCH /admin/reviews/:id/status`
- `DELETE /admin/reviews/:id`
- `GET /admin/reports/sales`
- `GET /admin/reports/inventory`
- `GET /admin/reports/inventory-logs`
