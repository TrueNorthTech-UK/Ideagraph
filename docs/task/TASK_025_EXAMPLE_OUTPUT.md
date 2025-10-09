# Task 025 Example Output: Export API Responses

This document shows example responses from the Export API endpoint.

---

## GET /api/export/[diagramId] - Available Formats

### Request
```bash
GET /api/export/abc-123-def
Authorization: Bearer {session-cookie}
```

### Response (200 OK)
```json
{
  "success": true,
  "diagramId": "abc-123-def",
  "diagramName": "E-Commerce Architecture",
  "nodeCount": 12,
  "edgeCount": 18,
  "availableFormats": [
    {
      "format": "markdown",
      "mimeType": "text/markdown",
      "extension": "md",
      "description": "Comprehensive Markdown documentation",
      "status": "available"
    },
    {
      "format": "json",
      "mimeType": "application/json",
      "extension": "json",
      "description": "Normalized JSON export with metadata",
      "status": "available"
    },
    {
      "format": "cursor",
      "mimeType": "application/json",
      "extension": "cursor.json",
      "description": "Cursor IDE task format",
      "status": "available"
    },
    {
      "format": "pdf",
      "mimeType": "application/pdf",
      "extension": "pdf",
      "description": "PDF document export",
      "status": "coming-soon",
      "plannedTask": "Task 074"
    },
    {
      "format": "png",
      "mimeType": "image/png",
      "extension": "png",
      "description": "PNG image export",
      "status": "coming-soon",
      "plannedTask": "Task 075"
    },
    {
      "format": "svg",
      "mimeType": "image/svg+xml",
      "extension": "svg",
      "description": "SVG vector image export",
      "status": "coming-soon",
      "plannedTask": "Task 075"
    }
  ]
}
```

---

## POST /api/export/[diagramId] - Markdown Export

### Request (Body Method)
```bash
POST /api/export/abc-123-def
Content-Type: application/json

{
  "format": "markdown",
  "options": {
    "includeTOC": true,
    "includeMetadata": true,
    "includeNodeDetails": true,
    "includeEdgeDetails": true,
    "includeMermaidDiagrams": false,
    "startingHeadingLevel": 1
  }
}
```

### Response (200 OK)
```
Content-Type: text/markdown
Content-Disposition: inline; filename="e-commerce-architecture-2025-10-09.md"
X-Export-Format: markdown
X-Node-Count: 12
X-Edge-Count: 18

# E-Commerce Architecture

Comprehensive architecture diagram for e-commerce platform.

**Author:** John Doe
**Generated:** 2025-10-09T15:30:00.000Z
**Created:** 2025-10-08T10:00:00.000Z
**Last Updated:** 2025-10-09T14:45:00.000Z

---

## Table of Contents

- [Overview](#overview)
- [Components](#components)
- [Connections](#connections)
- [Flows](#flows)
- [Specifications](#specifications)

---

## Overview

This diagram contains **12 components** and **18 connections**.

### Component Breakdown

- **UI Components**: 3 components
- **API Endpoints**: 4 components
- **Services**: 2 components
- **Databases**: 2 components
- **Infrastructure**: 1 component

...
```

---

## POST /api/export/[diagramId] - JSON Export

### Request (Query Parameter Method)
```bash
POST /api/export/abc-123-def?format=json&download=true
Content-Type: application/json

{
  "options": {
    "prettyPrint": true,
    "includeComputedProperties": true,
    "indent": 2
  }
}
```

### Response (200 OK)
```json
Content-Type: application/json
Content-Disposition: attachment; filename="e-commerce-architecture-2025-10-09.json"
X-Export-Format: json
X-Node-Count: 12
X-Edge-Count: 18

{
  "$schema": "ideagraph-diagram-export",
  "version": "1.0.0",
  "metadata": {
    "id": "abc-123-def",
    "name": "E-Commerce Architecture",
    "description": "Comprehensive architecture diagram for e-commerce platform",
    "project": {
      "id": "proj-456",
      "name": "E-Commerce Platform"
    },
    "author": "John Doe",
    "authorId": "user-789",
    "authorEmail": "john@example.com",
    "timestamps": {
      "exported": "2025-10-09T15:30:00.000Z",
      "created": "2025-10-08T10:00:00.000Z",
      "updated": "2025-10-09T14:45:00.000Z"
    }
  },
  "diagram": {
    "nodes": [
      {
        "id": "node-1",
        "type": "ui-component",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Product Catalog",
          "description": "UI component for browsing products"
        }
      },
      {
        "id": "node-2",
        "type": "api-endpoint",
        "position": { "x": 300, "y": 100 },
        "data": {
          "label": "GET /api/products",
          "description": "Endpoint to fetch product listings"
        }
      }
      // ... more nodes
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "type": "data-flow",
        "data": {
          "label": "Fetch products"
        }
      }
      // ... more edges
    ]
  },
  "statistics": {
    "summary": {
      "totalNodes": 12,
      "totalEdges": 18,
      "nodeTypes": 5,
      "edgeTypes": 3
    },
    "nodes": {
      "byType": [
        {
          "type": "ui-component",
          "count": 3,
          "ids": ["node-1", "node-5", "node-9"]
        },
        {
          "type": "api-endpoint",
          "count": 4,
          "ids": ["node-2", "node-6", "node-10", "node-11"]
        }
        // ... more types
      ]
    },
    "edges": {
      "byType": [
        {
          "type": "data-flow",
          "count": 10
        },
        {
          "type": "dependency",
          "count": 5
        },
        {
          "type": "user-flow",
          "count": 3
        }
      ]
    }
  },
  "computed": {
    "connectivity": {
      "nodes": [
        {
          "id": "node-2",
          "incoming": 3,
          "outgoing": 5,
          "total": 8,
          "incomingFrom": ["node-1", "node-5", "node-9"],
          "outgoingTo": ["node-3", "node-4", "node-7", "node-8", "node-12"]
        }
        // ... more nodes
      ],
      "highlyConnected": [
        { "id": "node-2", "connections": 8 },
        { "id": "node-6", "connections": 6 },
        { "id": "node-3", "connections": 5 }
      ]
    },
    "flows": {
      "dataFlow": {
        "count": 10,
        "paths": [
          { "from": "node-1", "to": "node-2" },
          { "from": "node-2", "to": "node-3" }
          // ... more paths
        ]
      },
      "userFlow": {
        "count": 3,
        "paths": [
          { "from": "node-1", "to": "node-5" }
          // ... more paths
        ]
      },
      "dependencies": {
        "count": 5,
        "relationships": [
          { "dependent": "node-2", "dependsOn": "node-3" }
          // ... more relationships
        ]
      }
    },
    "complexity": {
      "nodeCount": 12,
      "edgeCount": 18,
      "averageConnections": 3.0,
      "density": 0.1364,
      "score": 42
    }
  }
}
```

