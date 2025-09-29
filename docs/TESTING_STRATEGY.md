# Testing Strategy

## Coverage Targets
- Unit: 70%+
- Integration: key API routes and exporters
- E2E: core user flows (auth, create project, create diagram, edit, export)

## Unit Tests
- Export engine (markdown/json/cursor)
- PRD parser utilities
- Zustand store reducers

## Integration Tests
- API endpoints: projects, diagrams, analyze-prd, export
- Auth middleware behavior

## E2E Tests
- Login/signup
- Create project and diagram
- Add nodes/edges and persist
- Export markdown

## Performance Benchmarks
- 100+ nodes at ~60fps interactions
- AI analysis under 15s
- Export under 5s

## Tooling
- Vitest/Jest for unit/integration
- Playwright for E2E (Pages environment mock)

## CI
- Lint, type-check, unit/integration on PR
- Nightly E2E on main
