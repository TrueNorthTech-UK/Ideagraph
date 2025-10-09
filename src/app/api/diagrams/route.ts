import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { diagrams, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import handleApiError, {
    unauthorizedError,
    notFoundError,
    validationError,
} from "@/lib/api-error";
import { createDiagramSchema } from "@/constants/validation.constant";

/**
 * GET /api/diagrams?projectId=xxx
 * Retrieve all diagrams for a specific project (must be owned by authenticated user)
 */
export async function GET(request: NextRequest) {
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        // Get projectId from query params
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            throw validationError(
                "projectId query parameter is required",
                "projectId",
            );
        }

        // Get database connection
        const db = await getDb();

        // First, verify that the project exists and is owned by the user
        const project = await db
            .select()
            .from(projects)
            .where(
                and(eq(projects.id, projectId), eq(projects.ownerId, user.id)),
            )
            .limit(1);

        if (project.length === 0) {
            throw notFoundError(
                "Project",
                "Project not found or you don't have access to it",
            );
        }

        // Fetch diagrams for the project
        const projectDiagrams = await db
            .select()
            .from(diagrams)
            .where(eq(diagrams.projectId, projectId))
            .orderBy(diagrams.createdAt);

        return NextResponse.json({
            success: true,
            diagrams: projectDiagrams,
            count: projectDiagrams.length,
        });
    } catch (error) {
        console.error("Error fetching diagrams:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}

/**
 * POST /api/diagrams
 * Create a new diagram in a project (project must be owned by authenticated user)
 */
export async function POST(request: NextRequest) {
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = createDiagramSchema.safeParse(body);

        if (!validation.success) {
            throw validationError(
                "Invalid diagram data",
                undefined,
                validation.error.issues,
            );
        }

        const { projectId, name, nodes, edges, metadata } = validation.data;

        // Get database connection
        const db = await getDb();

        // Verify that the project exists and is owned by the user
        const project = await db
            .select()
            .from(projects)
            .where(
                and(eq(projects.id, projectId), eq(projects.ownerId, user.id)),
            )
            .limit(1);

        if (project.length === 0) {
            throw notFoundError(
                "Project",
                "Project not found or you don't have access to it",
            );
        }

        // Create new diagram
        const diagramId = randomUUID();
        const now = new Date();

        // Convert nodes/edges to JSON strings if they're arrays
        const nodesStr = nodes
            ? typeof nodes === "string"
                ? nodes
                : JSON.stringify(nodes)
            : "[]";
        const edgesStr = edges
            ? typeof edges === "string"
                ? edges
                : JSON.stringify(edges)
            : "[]";
        const metadataStr = metadata
            ? typeof metadata === "string"
                ? metadata
                : JSON.stringify(metadata)
            : null;

        const newDiagram = {
            id: diagramId,
            projectId,
            name,
            nodes: nodesStr,
            edges: edgesStr,
            metadata: metadataStr,
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(diagrams).values(newDiagram);

        return NextResponse.json(
            {
                success: true,
                message: "Diagram created successfully",
                diagram: newDiagram,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating diagram:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}
