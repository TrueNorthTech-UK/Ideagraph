# Dependencies

## Runtime Dependencies
- **next**: ^15.0.0 — App Router, server components
- **react**, **react-dom**: via Next.js
- **@xyflow/react**: ^12.0.0 — React Flow for diagramming
- **zustand**: ^4.4.0 — state management
- **@anthropic-ai/sdk**: ^0.24.0 — Claude API client
- **better-auth**: ^0.8.0 — authentication
- **drizzle-orm**: ^0.33.0 — ORM for D1
- **lucide-react**: ^0.263.0 — icons
- **@tailwindcss/typography**: ^0.5.0 — prose styling
- **framer-motion**: ^10.16.0 — animations

## Dev Dependencies
- **wrangler**: ^3.57.0 — Cloudflare deployment
- **drizzle-kit**: ^0.24.0 — migrations + studio
- **typescript**: ^5.x
- **@types/node**: ^20.x
- **tailwindcss**: ^3.4.0

## Cloudflare-Specific
- D1 (SQLite) — primary DB
- R2 — exports/assets
- Durable Objects — realtime collaboration

## Compatibility Notes
- Ensure React Flow v12+ compatible with Next 15
- Drizzle with D1 requires Wrangler >=3.57 for migrations
- Better Auth secrets must be set server-side only

## Installation
```bash
pnpm install next@^15 @xyflow/react@^12 zustand@^4.4 @anthropic-ai/sdk@^0.24 better-auth@^0.8 drizzle-orm@^0.33 lucide-react@^0.263 @tailwindcss/typography@^0.5 framer-motion@^10.16
pnpm install -D wrangler@^3.57 drizzle-kit@^0.24 typescript@^5 @types/node@^20 tailwindcss@^3.4
```

## Environment Variables
- `ANTHROPIC_API_KEY`
- `BETTER_AUTH_SECRET`
- `DATABASE_ID` / Wrangler bound D1
- `R2_BUCKET` and binding

## Scripts (reference)
- `dev`, `build`, `start`, `deploy`, `db:generate`, `db:migrate`, `db:studio`
