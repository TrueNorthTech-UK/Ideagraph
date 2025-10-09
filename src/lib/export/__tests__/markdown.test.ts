/**
 * Markdown Export Tests
 *
 * Comprehensive test suite for Markdown export functionality.
 * Tests structure, content, formatting, and edge cases.
 */

import { describe, expect, it } from "vitest";
import { createExportEngine, exportDiagram } from "../ExportEngine";
import type { DiagramExportData, MarkdownExportOptions } from "../types";
import type { Node, Edge } from "@xyflow/react";

/**
 * Helper function to create sample diagram data for testing
 */
function createSampleDiagram(options: {
    nodeCount?: number;
    edgeCount?: number;
    includeMetadata?: boolean;
    includeOwner?: boolean;
}): DiagramExportData {
    const {
        nodeCount = 5,
        edgeCount = 4,
        includeMetadata = false,
        includeOwner = false,
    } = options;

    const nodes: Node[] = [
        {
            id: "ui-1",
            type: "ui-component",
            position: { x: 100, y: 100 },
            data: {
                label: "Login Form",
                description: "User authentication form component",
                metadata: includeMetadata
                    ? { framework: "React", version: "18" }
                    : undefined,
            },
        },
        {
            id: "api-1",
            type: "api-endpoint",
            position: { x: 400, y: 100 },
            data: {
                label: "POST /auth/login",
                description: "Authentication endpoint for user login",
            },
        },
        {
            id: "service-1",
            type: "service",
            position: { x: 700, y: 100 },
            data: {
                label: "AuthService",
                description: "Handles user authentication logic",
            },
        },
        {
            id: "db-1",
            type: "database",
            position: { x: 700, y: 400 },
            data: {
                label: "Users DB",
                description: "User credentials and profile storage",
            },
        },
        {
            id: "infra-1",
            type: "infrastructure",
            position: { x: 400, y: 400 },
            data: {
                label: "Redis Cache",
                description: "Session storage and caching layer",
            },
        },
    ].slice(0, nodeCount);

    const edges: Edge[] = [
        {
            id: "e1",
            type: "user-flow",
            source: "ui-1",
            target: "api-1",
            data: { label: "Submit credentials" },
        },
        {
            id: "e2",
            type: "data-flow",
            source: "api-1",
            target: "service-1",
            data: { label: "Validate credentials" },
        },
        {
            id: "e3",
            type: "data-flow",
            source: "service-1",
            target: "db-1",
            data: { label: "Query user" },
        },
        {
            id: "e4",
            type: "dependency",
            source: "service-1",
            target: "infra-1",
            data: { label: "Store session" },
        },
    ].slice(0, edgeCount);

    return {
        id: "diagram-1",
        name: "Authentication Flow",
        description: "User authentication system architecture",
        projectId: "project-1",
        projectName: "Sample Project",
        nodes,
        edges,
        viewport: { x: 0, y: 0, zoom: 1 },
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-02T00:00:00Z"),
        owner: includeOwner
            ? {
                  id: "user-1",
                  name: "Test User",
                  email: "test@example.com",
              }
            : undefined,
    };
}

