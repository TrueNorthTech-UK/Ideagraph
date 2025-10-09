import { z } from "zod";

/**
 * Validation limits for various entities in the application
 * These constants are used in Zod schemas to enforce consistent validation rules
 */
export const VALIDATION_LIMITS = {
    TODO: {
        TITLE_MIN: 3,
        TITLE_MAX: 255,
        DESCRIPTION_MAX: 1000,
        IMAGE_ALT_MAX: 255,
    },
    PROJECT: {
        NAME_MIN: 3,
        NAME_MAX: 100,
        DESCRIPTION_MAX: 500,
    },
    DIAGRAM: {
        NAME_MIN: 3,
        NAME_MAX: 100,
        DESCRIPTION_MAX: 500,
        NODES_MAX: 1000, // Maximum nodes per diagram
        EDGES_MAX: 2000, // Maximum edges per diagram
    },
    NODE: {
        LABEL_MIN: 1,
        LABEL_MAX: 100,
        DESCRIPTION_MAX: 500,
    },
    EDGE: {
        LABEL_MAX: 100,
    },
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png"],
        ALLOWED_DOCUMENT_TYPES: [
            "text/plain",
            "text/markdown",
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
    },
    PRD_ANALYSIS: {
        CONTENT_MIN: 100,
        CONTENT_MAX: 100000, // 100KB of text
        PROCESSING_TIMEOUT: 30000, // 30 seconds
    },
    EXPORT: {
        MAX_TITLE_LENGTH: 200,
        MAX_DESCRIPTION_LENGTH: 1000,
        MAX_AUTHOR_LENGTH: 100,
    },
} as const;

/**
 * Common validation messages
 */
export const VALIDATION_MESSAGES = {
    REQUIRED: "This field is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    USERNAME_TOO_SHORT: "Username must be at least 3 characters",
    FILE_TOO_LARGE: "File size must be less than 5MB",
    INVALID_FILE_TYPE: "Only JPEG and PNG files are allowed",
    INVALID_UUID: "Invalid ID format",
    INVALID_JSON: "Invalid JSON format",
} as const;

export const TODO_VALIDATION_MESSAGES = {
    TITLE_REQUIRED: "Title is required",
    TITLE_TOO_LONG: "Title must be less than 255 characters",
    DESCRIPTION_TOO_LONG: "Description must be less than 1000 characters",
    INVALID_IMAGE_URL: "Invalid image URL",
} as const;

// ===========================
// PROJECT VALIDATION SCHEMAS
// ===========================

/**
 * Schema for creating a new project
 */
export const createProjectSchema = z.object({
    name: z
        .string()
        .min(
            VALIDATION_LIMITS.PROJECT.NAME_MIN,
            `Project name must be at least ${VALIDATION_LIMITS.PROJECT.NAME_MIN} characters`,
        )
        .max(
            VALIDATION_LIMITS.PROJECT.NAME_MAX,
            `Project name must be less than ${VALIDATION_LIMITS.PROJECT.NAME_MAX} characters`,
        )
        .trim(),
    description: z
        .string()
        .max(
            VALIDATION_LIMITS.PROJECT.DESCRIPTION_MAX,
            `Description must be less than ${VALIDATION_LIMITS.PROJECT.DESCRIPTION_MAX} characters`,
        )
        .trim()
        .optional(),
});

/**
 * Schema for updating an existing project
 */
export const updateProjectSchema = z.object({
    name: z
        .string()
        .min(
            VALIDATION_LIMITS.PROJECT.NAME_MIN,
            `Project name must be at least ${VALIDATION_LIMITS.PROJECT.NAME_MIN} characters`,
        )
        .max(
            VALIDATION_LIMITS.PROJECT.NAME_MAX,
            `Project name must be less than ${VALIDATION_LIMITS.PROJECT.NAME_MAX} characters`,
        )
        .trim()
        .optional(),
    description: z
        .string()
        .max(
            VALIDATION_LIMITS.PROJECT.DESCRIPTION_MAX,
            `Description must be less than ${VALIDATION_LIMITS.PROJECT.DESCRIPTION_MAX} characters`,
        )
        .trim()
        .optional()
        .nullable(),
});

/**
 * Schema for project ID parameter
 */
export const projectIdSchema = z
    .string()
    .uuid(VALIDATION_MESSAGES.INVALID_UUID);

// ===========================
// DIAGRAM VALIDATION SCHEMAS
// ===========================

/**
 * Schema for React Flow node position
 */
const nodePositionSchema = z.object({
    x: z.number(),
    y: z.number(),
});

/**
 * Schema for React Flow node data
 */
