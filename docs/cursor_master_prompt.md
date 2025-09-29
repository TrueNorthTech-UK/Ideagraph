# Cursor Master Prompt: IdeaGraph Project Implementation

## Context
You are tasked with implementing IdeaGraph, a complex visual AI architecture tool built on the cloudflare-saas-stack foundation. This is a production-grade application requiring systematic implementation across multiple technical domains.

## Your Mission
Analyze the complete PRD (Product Requirements Document) for IdeaGraph and generate a comprehensive implementation plan broken into discrete, actionable tasks. Each task must be scoped for completion within 4-8 hours and include all necessary technical details for implementation.

---

## Task Breakdown Instructions

### Phase 1: Project Analysis and Setup
**Generate the following markdown documents:**

1. `PROJECT_OVERVIEW.md`
   - Executive summary of IdeaGraph
   - Core technical architecture
   - Technology stack breakdown
   - Development environment requirements
   - Repository structure explanation

2. `DEPENDENCIES.md`
   - Complete list of all npm packages needed
   - Version constraints and compatibility notes
   - Cloudflare-specific dependencies
   - Development vs production dependencies
   - Installation commands

3. `ARCHITECTURE_DECISIONS.md`
   - Why cloudflare-saas-stack was chosen
   - D1 vs PostgreSQL trade-offs
   - Better Auth vs other auth solutions
   - React Flow implementation approach
   - AI agent architecture reasoning
   - Real-time collaboration strategy

4. `DATABASE_SCHEMA.md`
   - Complete D1/SQLite schema
   - Table relationships diagram (text/ASCII)
   - Index strategy
   - Migration plan
   - Seed data requirements

---

## Task Generation Rules

For each feature or component in the PRD, create tasks following this structure:

```markdown
### Task [NUMBER]: [DESCRIPTIVE TITLE]

**Phase:** [Foundation/Core Features/Advanced Features/Polish]
**Estimated Time:** [4-8 hours]
**Priority:** [Critical/High/Medium/Low]
**Dependencies:** [List of task numbers that must be completed first]

**Objective:**
[2-3 sentences describing what needs to be built and why]

**Technical Requirements:**
- [Specific technical requirement 1]
- [Specific technical requirement 2]
- [Specific technical requirement 3]

**Implementation Steps:**
1. [Specific step with file paths]
2. [Specific step with code structure]
3. [Specific step with integration points]
4. [Testing requirements]

**Files to Create/Modify:**
- `path/to/file1.ts` - [Purpose]
- `path/to/file2.tsx` - [Purpose]
- `path/to/file3.ts` - [Purpose]

**Acceptance Criteria:**
- [ ] [Specific testable criterion 1]
- [ ] [Specific testable criterion 2]
- [ ] [Specific testable criterion 3]

**Testing Strategy:**
- [Unit tests needed]
- [Integration tests needed]
- [Manual testing checklist]

**Potential Challenges:**
- [Challenge 1 and mitigation strategy]
- [Challenge 2 and mitigation strategy]

**Reference Documentation:**
- [Link to relevant docs]
- [PRD section reference]
```

---

## Required Task Categories

Generate comprehensive tasks for each of these categories:

### Category 1: Foundation Setup (Tasks 1-15)
- Project initialization and cloudflare-saas-stack setup
- Environment configuration
- Database schema creation and migrations
- Authentication setup with Better Auth
- Basic routing structure
- Development tooling setup

### Category 2: Core UI Components (Tasks 16-30)
- Application layout and navigation
- Dashboard implementation
- Project management interface
- Diagram list views
- Settings and user profile
- Responsive design implementation

### Category 3: React Flow Canvas (Tasks 31-50)
- Basic canvas setup
- Custom node type components (UI, API, Database, Service, Infrastructure)
- Custom edge components with different types
- Node toolbar and controls
- Zoom, pan, and minimap
- Selection and multi-select
- Group/container nodes
- Drag and drop functionality
- Auto-layout integration
- Canvas state management with Zustand

### Category 4: AI Integration (Tasks 51-70)
- Anthropic API client setup
- Base agent architecture
- Coordinator agent implementation
- Specialist agents (Architect, Database, Frontend, Backend)
- PRD analysis agent
- Conversation management
- Agent recommendation system
- Conflict resolution logic
- Response parsing and validation

