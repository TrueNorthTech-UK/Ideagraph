/**
 * Export Engine
 *
 * Core export system for IdeaGraph diagrams.
 * Supports multiple export formats with extensible architecture.
 *
 * @module ExportEngine
 */

import type {
    DiagramExportData,
    ExportFormat,
    ExportOptions,
    ExportResult,
    ExportError,
    ExportProgressCallback,
    MarkdownExportOptions,
    JsonExportOptions,
    CursorExportOptions,
    ImageExportOptions,
    PdfExportOptions,
} from "./types";

/**
 * Main export engine class
 * Handles diagram exports in multiple formats
 */
export class ExportEngine {
    private progressCallback?: ExportProgressCallback;

    constructor(progressCallback?: ExportProgressCallback) {
        this.progressCallback = progressCallback;
    }

    /**
     * Export diagram to specified format
     *
     * @param data - Diagram data to export
     * @param format - Target export format
     * @param options - Format-specific options
     * @returns Promise resolving to export result
     * @throws ExportError if export fails
     */
    async export(
        data: DiagramExportData,
        format: ExportFormat,
        options: ExportOptions = {},
    ): Promise<ExportResult> {
        try {
            this.reportProgress(
                "preparing",
                0,
                `Preparing ${format} export...`,
            );

            // Validate input data
            this.validateDiagramData(data);

            // Route to appropriate export handler based on format
            switch (format) {
                case "markdown":
                    return await this.exportMarkdown(
                        data,
                        options as MarkdownExportOptions,
                    );
                case "json":
                    return await this.exportJson(
                        data,
                        options as JsonExportOptions,
                    );
                case "cursor":
                    return await this.exportCursorTasks(
                        data,
                        options as CursorExportOptions,
                    );
                case "pdf":
                    return await this.exportPdf(
                        data,
                        options as PdfExportOptions,
                    );
                case "png":
                    return await this.exportPng(
                        data,
                        options as ImageExportOptions,
                    );
                case "svg":
                    return await this.exportSvg(
                        data,
                        options as ImageExportOptions,
                    );
                default:
                    throw this.createError(
                        "UNSUPPORTED_FORMAT",
                        `Export format '${format}' is not supported`,
                        { format },
                    );
            }
        } catch (error) {
            if (this.isExportError(error)) {
                throw error;
            }
            throw this.createError("EXPORT_FAILED", "Export operation failed", {
                originalError: error,
            });
        } finally {
            this.reportProgress("complete", 100, "Export complete");
        }
    }

    /**
     * Export diagram as Markdown document
     *
     * @param data - Diagram data
     * @param options - Markdown export options
     * @returns Promise resolving to export result
     */
    private async exportMarkdown(
        data: DiagramExportData,
        options: MarkdownExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating Markdown content...");

        const content = this.generateMarkdown(data, options);

        this.reportProgress("finalizing", 90, "Finalizing Markdown export...");

        return {
            format: "markdown",
            content,
            mimeType: "text/markdown",
            filename: this.generateFilename(data.name, "md"),
            metadata: {
                nodeCount: data.nodes.length,
                edgeCount: data.edges.length,
                generatedAt: new Date(),
                options,
            },
        };
    }

    /**
     * Export diagram as JSON
     *
     * @param data - Diagram data
     * @param options - JSON export options
     * @returns Promise resolving to export result
     */
    private async exportJson(
        data: DiagramExportData,
        options: JsonExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating JSON content...");

        const content = this.generateJson(data, options);

        this.reportProgress("finalizing", 90, "Finalizing JSON export...");

        return {
            format: "json",
            content,
            mimeType: "application/json",
            filename: this.generateFilename(data.name, "json"),
            metadata: {
                nodeCount: data.nodes.length,
                edgeCount: data.edges.length,
                generatedAt: new Date(),
                options,
            },
        };
    }

    /**
     * Export diagram as Cursor tasks format
     *
     * @param data - Diagram data
     * @param options - Cursor export options
     * @returns Promise resolving to export result
     */
    private async exportCursorTasks(
        data: DiagramExportData,
        options: CursorExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating Cursor tasks...");

        const content = this.generateCursorTasks(data, options);

        this.reportProgress(
            "finalizing",
            90,
            "Finalizing Cursor tasks export...",
        );

        return {
            format: "cursor",
            content,
            mimeType: "application/json",
            filename: this.generateFilename(data.name, "cursor.json"),
            metadata: {
                nodeCount: data.nodes.length,
                edgeCount: data.edges.length,
                generatedAt: new Date(),
                options,
            },
        };
    }

    /**
     * Export diagram as PDF
     *
     * @param data - Diagram data
     * @param options - PDF export options
     * @returns Promise resolving to export result
     */
    private async exportPdf(
        data: DiagramExportData,
        options: PdfExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating PDF...");

        // TODO: Implement in Task 074
        throw this.createError(
            "NOT_IMPLEMENTED",
            "PDF export is not yet implemented",
            { plannedTask: "Task 074" },
        );
    }

    /**
     * Export diagram as PNG image
     *
     * @param data - Diagram data
     * @param options - Image export options
     * @returns Promise resolving to export result
     */
    private async exportPng(
        data: DiagramExportData,
        options: ImageExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating PNG image...");

        // TODO: Implement in Task 075
        throw this.createError(
            "NOT_IMPLEMENTED",
            "PNG export is not yet implemented",
            { plannedTask: "Task 075" },
        );
    }

    /**
     * Export diagram as SVG image
     *
     * @param data - Diagram data
     * @param options - Image export options
     * @returns Promise resolving to export result
     */
    private async exportSvg(
        data: DiagramExportData,
        options: ImageExportOptions,
    ): Promise<ExportResult> {
        this.reportProgress("processing", 25, "Generating SVG image...");

        // TODO: Implement in Task 075
        throw this.createError(
            "NOT_IMPLEMENTED",
            "SVG export is not yet implemented",
            { plannedTask: "Task 075" },
        );
    }

