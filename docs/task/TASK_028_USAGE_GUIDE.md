# Validation Schema Usage Guide

## Quick Start

Import schemas from the centralized validation constants:

```typescript
import {
  createProjectSchema,
  createDiagramSchema,
  analyzePrdSchema,
  exportRequestSchema,
  validateRequest,
  safeValidateRequest,
} from '@/constants/validation.constant';
```

---

## Usage Patterns

### Pattern 1: Throw on Validation Error (Simple)

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This will throw if validation fails
    const validation = createProjectSchema.safeParse(body);
    
    if (!validation.success) {
      throw validationError(
        "Invalid project data",
        undefined,
        validation.error.issues
      );
    }
    
    const { name, description } = validation.data;
    // ... use validated data
  } catch (error) {
    return handleApiError(error, requestId);
  }
}
```

### Pattern 2: Graceful Error Handling

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Safe parsing returns success/error object
  const result = safeValidateRequest(createProjectSchema, body);
  
  if (!result.success) {
    return NextResponse.json({
      success: false,
      errors: result.errors.issues,
    }, { status: 400 });
  }
  
  // Use result.data with full type inference
  const { name, description } = result.data;
}
```

### Pattern 3: Direct Validation (Advanced)

```typescript
// For simple validations that should throw
const projectId = validateRequest(projectIdSchema, params.projectId);

// For UUID validation
const diagramId = diagramIdSchema.parse(params.diagramId);
```

---

## Schema Reference

### Project Schemas

#### createProjectSchema
```typescript
{
  name: string,        // 3-100 chars, trimmed, required
  description?: string // 0-500 chars, trimmed, optional
}
```

**Example:**
```typescript
const validProject = {
  name: "My Architecture Project",
  description: "System design for the payment service"
};

const validated = createProjectSchema.parse(validProject);
```

#### updateProjectSchema
```typescript
{
  name?: string,       // 3-100 chars, trimmed, optional
  description?: string // 0-500 chars, trimmed, optional, nullable
}
```

**Example:**
```typescript
const update = {
  description: "Updated description"
};

const validated = updateProjectSchema.parse(update);
```

---

### Diagram Schemas

#### createDiagramSchema
```typescript
{
  projectId: string,    // UUID, required
  name: string,         // 3-100 chars, required
  description?: string, // 0-500 chars, optional
  nodes?: Node[],       // Array or JSON string, max 1000
  edges?: Edge[],       // Array or JSON string, max 2000
  metadata?: object     // Object or JSON string
}
```

**Example with arrays:**
```typescript
const newDiagram = {
  projectId: "123e4567-e89b-12d3-a456-426614174000",
  name: "Architecture Diagram",
  nodes: [
    {
      id: "node-1",
      type: "uiComponent",
      position: { x: 100, y: 100 },
      data: { label: "Login Form" }
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2"
    }
  ]
};

const validated = createDiagramSchema.parse(newDiagram);
```

**Example with JSON strings:**
```typescript
const newDiagram = {
  projectId: "123e4567-e89b-12d3-a456-426614174000",
  name: "Architecture Diagram",
  nodes: '[{"id":"node-1","type":"uiComponent","position":{"x":100,"y":100}}]',
  edges: '[{"id":"edge-1","source":"node-1","target":"node-2"}]'
};

const validated = createDiagramSchema.parse(newDiagram);
// nodes and edges are automatically parsed and validated
```

#### updateDiagramSchema
```typescript
{
  name?: string,        // 3-100 chars, optional
  description?: string, // 0-500 chars, optional, nullable
  nodes?: Node[],       // Array or JSON string, max 1000, optional
  edges?: Edge[],       // Array or JSON string, max 2000, optional
  metadata?: object     // Object or JSON string, optional
}
```

**Example:**
```typescript
const update = {
  name: "Updated Diagram Name",
  nodes: [
    // Updated nodes array
  ]
};

const validated = updateDiagramSchema.parse(update);
```

---

### AI Analysis Schemas

#### analyzePrdSchema
```typescript
{
  content: string,      // 100-100,000 chars, trimmed, required
  projectId?: string,   // UUID, optional
  fileName?: string     // Max 255 chars, optional
}
```