const nodeDataSchema = z
    .object({
        label: z
            .string()
            .min(VALIDATION_LIMITS.NODE.LABEL_MIN)
            .max(VALIDATION_LIMITS.NODE.LABEL_MAX)
            .optional(),
        description: z
            .string()
            .max(VALIDATION_LIMITS.NODE.DESCRIPTION_MAX)
            .optional(),
        type: z
            .enum([
                "uiComponent",
                "apiEndpoint",
                "database",
                "service",
                "infrastructure",
            ])
            .optional(),
    })
    .passthrough(); // Allow additional properties for node-specific data

/**
 * Schema for a single React Flow node
 */
const nodeSchema = z
    .object({
        id: z.string(),
        type: z.string(),
        position: nodePositionSchema,
        data: nodeDataSchema.optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        selected: z.boolean().optional(),
        dragging: z.boolean().optional(),
        style: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough();

/**
 * Schema for React Flow edge data
 */
const edgeDataSchema = z
    .object({
        label: z.string().max(VALIDATION_LIMITS.EDGE.LABEL_MAX).optional(),
        edgeType: z.enum(["dataFlow", "dependency", "userFlow"]).optional(),
        animated: z.boolean().optional(),
    })
    .passthrough();

/**
 * Schema for a single React Flow edge
 */
const edgeSchema = z
    .object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        sourceHandle: z.string().optional().nullable(),
        targetHandle: z.string().optional().nullable(),
        type: z.string().optional(),
        animated: z.boolean().optional(),
        data: edgeDataSchema.optional(),
        style: z.record(z.string(), z.unknown()).optional(),
        label: z.string().optional(),
        labelStyle: z.record(z.string(), z.unknown()).optional(),
        labelBgStyle: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough();

/**
 * Schema for nodes array (can be JSON string or array)
 */
const nodesSchema = z.union([
    z.string().transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);
            if (!Array.isArray(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Nodes must be an array",
                });
                return z.NEVER;
            }
            return parsed;
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid JSON format for nodes",
            });
            return z.NEVER;
        }
    }),
    z.array(nodeSchema).max(VALIDATION_LIMITS.DIAGRAM.NODES_MAX),
]);

/**
 * Schema for edges array (can be JSON string or array)
 */
const edgesSchema = z.union([
    z.string().transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);
            if (!Array.isArray(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Edges must be an array",
                });
                return z.NEVER;
            }
            return parsed;
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid JSON format for edges",
            });
            return z.NEVER;
        }
    }),
    z.array(edgeSchema).max(VALIDATION_LIMITS.DIAGRAM.EDGES_MAX),
]);

/**
 * Schema for diagram metadata
 */
const diagramMetadataSchema = z.union([
    z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid JSON format for metadata",
            });
            return z.NEVER;
        }
    }),
    z
        .object({
            viewport: z
                .object({
                    x: z.number(),
                    y: z.number(),
                    zoom: z.number(),
                })
                .optional(),
            theme: z.string().optional(),
            lastModified: z.string().optional(),
        })
        .passthrough(),
]);

/**
 * Schema for creating a new diagram
 * Note: description field is prepared for future enhancement (not in DB schema yet)
 */
export const createDiagramSchema = z.object({
    projectId: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID),
    name: z
        .string()
        .min(
            VALIDATION_LIMITS.DIAGRAM.NAME_MIN,
            `Diagram name must be at least ${VALIDATION_LIMITS.DIAGRAM.NAME_MIN} characters`,
        )
        .max(
            VALIDATION_LIMITS.DIAGRAM.NAME_MAX,
            `Diagram name must be less than ${VALIDATION_LIMITS.DIAGRAM.NAME_MAX} characters`,
        )
        .trim(),
    nodes: nodesSchema.optional(),
    edges: edgesSchema.optional(),
    metadata: diagramMetadataSchema.optional(),
});

/**
 * Schema for updating an existing diagram
 * Note: description field is prepared for future enhancement (not in DB schema yet)
 */
export const updateDiagramSchema = z.object({
    name: z
        .string()
        .min(
            VALIDATION_LIMITS.DIAGRAM.NAME_MIN,
            `Diagram name must be at least ${VALIDATION_LIMITS.DIAGRAM.NAME_MIN} characters`,
        )
        .max(
            VALIDATION_LIMITS.DIAGRAM.NAME_MAX,
            `Diagram name must be less than ${VALIDATION_LIMITS.DIAGRAM.NAME_MAX} characters`,
        )
        .trim()
        .optional(),
    nodes: nodesSchema.optional(),
    edges: edgesSchema.optional(),
    metadata: diagramMetadataSchema.optional(),
});

/**
 * Schema for diagram ID parameter
 */
