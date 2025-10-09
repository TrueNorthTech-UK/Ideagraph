# Changelog

All notable changes to this project will be documented in this file.



## [0.1.14] - 2025-10-09
### Fixed
- Cloudflare Pages deployment infinite build loop: separated OpenNext build into dedicated `build:worker` script
- Previous approach caused recursive loop because OpenNext internally calls `pnpm run build`

### Changed
- Reverted `build` script to `next build` only
- Added separate `build:worker` script for OpenNext transformation
- Cloudflare Pages build command should be configured as: `pnpm run build && pnpm run build:worker`
- Updated `wrangler.toml` D1 target to existing database `ideagraph-db` (id: `b8ae71ae-7012-47f7-bd91-dde6e5449b12`)
- Updated `wrangler.jsonc` D1 config to `ideagraph-db` to align with wrangler.toml and Dashboard binding

## [0.1.13] - 2025-01-27
### Added
- Environment verification script (`scripts/verify-env.js`) to validate configuration
- Comprehensive environment setup guide (`docs/ENVIRONMENT_SETUP.md`)
- Enhanced TypeScript types for Cloudflare environment variables
- Improved R2 URL construction with fallback logic
- `pnpm run verify-env` command for environment validation

### Fixed
- Environment variable type definitions in `types/env.d.ts`
- R2 storage URL construction in `src/lib/r2.ts`
- Missing environment variable documentation and examples

### Changed
- Updated `.dev.vars` template with all required and optional variables
- Enhanced environment variable validation and error reporting
- Improved documentation for Cloudflare integration setup

## [0.1.0] - 2025-09-29
### Added
- Generated documentation from PRD:
  - `docs/PROJECT_OVERVIEW.md`
  - `docs/DEPENDENCIES.md`
  - `docs/ARCHITECTURE_DECISIONS.md`
  - `docs/DATABASE_SCHEMA.md`
  - `docs/IMPLEMENTATION_TASKS.md` (Phase 1 tasks 001–030 initially)
  - `docs/IMPLEMENTATION_PHASES.md`
  - `docs/TASK_DEPENDENCIES.md`
  - `docs/TECHNICAL_CHALLENGES.md`
  - `docs/API_ENDPOINTS.md`
  - `docs/COMPONENT_HIERARCHY.md`
  - `docs/STATE_MANAGEMENT.md`
  - `docs/AI_AGENT_PROMPTS.md`
  - `docs/TESTING_STRATEGY.md`
  - `docs/DEPLOYMENT_CHECKLIST.md`

### Notes
- Remaining tasks (031–230) will be appended in subsequent updates.

## [0.1.1] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 126–135 covering validation, performance profiling, security for imports, AI streaming retries, diff/merge, export DSL, presence scalability, presets governance, import review UI, and autosave/recovery.

### Notes
- Next batches will continue 136–180 for Phase 3, then 181–230 for Phase 4.

## [0.1.2] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 136–145 covering analytics and insights, collaboration notifications, security and audit, performance optimization, error recovery, integration testing, user onboarding, validation rules engine, export quality control, and collaboration scalability.

### Notes
- Next batches will continue 146–180 for Phase 3, then 181–230 for Phase 4.

## [0.1.3] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 146–155 covering auto-layout heuristics, offline-first collaboration queue, AI plan-to-canvas commands, diagram milestones, template marketplace, AI recommendation feedback loop, large-graph windowing, secure share links, diagram linting, and workspace settings/policies.

### Notes
- Next batches will continue 156–180 for Phase 3, then 181–230 for Phase 4.

## [0.1.4] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 156–165 covering export quality polish, web vitals dashboard, chat transcript exports, plugin system (beta), multi-project bundles, advanced edge routing, review mode and suggestions, workspace audit dashboard, keyboard macros, and export accessibility audit.

### Notes
- Next batches will continue 166–180 for Phase 3, then 181–230 for Phase 4.