**Example:**
```typescript
const analysisRequest = {
  content: "Your PRD content here... (at least 100 characters)",
  projectId: "123e4567-e89b-12d3-a456-426614174000",
  fileName: "requirements.txt"
};

const validated = analyzePrdSchema.parse(analysisRequest);
```

#### summarizeSchema
```typescript
{
  content: string       // 10-50,000 chars, trimmed, required
}
```

---

### Export Schemas

#### exportRequestSchema
```typescript
{
  format: 'markdown' | 'json' | 'cursor' | 'pdf' | 'png' | 'svg',
  options?: {
    // Format-specific options
  }
}
```

**Example - Markdown Export:**
```typescript
const exportRequest = {
  format: "markdown",
  options: {
    includeTOC: true,
    includeNodeDetails: true,
    includeEdgeDetails: false,
    startingHeadingLevel: 2,
    title: "System Architecture",
    author: "Development Team"
  }
};

const validated = exportRequestSchema.parse(exportRequest);
```

**Example - JSON Export:**
```typescript
const exportRequest = {
  format: "json",
  options: {
    prettyPrint: true,
    indent: 2,
    includeComputedProperties: true
  }
};

const validated = exportRequestSchema.parse(exportRequest);
```

**Example - Cursor Export:**
```typescript
const exportRequest = {
  format: "cursor",
  options: {
    includeSubtasks: true,
    priorityLevel: "high",
    includeTestingNotes: true,
    phase: "Phase 1: Foundation"
  }
};

const validated = exportRequestSchema.parse(exportRequest);
```

#### exportQuerySchema
```typescript
{
  format: 'markdown' | 'json' | 'cursor' | 'pdf' | 'png' | 'svg',
  download?: string     // "true" or "false", transformed to boolean
}
```

**Example:**
```typescript
// From query parameters: ?format=markdown&download=true
const queryParams = {
  format: "markdown",
  download: "true"  // String "true" automatically converted to boolean
};

const validated = exportQuerySchema.parse(queryParams);
// validated.download === true (boolean)
```

---

## Node and Edge Validation

### Node Schema
```typescript
{
  id: string,
  type: string,
  position: { x: number, y: number },
  data?: {
    label?: string,      // 1-100 chars
    description?: string, // 0-500 chars
    type?: 'uiComponent' | 'apiEndpoint' | 'database' | 'service' | 'infrastructure'
  },
  width?: number,
  height?: number,
  selected?: boolean,
  dragging?: boolean,
  style?: Record<string, unknown>,
  // ... passthrough allows additional properties
}
```

### Edge Schema
```typescript
{
  id: string,
  source: string,
  target: string,
  sourceHandle?: string | null,
  targetHandle?: string | null,
  type?: string,
  animated?: boolean,
  data?: {
    label?: string,           // Max 100 chars
    edgeType?: 'dataFlow' | 'dependency' | 'userFlow',
    animated?: boolean
  },
  style?: Record<string, unknown>,
  label?: string,
  labelStyle?: Record<string, unknown>,
  labelBgStyle?: Record<string, unknown>,
  // ... passthrough allows additional properties
}
```

---

## Error Handling

### Validation Error Response Format

When validation fails, the API returns a structured error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project data",
    "details": [
      {
        "code": "too_small",
        "minimum": 3,
        "type": "string",
        "inclusive": true,
        "message": "Project name must be at least 3 characters",
        "path": ["name"]
      }
    ],
    "field": "name",
    "timestamp": "2025-10-09T12:00:00.000Z",
    "requestId": "uuid-here"
  }
}
```

### Common Validation Errors

#### 1. Field Too Short
```typescript
// Input
{ name: "ab" }

// Error
{
  "code": "too_small",
  "message": "Project name must be at least 3 characters",
  "path": ["name"]
}
```

#### 2. Field Too Long
```typescript
// Input
{ description: "x".repeat(501) }

// Error
{
  "code": "too_big",
  "message": "Description must be less than 500 characters",
  "path": ["description"]
}
```

#### 3. Invalid UUID Format
```typescript
// Input
{ projectId: "not-a-uuid" }