export const diagramIdSchema = z
    .string()
    .uuid(VALIDATION_MESSAGES.INVALID_UUID);

// ===========================
// AI ANALYSIS SCHEMAS
// ===========================

/**
 * Schema for PRD analysis request
 */
export const analyzePrdSchema = z.object({
    content: z
        .string()
        .min(
            VALIDATION_LIMITS.PRD_ANALYSIS.CONTENT_MIN,
            `PRD content must be at least ${VALIDATION_LIMITS.PRD_ANALYSIS.CONTENT_MIN} characters`,
        )
        .max(
            VALIDATION_LIMITS.PRD_ANALYSIS.CONTENT_MAX,
            `PRD content must be less than ${VALIDATION_LIMITS.PRD_ANALYSIS.CONTENT_MAX} characters`,
        )
        .trim(),
    projectId: z.string().uuid(VALIDATION_MESSAGES.INVALID_UUID).optional(),
    fileName: z.string().max(255).trim().optional(),
});

/**
 * Schema for summarize request
 */
export const summarizeSchema = z.object({
    content: z
        .string()
        .min(10, "Content must be at least 10 characters")
        .max(50000, "Content must be less than 50,000 characters")
        .trim(),
});

// ===========================
// EXPORT SCHEMAS
// ===========================

/**
 * Valid export formats
 */
export const exportFormatSchema = z.enum([
    "markdown",
    "json",
    "cursor",
    "pdf",
    "png",
    "svg",
]);

/**
 * Schema for markdown export options
 */
const markdownExportOptionsSchema = z
    .object({
        includeTOC: z.boolean().optional(),
        startingHeadingLevel: z.number().min(1).max(6).optional(),
        includeNodeDetails: z.boolean().optional(),
        includeEdgeDetails: z.boolean().optional(),
        includeMermaidDiagrams: z.boolean().optional(),
        includeMetadata: z.boolean().optional(),
        includeTimestamps: z.boolean().optional(),
        title: z
            .string()
            .max(VALIDATION_LIMITS.EXPORT.MAX_TITLE_LENGTH)
            .optional(),
        description: z
            .string()
            .max(VALIDATION_LIMITS.EXPORT.MAX_DESCRIPTION_LENGTH)
            .optional(),
        author: z
            .string()
            .max(VALIDATION_LIMITS.EXPORT.MAX_AUTHOR_LENGTH)
            .optional(),
    })
    .optional();

/**
 * Schema for JSON export options
 */
const jsonExportOptionsSchema = z
    .object({
        prettyPrint: z.boolean().optional(),
        indent: z.number().min(0).max(8).optional(),
        includeComputedProperties: z.boolean().optional(),
    })
    .optional();

/**
 * Schema for Cursor export options
 */
const cursorExportOptionsSchema = z
    .object({
        includeSubtasks: z.boolean().optional(),
        priorityLevel: z.enum(["critical", "high", "medium", "low"]).optional(),
        includeTestingNotes: z.boolean().optional(),
        phase: z.string().optional(),
    })
    .optional();

/**
 * Schema for image export options (PNG/SVG)
 */
const imageExportOptionsSchema = z
    .object({
        width: z.number().min(100).max(10000).optional(),
        height: z.number().min(100).max(10000).optional(),
        backgroundColor: z.string().optional(),
        quality: z.number().min(0).max(1).optional(),
    })
    .optional();

/**
 * Schema for PDF export options
 */
const pdfExportOptionsSchema = z
    .object({
        pageSize: z.enum(["A4", "Letter", "Legal"]).optional(),
        orientation: z.enum(["portrait", "landscape"]).optional(),
        includePageNumbers: z.boolean().optional(),
        includeTableOfContents: z.boolean().optional(),
    })
    .optional();

/**
 * Schema for export request
 */
export const exportRequestSchema = z.object({
    format: exportFormatSchema,
    options: z
        .union([
            markdownExportOptionsSchema,
            jsonExportOptionsSchema,
            cursorExportOptionsSchema,
            imageExportOptionsSchema,
            pdfExportOptionsSchema,
        ])
        .optional(),
});

/**
 * Schema for query parameter-based export request
 */
export const exportQuerySchema = z.object({
    format: exportFormatSchema,
    download: z
        .string()
        .transform((val) => val === "true")
        .optional(),
});

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Type-safe way to parse and validate request bodies
 */
export function validateRequest<T extends z.ZodSchema>(
    schema: T,
    data: unknown,
): z.infer<T> {
    return schema.parse(data);
}

/**
 * Type-safe way to parse with safe error handling
 */
export function safeValidateRequest<T extends z.ZodSchema>(
    schema: T,
    data: unknown,
):
    | { success: true; data: z.infer<T> }
    | { success: false; errors: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
