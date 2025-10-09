-- Demo Data Seeding Script for IdeaGraph
-- Creates sample project and diagram for testing and development
-- This script is idempotent (safe to run multiple times)

-- Clean up existing demo data (optional - comment out if you want to keep existing data)
-- DELETE FROM diagrams WHERE id = 'diagram-demo-001';
-- DELETE FROM projects WHERE id = 'project-demo-001';
-- DELETE FROM user WHERE id = 'demo-user-001';

-- Insert demo user (idempotent using INSERT OR IGNORE)
INSERT OR IGNORE INTO user (id, name, email, email_verified, image, created_at, updated_at)
VALUES (
    'demo-user-001',
    'Demo User',
    'demo@ideagraph.dev',
    1,
    NULL,
    cast((julianday('now') - 2440587.5)*86400000 as integer),
    cast((julianday('now') - 2440587.5)*86400000 as integer)
);

-- Insert demo project (idempotent using INSERT OR IGNORE)
INSERT OR IGNORE INTO projects (id, name, description, owner_id, created_at, updated_at)
VALUES (
    'project-demo-001',
    'Demo Project: System Architecture',
    'A sample project demonstrating the Ideagraph diagramming capabilities',
    'demo-user-001',
    cast((julianday('now') - 2440587.5)*86400000 as integer),
    cast((julianday('now') - 2440587.5)*86400000 as integer)
);

-- Insert demo diagram with React Flow nodes and edges (idempotent)
INSERT OR IGNORE INTO diagrams (id, project_id, name, nodes, edges, metadata, created_at, updated_at)
VALUES (
    'diagram-demo-001',
    'project-demo-001',
    'Demo Diagram: Microservices Architecture',
    -- Nodes as JSON
    '[
        {
            "id": "node-1",
            "type": "default",
            "position": { "x": 100, "y": 100 },
            "data": {
                "label": "Frontend (React)",
                "description": "User-facing web application"
            }
        },
        {
            "id": "node-2",
            "type": "default",
            "position": { "x": 100, "y": 250 },
            "data": {
                "label": "API Gateway",
                "description": "Central entry point for all services"
            }
        },
        {
            "id": "node-3",
            "type": "default",
            "position": { "x": 300, "y": 250 },
            "data": {
                "label": "Auth Service",
                "description": "Handles authentication and authorization"
            }
        },
        {
            "id": "node-4",
            "type": "default",
            "position": { "x": 100, "y": 400 },
            "data": {
                "label": "Database (PostgreSQL)",
                "description": "Primary data store"
            }
        }
    ]',
    -- Edges as JSON
    '[
        {
            "id": "edge-1",
            "source": "node-1",
            "target": "node-2",
            "label": "HTTP/REST",
            "type": "default"
        },
        {
            "id": "edge-2",
            "source": "node-2",
            "target": "node-3",
            "label": "gRPC",
            "type": "default"
        },
        {
            "id": "edge-3",
            "source": "node-2",
            "target": "node-4",
            "label": "SQL",
            "type": "default"
        }
    ]',
    -- Metadata as JSON
    '{
        "version": "1.0.0",
        "created_by": "system",
        "tags": ["demo", "architecture", "microservices"]
    }',
    cast((julianday('now') - 2440587.5)*86400000 as integer),
    cast((julianday('now') - 2440587.5)*86400000 as integer)
);

-- Verify the seeded data
SELECT 'Projects:' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'Diagrams:' as table_name, COUNT(*) as count FROM diagrams;

-- Show the demo data
SELECT '=== Demo Project ===' as info;
SELECT * FROM projects WHERE id = 'project-demo-001';

SELECT '=== Demo Diagram ===' as info;
SELECT id, project_id, name, 
       substr(nodes, 1, 50) || '...' as nodes_preview,
       substr(edges, 1, 50) || '...' as edges_preview
FROM diagrams WHERE id = 'diagram-demo-001';

