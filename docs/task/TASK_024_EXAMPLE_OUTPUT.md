# Task 024 - Example Cursor Export Output

This document shows example output from the Cursor tasks export feature.

---

## Sample Input Diagram

**Diagram Name:** E-Commerce Architecture  
**Nodes:** 6 components  
**Edges:** 5 connections

### Node Types:
1. Infrastructure (Cloudflare Workers)
2. Database (Products Database)
3. API Endpoint (Product API)
4. Service (Cart Service)
5. UI Component (Product List)
6. UI Component (Shopping Cart)

---

## Generated Cursor Tasks Output

```json
{
  "$schema": "https://cursor.sh/schemas/tasks/v1.0.0",
  "version": "1.0.0",
  "project": {
    "id": "project-ecommerce",
    "name": "E-Commerce Platform",
    "description": "Sample e-commerce system architecture for testing Cursor export",
    "diagramId": "diagram-test-001",
    "diagramName": "E-Commerce Architecture"
  },
  "metadata": {
    "generatedAt": "2025-10-09T12:00:00.000Z",
    "generatedBy": "IdeaGraph Export System",
    "totalTasks": 6,
    "owner": {
      "id": "user-123",
      "name": "John Developer",
      "email": "john@example.com"
    },
    "source": {
      "type": "diagram",
      "id": "diagram-test-001",
      "nodeCount": 6,
      "edgeCount": 5
    }
  },
  "diagram": {
    "nodes": 6,
    "edges": 5,
    "complexity": 22
  },
  "tasks": [
    {
      "id": "infra-1",
      "taskNumber": 1,
      "title": "Configure Cloudflare Workers Infrastructure",
      "description": "This task involves infrastructure configuration.\n\nEdge computing platform for serverless functions\n\n**Objectives:**\n- Implement Cloudflare Workers according to specifications",
      "type": "infrastructure",
      "priority": "critical",
      "status": "pending",
      "estimatedHours": 6,
      "phase": "Foundation",
      "tags": [
        "infrastructure",
        "infrastructure",
        "config",
        "devops"
      ],
      "acceptanceCriteria": [
        "Infrastructure is properly configured",
        "Security best practices followed",
        "Monitoring and logging enabled",
        "Documentation is complete",
        "Provides required interface for 1 downstream component",
        "All tests passing"
      ],
      "files": [
        "infrastructure/cloudflare-workers.yml",
        "wrangler.jsonc"
      ],
      "relatedComponents": [
        {
          "id": "db-1",
          "title": "Products Database",
          "type": "dependency"
        }
      ],
      "diagramPosition": {
        "x": 100,
        "y": 100
      }
    },
    {
      "id": "db-1",
      "taskNumber": 2,
      "title": "Set Up Products Database Database",
      "description": "This task involves database setup and configuration.\n\nMain product catalog database\n\n**Objectives:**\n- Implement Products Database according to specifications\n- Define schema and relationships\n- Create migrations\n- Add indexes for performance",
      "type": "database",
      "priority": "critical",
      "status": "pending",
      "estimatedHours": 5,
      "phase": "Foundation",
      "tags": [
        "database",
        "database",
        "schema",
        "data"
      ],
      "acceptanceCriteria": [
        "Schema matches design specifications",
        "Migrations run successfully",
        "Indexes are properly configured",
        "Queries are optimized for performance",
        "Integrates correctly with 1 upstream component",
        "Provides required interface for 1 downstream component",
        "All tests passing"
      ],
      "files": [
        "src/db/schema.ts",
        "src/drizzle/migrations/*_products-database.sql"
      ],
      "dependencies": [
        {
          "id": "infra-1",
          "title": "Cloudflare Workers",
          "type": "dependency"
        }
      ],
      "relatedComponents": [
        {
          "id": "api-1",
          "title": "Product API",
          "type": "data-flow"
        }
      ],
      "diagramPosition": {
        "x": 300,
        "y": 100
      }
    },
    {
      "id": "api-1",
      "taskNumber": 3,
      "title": "Create Product API API Endpoint",
      "description": "This task involves creating a backend API endpoint.\n\nREST API for product operations (CRUD)\n\n**Objectives:**\n- Implement Product API according to specifications\n- Define request/response schemas\n- Add input validation\n- Implement error handling",
      "type": "api-endpoint",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 6,
      "phase": "Integration",
      "tags": [
        "api-endpoint",
        "backend",
        "api",
        "endpoint"
      ],
      "acceptanceCriteria": [
        "Endpoint responds with correct status codes",
        "Request validation works correctly",
        "Response schema matches specification",
        "Error handling covers all edge cases",
        "Integrates correctly with 1 upstream component",
        "Provides required interface for 2 downstream components",
        "All tests passing"
      ],
      "files": [
        "src/app/api/product-api/route.ts",
        "src/app/api/product-api/route.test.ts"
      ],
      "dependencies": [
        {
          "id": "db-1",
          "title": "Products Database",
          "type": "data-flow"
        }
      ],
      "relatedComponents": [
        {
          "id": "service-1",
          "title": "Cart Service",
          "type": "data-flow"
        },
        {
          "id": "ui-1",
          "title": "Product List",
          "type": "data-flow"
        }
      ],
      "diagramPosition": {
        "x": 500,
        "y": 100
      }
    }
  ]
}
```