### Category 5: Conversational Interface (Tasks 71-80)
- Chat UI component
- Message rendering
- Input handling
- Message history
- Typing indicators
- Error handling
- AI response streaming
- Context management

### Category 6: PRD Import System (Tasks 81-95)
- File upload component
- Text input interface
- Document parsing (PDF, DOCX, TXT, MD)
- Entity extraction logic
- Relationship detection
- Flow identification
- Preview generation
- Import session management
- Progress indicators

### Category 7: Export System (Tasks 96-110)
- Export engine architecture
- Markdown generator
- JSON exporter
- Cursor tasks format
- PDF generation
- PNG/SVG image export
- Template system
- R2 storage integration
- Download handling

### Category 8: Real-time Collaboration (Tasks 111-125)
- Durable Objects setup
- WebSocket connection management
- Presence tracking
- Cursor position broadcasting
- Selection synchronization
- Conflict resolution
- Connection state handling
- Reconnection logic

### Category 9: Database Operations (Tasks 126-140)
- Project CRUD operations
- Diagram CRUD operations
- Conversation persistence
- AI analysis storage
- Export history
- Version management
- Query optimization
- Transaction handling

### Category 10: API Development (Tasks 141-160)
- API route structure
- Request validation with Zod
- Error handling middleware
- Rate limiting
- Authentication middleware
- Project endpoints
- Diagram endpoints
- AI analysis endpoints
- Export endpoints
- Import endpoints

### Category 11: State Management (Tasks 161-170)
- Zustand store setup
- Diagram state management
- Conversation state
- UI state management
- Persistence middleware
- Optimistic updates
- Undo/redo functionality

### Category 12: Testing (Tasks 171-185)
- Test environment setup
- Unit test structure
- Component testing
- API endpoint testing
- AI agent testing (mocked)
- Integration tests
- E2E test scenarios
- Performance testing

### Category 13: UI/UX Polish (Tasks 186-200)
- Theme implementation (dark/light mode)
- Animation and transitions
- Loading states
- Error states
- Empty states
- Keyboard shortcuts
- Accessibility improvements
- Mobile responsiveness

### Category 14: Performance Optimization (Tasks 201-210)
- Canvas rendering optimization
- Large diagram handling
- Lazy loading implementation
- Image optimization
- Bundle size optimization
- Caching strategy
- Database query optimization

### Category 15: Documentation (Tasks 211-220)
- User guide
- Developer documentation
- API documentation
- Deployment guide
- Troubleshooting guide
- Contributing guidelines

### Category 16: Deployment and DevOps (Tasks 221-230)
- Wrangler configuration
- Environment variables setup
- D1 migrations deployment
- R2 bucket setup
- Durable Objects deployment
- Production monitoring
- Error tracking setup
- Performance monitoring
- Backup strategy

---

## Additional Documentation Requirements

Generate these supplementary documents:

### `IMPLEMENTATION_PHASES.md`
Break down the 230 tasks into 4 distinct phases:
- Phase 1: Foundation (Weeks 1-3)
- Phase 2: Core Features (Weeks 4-6)
- Phase 3: Advanced Features (Weeks 7-9)
- Phase 4: Production Polish (Weeks 10-12)

For each phase, include:
- Phase objectives
- Task numbers included
- Dependencies between tasks
- Deliverables
- Testing requirements
- Risk assessment

### `TASK_DEPENDENCIES.md`
Create a visual dependency graph (text/ASCII) showing:
- Critical path tasks
- Parallel workstreams
- Blocking dependencies
- Optional enhancements

### `TECHNICAL_CHALLENGES.md`
Document anticipated challenges:
- Cloudflare D1 limitations (SQLite constraints)
- Real-time collaboration complexity
- AI response parsing reliability
- Large diagram performance
- Cross-browser compatibility
- Mitigation strategies for each

### `API_ENDPOINTS.md`
Complete API specification:
- All endpoints with methods
- Request/response schemas
- Authentication requirements
- Rate limiting rules
- Error codes
- Example requests/responses

### `COMPONENT_HIERARCHY.md`
React component structure:
- Component tree diagram
- Props interfaces
- State management approach
- Reusable components
- Component responsibilities

### `STATE_MANAGEMENT.md`
Zustand store specifications:
- Store structure
- Actions and mutations
- Selectors
- Persistence strategy
- Middleware usage

