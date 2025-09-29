# Task Dependencies

## Critical Path (ASCII)
```
001 -> 002 -> 003 -> 008 -> 009 -> 010 -> 014 -> 021 -> 022 -> 025
           \-> 004 -> 005 -> 006 -> 029 -> 030
003 -> 007
016 -> 017 -> 018 -> 019 -> 020
```

- 001 Initialize stack
- 002 D1 + Drizzle config
- 003 Core schema
- 004 Auth foundation
- 005 App Router layouts
- 006 Dashboard shell
- 007 Projects CRUD
- 008 Diagrams CRUD
- 009 Canvas bootstrap
- 010 Zustand store
- 014 Custom edges
- 016 Analyze PRD route
- 017 Anthropic client
- 018 PRDAnalysisAgent
- 019 Import session persistence
- 020 Import UI
- 021 Export engine
- 022 Markdown export
- 025 Export API route
- 029 Login/Signup forms
- 030 Protected routes

## Parallel Workstreams
- UI theming (026) alongside node/edge work (011–015)
- Export formats (022–024) in parallel after 021
- API error handling/validation (027–028) in parallel with routes

## Blocking Dependencies
- Realtime collaboration depends on stable canvas/store (after 031+)
- AI recommendations depend on PRD agent and chat infrastructure (after 051+)

## Optional Enhancements
- Auto-layout integration (Phase 3)
- Dark mode and accessibility polish (Phase 4)