---

## Example with Implementation Hints

When `includeHints: true` is set, each task includes helpful implementation guidance:

```json
{
  "id": "ui-1",
  "taskNumber": 5,
  "title": "Implement Product List UI Component",
  "hints": [
    "Use Shadcn/ui components for consistent styling",
    "Implement proper TypeScript types for all props",
    "Add loading and error states",
    "Consider mobile responsiveness from the start"
  ],
  "acceptanceCriteria": [
    "Component renders without errors",
    "All props are properly typed",
    "Component is responsive on all screen sizes",
    "Accessibility standards met (ARIA labels, keyboard navigation)",
    "Integrates correctly with 1 upstream component",
    "All tests passing"
  ],
  "files": [
    "src/components/product-list/product-list.tsx",
    "src/components/product-list/product-list.test.tsx",
    "src/components/product-list/index.ts"
  ]
}
```

---

## Example with Phase Grouping

When `groupByType: true` is set, tasks are organized by implementation phase:

```json
{
  "tasks": {
    "Foundation": [
      {
        "id": "infra-1",
        "title": "Configure Cloudflare Workers Infrastructure",
        "phase": "Foundation"
      },
      {
        "id": "db-1",
        "title": "Set Up Products Database Database",
        "phase": "Foundation"
      }
    ],
    "Integration": [
      {
        "id": "api-1",
        "title": "Create Product API API Endpoint",
        "phase": "Integration"
      },
      {
        "id": "service-1",
        "title": "Implement Cart Service Service",
        "phase": "Integration"
      }
    ],
    "UI & Polish": [
      {
        "id": "ui-1",
        "title": "Implement Product List UI Component",
        "phase": "UI & Polish"
      },
      {
        "id": "ui-2",
        "title": "Implement Shopping Cart UI Component",
        "phase": "UI & Polish"
      }
    ]
  }
}
```

---

## Key Features Demonstrated

### 1. Intelligent Task Generation
- **Context-aware titles**: "Create Product API API Endpoint" vs "Implement Shopping Cart UI Component"
- **Type-specific descriptions**: Different objectives for API endpoints vs UI components
- **Adaptive criteria**: API endpoints get validation/error handling criteria, UI components get accessibility criteria

### 2. Dependency Intelligence
- **Upstream dependencies**: Product API depends on Products Database
- **Downstream relationships**: Product API provides interface to Cart Service and Product List
- **Priority elevation**: Critical for infrastructure/database, high for highly connected nodes

### 3. Developer Guidance
- **File path suggestions**: Follow project conventions for each node type
- **Implementation hints**: Technology-specific guidance (Zod for APIs, Shadcn/ui for UI)
- **Acceptance criteria**: 5-7 specific, testable criteria per task
- **Time estimates**: Based on node type and connection complexity

### 4. Organization Features
- **Phase determination**: Automatic categorization (Foundation → Core → Integration → Polish)
- **Tag generation**: Multiple tags for filtering (e.g., ["ui-component", "frontend", "react", "ui"])
- **Grouping options**: Flat list or grouped by phase
- **Position preservation**: Original diagram coordinates included for reference

---

## Usage in Cursor IDE

The exported JSON file can be:
1. Imported into Cursor IDE's task management
2. Used to generate implementation checklists
3. Tracked as project tasks with status updates
4. Filtered by phase, priority, or tags
5. Referenced during development for acceptance criteria

---

**Generated by IdeaGraph Export System v0.1.24**