## [0.1.5] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 166–175 covering multi-agent conflict explanation, data residency, theming API, API rate plans, external import connectors, presence visualizations, diagram UI component library, milestone diff reports, compliance mode, and AI E2E test case generation.

### Notes
- Next batches will continue 176–180 for Phase 3, then 181–230 for Phase 4.

## [0.1.6] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 5):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 176–180 covering auto-resolve suggestions by agent confidence, live co-editing cursor chat, dependency graph for tasks/modules, AI refactoring proposals from analytics/lint signals, and the Phase 3 hardening pass.

### Notes
- Phase 3 tasks are now complete (121–180). Next, Phase 4 (181–230).

## [0.1.7] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 181–190 covering performance budgets, error taxonomy/messaging, app-wide a11y audit, observability, deployment hardening and rollback, security hardening and pen test fixes, billing polish, i18n foundation, documentation + examples, and production readiness checklist completion.

### Notes
- Next batches will continue 191–230 to finish Phase 4.

## [0.1.8] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 191–200 covering SLAs/runbooks, backups/restore, privacy and deletion flows, rate limit dashboards and self-service, export caching/incremental builds, snapshot diff viewer, mobile/tablet UX polish, customer support hooks, onboarding checklists/templates, and release notes/changelog automation.

### Notes
- Next batches will continue 201–230 to complete Phase 4 and reach 230 tasks total.

## [0.1.9] - 2025-09-29
### Added
- Appended new implementation tasks (batch of 10):
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 201–210 covering SSO enterprise readiness, audit exports/legal hold, DR game days, export webhooks/integrations, multi-region failover (read-only mode), end-user data exports, fine-grained permissions and policies, printing mode and page tiling, admin analytics, and GA launch/post-launch monitoring.

### Notes
- Remaining: 211–230 to finish the full 230-task set.

## [0.1.10] - 2025-09-29
### Added
- Completed the 230-task implementation plan:
  - `docs/IMPLEMENTATION_TASKS.md` — Tasks 211–230 covering export signing/provenance, telemetry privacy controls, archival/cold storage, performance labs, design tokens sync, public status page, cost monitoring, export white-labeling, advanced undo history, in-app knowledge base, tenant webhooks, export preflight checks, release channel switcher, data retention policies, offline docs bundle, accessibility theming, orphaned asset cleanup, diff-to-issue automation, tenant data isolation validation, and GA postmortem/next roadmap.

### Notes
- Implementation task list is now complete (001–230).
## [0.1.11] - 2025-10-05
### Added
- Task 001 completed: Initialize Cloudflare SaaS Stack Baseline
  - Verified `package.json` scripts and baseline dependencies
  - Confirmed `wrangler.jsonc` bindings (D1, R2, AI, Assets) and generated types
  - Built app for Cloudflare Workers using OpenNext (`build:cf`) successfully
  - Sanity-checked local dev startup without fatal errors

### Notes
- Next: proceed to Task 002 (D1 + Drizzle configuration) per `docs/IMPLEMENTATION_TASKS.md`.
## [0.1.12] - 2025-10-05
### Added
- Task 002 completed: Configure D1 Database and Drizzle ORM
  - Verified `wrangler.jsonc` D1 binding `next_cf_app` and `migrations_dir: ./src/drizzle`
  - Confirmed `drizzle.config.ts` uses `sqlite` + `d1-http` with Cloudflare credentials
  - Applied local migrations successfully (`0000_initial_schemas_migration.sql`)
  - Inspected tables via Wrangler: `account`, `user`, `session`, `verification`, `categories`, `todos`

### Notes
- Next: proceed to Task 003 (Initial schema for projects/diagrams) per `docs/IMPLEMENTATION_TASKS.md`.
## [0.1.13] - 2025-10-05
### Added
- Task 003 completed: Implement Initial Schema (Projects, Diagrams)
  - Added tables `projects` and `diagrams` via Drizzle schema
  - Created migration `src/drizzle/0001_projects_diagrams.sql`
  - Updated `docs/IMPLEMENTATION_TASKS.md` acceptance criteria and file paths

