# IdeaGraph Implementation Tasks
**Total Tasks:** 230
**Estimated Duration:** 12 weeks
**Last Updated:** September 29, 2025

## Quick Navigation
- [Phase 1: Foundation (Weeks 1-3)](#phase-1-foundation-weeks-1-3)
- [Phase 2: Core Features (Weeks 4-6)](#phase-2-core-features-weeks-4-6)
- [Phase 3: Advanced Features (Weeks 7-9)](#phase-3-advanced-features-weeks-7-9)
- [Phase 4: Production Polish (Weeks 10-12)](#phase-4-production-polish-weeks-10-12)

## Phase 1: Foundation (Weeks 1-3)
### Tasks 001-050

### Task 001: Initialize Cloudflare SaaS Stack Baseline
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Critical
**Dependencies:** []

**Objective:**
Set up the baseline project aligned with Cloudflare Pages + Workers, D1, R2, and Durable Objects to match the PRD’s foundation.

**Technical Requirements:**
- Next.js 15 App Router
- Wrangler 3.57+ config
- Typescript 5 and Tailwind setup

**Implementation Steps:**
1. Create repository and configure Next.js 15 with App Router.
2. Install baseline deps from `docs/DEPENDENCIES.md`.
3. Verify `wrangler.jsonc` and bindings align with PRD.
4. Run `pnpm dev` to validate local environment.

**Files to Create/Modify:**
- `package.json` - scripts and versions
- `wrangler.jsonc` - Cloudflare project config
- `next.config.ts` - Next.js config

**Acceptance Criteria:**
- [ ] Local dev server runs without errors
- [ ] Wrangler detects project
- [ ] CI can build Next.js

**Testing Strategy:**
- Manual smoke test dev server
- CI build workflow check

**Potential Challenges:**
- Version mismatches; pin versions per docs

**Reference Documentation:**
- PRD “Technical Architecture” section

---

### Task 002: Configure D1 Database and Drizzle ORM
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Critical
**Dependencies:** [001]

**Objective:**
Enable D1 database with Drizzle ORM including local and production migration flows.

**Technical Requirements:**
- Drizzle ORM + Drizzle Kit
- Wrangler D1 binding

**Implementation Steps:**
1. Ensure D1 binding in `wrangler.jsonc`/`wrangler.toml`.
2. Configure `drizzle.config.ts` for SQLite.
3. Set up `src/db/schema.ts` and `src/db/index.ts` connection utilities.
4. Generate initial migration and apply locally.

**Files to Create/Modify:**
- `drizzle.config.ts` - Drizzle configuration
- `src/db/schema.ts` - Tables per PRD
- `src/db/index.ts` - DB client

**Acceptance Criteria:**
- [ ] Migration generates without errors
- [ ] Local queries work via Drizzle

**Testing Strategy:**
- Run simple insert/select with `node` script

**Potential Challenges:**
- Wrangler version alignment for D1

**Reference Documentation:**
- PRD “Database Schema” section

---

### Task 003: Implement Initial Schema (Projects, Diagrams)
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [002]

**Objective:**
Create core tables for projects and diagrams including JSON fields for nodes/edges and metadata.

**Technical Requirements:**
- SQLite JSON fields as TEXT
- Foreign key constraints

**Implementation Steps:**
1. Define `projects`, `diagrams` in `src/db/schema.ts`.
2. Generate migration; apply locally.
3. Seed minimal demo data.

**Files to Create/Modify:**
- `src/db/schema.ts`
- `src/drizzle/0001_core.sql`
- `src/lib/utils.ts` (seeding helper)

**Acceptance Criteria:**
- [ ] Tables created with correct columns
- [ ] Seeded project and diagram exist

**Testing Strategy:**
- Manual `SELECT` via Wrangler D1 console

**Potential Challenges:**
- FK cascade rules on D1

**Reference Documentation:**
- PRD “Core Data Model”

---

### Task 004: Auth Foundation with Better Auth
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Critical
**Dependencies:** [001]

**Objective:**
Integrate Better Auth for session handling and restrict dashboard/API routes to authenticated users.

**Technical Requirements:**
- Server-side session retrieval
- Middleware enforcement

**Implementation Steps:**
1. Configure Better Auth secrets via env.
2. Create `src/lib/auth.ts` to expose `auth()` helper.
3. Add `middleware.ts` to protect `/dashboard` and API routes.

**Files to Create/Modify:**
- `src/lib/auth.ts`
- `middleware.ts`

**Acceptance Criteria:**
- [ ] Unauthenticated users are redirected to login
- [ ] `auth()` returns user session on server

**Testing Strategy:**
- Manual route access test

**Potential Challenges:**
- Edge runtime compatibility

**Reference Documentation:**
- PRD “Authentication”

---

### Task 005: App Router Base Routes and Layouts
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** High
**Dependencies:** [001,004]

**Objective:**
Create base layouts and landing/auth pages consistent with project structure.

**Technical Requirements:**
- App Router segment conventions
- Shadcn/ui styles

**Implementation Steps:**
1. Implement `src/app/layout.tsx` and `globals.css`.
2. Add `(auth)` group with `login` and `signup` pages.
3. Add root `page.tsx` landing linking to dashboard.

**Files to Create/Modify:**
- `src/app/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/page.tsx`

**Acceptance Criteria:**
- [ ] Pages render with shared layout
- [ ] Navigation to login/signup works

**Testing Strategy:**
- Manual navigation

**Potential Challenges:**
- CSS load order

**Reference Documentation:**
- PRD “User Interface Design”

---

### Task 006: Dashboard Shell and Navigation
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** High
**Dependencies:** [005]

**Objective:**
Implement dashboard shell, sidebar/topbar navigation and empty content areas for projects and diagrams.

**Technical Requirements:**
- Responsive layout
- Shadcn/ui components

**Implementation Steps:**
1. Create `src/modules/dashboard/dashboard.layout.tsx`.
2. Add navigation component in `src/components/navigation.tsx`.
3. Create `src/app/dashboard/page.tsx` using layout.

**Files to Create/Modify:**
- `src/modules/dashboard/dashboard.layout.tsx`
- `src/components/navigation.tsx`
- `src/app/dashboard/page.tsx`

**Acceptance Criteria:**
- [ ] Shell renders with nav
- [ ] Authenticated-only access

**Testing Strategy:**
- Manual page load

**Potential Challenges:**
- Layout nesting in App Router

**Reference Documentation:**
- PRD UI layout examples

---

### Task 007: Projects CRUD (Minimal)
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [003,004,006]

**Objective:**
Add basic ability to create and list projects owned by the user.

**Technical Requirements:**
- Server actions or API routes
- Ownership checks

**Implementation Steps:**
1. Implement `app/api/projects/route.ts` for POST/GET.
2. Add form to create project in dashboard.
3. List projects in dashboard page.

**Files to Create/Modify:**
- `src/app/api/projects/route.ts`
- `src/modules/dashboard/dashboard.page.tsx`

**Acceptance Criteria:**
- [ ] Projects can be created
- [ ] Only user’s projects listed

**Testing Strategy:**
- Manual creation and fetch

**Potential Challenges:**
- Input validation consistency

**Reference Documentation:**
- PRD “Application Architecture”

---

### Task 008: Diagrams CRUD (Minimal)
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [003,007]

**Objective:**
Enable creating, listing, and fetching a diagram within a project.

**Technical Requirements:**
- Diagram fields: name, nodes, edges

**Implementation Steps:**
1. Implement `app/api/diagrams/route.ts` POST (create) and GET (list by project).
2. Implement `app/api/diagrams/[diagramId]/route.ts` GET (fetch).
3. Add UI to create diagram from project view.

**Files to Create/Modify:**
- `src/app/api/diagrams/route.ts`
- `src/app/api/diagrams/[diagramId]/route.ts`
- `src/app/dashboard/page.tsx`

**Acceptance Criteria:**
- [ ] Diagrams created and retrievable
- [ ] Ownership enforced via project

**Testing Strategy:**
- Manual create and open

**Potential Challenges:**
- JSON serialization of nodes/edges

**Reference Documentation:**
- PRD “Diagram Management”

---

### Task 009: React Flow Canvas Bootstrap
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Critical
**Dependencies:** [008]

**Objective:**
Render a basic React Flow canvas for a specific diagram with persisted nodes/edges.

**Technical Requirements:**
- React Flow v12 setup
- Controlled state pattern

**Implementation Steps:**
1. Create `DiagramCanvas` component and route page.
2. Load diagram via API and map to React Flow objects.
3. Persist changes with debounce to API.

**Files to Create/Modify:**
- `src/app/dashboard/diagrams/[id]/page.tsx` (or module route as per PRD)
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Canvas renders nodes/edges
- [ ] Edits persist and reload correctly

**Testing Strategy:**
- Manual add/move node; refresh verification

**Potential Challenges:**
- SSR/CSR boundaries for React Flow

**Reference Documentation:**
- PRD “React Flow Implementation”

---

### Task 010: Zustand Store for Diagram State
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** High
**Dependencies:** [009]

**Objective:**
Create a Zustand store to manage diagram state (nodes, edges, viewport) and sync with API.

**Technical Requirements:**
- Persist middleware
- Selectors for performance

**Implementation Steps:**
1. Add `src/lib/diagram/store.ts` with types.
2. Wire store into `DiagramCanvas` and handlers.
3. Implement optimistic updates and rollback.

**Files to Create/Modify:**
- `src/lib/diagram/store.ts`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Store drives canvas updates
- [ ] API sync without jank

**Testing Strategy:**
- Manual latency simulation

**Potential Challenges:**
- Avoiding re-render storms

**Reference Documentation:**
- PRD “State Management”

---

### Task 011: Custom Node Types — UI Component
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [009]

**Objective:**
Implement a custom React Flow node for UI components with properties and handles.

**Technical Requirements:**
- Node props and badges per PRD

**Implementation Steps:**
1. Create `components/diagram/nodes/UIComponentNode.tsx`.
2. Register node type in canvas.
3. Style with Tailwind and shadcn/ui.

**Files to Create/Modify:**
- `src/components/diagram/nodes/UIComponentNode.tsx`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Node renders with label, description, handles
- [ ] Selectable and movable

**Testing Strategy:**
- Manual drop and edit

**Potential Challenges:**
- CSS containment within canvas

**Reference Documentation:**
- PRD Custom Node Components

---

### Task 012: Custom Node Types — API Endpoint
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** High
**Dependencies:** [011]

**Objective:**
Add API endpoint node type with method/protocol annotations.

**Technical Requirements:**
- Edge styling for data flows

**Implementation Steps:**
1. Create `components/diagram/nodes/ApiEndpointNode.tsx`.
2. Register and style node.

**Files to Create/Modify:**
- `src/components/diagram/nodes/ApiEndpointNode.tsx`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Node shows HTTP method and path label

**Testing Strategy:**
- Manual add and connect

**Potential Challenges:**
- Label overflow handling

**Reference Documentation:**
- PRD Node Types

---

### Task 013: Custom Node Types — Database/Service/Infra
**Phase:** Foundation
**Estimated Time:** 7 hours
**Priority:** High
**Dependencies:** [011]

**Objective:**
Implement database, service, and infrastructure nodes with appropriate icons/colors.

**Technical Requirements:**
- Consistent data model for node metadata

**Implementation Steps:**
1. Create `DatabaseNode.tsx`, `ServiceNode.tsx`, `InfrastructureNode.tsx`.
2. Register in canvas and theme mappings.

**Files to Create/Modify:**
- `src/components/diagram/nodes/DatabaseNode.tsx`
- `src/components/diagram/nodes/ServiceNode.tsx`
- `src/components/diagram/nodes/InfrastructureNode.tsx`

**Acceptance Criteria:**
- [ ] All node types render and connect properly

**Testing Strategy:**
- Manual palette add and connect

**Potential Challenges:**
- Visual consistency across themes

**Reference Documentation:**
- PRD Theme + Node Types

---

### Task 014: Custom Edge Types and Styling
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [009]

**Objective:**
Define custom edges for data flow, dependency, and user flow with configurable animation.

**Technical Requirements:**
- Edge data model per PRD

**Implementation Steps:**
1. Create `src/lib/diagram/edges.ts` types and utilities.
2. Register custom edges in canvas.
3. Add style controls for color, dash, width.

**Files to Create/Modify:**
- `src/lib/diagram/edges.ts`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Edge types render distinctly
- [ ] Animation toggle works

**Testing Strategy:**
- Manual edge creation and style checks

**Potential Challenges:**
- Performance with many animated edges

**Reference Documentation:**
- PRD Advanced Edge System

---

### Task 015: Diagram Toolbar and Controls
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [009,010]

**Objective:**
Add zoom, pan, fit-view, and basic node/edge creation controls.

**Technical Requirements:**
- Keyboard shortcuts for zoom/fit

**Implementation Steps:**
1. Create `components/diagram/controls/Toolbar.tsx` and `ViewControls.tsx`.
2. Wire actions to store.

**Files to Create/Modify:**
- `src/components/diagram/controls/Toolbar.tsx`
- `src/components/diagram/controls/ViewControls.tsx`

**Acceptance Criteria:**
- [ ] Zoom and fit view work reliably

**Testing Strategy:**
- Manual controls interaction

**Potential Challenges:**
- Device wheel/trackpad differences

**Reference Documentation:**
- PRD UI Layout

---

### Task 016: Basic PRD Analysis API Route Skeleton
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** High
**Dependencies:** [004]

**Objective:**
Create secure API route scaffold for PRD analysis requests.

**Technical Requirements:**
- Auth check
- Input validation

**Implementation Steps:**
1. Add `app/api/ai/analyze-prd/route.ts` with POST.
2. Validate `content` input; return stubbed analysis structure.

**Files to Create/Modify:**
- `src/app/api/ai/analyze-prd/route.ts`

**Acceptance Criteria:**
- [ ] Auth required
- [ ] Validates request and returns schema-compliant JSON

**Testing Strategy:**
- cURL/Postman request

**Potential Challenges:**
- Response size limits

**Reference Documentation:**
- PRD “AI Analysis Endpoints”

---

### Task 017: Anthropic Client Setup and Env Wiring
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** High
**Dependencies:** [016]

**Objective:**
Wire Anthropic client and environment variable management for server-side use.

**Technical Requirements:**
- `@anthropic-ai/sdk`
- Secret handling

**Implementation Steps:**
1. Create `src/lib/ai/client.ts` to export a configured client.
2. Add env validation in `src/lib/utils.ts`.

**Files to Create/Modify:**
- `src/lib/ai/client.ts`
- `src/lib/utils.ts`

**Acceptance Criteria:**
- [ ] Client can make a trivial test call (local)

**Testing Strategy:**
- Temporary test endpoint or script

**Potential Challenges:**
- Edge runtime compatibility

**Reference Documentation:**
- PRD “Key Dependencies”

---

### Task 018: PRDAnalysisAgent Implementation (Parse + Map Types)
**Phase:** Foundation
**Estimated Time:** 7 hours
**Priority:** High
**Dependencies:** [017]

**Objective:**
Implement `PRDAnalysisAgent` to call Claude, parse JSON safely, and map to internal node/edge models.

**Technical Requirements:**
- Robust JSON extraction
- Type mapping

**Implementation Steps:**
1. Add `src/lib/ai/agents/PRDAnalysisAgent.ts` with prompt and parse.
2. Implement type mapping and helpers.

**Files to Create/Modify:**
- `src/lib/ai/agents/PRDAnalysisAgent.ts`
- `src/lib/diagram/types.ts`

**Acceptance Criteria:**
- [ ] Returns structured entities/relationships/flows

**Testing Strategy:**
- Unit test the parser with fixture responses

**Potential Challenges:**
- Non-JSON responses; add regex and fallbacks

**Reference Documentation:**
- PRD PRD Analysis Agent

---

### Task 019: Import Session Persistence
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [003,018]

**Objective:**
Store import sessions with original content and processed results.

**Technical Requirements:**
- `import_sessions` table

**Implementation Steps:**
1. Add model and CRUD using Drizzle.
2. Save session on successful analysis.

**Files to Create/Modify:**
- `src/app/api/ai/analyze-prd/route.ts`
- `src/db/schema.ts`

**Acceptance Criteria:**
- [ ] Session row created with processed nodes/edges

**Testing Strategy:**
- Manual API call and DB check

**Potential Challenges:**
- Large payload storage limits

**Reference Documentation:**
- PRD Import Sessions

---

### Task 020: PRD Import UI (Paste + Upload Shell)
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Medium
**Dependencies:** [016,018]

**Objective:**
Create import page with text area and file-upload stubs, progress visualization.

**Technical Requirements:**
- Accessible UI, progress indicators

**Implementation Steps:**
1. Add `app/(dashboard)/import/page.tsx` with UI from PRD.
2. Wire to analysis POST and display progress.

**Files to Create/Modify:**
- `src/app/(dashboard)/import/page.tsx`

**Acceptance Criteria:**
- [ ] Paste and analyze starts request
- [ ] Progress UI updates

**Testing Strategy:**
- Manual run-through with sample PRD text

**Potential Challenges:**
- File parsing to be implemented later

**Reference Documentation:**
- PRD “PRD Import Interface”

---

### Task 021: Export Engine Skeleton
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [009]

**Objective:**
Create `ExportEngine` with method stubs for markdown/json/cursor/pdf/png.

**Technical Requirements:**
- Strategy switch by format

**Implementation Steps:**
1. Add `src/lib/export/ExportEngine.ts` with placeholders per PRD.
2. Define types and interfaces.

**Files to Create/Modify:**
- `src/lib/export/ExportEngine.ts`

**Acceptance Criteria:**
- [ ] Engine compiles and can be invoked

**Testing Strategy:**
- Unit test format switching

**Potential Challenges:**
- Later PDF/PNG generation complexity

**Reference Documentation:**
- PRD “Export System”

---

### Task 022: Markdown Export Implementation
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Medium
**Dependencies:** [021]

**Objective:**
Implement Markdown generator per PRD template including components and flows sections.

**Technical Requirements:**
- Deterministic output

**Implementation Steps:**
1. Implement `generateMarkdown` and helpers.
2. Add tests for sample diagram.

**Files to Create/Modify:**
- `src/lib/export/ExportEngine.ts`
- `tests/export/markdown.test.ts`

**Acceptance Criteria:**
- [ ] Markdown includes overview, components, flows, specs

**Testing Strategy:**
- Unit tests snapshot

**Potential Challenges:**
- Large content performance

**Reference Documentation:**
- PRD Export template

---

### Task 023: JSON Export Implementation
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** Medium
**Dependencies:** [021]

**Objective:**
Output normalized JSON for external tooling.

**Technical Requirements:**
- Schema documented in code

**Implementation Steps:**
1. Implement `generateJSON` with schema.
2. Add unit tests.

**Files to Create/Modify:**
- `src/lib/export/ExportEngine.ts`
- `tests/export/json.test.ts`

**Acceptance Criteria:**
- [ ] JSON validates against schema

**Testing Strategy:**
- Unit validation

**Potential Challenges:**
- Backward compatibility

**Reference Documentation:**
- PRD Export JSON

---

### Task 024: Cursor Tasks Export Implementation
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Medium
**Dependencies:** [021,022,023]

**Objective:**
Generate Cursor-friendly tasks JSON with titles, acceptance criteria, and files.

**Technical Requirements:**
- Follow PRD formatting

**Implementation Steps:**
1. Implement `generateCursorTasks` using `extractImplementationTasks`.
2. Add tests with sample diagram.

**Files to Create/Modify:**
- `src/lib/export/ExportEngine.ts`
- `tests/export/cursor.test.ts`

**Acceptance Criteria:**
- [ ] Output loads in Cursor with tasks listed

**Testing Strategy:**
- Unit tests snapshot

**Potential Challenges:**
- Title generation consistency

**Reference Documentation:**
- PRD Export System

---

### Task 025: API Route for Exports
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [021-024]

**Objective:**
Add API endpoint to trigger export generation for a diagram.

**Technical Requirements:**
- Auth and ownership checks

**Implementation Steps:**
1. Create `app/api/export/[diagramId]/route.ts` with POST.
2. Return file content and metadata.

**Files to Create/Modify:**
- `src/app/api/export/[diagramId]/route.ts`

**Acceptance Criteria:**
- [ ] Endpoint returns chosen format successfully

**Testing Strategy:**
- Manual request and download

**Potential Challenges:**
- Response size for PDF/PNG later

**Reference Documentation:**
- PRD API Implementation

---

### Task 026: Theme Config and Styling Baseline
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [011-015]

**Objective:**
Implement theme config per PRD for colors, typography, spacing, animation.

**Technical Requirements:**
- `src/lib/theme/types.ts`

**Implementation Steps:**
1. Add `modernTheme` per PRD.
2. Map node types to colors/icons.

**Files to Create/Modify:**
- `src/lib/theme/types.ts`

**Acceptance Criteria:**
- [ ] Canvas nodes reflect theme colors

**Testing Strategy:**
- Visual inspection

**Potential Challenges:**
- Dark mode later

**Reference Documentation:**
- PRD Theme System

---

### Task 027: Error Handling and API Error Utility
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** Medium
**Dependencies:** [016]

**Objective:**
Create standardized API error responses and utilities.

**Technical Requirements:**
- Consistent error shape

**Implementation Steps:**
1. Add `src/lib/api-error.ts` helper.
2. Use in AI and diagrams endpoints.

**Files to Create/Modify:**
- `src/lib/api-error.ts`
- `src/app/api/*/route.ts`

**Acceptance Criteria:**
- [ ] Errors include code and message consistently

**Testing Strategy:**
- Manual error path tests

**Potential Challenges:**
- Edge runtime stack traces

**Reference Documentation:**
- PRD API patterns

---

### Task 028: Validation Constants and Zod Schemas
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [016]

**Objective:**
Define input validation for key routes (projects, diagrams, analyze-prd).

**Technical Requirements:**
- Zod or lightweight validation

**Implementation Steps:**
1. Add `src/constants/validation.constant.ts`.
2. Use in API routes for request parsing.

**Files to Create/Modify:**
- `src/constants/validation.constant.ts`
- `src/app/api/*/route.ts`

**Acceptance Criteria:**
- [ ] Invalid requests return 400 with details

**Testing Strategy:**
- Manual invalid payload tests

**Potential Challenges:**
- Schema drift as features grow

**Reference Documentation:**
- PRD Validation mentions

---

### Task 029: Login/Signup Forms Using Better Auth
**Phase:** Foundation
**Estimated Time:** 5 hours
**Priority:** Medium
**Dependencies:** [004,005]

**Objective:**
Implement forms and actions for login and signup aligning with Better Auth flows.

**Technical Requirements:**
- Server actions for auth

**Implementation Steps:**
1. Build forms in `src/modules/auth/components/*`.
2. Wire actions in `src/modules/auth/actions/auth.action.ts`.

**Files to Create/Modify:**
- `src/modules/auth/components/login-form.tsx`
- `src/modules/auth/components/signup-form.tsx`
- `src/modules/auth/actions/auth.action.ts`

**Acceptance Criteria:**
- [ ] Can sign up and log in
- [ ] Errors display clearly

**Testing Strategy:**
- Manual auth flows

**Potential Challenges:**
- Edge-safe cookie/session handling

**Reference Documentation:**
- PRD Auth foundation

---

### Task 030: Protected Dashboard Routes and Redirects
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** Medium
**Dependencies:** [004,006,029]

**Objective:**
Ensure dashboard pages and API routes require authentication and redirect unauthenticated users.

**Technical Requirements:**
- Route middleware

**Implementation Steps:**
1. Verify `middleware.ts` protects `/dashboard` and `/api/*`.
2. Add redirect-to-login logic.

**Files to Create/Modify:**
- `middleware.ts`

**Acceptance Criteria:**
- [ ] Unauthed users cannot access dashboard or APIs

**Testing Strategy:**
- Manual access attempts

**Potential Challenges:**
- Route matching for nested paths

**Reference Documentation:**
- PRD “Authentication”

---

### Task 031: Selection and Multi-Select on Canvas
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** Medium
**Dependencies:** [010]

**Objective:**
Enable click selection, shift-click multi-select, and marquee selection for nodes/edges.

**Technical Requirements:**
- React Flow selection API

**Implementation Steps:**
1. Configure selection options in `DiagramCanvas`.
2. Add UI outline for selected items.

**Files to Create/Modify:**
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Single and multi-select work
- [ ] Selected styles visible

**Testing Strategy:**
- Manual selection scenarios

**Potential Challenges:**
- Prevent accidental drags

**Reference Documentation:**
- React Flow selection

---

### Task 032: Drag-and-Drop from Sidebar Palette
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** Medium
**Dependencies:** [011-013,015]

**Objective:**
Add a sidebar palette and allow dragging node types onto the canvas.

**Technical Requirements:**
- DnD between sidebar and canvas

**Implementation Steps:**
1. Create `components/diagram/Sidebar.tsx` with node items.
2. Implement onDrop handler in `DiagramCanvas` to create nodes.

**Files to Create/Modify:**
- `src/components/diagram/Sidebar.tsx`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Dragging creates a node at drop position

**Testing Strategy:**
- Manual drag tests

**Potential Challenges:**
- Correct position mapping

**Reference Documentation:**
- PRD Sidebar in editor

---

### Task 033: Node Properties Panel (Right Sidebar)
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [010,031]

**Objective:**
Display and edit properties for selected node including label, description, metadata.

**Technical Requirements:**
- Controlled forms synced to store

**Implementation Steps:**
1. Create `NodePropertiesPanel` component.
2. Bind to selected node(s); update store and persist.

**Files to Create/Modify:**
- `src/components/diagram/NodePropertiesPanel.tsx`
- `src/components/diagram/DiagramCanvas.tsx`

**Acceptance Criteria:**
- [ ] Editing fields updates node and persists

**Testing Strategy:**
- Manual edit/persist

**Potential Challenges:**
- Handling multi-select edits

**Reference Documentation:**
- PRD Properties panel

---

### Task 034: Group/Container Node Type
**Phase:** Foundation
**Estimated Time:** 6 hours
**Priority:** High
**Dependencies:** [011,013]

**Objective:**
Add group/container nodes to visually organize children with optional collapse.

**Technical Requirements:**
- Parent/child relationships and extent

**Implementation Steps:**
1. Implement `components/diagram/nodes/GroupNode.tsx`.
2. Support `parentNode` and `extent='parent'` in nodes.

**Files to Create/Modify:**
- `src/components/diagram/nodes/GroupNode.tsx`
- `src/lib/diagram/types.ts`

**Acceptance Criteria:**
- [ ] Nodes can be nested and constrained within group

**Testing Strategy:**
- Manual nesting

**Potential Challenges:**
- Z-index and selection behavior

**Reference Documentation:**
- PRD Group/Container Implementation

---

### Task 035: Collapsible Groups and Badges
**Phase:** Foundation
**Estimated Time:** 4 hours
**Priority:** Medium
**Dependencies:** [034]

**Objective:**
Allow groups to collapse/expand and show badges (e.g., child count).

**Technical Requirements:**
- Internal collapse state with visual toggle

**Implementation Steps:**
1. Add collapse control to `GroupNode`.
2. Render badges for group type and counts.

**Files to Create/Modify:**
- `src/components/diagram/nodes/GroupNode.tsx`

**Acceptance Criteria:**
- [ ] Collapsing hides contents visually

**Testing Strategy:**
- Manual toggle

**Potential Challenges:**
- Layout shifts on collapse

**Reference Documentation:**
- PRD Group node sample

---

## Phase 2: Core Features (Weeks 4-6)
### Tasks 051-120

(Tasks to be appended in subsequent batch: project management UI, diagram lists, settings/profile, responsive design, chat UI, message rendering, input handling, message history, streaming, context management.)

## Phase 3: Advanced Features (Weeks 7-9)
### Tasks 121-180

(Tasks to be appended in subsequent batch: grouping nodes, real-time collaboration, export enhancements, AI recommendation system, conflict resolution, auto-layout, performance.)

## Phase 4: Production Polish (Weeks 10-12)
### Tasks 181-230

(Tasks to be appended in subsequent batch: performance optimization, error handling, testing, docs, deployment, monitoring.)

## Appendix
### Task Index by Category
(To be generated after full task set is complete.)

### Critical Path Tasks
(To be generated after dependency mapping.)

### Quick Reference Checklist
(To be generated after full task set is complete.)
