# API Endpoints

## Auth
- Middleware-enforced; session required for all endpoints below

## Projects
- POST `app/api/projects` — Create project
  - Request: `{ name: string, description?: string }`
  - Response: `{ project: {...} }`
- GET `app/api/projects` — List projects
  - Response: `{ projects: [...] }`

## Diagrams
- POST `app/api/diagrams` — Create diagram
  - Request: `{ projectId: string, name: string, description?: string }`
  - Response: `{ diagram: {...} }`
- GET `app/api/diagrams?projectId=...` — List diagrams for project
  - Response: `{ diagrams: [...] }`
- GET `app/api/diagrams/[diagramId]` — Fetch diagram
  - Response: `{ diagram: { nodes: [], edges: [], viewport: {} } }`
- PUT `app/api/diagrams/[diagramId]` — Update diagram
  - Request: `{ nodes?: [], edges?: [], viewport?: {}, name?: string, description?: string }`
  - Response: `{ diagram: {...} }`

## AI Analysis
- POST `app/api/ai/analyze-prd`
  - Request: `{ content: string, projectId?: string }`
  - Response: `{ sessionId: string, analysis: { entities: [], relationships: [], flows: [], recommendations: [] } }`

## Export
- POST `app/api/export/[diagramId]`
  - Request: `{ format: 'markdown'|'json'|'cursor'|'pdf'|'png', options?: {} }`
  - Response: `{ content: string|ArrayBuffer, filename: string, mimeType: string }`

## Rate Limiting
- Per-user limits on AI endpoints; 429 with `{ error: 'rate_limited' }`

## Error Codes
- 400 invalid request, 401 unauthorized, 403 forbidden, 404 not found, 429 rate limited, 500 server error

## Examples
```http
POST /app/api/ai/analyze-prd
Content-Type: application/json

{"content":"# My PRD..."}
```

```json
{
  "sessionId": "sess_123",
  "analysis": { "entities": [], "relationships": [], "flows": [], "recommendations": [] }
}
```