    /**
     * Validate diagram data before export
     *
     * @param data - Diagram data to validate
     * @throws ExportError if validation fails
     */
    private validateDiagramData(data: DiagramExportData): void {
        if (!data.id) {
            throw this.createError("INVALID_DATA", "Diagram ID is required");
        }

        if (!data.name) {
            throw this.createError("INVALID_DATA", "Diagram name is required");
        }

        if (!Array.isArray(data.nodes)) {
            throw this.createError("INVALID_DATA", "Nodes must be an array");
        }

        if (!Array.isArray(data.edges)) {
            throw this.createError("INVALID_DATA", "Edges must be an array");
        }
    }

    /**
     * Generate filename for export
     *
     * @param diagramName - Base diagram name
     * @param extension - File extension
     * @returns Sanitized filename
     */
    private generateFilename(diagramName: string, extension: string): string {
        // Sanitize diagram name for filename
        const sanitized = diagramName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const timestamp = new Date().toISOString().split("T")[0];
        return `${sanitized}-${timestamp}.${extension}`;
    }

    /**
     * Report progress to callback if provided
     */
    private reportProgress(
        stage:
            | "preparing"
            | "processing"
            | "generating"
            | "finalizing"
            | "complete",
        percentage: number,
        message?: string,
    ): void {
        if (this.progressCallback) {
            this.progressCallback({ stage, percentage, message });
        }
    }

    /**
     * Create standardized export error
     */
    private createError(
        code: string,
        message: string,
        details?: Record<string, unknown>,
    ): ExportError {
        return {
            code,
            message,
            details,
        } as ExportError;
    }

    /**
     * Type guard for ExportError
     */
    private isExportError(error: unknown): error is ExportError {
        return (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            "message" in error
        );
    }

    // ==================== MARKDOWN GENERATION ====================

    /**
     * Generate comprehensive Markdown documentation from diagram data
     *
     * @param data - Diagram data to export
     * @param options - Markdown export options
     * @returns Complete Markdown document as string
     */
    private generateMarkdown(
        data: DiagramExportData,
        options: MarkdownExportOptions,
    ): string {
        const sections: string[] = [];
        const h = options.startingHeadingLevel || 1;
        const heading = (level: number, text: string) =>
            "#".repeat(Math.min(h + level - 1, 6)) + " " + text;

        // Header section
        sections.push(this.generateMarkdownHeader(data, options, heading));

        // Table of Contents (optional)
        if (options.includeTOC) {
            sections.push(this.generateMarkdownTOC(heading));
        }

        // Overview section
        sections.push(this.generateMarkdownOverview(data, options, heading));

        // Components section
        if (options.includeNodeDetails !== false) {
            sections.push(
                this.generateMarkdownComponents(data, options, heading),
            );
        }

        // Connections/Flows section
        if (options.includeEdgeDetails !== false) {
            sections.push(
                this.generateMarkdownConnections(data, options, heading),
            );
        }

        // Flows section
        sections.push(this.generateMarkdownFlows(data, options, heading));

        // Specifications section
        sections.push(
            this.generateMarkdownSpecifications(data, options, heading),
        );

        // Mermaid diagram (optional)
        if (options.includeMermaidDiagrams) {
            sections.push(this.generateMermaidDiagram(data, heading));
        }

        // Footer
        if (options.includeMetadata !== false) {
            sections.push(this.generateMarkdownFooter(data, options, heading));
        }

        return sections.join("\n\n---\n\n");
    }

    /**
     * Generate Markdown header with title and basic info
     */
    private generateMarkdownHeader(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const title = options.title || data.name;
        const description = options.description || data.description || "";
        const author = options.author || data.owner?.name || "IdeaGraph User";

        const lines = [heading(1, title)];

        if (description) {
            lines.push("", description);
        }

        if (options.includeMetadata !== false) {
            lines.push("");
            lines.push(`**Author:** ${author}`);

            if (options.includeTimestamps !== false) {
                lines.push(`**Generated:** ${new Date().toISOString()}`);
                if (data.createdAt) {
                    lines.push(
                        `**Created:** ${new Date(data.createdAt).toISOString()}`,
                    );
                }
                if (data.updatedAt) {
                    lines.push(
                        `**Last Updated:** ${new Date(data.updatedAt).toISOString()}`,
                    );
                }
            }
        }

        return lines.join("\n");
    }

    /**
     * Generate Table of Contents
     */
    private generateMarkdownTOC(
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Table of Contents"),
            "",
            "- [Overview](#overview)",
            "- [Components](#components)",
            "- [Connections](#connections)",
            "- [Flows](#flows)",
            "- [Specifications](#specifications)",
        ];

