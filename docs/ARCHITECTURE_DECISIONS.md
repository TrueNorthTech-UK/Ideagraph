# Architecture Decisions (ADRs)

## ADR-001: Cloudflare SaaS Stack
- **Decision**: Use Cloudflare Pages + Workers with D1, R2, Durable Objects
- **Rationale**: Global edge performance, low cost, integrated platform
- **Consequences**: SQLite constraints; design for transactional simplicity and eventual consistency

## ADR-002: D1 (SQLite) vs PostgreSQL
- **Decision**: D1 for MVP
- **Pros**: Cost, simplicity, tight Wrangler tooling
- **Cons**: Concurrency, limited SQL features
- **Mitigation**: Use Drizzle migrations; avoid heavy joins; precompute summaries

## ADR-003: Better Auth
- **Decision**: Adopt Better Auth over custom or NextAuth
- **Rationale**: Lightweight, good DX, edge-friendly
- **Implications**: Centralize session checks in API routes; secure secrets

## ADR-004: React Flow Implementation
- **Decision**: `@xyflow/react` v12+ with custom nodes/edges and groups
- **Rationale**: Mature ecosystem, performance, extensibility
- **Implications**: Node data contracts in `lib/diagram/*`; optimize rendering, memoize selectors

## ADR-005: AI Agent Architecture
- **Decision**: Coordinator + specialist agents (architect, db, frontend, backend)
- **Rationale**: Separation of concerns; composable recommendations
- **Implications**: Standardize input/output schemas; robust JSON parsing; retries

## ADR-006: Real-time Collaboration
- **Decision**: Durable Objects for room coordination
- **Rationale**: Built-in stateful coordination at edge
- **Implications**: WebSocket fanout, presence, conflict resolution; persist periodic snapshots to D1

## ADR-007: Export System
- **Decision**: Pluggable export engine (Markdown/JSON/Cursor/PDF/PNG)
- **Rationale**: Multi-consumer outputs (docs, code assistants, stakeholders)
- **Implications**: Stable interfaces; background generation for heavy formats