// Error
{
  "validation": "uuid",
  "code": "invalid_string",
  "message": "Invalid ID format",
  "path": ["projectId"]
}
```

#### 4. Invalid JSON String
```typescript
// Input
{ nodes: "invalid json" }

// Error
{
  "code": "custom",
  "message": "Invalid JSON format for nodes",
  "path": ["nodes"]
}
```

#### 5. Invalid Enum Value
```typescript
// Input
{ format: "invalid-format" }

// Error
{
  "received": "invalid-format",
  "code": "invalid_enum_value",
  "options": ["markdown", "json", "cursor", "pdf", "png", "svg"],
  "message": "Invalid enum value. Expected 'markdown' | 'json' | ...",
  "path": ["format"]
}
```

---

## Best Practices

### 1. Always Use Safe Parse in API Routes

```typescript
// ✅ Good - handles errors gracefully
const validation = schema.safeParse(body);
if (!validation.success) {
  throw validationError("...", undefined, validation.error.issues);
}

// ❌ Avoid - can throw unhandled errors
const data = schema.parse(body);
```

### 2. Provide Field Context in Errors

```typescript
// ✅ Good - specifies which field failed
throw validationError("Invalid diagram ID", "diagramId", issues);

// ❌ Less helpful - generic error
throw validationError("Invalid input");
```

### 3. Convert Types Before Database Operations

```typescript
// ✅ Good - explicit conversion
const nodesStr = typeof nodes === "string" 
  ? nodes 
  : JSON.stringify(nodes);

await db.insert(diagrams).values({ nodes: nodesStr });

// ❌ Bad - type mismatch
await db.insert(diagrams).values({ nodes }); // nodes might be array
```

### 4. Use Validation Limits Constants

```typescript
// ✅ Good - uses constants
import { VALIDATION_LIMITS } from '@/constants/validation.constant';

if (text.length > VALIDATION_LIMITS.PROJECT.DESCRIPTION_MAX) {
  // ...
}

// ❌ Bad - magic numbers
if (text.length > 500) {
  // ...
}
```

---

## Extending the Validation System

### Adding a New Schema

1. Add limits to `VALIDATION_LIMITS`:
```typescript
export const VALIDATION_LIMITS = {
  // ... existing limits
  NEW_ENTITY: {
    NAME_MIN: 3,
    NAME_MAX: 100,
  },
} as const;
```

2. Create the schema:
```typescript
export const createNewEntitySchema = z.object({
  name: z.string()
    .min(VALIDATION_LIMITS.NEW_ENTITY.NAME_MIN)
    .max(VALIDATION_LIMITS.NEW_ENTITY.NAME_MAX)
    .trim(),
  // ... other fields
});
```

3. Use in API route:
```typescript
import { createNewEntitySchema } from '@/constants/validation.constant';

const validation = createNewEntitySchema.safeParse(body);
if (!validation.success) {
  throw validationError("Invalid data", undefined, validation.error.issues);
}
```

### Adding Format-Specific Export Options

1. Define the option schema:
```typescript
const newFormatExportOptionsSchema = z.object({
  customOption: z.boolean().optional(),
  // ... other options
}).optional();
```

2. Add to export request schema union:
```typescript
export const exportRequestSchema = z.object({
  format: exportFormatSchema,
  options: z.union([
    markdownExportOptionsSchema,
    jsonExportOptionsSchema,
    // ... add new schema here
    newFormatExportOptionsSchema,
  ]).optional(),
});
```

---

## Testing Validation Schemas

### Unit Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { createProjectSchema } from '@/constants/validation.constant';

describe('Project Validation', () => {
  it('should accept valid project', () => {
    const valid = { name: "Test Project" };
    const result = createProjectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
  
  it('should reject short name', () => {
    const invalid = { name: "ab" };
    const result = createProjectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 3 characters");
    }
  });
});
```

### Integration Testing Example

```typescript
describe('POST /api/projects', () => {
  it('should return 400 for invalid project', async () => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "ab" })
    });
    
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error.code).toBe('VALIDATION_ERROR');
    expect(json.error.details[0].path).toEqual(['name']);
  });
});
```

