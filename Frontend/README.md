# ShopEZ — Next.js (App Router) + TypeScript + Tailwind + shadcn
Flipkart/Amazon-style e-commerce front-end wired to your Node/Express API.

## Quick Start
```bash
pnpm install   # or npm i / yarn
cp .env.local.example .env.local
pnpm dev
```

## Tech
- Next.js App Router + TypeScript
- Tailwind CSS
- Zustand for cart/auth
- shadcn/ui (lightweight placeholders in `components/ui` so it runs immediately). To replace with official components:
  ```bash
  pnpm dlx shadcn@latest init
  pnpm dlx shadcn@latest add button card input label dialog
  ```

## API
Endpoints are implemented to match your Postman collection (see `lib/api.ts`).
- Register: `POST /customer/signup` with `{ name, email, passwords }`
- Login: `POST /customer/login` with `{ email, passwords }`
- Product list: `GET /product/list`
- Add/Update/Delete product: `/product/create|update|delete`
- Cart: `POST /cart/create`, `PUT /cart/update`, `DELETE /cart/delete`, `GET /cart/list?id=<userId>`
- Orders: `POST /order/create`, `GET /order/history`, `GET /order/userhistory?id=<userId>`

## Auth Protection
`middleware.ts` protects `/profile`, `/checkout`, `/orders`, `/admin`. On login we set a simple `auth` cookie (replace with real JWT/session as needed).

## Folder Structure
```
app/                # App Router pages
components/         # layout + UI + product widgets
lib/                # api wrapper, stores, types
```

## Notes
- The backend sample didn't include a `GET /product/:id`, so product detail loads from the list and finds by id.
- If your API returns different shapes, adjust mapping in the corresponding page/component.
```