### `AI_AGENT_PROMPTS.md`
Complete prompt library:
- Each agent's system prompt
- Input/output formats
- Example conversations
- Prompt optimization notes
- Token usage estimates

### `TESTING_STRATEGY.md`
Comprehensive testing plan:
- Unit test coverage targets
- Integration test scenarios
- E2E test flows
- Performance benchmarks
- Testing tools and frameworks

### `DEPLOYMENT_CHECKLIST.md`
Pre-launch verification:
- Environment configuration
- Database migrations
- Security audit
- Performance testing
- Monitoring setup
- Backup verification
- Documentation completeness

---

## Task Formatting Requirements

### Critical Rules:
1. **No task should exceed 8 hours of estimated work**
2. **Each task must have clear acceptance criteria**
3. **All dependencies must be explicitly listed**
4. **File paths must be specific and complete**
5. **Implementation steps must be actionable**
6. **Testing requirements must be included**

### Numbering Convention:
- Use zero-padded numbers: Task 001, Task 002, etc.
- Group related tasks sequentially
- Leave gaps (e.g., 010, 020, 030) for future insertions

### Priority Levels:
- **Critical:** Blocks all other work, must be done first
- **High:** Core functionality, needed for MVP
- **Medium:** Important but not blocking
- **Low:** Nice-to-have, can be deferred

### File Path Standards:
- Use forward slashes: `app/api/diagrams/route.ts`
- Include file extensions
- Show full path from project root
- Note if creating new directory

---

## Output Structure

Generate all tasks in a single markdown file: `IMPLEMENTATION_TASKS.md`

Structure as follows:

```markdown
# IdeaGraph Implementation Tasks
**Total Tasks:** 230
**Estimated Duration:** 12 weeks
**Last Updated:** [Date]

## Quick Navigation
- [Phase 1: Foundation](#phase-1-foundation-weeks-1-3)
- [Phase 2: Core Features](#phase-2-core-features-weeks-4-6)
- [Phase 3: Advanced Features](#phase-3-advanced-features-weeks-7-9)
- [Phase 4: Production Polish](#phase-4-production-polish-weeks-10-12)

## Phase 1: Foundation (Weeks 1-3)
### Tasks 001-050

[Individual tasks following the template above]

## Phase 2: Core Features (Weeks 4-6)
### Tasks 051-120

[Individual tasks]

## Phase 3: Advanced Features (Weeks 7-9)
### Tasks 121-180

[Individual tasks]

## Phase 4: Production Polish (Weeks 10-12)
### Tasks 181-230

[Individual tasks]

## Appendix
### Task Index by Category
### Critical Path Tasks
### Quick Reference Checklist
```

---

## Special Considerations

### For Cloudflare-Specific Tasks:
- Note any Workers limitations
- Document D1/SQLite constraints
- Highlight Durable Objects complexity
- Mention R2 integration patterns

### For AI Integration Tasks:
- Include prompt examples
- Document token limits
- Note rate limiting considerations
- Provide fallback strategies

### For React Flow Tasks:
- Reference official documentation
- Note performance considerations
- Document custom node patterns
- Include layout algorithms

### For State Management:
- Show state structure
- Document update patterns
- Include persistence logic
- Note optimization strategies

---

## Validation Checklist

Before finalizing the task breakdown, verify:

- [ ] All 230+ tasks are present
- [ ] No task exceeds 8 hours
- [ ] All dependencies are mapped
- [ ] File paths are specific
- [ ] Acceptance criteria are testable
- [ ] All documentation files are generated
- [ ] Tasks align with PRD requirements
- [ ] Critical path is identified
- [ ] Testing is integrated throughout
- [ ] Deployment steps are included

---

## Final Instructions

1. Read the complete IdeaGraph PRD thoroughly
2. Generate all requested documentation files
3. Create all 230+ implementation tasks
4. Ensure tasks are sequenced logically
5. Verify all dependencies are correct
6. Review for completeness and clarity
7. Output in markdown format ready for immediate use

**Remember:** This is a complex, production-grade application. The task breakdown must be thorough enough for systematic implementation while remaining actionable for developers working with AI coding assistants like Cursor.

**Begin generating the complete task breakdown and all supplementary documentation now.**