---

## POST /api/export/[diagramId] - Cursor Tasks Export

### Request
```bash
POST /api/export/abc-123-def
Content-Type: application/json

{
  "format": "cursor",
  "options": {
    "includeHints": true,
    "groupByType": false,
    "defaultPriority": "medium",
    "defaultEstimatedTime": 5
  }
}
```

### Response (200 OK)
```json
Content-Type: application/json
Content-Disposition: inline; filename="e-commerce-architecture-2025-10-09.cursor.json"
X-Export-Format: cursor
X-Node-Count: 12
X-Edge-Count: 18

{
  "$schema": "https://cursor.sh/schemas/tasks/v1.0.0",
  "version": "1.0.0",
  "project": {
    "id": "proj-456",
    "name": "E-Commerce Platform",
    "description": "Implementation tasks generated from IdeaGraph diagram",
    "diagramId": "abc-123-def",
    "diagramName": "E-Commerce Architecture"
  },
  "metadata": {
    "generatedAt": "2025-10-09T15:30:00.000Z",
    "generatedBy": "IdeaGraph Export System",
    "totalTasks": 12,
    "author": "John Doe",
    "owner": {
      "id": "user-789",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "source": {
      "type": "diagram",
      "id": "abc-123-def",
      "nodeCount": 12,
      "edgeCount": 18
    }
  },
  "tasks": [
    {
      "id": "node-1",
      "taskNumber": 1,
      "title": "Implement Product Catalog UI Component",
      "description": "This task involves implementing a frontend UI component.\n\nUI component for browsing products\n\n**Objectives:**\n- Implement Product Catalog according to specifications\n- Create component with proper styling\n- Implement state management\n- Ensure accessibility standards",
      "type": "ui-component",
      "priority": "medium",
      "status": "pending",
      "estimatedHours": 6,
      "phase": "UI & Polish",
      "tags": ["ui-component", "frontend", "react", "ui"],
      "acceptanceCriteria": [
        "Component renders without errors",
        "All props are properly typed",
        "Component is responsive on all screen sizes",
        "Accessibility standards met (ARIA labels, keyboard navigation)",
        "Provides required interface for 1 downstream component",
        "All tests passing"
      ],
      "files": [
        "src/components/product-catalog/product-catalog.tsx",
        "src/components/product-catalog/product-catalog.test.tsx",
        "src/components/product-catalog/index.ts"
      ],
      "relatedComponents": [
        {
          "id": "node-2",
          "title": "GET /api/products",
          "type": "data-flow"
        }
      ],
      "hints": [
        "Use Shadcn/ui components for consistent styling",
        "Implement proper TypeScript types for all props",
        "Add loading and error states",
        "Consider mobile responsiveness from the start"
      ],
      "diagramPosition": {
        "x": 100,
        "y": 100
      }
    }
    // ... more tasks
  ],
  "diagram": {
    "nodes": 12,
    "edges": 18,
    "complexity": 42
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Please log in"
}
```

### 404 Not Found
```json
{
  "error": "Diagram not found or you don't have access to it"
}
```

### 400 Bad Request - Invalid Format
```json
{
  "error": "Invalid export format. Must be one of: markdown, json, cursor, pdf, png, svg",
  "validFormats": ["markdown", "json", "cursor", "pdf", "png", "svg"]
}
```

### 400 Bad Request - Missing Format
```json
{
  "error": "Export format is required (in body or query parameter)"
}
```

### 400 Bad Request - Unsupported Format
```json
{
  "error": "Export format 'invalid-format' is not supported",
  "code": "UNSUPPORTED_FORMAT"
}
```

### 500 Internal Server Error - Corrupted Data
```json
{
  "error": "Diagram data is corrupted or invalid"
}
```

### 501 Not Implemented - PDF Export
```json
{
  "error": "PDF export is not yet implemented",
  "code": "NOT_IMPLEMENTED"
}
```

### 400 Bad Request - Invalid Diagram Data
```json
{
  "error": "Diagram ID is required",
  "code": "INVALID_DATA"
}
```

---

## Response Headers

### Successful Export
```
HTTP/1.1 200 OK
Content-Type: text/markdown
Content-Disposition: inline; filename="e-commerce-architecture-2025-10-09.md"
X-Export-Format: markdown
X-Node-Count: 12
X-Edge-Count: 18
Content-Length: 15420
```

### Download Mode
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Disposition: attachment; filename="e-commerce-architecture-2025-10-09.json"
X-Export-Format: json
X-Node-Count: 12
X-Edge-Count: 18
Content-Length: 28640
```

---

**End of Example Output**

