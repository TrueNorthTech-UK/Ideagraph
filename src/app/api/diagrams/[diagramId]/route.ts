import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import { diagrams, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import handleApiError, {
    unauthorizedError,
    notFoundError,
    validationError,
} from "@/lib/api-error";
import {
    diagramIdSchema,
    updateDiagramSchema,
} from "@/constants/validation.constant";

/**
 * GET /api/diagrams/[diagramId]
 * Retrieve a specific diagram by ID (must be in a project owned by authenticated user)
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ diagramId: string }> },
) {
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        const { diagramId } = await params;

        // Validate diagram ID
        const diagramIdValidation = diagramIdSchema.safeParse(diagramId);
        if (!diagramIdValidation.success) {
            throw validationError(
                "Invalid diagram ID format",
                "diagramId",
                diagramIdValidation.error.issues,
            );
        }

        // Get database connection
        const db = await getDb();

        // Fetch the diagram and join with projects to verify ownership
        const result = await db
            .select({
                diagram: diagrams,
                project: projects,
            })
            .from(diagrams)
            .innerJoin(projects, eq(diagrams.projectId, projects.id))
            .where(
                and(
                    eq(diagrams.id, diagramIdValidation.data),
                    eq(projects.ownerId, user.id),
                ),
            )
            .limit(1);

        if (result.length === 0) {
            throw notFoundError(
                "Diagram",
                "Diagram not found or you don't have access to it",
            );
        }

        const { diagram } = result[0];

        return NextResponse.json({
            success: true,
            diagram,
        });
    } catch (error) {
        console.error("Error fetching diagram:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}

/**
 * PUT /api/diagrams/[diagramId]
 * Update a diagram's nodes and edges (must be in a project owned by authenticated user)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ diagramId: string }> },
) {
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        const { diagramId } = await params;

        // Validate diagram ID
        const diagramIdValidation = diagramIdSchema.safeParse(diagramId);
        if (!diagramIdValidation.success) {
            throw validationError(
                "Invalid diagram ID format",
                "diagramId",
                diagramIdValidation.error.issues,
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = updateDiagramSchema.safeParse(body);

        if (!validation.success) {
            throw validationError(
                "Invalid diagram update data",
                undefined,
                validation.error.issues,
            );
        }

        const { name, nodes, edges, metadata } = validation.data;

        // Require at least one field to update
        if (!name && !nodes && !edges && !metadata) {
            throw validationError(
                "At least one field must be provided for update",
            );
        }

        // Get database connection
        const db = await getDb();

        // First verify ownership
        const result = await db
            .select({
                diagram: diagrams,
                project: projects,
            })
            .from(diagrams)
            .innerJoin(projects, eq(diagrams.projectId, projects.id))
            .where(
                and(
                    eq(diagrams.id, diagramIdValidation.data),
                    eq(projects.ownerId, user.id),
                ),
            )
            .limit(1);

        if (result.length === 0) {
            throw notFoundError(
                "Diagram",
                "Diagram not found or you don't have access to it",
            );
        }

        // Update the diagram
        const updateData: Partial<{
            name: string;
            nodes: string;
            edges: string;
            metadata: string | null;
            updatedAt: Date;
        }> = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (nodes !== undefined) {
            // Convert array to JSON string if needed
            updateData.nodes =
                typeof nodes === "string" ? nodes : JSON.stringify(nodes);
        }
        if (edges !== undefined) {
            // Convert array to JSON string if needed
            updateData.edges =
                typeof edges === "string" ? edges : JSON.stringify(edges);
        }
        if (metadata !== undefined) {
            // Convert object to JSON string if needed
            updateData.metadata =
                metadata === null
                    ? null
                    : typeof metadata === "string"
                      ? metadata
                      : JSON.stringify(metadata);
        }

        await db
            .update(diagrams)
            .set(updateData)
            .where(eq(diagrams.id, diagramIdValidation.data));

        return NextResponse.json({
            success: true,
            message: "Diagram updated successfully",
        });
    } catch (error) {
        console.error("Error updating diagram:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}
