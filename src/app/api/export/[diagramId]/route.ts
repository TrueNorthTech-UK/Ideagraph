import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { diagrams, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createExportEngine } from "@/lib/export/ExportEngine";
import type {
    ExportFormat,
    ExportOptions,
    DiagramExportData,
    Node,
    Edge,
} from "@/lib/export/types";
import {
    exportRequestSchema,
    exportQuerySchema,
    diagramIdSchema,
} from "@/constants/validation.constant";
import { validationError } from "@/lib/api-error";

/**
 * POST /api/export/[diagramId]
 * Export a diagram in the specified format
 *
 * Request Body:
 * {
 *   format: 'markdown' | 'json' | 'cursor' | 'pdf' | 'png' | 'svg'
 *   options?: ExportOptions (format-specific options)
 * }
 *
 * Query Parameters:
 * - format: Export format (alternative to body)
 * - download: If 'true', sets Content-Disposition header for download
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ diagramId: string }> },
) {
    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in" },
                { status: 401 },
            );
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

        // Fetch the diagram and verify ownership
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
            return NextResponse.json(
                {
                    error: "Diagram not found or you don't have access to it",
                },
                { status: 404 },
            );
        }

        const { diagram, project } = result[0];

        // Parse and validate request body for format and options
        let format: ExportFormat;
        let options: ExportOptions = {};
        let shouldDownload = false;

        try {
            const body = await request.json();
            const validation = exportRequestSchema.safeParse(body);

            if (!validation.success) {
                throw validationError(
                    "Invalid export request",
                    undefined,
                    validation.error.issues,
                );
            }

            format = validation.data.format;
            options = (validation.data.options as ExportOptions) || {};
        } catch (error) {
            // If body parsing fails, try query parameters
            const searchParams = request.nextUrl.searchParams;
            const queryValidation = exportQuerySchema.safeParse({
                format: searchParams.get("format"),
                download: searchParams.get("download"),
            });

            if (!queryValidation.success) {
                throw validationError(
                    "Export format is required (in body or query parameter)",
                    "format",
                    queryValidation.error.issues,
                );
            }

            format = queryValidation.data.format;
            shouldDownload = queryValidation.data.download || false;
        }

        // Parse diagram data
        let nodes: Node[];
        let edges: Edge[];

        try {
            nodes = diagram.nodes ? JSON.parse(diagram.nodes) : [];
            edges = diagram.edges ? JSON.parse(diagram.edges) : [];
        } catch (error) {
            console.error("Error parsing diagram data:", error);
            return NextResponse.json(
                { error: "Diagram data is corrupted or invalid" },
                { status: 500 },
            );
        }

        // Prepare export data
        const exportData: DiagramExportData = {
            id: diagram.id,
            name: diagram.name,
            projectId: diagram.projectId,
            projectName: project.name,
            nodes,
            edges,
            metadata: diagram.metadata
                ? JSON.parse(diagram.metadata)
                : undefined,
            owner: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            createdAt: diagram.createdAt,
            updatedAt: diagram.updatedAt,
        };

        // Create export engine and generate export
        const exportEngine = createExportEngine((progress) => {
            // Progress callback - could be used for websocket updates in future
            console.log(
                `Export progress: ${progress.stage} - ${progress.percentage}%`,
            );
        });

        const exportResult = await exportEngine.export(
            exportData,
            format,
            options,
        );

        // Determine response content type
        const contentType = exportResult.mimeType || "application/octet-stream";

        // Create response with appropriate headers
        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "X-Export-Format": exportResult.format,
            "X-Node-Count": exportResult.metadata.nodeCount.toString(),
            "X-Edge-Count": exportResult.metadata.edgeCount.toString(),
        };

        // Add download header if requested or if format is binary
        if (
            shouldDownload ||
            format === "pdf" ||
            format === "png" ||
            format === "svg"
        ) {
            headers["Content-Disposition"] =
                `attachment; filename="${exportResult.filename}"`;
        } else {
            headers["Content-Disposition"] =
                `inline; filename="${exportResult.filename}"`;
        }

        // Return the exported content
        // Handle Buffer vs string content
        const content =
            typeof exportResult.content === "string"
                ? exportResult.content
                : exportResult.content.toString("utf-8");

        return new NextResponse(content, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error exporting diagram:", error);

        // Handle specific export errors
        if (typeof error === "object" && error !== null && "code" in error) {
            const exportError = error as { code: string; message: string };

            if (exportError.code === "NOT_IMPLEMENTED") {
                return NextResponse.json(
                    {
                        error: exportError.message,
                        code: exportError.code,
                    },
                    { status: 501 }, // Not Implemented
                );
            }

            if (exportError.code === "INVALID_DATA") {
                return NextResponse.json(
                    {
                        error: exportError.message,
                        code: exportError.code,
                    },
                    { status: 400 },
                );
            }

            if (exportError.code === "UNSUPPORTED_FORMAT") {
                return NextResponse.json(
                    {
                        error: exportError.message,
                        code: exportError.code,
                    },
                    { status: 400 },
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to export diagram" },
            { status: 500 },
        );
    }
}

/**
 * GET /api/export/[diagramId]
 * Get available export formats and metadata for a diagram
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ diagramId: string }> },
) {
    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in" },
                { status: 401 },
            );
        }

        const { diagramId } = await params;

        if (!diagramId) {
            return NextResponse.json(
                { error: "Diagram ID is required" },
                { status: 400 },
            );
        }

        // Get database connection
        const db = await getDb();

        // Verify ownership
        const result = await db
            .select({
                diagram: diagrams,
            })
            .from(diagrams)
            .innerJoin(projects, eq(diagrams.projectId, projects.id))
            .where(
                and(eq(diagrams.id, diagramId), eq(projects.ownerId, user.id)),
            )
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json(
                {
                    error: "Diagram not found or you don't have access to it",
                },
                { status: 404 },
            );
        }

        const { diagram } = result[0];

        // Parse node and edge counts
        let nodeCount = 0;
        let edgeCount = 0;

        try {
            const nodes = diagram.nodes ? JSON.parse(diagram.nodes) : [];
            const edges = diagram.edges ? JSON.parse(diagram.edges) : [];
            nodeCount = nodes.length;
            edgeCount = edges.length;
        } catch {
            // Silently fail parsing errors for metadata
        }

        // Return available export formats and diagram metadata
        return NextResponse.json({
            success: true,
            diagramId: diagram.id,
            diagramName: diagram.name,
            nodeCount,
            edgeCount,
            availableFormats: [
                {
                    format: "markdown",
                    mimeType: "text/markdown",
                    extension: "md",
                    description: "Comprehensive Markdown documentation",
                    status: "available",
                },
                {
                    format: "json",
                    mimeType: "application/json",
                    extension: "json",
                    description: "Normalized JSON export with metadata",
                    status: "available",
                },
                {
                    format: "cursor",
                    mimeType: "application/json",
                    extension: "cursor.json",
                    description: "Cursor IDE task format",
                    status: "available",
                },
                {
                    format: "pdf",
                    mimeType: "application/pdf",
                    extension: "pdf",
                    description: "PDF document export",
                    status: "coming-soon",
                    plannedTask: "Task 074",
                },
                {
                    format: "png",
                    mimeType: "image/png",
                    extension: "png",
                    description: "PNG image export",
                    status: "coming-soon",
                    plannedTask: "Task 075",
                },
                {
                    format: "svg",
                    mimeType: "image/svg+xml",
                    extension: "svg",
                    description: "SVG vector image export",
                    status: "coming-soon",
                    plannedTask: "Task 075",
                },
            ],
        });
    } catch (error) {
        console.error("Error fetching export info:", error);
        return NextResponse.json(
            { error: "Failed to fetch export information" },
            { status: 500 },
        );
    }
}