describe("ExportEngine - Markdown Export", () => {
    describe("Basic Export", () => {
        it("should export a basic diagram to Markdown", async () => {
            const data = createSampleDiagram({ nodeCount: 3, edgeCount: 2 });
            const result = await exportDiagram(data, "markdown");

            expect(result.format).toBe("markdown");
            expect(result.mimeType).toBe("text/markdown");
            expect(typeof result.content).toBe("string");
            expect(result.content.length).toBeGreaterThan(0);
        });

        it("should include diagram metadata in result", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");

            expect(result.metadata.nodeCount).toBe(5);
            expect(result.metadata.edgeCount).toBe(4);
            expect(result.metadata.generatedAt).toBeInstanceOf(Date);
        });

        it("should generate a valid filename", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");

            expect(result.filename).toMatch(
                /^authentication-flow-\d{4}-\d{2}-\d{2}\.md$/,
            );
        });
    });

    describe("Markdown Structure", () => {
        it("should include main heading with title", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("# Authentication Flow");
        });

        it("should include Overview section", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Overview");
            expect(content).toContain("This diagram contains");
        });

        it("should include Components section", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Components");
            expect(content).toContain("Login Form");
            expect(content).toContain("AuthService");
        });

        it("should include Connections section", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Connections");
            expect(content).toContain("| From | To | Description |");
        });

        it("should include Flows section", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Flows");
            expect(content).toContain("Data Flows");
            expect(content).toContain("User Flows");
        });

        it("should include Specifications section", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Specifications");
            expect(content).toContain("Architecture Summary");
        });

        it("should include Document Information footer", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Document Information");
            expect(content).toContain("Diagram ID:");
            expect(content).toContain("Generated by IdeaGraph");
        });
    });

    describe("Export Options - TOC", () => {
        it("should include Table of Contents when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeTOC: true,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain("## Table of Contents");
            expect(content).toContain("[Overview](#overview)");
            expect(content).toContain("[Components](#components)");
        });

        it("should exclude Table of Contents by default", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).not.toContain("## Table of Contents");
        });
    });

    describe("Export Options - Heading Levels", () => {
        it("should respect custom starting heading level", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                startingHeadingLevel: 2,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain("## Authentication Flow");
            expect(content).toContain("### Overview");
        });

        it("should use h1 as default starting level", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("# Authentication Flow");
            expect(content).toContain("## Overview");
        });
    });

    describe("Export Options - Node Details", () => {
        it("should include node details by default", async () => {
            const data = createSampleDiagram({ includeMetadata: true });
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("**ID:** `ui-1`");
            expect(content).toContain("**Type:** UI Components");
            expect(content).toContain("User authentication form component");
        });

        it("should include node metadata when present", async () => {
            const data = createSampleDiagram({ includeMetadata: true });
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("**Metadata:**");
            expect(content).toContain("```json");
            expect(content).toContain('"framework": "React"');
        });

        it("should include node connections", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("**Connections:**");
            expect(content).toContain("*Incoming:*");
            expect(content).toContain("*Outgoing:*");
        });

        it("should exclude node details when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeNodeDetails: false,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).not.toContain("**ID:** `ui-1`");
        });
    });

    describe("Export Options - Edge Details", () => {
        it("should include edge details by default", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("| From | To | Description |");
            expect(content).toContain("Login Form");
            expect(content).toContain("POST /auth/login");
        });

        it("should exclude edge details when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeEdgeDetails: false,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).not.toContain("| From | To | Description |");
        });
    });

    describe("Export Options - Mermaid Diagrams", () => {
        it("should include Mermaid diagram when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeMermaidDiagrams: true,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain("```mermaid");
            expect(content).toContain("graph TD");
            expect(content).toContain("ui-1");
            expect(content).toContain("-->");
        });

        it("should use correct Mermaid node shapes", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeMermaidDiagrams: true,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            // UI component uses square brackets
            expect(content).toContain('ui-1["Login Form"]');
            // API endpoint uses rounded brackets
            expect(content).toContain('api-1(["POST /auth/login"])');
            // Database uses cylindrical shape
            expect(content).toContain('db-1[("Users DB")]');
            // Service uses double square brackets
            expect(content).toContain('service-1[["AuthService"]]');
            // Infrastructure uses curly brackets
            expect(content).toContain('infra-1{{"Redis Cache"}}');
        });

        it("should use correct Mermaid arrow styles", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeMermaidDiagrams: true,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            // Data flow uses solid arrow
            expect(content).toContain("-->");
            // Dependency uses dotted arrow
            expect(content).toContain("-.->");
            // User flow uses thick arrow
            expect(content).toContain("==>");
        });

        it("should exclude Mermaid diagram by default", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).not.toContain("```mermaid");
        });
    });

    describe("Export Options - Metadata and Timestamps", () => {
        it("should include metadata by default", async () => {
            const data = createSampleDiagram({ includeOwner: true });
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("**Author:** Test User");
        });

        it("should include timestamps by default", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("**Generated:**");
            expect(content).toContain("**Created:**");
            expect(content).toContain("**Last Updated:**");
        });

        it("should exclude timestamps when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeTimestamps: false,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).not.toContain("**Generated:**");
            expect(content).not.toContain("**Created:**");
        });

        it("should exclude metadata when requested", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeMetadata: false,
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).not.toContain("## Document Information");
        });
    });

    describe("Custom Options", () => {
        it("should use custom title", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                title: "Custom Authentication Architecture",
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain("# Custom Authentication Architecture");
            expect(content).not.toContain("# Authentication Flow");
        });

        it("should use custom description", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                description:
                    "This is a custom description for testing purposes.",
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain(
                "This is a custom description for testing purposes.",
            );
        });

        it("should use custom author", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                author: "John Doe",
            };
            const result = await exportDiagram(data, "markdown", options);
            const content = result.content as string;

            expect(content).toContain("**Author:** John Doe");
        });
    });

    describe("Node Type Grouping", () => {
        it("should group components by type", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("### UI Components");
            expect(content).toContain("### API Endpoints");
            expect(content).toContain("### Services");
            expect(content).toContain("### Databases");
            expect(content).toContain("### Infrastructure");
        });

        it("should show correct counts in overview", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("- **UI Components**: 1 component");
            expect(content).toContain("- **API Endpoints**: 1 component");
            expect(content).toContain("- **Services**: 1 component");
            expect(content).toContain("- **Databases**: 1 component");
            expect(content).toContain("- **Infrastructure**: 1 component");
        });
    });

    describe("Edge Type Grouping", () => {
        it("should group connections by type", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("### Data Flow");
            expect(content).toContain("### Dependency");
            expect(content).toContain("### User Flow");
        });

        it("should show correct counts in overview", async () => {
            const data = createSampleDiagram({});
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("- **Data Flow**: 2 connections");
            expect(content).toContain("- **Dependency**: 1 connection");
            expect(content).toContain("- **User Flow**: 1 connection");
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty diagrams", async () => {
            const data = createSampleDiagram({ nodeCount: 0, edgeCount: 0 });
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("## Overview");
            expect(content).toContain("0 components");
            expect(content).toContain("0 connections");
        });

        it("should handle diagrams with nodes but no edges", async () => {
            const data = createSampleDiagram({ nodeCount: 3, edgeCount: 0 });
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("3 components");
            expect(content).toContain("0 connections");
            expect(result.metadata.nodeCount).toBe(3);
            expect(result.metadata.edgeCount).toBe(0);
        });

        it("should handle nodes without labels", async () => {
            const data = createSampleDiagram({});
            data.nodes[0].data.label = "";
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            // Should fall back to node ID
            expect(content).toContain("ui-1");
        });

        it("should handle nodes without descriptions", async () => {
            const data = createSampleDiagram({});
            data.nodes[0].data.description = undefined;
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("No description provided.");
        });

        it("should handle edges without labels", async () => {
            const data = createSampleDiagram({});
            data.edges[0].data = {};
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            // Should handle gracefully
            expect(content).toContain("| From | To | Description |");
        });

        it("should handle special characters in labels", async () => {
            const data = createSampleDiagram({});
            data.nodes[0].data.label = "User | Profile & Settings";
            const result = await exportDiagram(data, "markdown");
            const content = result.content as string;

            expect(content).toContain("User | Profile & Settings");
        });
    });

    describe("Progress Reporting", () => {
        it("should report progress during export", async () => {
            const data = createSampleDiagram({});
            const progressUpdates: Array<{
                stage: string;
                percentage: number;
            }> = [];

            const engine = createExportEngine((progress) => {
                progressUpdates.push({
                    stage: progress.stage,
                    percentage: progress.percentage,
                });
            });

            await engine.export(data, "markdown");

            expect(progressUpdates.length).toBeGreaterThan(0);
            expect(progressUpdates[0].stage).toBe("preparing");
            expect(progressUpdates[progressUpdates.length - 1].stage).toBe(
                "complete",
            );
        });
    });

    describe("Deterministic Output", () => {
        it("should produce same output for same input (excluding timestamps)", async () => {
            const data = createSampleDiagram({});
            const options: MarkdownExportOptions = {
                includeTimestamps: false,
            };

            const result1 = await exportDiagram(data, "markdown", options);
            const result2 = await exportDiagram(data, "markdown", options);

            expect(result1.content).toBe(result2.content);
        });
    });
});
