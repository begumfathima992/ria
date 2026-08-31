# Customer API integration map

Base URL: `VITE_API_BASE_URL` (default `http://localhost:4000/api/v1`).

| Backend endpoint | Frontend service / UI |
|---|---|
| POST `/auth/register` | `authService.register` → Register |
| POST `/auth/login` | `authService.login` → Login |
| POST `/auth/refresh` | Axios response interceptor / `authService.refresh` |
| POST `/auth/logout` | `authService.logout` → account/header logout |
| POST `/auth/forgot-password` | Forgot Password |
| POST `/auth/reset-password` | Reset Password |
| GET `/users/me` | Auth bootstrap / Account |
| PATCH `/users/me` | Account profile |
| POST `/users/change-password` | Account security |
| GET/POST `/users/addresses` | Saved Addresses / Checkout |
| PATCH/DELETE `/users/addresses/:id` | Saved Addresses |
| PATCH `/users/addresses/:id/default` | Saved Addresses |
| GET `/users/wishlist` | Wishlist sync |
| POST/DELETE `/users/wishlist/:productId` | Wishlist actions |
| GET `/catalog/categories` | Home/Header/Shop |
| GET `/catalog/categories/:slug` | Category page |
| GET `/catalog/products` | Home/Shop/catalogue context |
| GET `/catalog/products/:slugOrId` | Product detail |
| GET `/catalog/products/:slugOrId/reviews` | Product reviews |
| GET `/catalog/banners` | Home hero content |
| GET `/catalog/settings` | Store/contact/delivery/COD settings |
| GET `/cart` | Authenticated bag sync |
| POST `/cart/items` | Add to bag |
| PATCH `/cart/items/:itemId` | Quantity update |
| DELETE `/cart/items/:itemId` | Remove item |
| DELETE `/cart` | Clear bag |
| POST `/cart/quote` | Cart/Checkout offer + delivery pricing |
| POST `/orders` | COD Checkout |
| GET `/orders` | Order history |
| GET `/orders/:id` | Order detail / confirmation |
| POST `/orders/:id/cancel` | Customer cancellation |
| POST `/orders/:id/return-request` | Customer return request |
| POST `/orders/track` | Public order tracking |
| POST `/reviews/products/:productId` | Submit review |
| PATCH `/reviews/:id` | Edit own review |
| DELETE `/reviews/:id` | Delete own review |
| POST `/contact` | Contact form |
| POST `/newsletter/subscribe` | Newsletter/Register/Account |
| POST `/newsletter/unsubscribe` | Account preference |

**Admin APIs are intentionally not referenced by this build.**