---

## Migration Guide

If you're migrating existing inline schemas:

### Step 1: Import Centralized Schema
```typescript
// Before
const createProjectSchema = z.object({
  name: z.string().min(3).max(100),
});

// After
import { createProjectSchema } from '@/constants/validation.constant';
```

### Step 2: Remove Inline Definition
Delete the inline schema definition.

### Step 3: Update Usage
Ensure you're using `.safeParse()` and handling errors properly:

```typescript
// Before
const { name } = await request.json();

// After
const body = await request.json();
const validation = createProjectSchema.safeParse(body);
if (!validation.success) {
  throw validationError("Invalid project data", undefined, validation.error.issues);
}
const { name } = validation.data;
```

### Step 4: Update Type Conversions
If working with diagram nodes/edges, ensure proper conversion:

```typescript
// After validation
const nodesStr = typeof nodes === "string" 
  ? nodes 
  : JSON.stringify(nodes);

await db.insert(diagrams).values({ nodes: nodesStr });
```

---

## Common Pitfalls

### ❌ Pitfall 1: Not Converting Arrays to Strings

```typescript
// Bad - type error
const validated = createDiagramSchema.parse(body);
await db.insert(diagrams).values({
  nodes: validated.nodes  // Might be array!
});

// Good - explicit conversion
const nodesStr = typeof validated.nodes === "string"
  ? validated.nodes
  : JSON.stringify(validated.nodes);
await db.insert(diagrams).values({ nodes: nodesStr });
```

### ❌ Pitfall 2: Forgetting to Handle Validation Errors

```typescript
// Bad - unhandled error
const data = schema.parse(body);

// Good - proper error handling
const validation = schema.safeParse(body);
if (!validation.success) {
  throw validationError("...", undefined, validation.error.issues);
}
```

### ❌ Pitfall 3: Using Magic Numbers

```typescript
// Bad - unclear meaning
if (name.length > 100) { /* ... */ }

// Good - uses constant
if (name.length > VALIDATION_LIMITS.PROJECT.NAME_MAX) { /* ... */ }
```

---

## Troubleshooting

### Issue: "z.record expects 2 arguments"

**Solution:** Use the two-argument form in Zod v4:
```typescript
// ❌ Old (Zod v3)
z.record(z.unknown())

// ✅ New (Zod v4)
z.record(z.string(), z.unknown())
```

### Issue: "Type not assignable to string | null"

**Solution:** Ensure proper type conversion before database operations:
```typescript
const metadataStr = metadata
  ? typeof metadata === "string"
    ? metadata
    : JSON.stringify(metadata)
  : null;
```

### Issue: "Spread types may only be created from object types"

**Solution:** Use explicit property assignment instead of spread:
```typescript
// ❌ Bad
return {
  ...someCondition && { property: value }
};

// ✅ Good
const result = {};
if (someCondition) result.property = value;
return result;
```

---

## Performance Considerations

### Validation Performance
- **Average validation time**: < 1ms per request
- **Complex diagrams** (100+ nodes): ~2-3ms
- **Large PRD content** (50KB+): ~5-10ms

### Optimization Tips

1. **Avoid Re-validation**: Cache validated results
2. **Use Partial Schemas**: For updates, only validate changed fields
3. **Limit Passthrough**: Only use `.passthrough()` when necessary
4. **Transform Wisely**: JSON parsing can be expensive for large payloads

---

## Related Documentation

- **Error Handling**: `docs/task/TASK_027_COMPLETION.md`
- **API Error Utility**: `src/lib/api-error.ts`
- **Database Schema**: `docs/DATABASE_SCHEMA.md`
- **Validation Constants**: `src/constants/validation.constant.ts`

---

## Quick Command Reference

```bash
# Verify validation schemas exist and are exported
node scripts/verify-validation.js

# Build project (includes type checking and validation)
pnpm run build

# Run in development (hot reload with validation)
pnpm dev

# Test specific API route
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project"}'
```

---

**Last Updated:** October 9, 2025  
**Task:** 028 - Validation Constants and Zod Schemas  
**Status:** ✅ COMPLETE

