# Database Schema (D1/SQLite)

## Tables
```sql
-- projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL
);

-- diagrams
CREATE TABLE diagrams (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  nodes TEXT DEFAULT '[]',
  edges TEXT DEFAULT '[]',
  viewport TEXT DEFAULT '{}',
  diagram_type TEXT DEFAULT 'architecture',
  theme TEXT DEFAULT 'modern',
  version INTEGER DEFAULT 1,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- conversations
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  diagram_id TEXT NOT NULL,
  messages TEXT DEFAULT '[]',
  context TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diagram_id) REFERENCES diagrams(id) ON DELETE CASCADE
);

-- ai_analyses
CREATE TABLE ai_analyses (
  id TEXT PRIMARY KEY,
  diagram_id TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  recommendations TEXT NOT NULL,
  confidence_score REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diagram_id) REFERENCES diagrams(id) ON DELETE CASCADE
);

-- exports
CREATE TABLE exports (
  id TEXT PRIMARY KEY,
  diagram_id TEXT NOT NULL,
  format TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diagram_id) REFERENCES diagrams(id) ON DELETE CASCADE
);

-- import_sessions
CREATE TABLE import_sessions (
  id TEXT PRIMARY KEY,
  original_content TEXT NOT NULL,
  processed_nodes TEXT DEFAULT '[]',
  processed_edges TEXT DEFAULT '[]',
  status TEXT DEFAULT 'processing',
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships (ASCII)
```
projects (1)───<(N) diagrams (1)───<(N) conversations
                 │                 
                 └──<(N) ai_analyses
                 └──<(N) exports
```

## Index Strategy
- `diagrams(project_id)`
- `conversations(diagram_id)`
- `ai_analyses(diagram_id)`
- `exports(diagram_id)`

## Migrations Plan
- Use `drizzle-kit generate:sqlite` to produce initial migration
- Apply with Wrangler D1 migrations (dev/prod)
- Add forward-only migrations for new columns; avoid destructive changes

## Seed Data
- Minimal seed for a demo project, one diagram, and initial nodes/edges
- Synthetic conversation for UI preview
