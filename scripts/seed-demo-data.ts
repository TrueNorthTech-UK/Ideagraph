/**
 * Seed Demo Data Script
 * Creates a demo project and diagram for testing and development
 *
 * Usage:
 *   Local: pnpm run db:seed:local
 *   Production: pnpm run db:seed:prod
 */

import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

// Demo user ID - should exist from auth setup
// In production, you'll need to create a user first or use an existing user ID
const DEMO_USER_ID = "demo-user-001";

// Demo project data
const DEMO_PROJECT = {
    id: "project-demo-001",
    name: "Demo Project: System Architecture",
    description:
        "A sample project demonstrating the Ideagraph diagramming capabilities",
    ownerId: DEMO_USER_ID,
};

// Demo diagram with sample nodes and edges (React Flow format)
const DEMO_DIAGRAM = {
    id: "diagram-demo-001",
    projectId: "project-demo-001",
    name: "Demo Diagram: Microservices Architecture",
    nodes: JSON.stringify([
        {
            id: "node-1",
            type: "default",
            position: { x: 100, y: 100 },
            data: {
                label: "Frontend (React)",
                description: "User-facing web application",
            },
        },
        {
            id: "node-2",
            type: "default",
            position: { x: 100, y: 250 },
            data: {
                label: "API Gateway",
                description: "Central entry point for all services",
            },
        },
        {
            id: "node-3",
            type: "default",
            position: { x: 300, y: 250 },
            data: {
                label: "Auth Service",
                description: "Handles authentication and authorization",
            },
        },
        {
            id: "node-4",
            type: "default",
            position: { x: 100, y: 400 },
            data: {
                label: "Database (PostgreSQL)",
                description: "Primary data store",
            },
        },
    ]),
    edges: JSON.stringify([
        {
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            label: "HTTP/REST",
            type: "default",
        },
        {
            id: "edge-2",
            source: "node-2",
            target: "node-3",
            label: "gRPC",
            type: "default",
        },
        {
            id: "edge-3",
            source: "node-2",
            target: "node-4",
            label: "SQL",
            type: "default",
        },
    ]),
    metadata: JSON.stringify({
        version: "1.0.0",
        created_by: "system",
        tags: ["demo", "architecture", "microservices"],
    }),
};

/**
 * Main seeding function
 */
async function seed(db: ReturnType<typeof drizzle>) {
    console.log("🌱 Starting demo data seeding...");

    try {
        // Check if demo project already exists
        const existingProject = await db
            .select()
            .from(schema.projects)
            .where(eq(schema.projects.id, DEMO_PROJECT.id))
            .get();

        if (existingProject) {
            console.log(
                "ℹ️  Demo project already exists, skipping project creation",
            );
        } else {
            // Insert demo project
            await db.insert(schema.projects).values(DEMO_PROJECT);
            console.log("✅ Demo project created:", DEMO_PROJECT.name);
        }

        // Check if demo diagram already exists
        const existingDiagram = await db
            .select()
            .from(schema.diagrams)
            .where(eq(schema.diagrams.id, DEMO_DIAGRAM.id))
            .get();

        if (existingDiagram) {
            console.log(
                "ℹ️  Demo diagram already exists, skipping diagram creation",
            );
        } else {
            // Insert demo diagram
            await db.insert(schema.diagrams).values(DEMO_DIAGRAM);
            console.log("✅ Demo diagram created:", DEMO_DIAGRAM.name);
        }

        // Verify seeded data
        const projects = await db.select().from(schema.projects).all();
        const diagrams = await db.select().from(schema.diagrams).all();

        console.log("\n📊 Database Summary:");
        console.log(`   Projects: ${projects.length}`);
        console.log(`   Diagrams: ${diagrams.length}`);
        console.log("\n✨ Demo data seeding completed successfully!");

        return {
            success: true,
            projectsCount: projects.length,
            diagramsCount: diagrams.length,
        };
    } catch (error) {
        console.error("❌ Error seeding demo data:", error);
        throw error;
    }
}

// Export for programmatic use
export { seed, DEMO_PROJECT, DEMO_DIAGRAM, DEMO_USER_ID };

// CLI execution
if (require.main === module) {
    console.log(
        "Note: This script requires D1 context. Use wrangler commands instead:",
    );
    console.log("  pnpm run db:seed:local");
    console.log("  pnpm run db:seed:prod");
}
