# H&H Hair & Cosmetics — Premium Ecommerce v8 API Integrated

Premium React 18 + Vite 5 + Tailwind storefront connected to the H&H Node/Express/MySQL backend.

## What is connected

All **non-admin** APIs from the supplied backend are wired into the storefront through a dedicated Axios service layer:

- Authentication: register, login, refresh-token rotation, logout, forgot/reset password
- Customer account: profile, password change, address CRUD/default address
- Catalogue: categories, category detail, products, product detail, reviews, banners, public settings
- Wishlist: list, add, remove
- Shopping bag: list, add, update quantity, remove, clear, backend quote
- Checkout/orders: COD order creation, order list/detail, cancellation, return request, public order tracking
- Reviews: submit, edit, delete
- Public forms: contact enquiry and newsletter subscribe/unsubscribe

No `/admin` endpoint is called from this frontend.

## Frontend architecture

```text
src/
  services/
    apiClient.js       # Axios instance, auth header + automatic token refresh
    authService.js
    catalogService.js
    userService.js
    cartService.js
    orderService.js
    reviewService.js
    publicService.js
  context/
    AuthContext.jsx
    CommerceContext.jsx
  components/
  pages/
```

All customer-facing forms use **Formik + Yup** validation. API errors are surfaced in the UI through shared notice/form components.

## Backend URL

Copy `.env.example` to `.env` if you want to override the default:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_API_TIMEOUT=20000
```

The code already falls back to `http://localhost:4000/api/v1` when the variable is not supplied.

Your backend must allow the Vite origin, normally:

```env
FRONTEND_URL=http://localhost:5173
```

## Run

Start the backend first, then in this frontend:

```bash
npm install
npm run lint:imports
npm run dev
```

Production:

```bash
npm run build
npm run preview
```

## Seed customer

With the backend dummy data supplied earlier:

```text
Email: customer@example.com
Password: User@12345
```

Test offer codes from the backend seed include `HH10` and `BEAUTY5`.

## Payment

Checkout sends only:

```json
{ "paymentMethod": "COD" }
```

The backend remains the source of truth for stock, prices, coupons, delivery fees and final order totals.

## Guest behaviour

Guest cart/wishlist remain available locally. When the customer signs in, guest items are synchronized into the authenticated server cart/wishlist and the live server state replaces the local state.
