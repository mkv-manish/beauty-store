# Dermiscaa beauty store

Next.js 16 App Router storefront with React 19, Tailwind 4, Redux Toolkit, and MongoDB/Mongoose. Customers can browse skin and hair products, filter/search/sort a paginated catalog, manage a locally saved cart, register or sign in, place cash-on-delivery orders, and view their most recent 100 orders.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set the database URI `SITE_URL` to your public origin, and a random JWT secret of at least 32 characters (for example, generate one with `openssl rand -base64 48`).
3. Use MongoDB Atlas or a MongoDB replica set. Checkout requires transactions; a standalone MongoDB instance is unsupported.
4. Run `npm run seed` to insert missing demo products without replacing existing inventory.
5. Run `npm run dev` and open http://localhost:3000.

## Checks

- `npm run lint`
- `npm run typecheck`
- `npm test` — validation, duplicate cart aggregation, user/index schemas, and cart state regressions.
- `npm run test:integration` — after building, starts a temporary server on port 3002 and runs authentication/checkout tests against a generated temporary database, then drops only that test database. The MongoDB account needs permission to create and drop that database.
- `npm run build` and `npm start` — production build and server.

Unit tests do not connect to your database. Integration checks cover parallel checkouts, repeated idempotency keys, rollback when one product is unavailable, phone login, session cookies, origin protection, ranking, pagination, and rate limiting in an isolated replica-set test database.

## Data and authentication

Sessions use HTTP-only, SameSite=Lax cookies (Secure in production). Mutating endpoints check the request origin. JWTs expire after seven days. Legacy localStorage sessions are removed; existing customers need to sign in again. New passwords require 8 characters and are limited to bcrypt's 72-byte input size; existing passwords still work at login.

Login and registration use database-backed limits of 10 attempts per normalized identifier per 15-minute window. Apply an additional IP/global limit at the deployment edge to prevent distributed account creation and identifier rotation. Do not rely on untrusted forwarded-IP headers.

Mongoose creates a unique sparse phone index and a unique partial order index on `(user, requestKey)`. Before deploying against existing data, check for duplicate phone values and ensure indexes are created (`User.init()` / `Order.init()` or your normal index migration tooling). Legacy users without phone numbers continue to sign in by email; the previous schema did not retain their mobile number, so it cannot be automatically recovered.

Order submission aggregates duplicate product IDs, validates integer quantities, conditionally reserves stock and saves the order in one transaction. Checkout persists a payload-specific idempotency key in sessionStorage to make retries safe. Best sellers use quantities from Confirmed/Delivered orders, so the section stays hidden until qualifying sales exist. There is no administration/status-management interface yet.

The product API returns `{ products, total, page, pages }`, with optional `bestSellers` for `home=true`. Supported query parameters: `page`, `limit` (1–48), `category` (`skin`/`hair`), `search`, and `sort` (`newest`, `price-asc`, `price-desc`).

## Seed safety

The default seed is additive. Destructive reset requires both `ALLOW_SEED_RESET=true` and `npm run seed -- --reset`. Do not reset production products: historical orders reference their IDs. Seed failures return a failing exit code.

## Responsive interface

The storefront uses two product columns on phones, three on tablets, and four on desktop. Mobile navigation uses the full-width search field and account sidebar, without bottom tabs. The interface includes visible keyboard focus, a skip link, semantic headings, accessible quantity controls, reduced-motion support, and touch-sized actions.

## Wishlist, reviews, and discounts

- Wishlist hearts save product IDs on the current device and persist after refresh. The wishlist reloads current prices and stock; deleted products can be removed. It is not an account-synced wishlist.
- Signed-in customers can post one review per product and update it by posting again. Reviews have validated 1–5 ratings and up to 1000 characters. Public responses omit account IDs. Ratings on product cards are calculated from stored reviews.
- The launch offer `CARE10` gives 10% off orders of ₹499 or more, capped at ₹200. Set `DISCOUNT_CODES=[]` to disable it, or configure a JSON array of `{ "code": "CARE10", "percent": 10, "minSubtotal": 499, "maxDiscount": 200, "expiresAt": "2027-01-01T00:00:00Z" }` in the server environment. Offers have no per-user redemption limit.
- Checkout quotes and final order totals use database prices. Orders store the subtotal, applied code, savings, and final total. Invalid/expired codes and out-of-stock items are rejected; stock reservations roll back when checkout fails.
- Product records optionally accept an `images` array for additional gallery images. The primary `image` remains the first gallery view. Next.js serves responsive AVIF/WebP images; the gallery does not invent extra views when only one photograph is available.

Search updates automatically after a 400 ms pause, preserves the focused field while results load, supports Enter and clearing, and waits for IME composition to finish. Home includes an automatic three-image carousel from public/images/home, four Best Sellers in a single row, everyday essentials, a coupon banner with a copy button immediately before Why Choose Us, and the footer. Sales-ranked products appear first; available catalogue products fill the remaining Best Seller slots without duplicates or fabricated sales counts. Form controls share the search field’s sage surface and focus styling. Product-page Add to Cart changes to Go to Cart when that product is already in the cart.

Cart rendering uses a stable server snapshot through `useSyncExternalStore`, plus a restoration skeleton for cart and checkout. This prevents persisted carts from changing streamed HTML before hydration. Session changes refresh the sidebar and order history; sign-out clears pending checkout details while preserving the device cart and wishlist.

The home carousel is image-only and spans the viewport, with a compact responsive height and no captions, links, arrows, dots or playback buttons. It advances every five seconds while visible and respects reduced-motion preferences. Desktop signed-in navigation uses an account dropdown; mobile uses the account avatar to open the sidebar.


## Source structure

```text
app/                     Next.js routes, route-level loading/errors and API handlers
components/
  layout/                Navbar, footer, category rail and search
  home/                  Carousel, home catalogue, coupon banner and its CSS module
  products/              Product cards, reviews and wishlist controls
  checkout/              Discount-code form and live quote
  cart/                  Cart restoration/loading UI
  providers/             Redux provider and persistence
  ui/                    Shared beauty and category icons
config/categories.ts     Category definitions shared across UI, types and database enum
types/                   Shared product and discount contracts; no database imports
lib/                     Database access, authentication, validation and catalogue queries
models/                  Mongoose schemas and indexes
store/                   Cart reducer, store factory and hydration-safe cart hook
scripts/                 Additive catalogue seed
tests/                  Unit, hydration and isolated database integration checks
```

Pages specific to one route stay beside that route (for example, `app/shop/ShopContent.tsx` and `app/product/[id]/ProductDetails.tsx`). Shared components live in their feature folders. Coupon styles are scoped to `CouponBanner.module.css`; global styles cover the shared site shell and fields.

To add a category, add its unique `id`, `label`, `headline` and `icon` key to `config/categories.ts`, then restart/deploy the application and add products with that category ID. Navigation, sidebar, shop filters, product labels, TypeScript category IDs and the Mongoose enum use this configuration. Unknown icon keys use the leaf icon; custom artwork can be added in `components/ui/CategoryIcon.tsx`. Existing products and URLs are unchanged. Mobile category chips use a compact, horizontally scrollable rail so additional categories do not wrap the header.
