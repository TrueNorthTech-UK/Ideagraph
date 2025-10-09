/**
 * Export System Types
 *
 * Defines core types and interfaces for the IdeaGraph export system.
 * Supports multiple export formats: Markdown, JSON, Cursor Tasks, PDF, PNG, SVG
 */

import type { Node, Edge } from "@xyflow/react";

// Re-export React Flow types for convenience
export type { Node, Edge } from "@xyflow/react";

/**
 * Supported export formats
 */
export type ExportFormat =
    | "markdown"
    | "json"
    | "cursor"
    | "pdf"
    | "png"
    | "svg";

/**
 * Export options common to all formats
 */
export interface BaseExportOptions {
    /** Include diagram metadata in export */
    includeMetadata?: boolean;
    /** Include timestamps in export */
    includeTimestamps?: boolean;
    /** Custom title for the export */
    title?: string;
    /** Custom description for the export */
    description?: string;
    /** Author information */
    author?: string;
}

/**
 * Markdown export specific options
 */
export interface MarkdownExportOptions extends BaseExportOptions {
    /** Include table of contents */
    includeTOC?: boolean;
    /** Heading level to start with (1-6) */
    startingHeadingLevel?: number;
    /** Include node details section */
    includeNodeDetails?: boolean;
    /** Include edge/connection details */
    includeEdgeDetails?: boolean;
    /** Include flow diagrams in Mermaid format */
    includeMermaidDiagrams?: boolean;
}

/**
 * JSON export specific options
 */
export interface JsonExportOptions extends BaseExportOptions {
    /** Pretty print with indentation */
    prettyPrint?: boolean;
    /** Indentation spaces (if pretty print enabled) */
    indent?: number;
    /** Include computed properties */
    includeComputedProperties?: boolean;
}

/**
 * Cursor tasks export specific options
 */
export interface CursorExportOptions extends BaseExportOptions {
    /** Group tasks by node type */
    groupByType?: boolean;
    /** Estimated time per task in hours */
    defaultEstimatedTime?: number;
    /** Include implementation hints */
    includeHints?: boolean;
    /** Priority level for generated tasks */
    defaultPriority?: "low" | "medium" | "high" | "critical";
}

/**
 * Image export specific options (PNG/SVG)
 */
export interface ImageExportOptions extends BaseExportOptions {
    /** Image width in pixels */
    width?: number;
    /** Image height in pixels */
    height?: number;
    /** Scale factor (1 = 100%, 2 = 200%) */
    scale?: number;
    /** Background color (transparent if not specified) */
    backgroundColor?: string;
    /** Image quality (0-100) for PNG */
    quality?: number;
    /** Include padding around diagram */
    padding?: number;
}

/**
 * PDF export specific options
 */
export interface PdfExportOptions extends BaseExportOptions {
    /** Page size */
    pageSize?: "A4" | "Letter" | "Legal" | "A3" | "Tabloid";
    /** Page orientation */
    orientation?: "portrait" | "landscape";
    /** Include page numbers */
    includePageNumbers?: boolean;
    /** Include header/footer */
    includeHeader?: boolean;
    includeFooter?: boolean;
    /** Margins in mm */
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

/**
 * Union type for all export options
 */
export type ExportOptions =
    | MarkdownExportOptions
    | JsonExportOptions
    | CursorExportOptions
    | ImageExportOptions
    | PdfExportOptions;

/**
 * Diagram data for export
 */
export interface DiagramExportData {
    /** Diagram unique identifier */
    id: string;
    /** Diagram name/title */
    name: string;
    /** Diagram description */
    description?: string;
    /** Project ID this diagram belongs to */
    projectId: string;
    /** Project name */
    projectName?: string;
    /** Nodes in the diagram */
    nodes: Node[];
    /** Edges/connections in the diagram */
    edges: Edge[];
    /** Viewport state */
    viewport?: {
        x: number;
        y: number;
        zoom: number;
    };
    /** Diagram metadata */
    metadata?: Record<string, unknown>;
    /** Creation timestamp */
    createdAt?: Date;
    /** Last updated timestamp */
    updatedAt?: Date;
    /** Owner information */
    owner?: {
        id: string;
        name?: string;
        email?: string;
    };
}

/**
 * Export result
 */
export interface ExportResult {
    /** Export format used */
    format: ExportFormat;
    /** Generated content (string for text formats, Buffer for binary) */
    content: string | Buffer;
    /** MIME type for the content */
    mimeType: string;
    /** Suggested filename */
    filename: string;
    /** Export metadata */
    metadata: {
        /** Number of nodes exported */
        nodeCount: number;
        /** Number of edges exported */
        edgeCount: number;
        /** Generation timestamp */
        generatedAt: Date;
        /** Export options used */
        options: ExportOptions;
    };
}

/**
 * Export error information
 */
export interface ExportError {
    /** Error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Detailed error information */
    details?: Record<string, unknown>;
    /** Original error if available */
    originalError?: Error;
}

/**
 * Export progress callback type
 */
export type ExportProgressCallback = (progress: {
    stage:
        | "preparing"
        | "processing"
        | "generating"
        | "finalizing"
        | "complete";
    percentage: number;
    message?: string;
}) => void;