        return lines.join("\n");
    }

    /**
     * Generate overview section with statistics
     */
    private generateMarkdownOverview(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const nodesByType = this.groupNodesByType(data.nodes);
        const edgesByType = this.groupEdgesByType(data.edges);

        const lines = [
            heading(2, "Overview"),
            "",
            `This diagram contains **${data.nodes.length} components** and **${data.edges.length} connections**.`,
            "",
            heading(3, "Component Breakdown"),
            "",
        ];

        // Component statistics by type
        for (const [type, nodes] of Object.entries(nodesByType)) {
            const typeName = this.formatNodeTypeName(type);
            lines.push(
                `- **${typeName}**: ${nodes.length} component${nodes.length !== 1 ? "s" : ""}`,
            );
        }

        lines.push("");
        lines.push(heading(3, "Connection Types"));
        lines.push("");

        // Connection statistics by type
        for (const [type, edges] of Object.entries(edgesByType)) {
            const typeName = this.formatEdgeTypeName(type);
            lines.push(
                `- **${typeName}**: ${edges.length} connection${edges.length !== 1 ? "s" : ""}`,
            );
        }

        return lines.join("\n");
    }

    /**
     * Generate components section with detailed node information
     */
    private generateMarkdownComponents(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Components"),
            "",
            "Detailed information about each component in the architecture.",
            "",
        ];

        const nodesByType = this.groupNodesByType(data.nodes);

        for (const [type, nodes] of Object.entries(nodesByType)) {
            lines.push(heading(3, this.formatNodeTypeName(type)));
            lines.push("");

            for (const node of nodes) {
                const label = (node.data?.label as string) || node.id;
                const description =
                    (node.data?.description as string | undefined) ||
                    "No description provided.";

                lines.push(heading(4, label));
                lines.push("");
                lines.push(`**ID:** \`${node.id}\``);
                lines.push(
                    `**Type:** ${this.formatNodeTypeName(node.type || "unknown")}`,
                );
                lines.push("");
                lines.push(description);

                // Add metadata if present
                if (
                    node.data?.metadata &&
                    Object.keys(node.data.metadata).length > 0
                ) {
                    lines.push("");
                    lines.push("**Metadata:**");
                    lines.push("");
                    lines.push("```json");
                    lines.push(JSON.stringify(node.data.metadata, null, 2));
                    lines.push("```");
                }

                // Find connected components
                const incomingEdges = data.edges.filter(
                    (e) => e.target === node.id,
                );
                const outgoingEdges = data.edges.filter(
                    (e) => e.source === node.id,
                );

                if (incomingEdges.length > 0 || outgoingEdges.length > 0) {
                    lines.push("");
                    lines.push("**Connections:**");
                    lines.push("");

                    if (incomingEdges.length > 0) {
                        lines.push("*Incoming:*");
                        for (const edge of incomingEdges) {
                            const sourceNode = data.nodes.find(
                                (n) => n.id === edge.source,
                            );
                            const sourceLabel =
                                (sourceNode?.data?.label as
                                    | string
                                    | undefined) || edge.source;
                            lines.push(
                                `- ← ${sourceLabel} (${this.formatEdgeTypeName(edge.type || "unknown")})`,
                            );
                        }
                    }

                    if (outgoingEdges.length > 0) {
                        lines.push("");
                        lines.push("*Outgoing:*");
                        for (const edge of outgoingEdges) {
                            const targetNode = data.nodes.find(
                                (n) => n.id === edge.target,
                            );
                            const targetLabel =
                                (targetNode?.data?.label as
                                    | string
                                    | undefined) || edge.target;
                            lines.push(
                                `- → ${targetLabel} (${this.formatEdgeTypeName(edge.type || "unknown")})`,
                            );
                        }
                    }
                }

                lines.push("");
            }
        }

        return lines.join("\n");
    }

    /**
     * Generate connections section
     */
    private generateMarkdownConnections(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Connections"),
            "",
            "All connections between components in the architecture.",
            "",
        ];

        const edgesByType = this.groupEdgesByType(data.edges);

        for (const [type, edges] of Object.entries(edgesByType)) {
            lines.push(heading(3, this.formatEdgeTypeName(type)));
            lines.push("");

            if (edges.length === 0) {
                lines.push("*No connections of this type.*");
                lines.push("");
                continue;
            }

            lines.push("| From | To | Description |");
            lines.push("|------|----|----|");

            for (const edge of edges) {
                const sourceNode = data.nodes.find((n) => n.id === edge.source);
                const targetNode = data.nodes.find((n) => n.id === edge.target);

                const fromLabel =
                    (sourceNode?.data?.label as string | undefined) ||
                    edge.source;
                const toLabel =
                    (targetNode?.data?.label as string | undefined) ||
                    edge.target;
                const description =
                    (edge.data?.label as string | undefined) ||
                    (edge.data?.description as string | undefined) ||
                    "-";

                lines.push(`| ${fromLabel} | ${toLabel} | ${description} |`);
            }

            lines.push("");
        }

        return lines.join("\n");
    }

    /**
     * Generate flows section
     */
    private generateMarkdownFlows(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Flows"),
            "",
            "Key data and user flows through the system.",
            "",
        ];

        // Group edges by type to identify flows
        const dataFlows = data.edges.filter((e) => e.type === "data-flow");
        const userFlows = data.edges.filter((e) => e.type === "user-flow");
        const dependencies = data.edges.filter((e) => e.type === "dependency");

        if (dataFlows.length > 0) {
            lines.push(heading(3, "Data Flows"));
            lines.push("");
            lines.push("Data movement through the system:");
            lines.push("");

            for (const edge of dataFlows) {
                const sourceNode = data.nodes.find((n) => n.id === edge.source);
                const targetNode = data.nodes.find((n) => n.id === edge.target);
                const fromLabel =
                    (sourceNode?.data?.label as string | undefined) ||
                    edge.source;
                const toLabel =
                    (targetNode?.data?.label as string | undefined) ||
                    edge.target;
                const description =
                    (edge.data?.label as string | undefined) || "";

                lines.push(
                    `1. **${fromLabel}** → **${toLabel}**${description ? `: ${description}` : ""}`,
                );
            }
            lines.push("");
        }

        if (userFlows.length > 0) {
            lines.push(heading(3, "User Flows"));
            lines.push("");
            lines.push("User interaction paths:");
            lines.push("");

            for (const edge of userFlows) {
                const sourceNode = data.nodes.find((n) => n.id === edge.source);
                const targetNode = data.nodes.find((n) => n.id === edge.target);
                const fromLabel =
                    (sourceNode?.data?.label as string | undefined) ||
                    edge.source;
                const toLabel =
                    (targetNode?.data?.label as string | undefined) ||
                    edge.target;
                const description =
                    (edge.data?.label as string | undefined) || "";

                lines.push(
                    `1. **${fromLabel}** → **${toLabel}**${description ? `: ${description}` : ""}`,
                );
            }
            lines.push("");
        }

        if (dependencies.length > 0) {
            lines.push(heading(3, "Dependencies"));
            lines.push("");
            lines.push("Component dependencies:");
            lines.push("");

            for (const edge of dependencies) {
                const sourceNode = data.nodes.find((n) => n.id === edge.source);
                const targetNode = data.nodes.find((n) => n.id === edge.target);
                const fromLabel =
                    (sourceNode?.data?.label as string | undefined) ||
                    edge.source;
                const toLabel =
                    (targetNode?.data?.label as string | undefined) ||
                    edge.target;

                lines.push(`- **${fromLabel}** depends on **${toLabel}**`);
            }
            lines.push("");
        }

        return lines.join("\n");
    }

    /**
     * Generate specifications section
     */
    private generateMarkdownSpecifications(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Specifications"),
            "",
            "Technical specifications and implementation details.",
            "",
        ];

        lines.push(heading(3, "Architecture Summary"));
        lines.push("");

        const nodesByType = this.groupNodesByType(data.nodes);

        // Generate architecture summary
        if (nodesByType["ui-component"]?.length > 0) {
            lines.push("**Frontend:**");
            lines.push("");
            for (const node of nodesByType["ui-component"]) {
                lines.push(
                    `- ${(node.data?.label as string | undefined) || node.id}`,
                );
            }
            lines.push("");
        }

        if (nodesByType["api-endpoint"]?.length > 0) {
            lines.push("**API Endpoints:**");
            lines.push("");
            for (const node of nodesByType["api-endpoint"]) {
                lines.push(
                    `- ${(node.data?.label as string | undefined) || node.id}`,
                );
            }
            lines.push("");
        }

        if (nodesByType["service"]?.length > 0) {
            lines.push("**Services:**");
            lines.push("");
            for (const node of nodesByType["service"]) {
                lines.push(
                    `- ${(node.data?.label as string | undefined) || node.id}`,
                );
            }
            lines.push("");
        }

        if (nodesByType["database"]?.length > 0) {
            lines.push("**Data Layer:**");
            lines.push("");
            for (const node of nodesByType["database"]) {
                lines.push(
                    `- ${(node.data?.label as string | undefined) || node.id}`,
                );
            }
            lines.push("");
        }

        if (nodesByType["infrastructure"]?.length > 0) {
            lines.push("**Infrastructure:**");
            lines.push("");
            for (const node of nodesByType["infrastructure"]) {
                lines.push(
                    `- ${(node.data?.label as string | undefined) || node.id}`,
                );
            }
            lines.push("");
        }

        return lines.join("\n");
    }

    /**
     * Generate Mermaid diagram representation
     */
    private generateMermaidDiagram(
        data: DiagramExportData,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Diagram Visualization"),
            "",
            "Mermaid diagram representation:",
            "",
            "```mermaid",
            "graph TD",
        ];

        // Add nodes
        for (const node of data.nodes) {
            const label = (node.data?.label as string | undefined) || node.id;
            const shape = this.getMermaidNodeShape(node.type);
            lines.push(`    ${node.id}${shape[0]}"${label}"${shape[1]}`);
        }

        lines.push("");

        // Add edges
        for (const edge of data.edges) {
            const arrow = this.getMermaidArrow(edge.type);
            const label = edge.data?.label
                ? `|${edge.data.label as string}|`
                : "";
            lines.push(`    ${edge.source} ${arrow}${label} ${edge.target}`);
        }

        lines.push("```");

        return lines.join("\n");
    }

    /**
     * Generate Markdown footer with metadata
     */
    private generateMarkdownFooter(
        data: DiagramExportData,
        options: MarkdownExportOptions,
        heading: (level: number, text: string) => string,
    ): string {
        const lines = [
            heading(2, "Document Information"),
            "",
            `- **Diagram ID:** \`${data.id}\``,
            `- **Project ID:** \`${data.projectId}\``,
        ];

        if (data.projectName) {
            lines.push(`- **Project:** ${data.projectName}`);
        }

        if (options.includeTimestamps !== false) {
            lines.push(`- **Exported:** ${new Date().toISOString()}`);
        }

        lines.push(`- **Total Components:** ${data.nodes.length}`);
        lines.push(`- **Total Connections:** ${data.edges.length}`);
        lines.push("");
        lines.push("*Generated by IdeaGraph - Visual AI Architecture Tool*");

        return lines.join("\n");
    }

    // ==================== HELPER METHODS ====================

    /**
     * Group nodes by type
     */
    private groupNodesByType(
        nodes: DiagramExportData["nodes"],
    ): Record<string, DiagramExportData["nodes"]> {
        return nodes.reduce(
            (acc, node) => {
                const type = node.type || "unknown";
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(node);
                return acc;
            },
            {} as Record<string, DiagramExportData["nodes"]>,
        );
    }

    /**
     * Group edges by type
     */
    private groupEdgesByType(
        edges: DiagramExportData["edges"],
    ): Record<string, DiagramExportData["edges"]> {
        return edges.reduce(
            (acc, edge) => {
                const type = edge.type || "unknown";
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(edge);
                return acc;
            },
            {} as Record<string, DiagramExportData["edges"]>,
        );
    }

    /**
     * Format node type name for display
     */
    private formatNodeTypeName(type: string): string {
        const names: Record<string, string> = {
            "ui-component": "UI Components",
            "api-endpoint": "API Endpoints",
            database: "Databases",
            service: "Services",
            infrastructure: "Infrastructure",
            unknown: "Other Components",
        };
        return names[type] || type;
    }

    /**
     * Format edge type name for display
     */
    private formatEdgeTypeName(type: string): string {
        const names: Record<string, string> = {
            "data-flow": "Data Flow",
            dependency: "Dependency",
            "user-flow": "User Flow",
            unknown: "Other",
        };
        return names[type] || type;
    }

    /**
     * Get Mermaid node shape for node type
     */
    private getMermaidNodeShape(type?: string): [string, string] {
        const shapes: Record<string, [string, string]> = {
            "ui-component": ["[", "]"],
            "api-endpoint": ["([", "])"],
            database: ["[(", ")]"],
            service: ["[[", "]]"],
            infrastructure: ["{{", "}}"],
        };
        return shapes[type || "unknown"] || ["[", "]"];
    }

    /**
     * Get Mermaid arrow style for edge type
     */
    private getMermaidArrow(type?: string): string {
        const arrows: Record<string, string> = {
            "data-flow": "-->",
            dependency: "-.->",
            "user-flow": "==>",
        };
        return arrows[type || "unknown"] || "-->";
    }

    // ==================== JSON GENERATION ====================

    /**
     * JSON Export Schema Version
     * Increment this when making breaking changes to the JSON structure
     */
    private readonly JSON_SCHEMA_VERSION = "1.0.0";

    /**
     * Generate comprehensive JSON export from diagram data
     *
     * Produces a normalized, well-structured JSON document containing:
     * - Metadata about the diagram and export
     * - Complete node and edge data
     * - Statistics and analysis
     * - Optional computed properties
     * - Schema version for backward compatibility
     *
     * @param data - Diagram data to export
     * @param options - JSON export options
     * @returns JSON string (formatted or minified based on options)
     */
    private generateJson(
        data: DiagramExportData,
        options: JsonExportOptions,
    ): string {
        // Build the complete JSON structure
        const jsonData = {
            // Schema information for versioning and compatibility
            $schema: "ideagraph-diagram-export",
            version: this.JSON_SCHEMA_VERSION,

            // Metadata section
            metadata: this.buildJsonMetadata(data, options),

            // Core diagram data
            diagram: this.buildJsonDiagram(data),

            // Statistics and analysis
            statistics: this.buildJsonStatistics(data),

            // Computed properties (optional)
            ...(options.includeComputedProperties && {
                computed: this.buildJsonComputed(data),
            }),
        };

        // Format output based on options
        const indent = options.prettyPrint !== false ? options.indent || 2 : 0;

        return JSON.stringify(jsonData, null, indent);
    }

    /**
     * Build metadata section of JSON export
     */
    private buildJsonMetadata(
        data: DiagramExportData,
        options: JsonExportOptions,
    ): Record<string, unknown> {
        const metadata: Record<string, unknown> = {
            id: data.id,
            name: data.name,
        };

        // Optional description
        if (data.description) {
            metadata.description = data.description;
        }

        // Project information
        metadata.project = {
            id: data.projectId,
            ...(data.projectName && { name: data.projectName }),
        };

        // Custom title/description from export options
        if (options.title && options.title !== data.name) {
            metadata.exportTitle = options.title;
        }
        if (options.description && options.description !== data.description) {
            metadata.exportDescription = options.description;
        }

        // Author information
        if (options.author || data.owner) {
            metadata.author = options.author || data.owner?.name || "Unknown";
            if (data.owner?.id) {
                metadata.authorId = data.owner.id;
            }
            if (data.owner?.email) {
                metadata.authorEmail = data.owner.email;
            }
        }

        // Timestamps
        if (options.includeTimestamps !== false) {
            metadata.timestamps = {
                exported: new Date().toISOString(),
                ...(data.createdAt && {
                    created: new Date(data.createdAt).toISOString(),
                }),
                ...(data.updatedAt && {
                    updated: new Date(data.updatedAt).toISOString(),
                }),
            };
        }

        // Additional diagram metadata
        if (data.metadata && Object.keys(data.metadata).length > 0) {
            metadata.custom = data.metadata;
        }

        return metadata;
    }

    /**
     * Build diagram section with nodes, edges, and viewport
     */
    private buildJsonDiagram(data: DiagramExportData): Record<string, unknown> {
        return {
            nodes: data.nodes.map((node) => this.normalizeNode(node)),
            edges: data.edges.map((edge) => this.normalizeEdge(edge)),
            ...(data.viewport && { viewport: data.viewport }),
        };
    }

    /**
     * Build statistics section with diagram analysis
     */
    private buildJsonStatistics(
        data: DiagramExportData,
    ): Record<string, unknown> {
        const nodesByType = this.groupNodesByType(data.nodes);
        const edgesByType = this.groupEdgesByType(data.edges);

        return {
            summary: {
                totalNodes: data.nodes.length,
                totalEdges: data.edges.length,
                nodeTypes: Object.keys(nodesByType).length,
                edgeTypes: Object.keys(edgesByType).length,
            },
            nodes: {
                byType: Object.entries(nodesByType).map(([type, nodes]) => ({
                    type,
                    count: nodes.length,
                    ids: nodes.map((n) => n.id),
                })),
            },
            edges: {
                byType: Object.entries(edgesByType).map(([type, edges]) => ({
                    type,
                    count: edges.length,
                })),
            },
        };
    }

    /**
     * Build computed properties section with derived data
     * Includes connectivity analysis, flow detection, and complexity metrics
     */
    private buildJsonComputed(
        data: DiagramExportData,
    ): Record<string, unknown> {
        return {
            connectivity: this.computeConnectivity(data),
            flows: this.computeFlows(data),
            complexity: this.computeComplexity(data),
        };
    }

    /**
     * Normalize node data for JSON export
     * Ensures consistent structure and removes internal React Flow properties
     */
    private normalizeNode(
        node: DiagramExportData["nodes"][0],
    ): Record<string, unknown> {
        return {
            id: node.id,
            type: node.type || "unknown",
            position: node.position,
            data: node.data,
            ...(node.width && { width: node.width }),
            ...(node.height && { height: node.height }),
            ...(node.selected && { selected: node.selected }),
            ...(node.dragging && { dragging: node.dragging }),
            ...(node.parentId && { parentId: node.parentId }),
            ...(node.zIndex && { zIndex: node.zIndex }),
        };
    }

    /**
     * Normalize edge data for JSON export
     * Ensures consistent structure and removes internal React Flow properties
     */
    private normalizeEdge(
        edge: DiagramExportData["edges"][0],
    ): Record<string, unknown> {
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || "default",
            ...(edge.sourceHandle && { sourceHandle: edge.sourceHandle }),
            ...(edge.targetHandle && { targetHandle: edge.targetHandle }),
            ...(edge.data && { data: edge.data }),
            ...(edge.label && { label: edge.label }),
            ...(edge.animated && { animated: edge.animated }),
            ...(edge.selected && { selected: edge.selected }),
        };
    }

    /**
     * Compute connectivity metrics for each node
     */
    private computeConnectivity(
        data: DiagramExportData,
    ): Record<string, unknown> {
        const nodeConnectivity = data.nodes.map((node) => {
            const incomingEdges = data.edges.filter(
                (e) => e.target === node.id,
            );
            const outgoingEdges = data.edges.filter(
                (e) => e.source === node.id,
            );

            return {
                id: node.id,
                incoming: incomingEdges.length,
                outgoing: outgoingEdges.length,
                total: incomingEdges.length + outgoingEdges.length,
                incomingFrom: incomingEdges.map((e) => e.source),
                outgoingTo: outgoingEdges.map((e) => e.target),
            };
        });

        // Find highly connected nodes
        const sortedByConnectivity = [...nodeConnectivity].sort(
            (a, b) => b.total - a.total,
        );
        const highlyConnected = sortedByConnectivity.slice(0, 5);

        return {
            nodes: nodeConnectivity,
            highlyConnected: highlyConnected.map((n) => ({
                id: n.id,
                connections: n.total,
            })),
        };
    }

    /**
     * Compute data flows through the diagram
     */
    private computeFlows(data: DiagramExportData): Record<string, unknown> {
        const dataFlows = data.edges.filter((e) => e.type === "data-flow");
        const userFlows = data.edges.filter((e) => e.type === "user-flow");
        const dependencies = data.edges.filter((e) => e.type === "dependency");

        return {
            dataFlow: {
                count: dataFlows.length,
                paths: dataFlows.map((e) => ({ from: e.source, to: e.target })),
            },
            userFlow: {
                count: userFlows.length,
                paths: userFlows.map((e) => ({ from: e.source, to: e.target })),
            },
            dependencies: {
                count: dependencies.length,
                relationships: dependencies.map((e) => ({
                    dependent: e.source,
                    dependsOn: e.target,
                })),
            },
        };
    }

    /**
     * Compute complexity metrics for the diagram
     */
    private computeComplexity(
        data: DiagramExportData,
    ): Record<string, unknown> {
        const avgConnections =
            data.nodes.length > 0
                ? (data.edges.length * 2) / data.nodes.length
                : 0;

        return {
            nodeCount: data.nodes.length,
            edgeCount: data.edges.length,
            averageConnections: Number(avgConnections.toFixed(2)),
            density:
                data.nodes.length > 1
                    ? Number(
                          (
                              data.edges.length /
                              (data.nodes.length * (data.nodes.length - 1))
                          ).toFixed(4),
                      )
                    : 0,
            score: this.calculateComplexityScore(data),
        };
    }

    /**
     * Calculate overall complexity score (0-100)
     */
    private calculateComplexityScore(data: DiagramExportData): number {
        // Simple heuristic based on nodes, edges, and connectivity
        const nodeFactor = Math.min(data.nodes.length / 50, 1) * 40;
        const edgeFactor = Math.min(data.edges.length / 100, 1) * 40;
        const densityFactor =
            data.nodes.length > 1
                ? (data.edges.length /
                      (data.nodes.length * (data.nodes.length - 1))) *
                  20
                : 0;

        return Math.round(nodeFactor + edgeFactor + densityFactor);
    }

    // ==================== CURSOR TASKS GENERATION ====================

    /**
     * Generate Cursor-friendly tasks JSON from diagram
     *
     * Creates implementation tasks based on diagram nodes with:
     * - Meaningful titles and descriptions
     * - Dependency tracking from edges
     * - Acceptance criteria
     * - Implementation hints (optional)
     * - Grouping by type (optional)
     *
     * @param data - Diagram data
     * @param options - Cursor export options
     * @returns JSON string formatted for Cursor IDE
     */
    private generateCursorTasks(
        data: DiagramExportData,
        options: CursorExportOptions,
    ): string {
        // Extract implementation tasks from nodes
        const tasks = this.extractImplementationTasks(data, options);

        // Build the Cursor tasks document
        const cursorDocument = {
            $schema: "https://cursor.sh/schemas/tasks/v1.0.0",
            version: "1.0.0",
            project: {
                id: data.projectId,
                name: data.projectName || data.name,
                description:
                    options.description ||
                    data.description ||
                    "Implementation tasks generated from IdeaGraph diagram",
                diagramId: data.id,
                diagramName: data.name,
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                generatedBy: "IdeaGraph Export System",
                totalTasks: tasks.length,
                ...(options.author && { author: options.author }),
                ...(data.owner && {
                    owner: {
                        id: data.owner.id,
                        name: data.owner.name,
                        email: data.owner.email,
                    },
                }),
                source: {
                    type: "diagram",
                    id: data.id,
                    nodeCount: data.nodes.length,
                    edgeCount: data.edges.length,
                },
            },
            tasks: options.groupByType ? this.groupTasksByPhase(tasks) : tasks,
            ...(options.includeMetadata !== false && {
                diagram: {
                    nodes: data.nodes.length,
                    edges: data.edges.length,
                    complexity: this.calculateComplexityScore(data),
                },
            }),
        };

        return JSON.stringify(cursorDocument, null, 2);
    }

    /**
     * Extract implementation tasks from diagram nodes
     *
     * Analyzes each node to generate structured implementation tasks with:
     * - Context-aware titles and descriptions
     * - Dependency tracking from diagram edges
     * - Node type-specific acceptance criteria
     * - File path suggestions
     * - Optional implementation hints
     *
     * @param data - Diagram data
     * @param options - Cursor export options
     * @returns Array of task objects
     */
    private extractImplementationTasks(
        data: DiagramExportData,
        options: CursorExportOptions,
    ): Array<Record<string, unknown>> {
        return data.nodes.map((node, index) => {
            const nodeLabel = (node.data?.label as string) || node.id;
            const nodeDescription = (node.data?.description as string) || "";
            const nodeType = node.type || "component";

            // Generate task title based on node type
            const title = this.generateTaskTitle(nodeType, nodeLabel);

            // Generate comprehensive description
            const description = this.generateTaskDescription(
                nodeType,
                nodeLabel,
                nodeDescription,
                node.data,
            );

            // Find dependencies from incoming edges
            const incomingEdges = data.edges.filter(
                (edge) => edge.target === node.id,
            );
            const dependencies = incomingEdges.map((edge) => {
                const sourceNode = data.nodes.find((n) => n.id === edge.source);
                const sourceLabel =
                    (sourceNode?.data?.label as string) || edge.source;
                return {
                    id: edge.source,
                    title: sourceLabel,
                    type: edge.type || "default",
                };
            });

            // Find related components from outgoing edges
            const outgoingEdges = data.edges.filter(
                (edge) => edge.source === node.id,
            );
            const relatedComponents = outgoingEdges.map((edge) => {
                const targetNode = data.nodes.find((n) => n.id === edge.target);
                const targetLabel =
                    (targetNode?.data?.label as string) || edge.target;
                return {
                    id: edge.target,
                    title: targetLabel,
                    type: edge.type || "default",
                };
            });

            // Generate acceptance criteria based on node type
            const acceptanceCriteria = this.generateAcceptanceCriteria(
                nodeType,
                nodeLabel,
                incomingEdges.length,
                outgoingEdges.length,
            );

            // Suggest file paths based on node type
            const files = this.suggestFilePaths(nodeType, nodeLabel, node.data);

            // Calculate estimated time based on complexity
            const estimatedTime = this.estimateTaskTime(
                nodeType,
                incomingEdges.length,
                outgoingEdges.length,
                options.defaultEstimatedTime,
            );

            // Build the task object
            const task: Record<string, unknown> = {
                id: node.id,
                taskNumber: index + 1,
                title,
                description,
                type: nodeType,
                priority: this.determinePriority(
                    nodeType,
                    dependencies.length,
                    relatedComponents.length,
                    options.defaultPriority,
                ),
                status: "pending",
                estimatedHours: estimatedTime,
                phase: this.determinePhase(nodeType, dependencies.length),
                tags: this.generateTags(nodeType, node.data),
                acceptanceCriteria,
                files,
            };

            // Add dependencies if present
            if (dependencies.length > 0) {
                task.dependencies = dependencies;
            }

            // Add related components if present
            if (relatedComponents.length > 0) {
                task.relatedComponents = relatedComponents;
            }

            // Add implementation hints if requested
            if (options.includeHints) {
                task.hints = this.generateImplementationHints(
                    nodeType,
                    nodeLabel,
                    node.data,
                );
            }

            // Add position information for reference
            task.diagramPosition = {
                x: node.position.x,
                y: node.position.y,
            };

            // Add metadata from node if present
            if (node.data?.metadata) {
                task.metadata = node.data.metadata;
            }

            return task;
        });
    }

    /**
     * Generate task title based on node type and label
     */
    private generateTaskTitle(nodeType: string, label: string): string {
        const titleTemplates: Record<string, string> = {
            "ui-component": `Implement ${label} UI Component`,
            "api-endpoint": `Create ${label} API Endpoint`,
            database: `Set Up ${label} Database`,
            service: `Implement ${label} Service`,
            infrastructure: `Configure ${label} Infrastructure`,
        };

        return titleTemplates[nodeType] || `Implement ${label}`;
    }

    /**
     * Generate comprehensive task description
     */
    private generateTaskDescription(
        nodeType: string,
        label: string,
        description: string,
        data: Record<string, unknown> | undefined,
    ): string {
        const parts: string[] = [];

        // Add type-specific context
        const typeContext: Record<string, string> = {
            "ui-component":
                "This task involves implementing a frontend UI component.",
            "api-endpoint":
                "This task involves creating a backend API endpoint.",
            database: "This task involves database setup and configuration.",
            service: "This task involves implementing a backend service.",
            infrastructure: "This task involves infrastructure configuration.",
        };

        parts.push(
            typeContext[nodeType] || "This task involves implementation work.",
        );

        // Add user-provided description if available
        if (description) {
            parts.push(`\n\n${description}`);
        }

        // Add implementation objectives
        parts.push(`\n\n**Objectives:**`);
        parts.push(`- Implement ${label} according to specifications`);

        if (nodeType === "api-endpoint") {
            parts.push("- Define request/response schemas");
            parts.push("- Add input validation");
            parts.push("- Implement error handling");
        } else if (nodeType === "ui-component") {
            parts.push("- Create component with proper styling");
            parts.push("- Implement state management");
            parts.push("- Ensure accessibility standards");
        } else if (nodeType === "database") {
            parts.push("- Define schema and relationships");
            parts.push("- Create migrations");
            parts.push("- Add indexes for performance");
        } else if (nodeType === "service") {
            parts.push("- Implement business logic");
            parts.push("- Add error handling");
            parts.push("- Write unit tests");
        }

        return parts.join("\n");
    }

    /**
     * Generate acceptance criteria based on node type and connections
     */
    private generateAcceptanceCriteria(
        nodeType: string,
        label: string,
        incomingCount: number,
        outgoingCount: number,
    ): string[] {
        const criteria: string[] = [];

        // Type-specific criteria
        const typeCriteria: Record<string, string[]> = {
            "ui-component": [
                "Component renders without errors",
                "All props are properly typed",
                "Component is responsive on all screen sizes",
                "Accessibility standards met (ARIA labels, keyboard navigation)",
            ],
            "api-endpoint": [
                "Endpoint responds with correct status codes",
                "Request validation works correctly",
                "Response schema matches specification",
                "Error handling covers all edge cases",
            ],
            database: [
                "Schema matches design specifications",
                "Migrations run successfully",
                "Indexes are properly configured",
                "Queries are optimized for performance",
            ],
            service: [
                "Business logic implemented correctly",
                "All methods have proper error handling",
                "Service integrates with dependencies",
                "Unit tests achieve >80% coverage",
            ],
            infrastructure: [
                "Infrastructure is properly configured",
                "Security best practices followed",
                "Monitoring and logging enabled",
                "Documentation is complete",
            ],
        };

        criteria.push(
            ...(typeCriteria[nodeType] || [
                `${label} is fully implemented`,
                "Code follows project standards",
                "Documentation is complete",
            ]),
        );

        // Add connection-based criteria
        if (incomingCount > 0) {
            criteria.push(
                `Integrates correctly with ${incomingCount} upstream component${incomingCount !== 1 ? "s" : ""}`,
            );
        }

        if (outgoingCount > 0) {
            criteria.push(
                `Provides required interface for ${outgoingCount} downstream component${outgoingCount !== 1 ? "s" : ""}`,
            );
        }

        // Always add testing criteria
        criteria.push("All tests passing");

        return criteria;
    }

    /**
     * Suggest file paths based on node type
     */
    private suggestFilePaths(
        nodeType: string,
        label: string,
        data: Record<string, unknown> | undefined,
    ): string[] {
        const sanitizedLabel = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const pathTemplates: Record<string, string[]> = {
            "ui-component": [
                `src/components/${sanitizedLabel}/${sanitizedLabel}.tsx`,
                `src/components/${sanitizedLabel}/${sanitizedLabel}.test.tsx`,
                `src/components/${sanitizedLabel}/index.ts`,
            ],
            "api-endpoint": [
                `src/app/api/${sanitizedLabel}/route.ts`,
                `src/app/api/${sanitizedLabel}/route.test.ts`,
            ],
            database: [
                `src/db/schema.ts`,
                `src/drizzle/migrations/*_${sanitizedLabel}.sql`,
            ],
            service: [
                `src/services/${sanitizedLabel}.service.ts`,
                `src/services/${sanitizedLabel}.service.test.ts`,
            ],
            infrastructure: [
                `infrastructure/${sanitizedLabel}.yml`,
                `wrangler.jsonc`,
            ],
        };

        return pathTemplates[nodeType] || [`src/${sanitizedLabel}.ts`];
    }

    /**
     * Estimate task completion time based on complexity
     */
    private estimateTaskTime(
        nodeType: string,
        incomingEdges: number,
        outgoingEdges: number,
        defaultTime?: number,
    ): number {
        // Base time estimates per node type (in hours)
        const baseTimeEstimates: Record<string, number> = {
            "ui-component": 6,
            "api-endpoint": 5,
            database: 4,
            service: 6,
            infrastructure: 5,
        };

        let estimate = defaultTime || baseTimeEstimates[nodeType] || 4;

        // Add time based on complexity (connections)
        const complexityFactor = (incomingEdges + outgoingEdges) * 0.5;
        estimate += complexityFactor;

        // Round to nearest hour, minimum 2 hours
        return Math.max(2, Math.round(estimate));
    }

    /**
     * Determine task priority based on dependencies and connections
     */
    private determinePriority(
        nodeType: string,
        dependencyCount: number,
        relatedCount: number,
        defaultPriority?: string,
    ): string {
        // High priority if many downstream components depend on this
        if (relatedCount >= 3) {
            return "high";
        }

        // Critical priority for infrastructure and database nodes
        if (nodeType === "infrastructure" || nodeType === "database") {
            return "critical";
        }

        // Medium priority if has dependencies
        if (dependencyCount > 0) {
            return "medium";
        }

        return defaultPriority || "medium";
    }

    /**
     * Determine which implementation phase this task belongs to
     */
    private determinePhase(nodeType: string, dependencyCount: number): string {
        // Phase 1: Foundation (infrastructure, database)
        if (nodeType === "infrastructure" || nodeType === "database") {
            return "Foundation";
        }

        // Phase 2: Core Features (services, APIs with no dependencies)
        if (
            (nodeType === "service" || nodeType === "api-endpoint") &&
            dependencyCount === 0
        ) {
            return "Core Features";
        }

        // Phase 3: Integration (components with dependencies)
        if (dependencyCount > 0) {
            return "Integration";
        }

        // Phase 4: Polish (UI components)
        if (nodeType === "ui-component") {
            return "UI & Polish";
        }

        return "Core Features";
    }

    /**
     * Generate tags for task categorization
     */
    private generateTags(
        nodeType: string,
        data: Record<string, unknown> | undefined,
    ): string[] {
        const tags: string[] = [nodeType];

        // Add category tags based on type
        const categoryTags: Record<string, string[]> = {
            "ui-component": ["frontend", "react", "ui"],
            "api-endpoint": ["backend", "api", "endpoint"],
            database: ["database", "schema", "data"],
            service: ["backend", "service", "logic"],
            infrastructure: ["infrastructure", "config", "devops"],
        };

        tags.push(...(categoryTags[nodeType] || []));

        return tags;
    }

    /**
     * Generate implementation hints for developers
     */
    private generateImplementationHints(
        nodeType: string,
        label: string,
        data: Record<string, unknown> | undefined,
    ): string[] {
        const hints: string[] = [];

        const typeHints: Record<string, string[]> = {
            "ui-component": [
                "Use Shadcn/ui components for consistent styling",
                "Implement proper TypeScript types for all props",
                "Add loading and error states",
                "Consider mobile responsiveness from the start",
            ],
            "api-endpoint": [
                "Use Zod for request/response validation",
                "Implement proper error handling with ApiError utility",
                "Add authentication checks if needed",
                "Consider rate limiting for public endpoints",
            ],
            database: [
                "Use Drizzle ORM for type-safe queries",
                "Add proper indexes for frequently queried fields",
                "Consider foreign key constraints",
                "Test migrations in development first",
            ],
            service: [
                "Keep business logic separate from data access",
                "Add proper TypeScript types for all methods",
                "Implement comprehensive error handling",
                "Write unit tests alongside implementation",
            ],
            infrastructure: [
                "Follow infrastructure as code best practices",
                "Document all configuration options",
                "Consider security implications",
                "Test configuration changes in staging first",
            ],
        };

        hints.push(
            ...(typeHints[nodeType] || [
                "Follow existing code patterns in the codebase",
                "Write tests as you implement",
                "Document complex logic",
            ]),
        );

        return hints;
    }

    /**
     * Group tasks by phase for better organization
     */
    private groupTasksByPhase(
        tasks: Array<Record<string, unknown>>,
    ): Record<string, Array<Record<string, unknown>>> {
        const grouped: Record<string, Array<Record<string, unknown>>> = {};

        for (const task of tasks) {
            const phase = (task.phase as string) || "Other";
            if (!grouped[phase]) {
                grouped[phase] = [];
            }
            grouped[phase].push(task);
        }

        return grouped;
    }
}

/**
 * Factory function to create export engine instance
 *
 * @param progressCallback - Optional progress reporting callback
 * @returns ExportEngine instance
 */
export function createExportEngine(
    progressCallback?: ExportProgressCallback,
): ExportEngine {
    return new ExportEngine(progressCallback);
}

/**
 * Convenience function for single export operation
 *
 * @param data - Diagram data to export
 * @param format - Target export format
 * @param options - Format-specific options
 * @returns Promise resolving to export result
 */
export async function exportDiagram(
    data: DiagramExportData,
    format: ExportFormat,
    options: ExportOptions = {},
): Promise<ExportResult> {
    const engine = createExportEngine();
    return engine.export(data, format, options);
}
