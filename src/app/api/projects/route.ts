import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import handleApiError, {
    unauthorizedError,
    validationError,
} from "@/lib/api-error";
import { createProjectSchema } from "@/constants/validation.constant";

/**
 * GET /api/projects
 * Retrieve all projects owned by the authenticated user
 */
export async function GET(_request: NextRequest) {
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        // Get database connection
        const db = await getDb();

        // Fetch projects owned by the user
        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.ownerId, user.id))
            .orderBy(projects.createdAt);

        return NextResponse.json({
            success: true,
            projects: userProjects,
            count: userProjects.length,
        });
    } catch (error) {
        console.error("Error fetching projects:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}

/**
 * POST /api/projects
 * Create a new project owned by the authenticated user
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
        const validation = createProjectSchema.safeParse(body);

        if (!validation.success) {
            throw validationError(
                "Invalid project data",
                undefined,
                validation.error.issues,
            );
        }

        const { name, description } = validation.data;

        // Get database connection
        const db = await getDb();

        // Create new project
        const projectId = randomUUID();
        const now = new Date();

        const newProject = {
            id: projectId,
            name,
            description: description || null,
            ownerId: user.id,
            createdAt: now,
            updatedAt: now,
        };

        await db.insert(projects).values(newProject);

        return NextResponse.json(
            {
                success: true,
                message: "Project created successfully",
                project: newProject,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating project:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });
        return handleApiError(error, requestId);
    }
}
