/**
 * Cursor Tasks Export Tests
 *
 * Comprehensive test suite for Cursor tasks export functionality
 * Tests task generation, dependency tracking, and export options
 */

import { describe, it, expect } from "vitest";
import { ExportEngine } from "../ExportEngine";
import type { DiagramExportData, CursorExportOptions } from "../types";

/**
 * Helper function to create sample diagram data for testing
 */
function createSampleDiagram(): DiagramExportData {
    return {
        id: "diagram-123",
        name: "Sample Architecture Diagram",
        description: "A sample diagram for testing exports",
        projectId: "project-456",
        projectName: "Test Project",
        nodes: [
            {
                id: "node-1",
                type: "infrastructure",
                position: { x: 100, y: 100 },
                data: {
                    label: "Cloudflare Workers",
                    description: "Edge computing platform",
                    metadata: { provider: "Cloudflare" },
                },
            },
            {
                id: "node-2",
                type: "database",
                position: { x: 300, y: 100 },
                data: {
                    label: "D1 Database",
                    description: "Serverless SQL database",
                },
            },
            {
                id: "node-3",
                type: "api-endpoint",
                position: { x: 500, y: 100 },
                data: {
                    label: "User API",
                    description: "User management endpoints",
                },
            },
            {
                id: "node-4",
                type: "service",
                position: { x: 700, y: 100 },
                data: {
                    label: "Auth Service",
                    description: "Authentication and authorization",
                },
            },
            {
                id: "node-5",
                type: "ui-component",
                position: { x: 900, y: 100 },
                data: {
                    label: "Login Form",
                    description: "User login interface",
                },
            },
        ],
        edges: [
            {
                id: "edge-1",
                source: "node-1",
                target: "node-2",
                type: "dependency",
            },
            {
                id: "edge-2",
                source: "node-2",
                target: "node-3",
                type: "data-flow",
            },
            {
                id: "edge-3",
                source: "node-3",
                target: "node-4",
                type: "data-flow",
            },
            {
                id: "edge-4",
                source: "node-4",
                target: "node-5",
                type: "user-flow",
            },
        ],
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-02"),
        owner: {
            id: "user-789",
            name: "Test User",
            email: "test@example.com",
        },
    };
}

describe("ExportEngine - Cursor Tasks Export", () => {
    describe("Basic Export Functionality", () => {
        it("should export diagram to Cursor tasks format", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");

            expect(result.format).toBe("cursor");
            expect(result.mimeType).toBe("application/json");
            expect(result.filename).toMatch(/\.cursor\.json$/);
            expect(result.metadata.nodeCount).toBe(5);
            expect(result.metadata.edgeCount).toBe(4);
        });

        it("should generate valid JSON content", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed).toHaveProperty("$schema");
            expect(parsed).toHaveProperty("version");
            expect(parsed).toHaveProperty("project");
            expect(parsed).toHaveProperty("metadata");
            expect(parsed).toHaveProperty("tasks");
        });

        it("should include project metadata", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.project.id).toBe("project-456");
            expect(parsed.project.name).toBe("Test Project");
            expect(parsed.project.diagramId).toBe("diagram-123");
            expect(parsed.project.diagramName).toBe(
                "Sample Architecture Diagram",
            );
        });

        it("should generate tasks from all nodes", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(Array.isArray(parsed.tasks)).toBe(true);
            expect(parsed.tasks).toHaveLength(5);
        });
    });

    describe("Task Structure", () => {
        it("should generate tasks with all required fields", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const task = parsed.tasks[0];
            expect(task).toHaveProperty("id");
            expect(task).toHaveProperty("taskNumber");
            expect(task).toHaveProperty("title");
            expect(task).toHaveProperty("description");
            expect(task).toHaveProperty("type");
            expect(task).toHaveProperty("priority");
            expect(task).toHaveProperty("status");
            expect(task).toHaveProperty("estimatedHours");
            expect(task).toHaveProperty("phase");
            expect(task).toHaveProperty("tags");
            expect(task).toHaveProperty("acceptanceCriteria");
            expect(task).toHaveProperty("files");
        });

        it("should generate appropriate titles based on node type", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.tasks[0].title).toBe(
                "Configure Cloudflare Workers Infrastructure",
            );
            expect(parsed.tasks[1].title).toBe("Set Up D1 Database Database");
            expect(parsed.tasks[2].title).toBe("Create User API API Endpoint");
            expect(parsed.tasks[3].title).toBe(
                "Implement Auth Service Service",
            );
            expect(parsed.tasks[4].title).toBe(
                "Implement Login Form UI Component",
            );
        });

        it("should include descriptions with implementation context", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            expect(uiTask.description).toContain("frontend UI component");
            expect(uiTask.description).toContain("User login interface");
            expect(uiTask.description).toContain("Objectives:");
        });

        it("should assign appropriate priorities", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // Infrastructure and database should be critical
            const infraTask = parsed.tasks.find(
                (t: any) => t.type === "infrastructure",
            );
            const dbTask = parsed.tasks.find((t: any) => t.type === "database");
            expect(infraTask.priority).toBe("critical");
            expect(dbTask.priority).toBe("critical");
        });

        it("should determine correct implementation phases", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const infraTask = parsed.tasks.find(
                (t: any) => t.type === "infrastructure",
            );
            const dbTask = parsed.tasks.find((t: any) => t.type === "database");
            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );

            expect(infraTask.phase).toBe("Foundation");
            expect(dbTask.phase).toBe("Foundation");
            expect(uiTask.phase).toBe("UI & Polish");
        });

        it("should generate appropriate tags for each node type", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            expect(uiTask.tags).toContain("ui-component");
            expect(uiTask.tags).toContain("frontend");
            expect(uiTask.tags).toContain("react");

            const apiTask = parsed.tasks.find(
                (t: any) => t.type === "api-endpoint",
            );
            expect(apiTask.tags).toContain("api-endpoint");
            expect(apiTask.tags).toContain("backend");
            expect(apiTask.tags).toContain("api");
        });
    });

    describe("Dependency Tracking", () => {
        it("should track dependencies from incoming edges", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // node-3 (User API) depends on node-2 (D1 Database)
            const apiTask = parsed.tasks.find((t: any) => t.id === "node-3");
            expect(apiTask.dependencies).toHaveLength(1);
            expect(apiTask.dependencies[0].id).toBe("node-2");
            expect(apiTask.dependencies[0].title).toBe("D1 Database");
        });

        it("should track related components from outgoing edges", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // node-3 (User API) has outgoing edge to node-4 (Auth Service)
            const apiTask = parsed.tasks.find((t: any) => t.id === "node-3");
            expect(apiTask.relatedComponents).toHaveLength(1);
            expect(apiTask.relatedComponents[0].id).toBe("node-4");
        });

        it("should handle nodes with no dependencies", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // node-1 (Infrastructure) has no incoming edges
            const infraTask = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(infraTask.dependencies).toBeUndefined();
        });
    });

    describe("Acceptance Criteria", () => {
        it("should generate type-specific acceptance criteria", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            expect(uiTask.acceptanceCriteria).toContain(
                "Component renders without errors",
            );
            expect(uiTask.acceptanceCriteria).toContain(
                "Accessibility standards met (ARIA labels, keyboard navigation)",
            );

            const apiTask = parsed.tasks.find(
                (t: any) => t.type === "api-endpoint",
            );
            expect(apiTask.acceptanceCriteria).toContain(
                "Endpoint responds with correct status codes",
            );
            expect(apiTask.acceptanceCriteria).toContain(
                "Request validation works correctly",
            );
        });

        it("should include connection-based criteria", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // node-3 has 1 incoming and 1 outgoing edge
            const apiTask = parsed.tasks.find((t: any) => t.id === "node-3");
            expect(apiTask.acceptanceCriteria).toContainEqual(
                expect.stringContaining(
                    "Integrates correctly with 1 upstream component",
                ),
            );
            expect(apiTask.acceptanceCriteria).toContainEqual(
                expect.stringContaining(
                    "Provides required interface for 1 downstream component",
                ),
            );
        });

        it("should always include testing criteria", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            for (const task of parsed.tasks) {
                expect(task.acceptanceCriteria).toContain("All tests passing");
            }
        });
    });

    describe("File Path Suggestions", () => {
        it("should suggest UI component file paths", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            expect(uiTask.files).toContain(
                "src/components/login-form/login-form.tsx",
            );
            expect(uiTask.files).toContain(
                "src/components/login-form/login-form.test.tsx",
            );
        });

        it("should suggest API endpoint file paths", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const apiTask = parsed.tasks.find(
                (t: any) => t.type === "api-endpoint",
            );
            expect(apiTask.files).toContain("src/app/api/user-api/route.ts");
            expect(apiTask.files).toContain(
                "src/app/api/user-api/route.test.ts",
            );
        });

        it("should sanitize labels for file paths", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.nodes[4].data.label = "User Login Form!@# Component";

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find((t: any) => t.id === "node-5");
            expect(uiTask.files[0]).toContain("user-login-form-component");
            expect(uiTask.files[0]).not.toContain("!");
            expect(uiTask.files[0]).not.toContain("@");
        });
    });

    describe("Time Estimation", () => {
        it("should estimate task completion time", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            for (const task of parsed.tasks) {
                expect(task.estimatedHours).toBeGreaterThanOrEqual(2);
                expect(task.estimatedHours).toBeLessThanOrEqual(20);
            }
        });

        it("should estimate based on node type", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            const dbTask = parsed.tasks.find((t: any) => t.type === "database");

            // UI components typically take longer than database tasks
            expect(uiTask.estimatedHours).toBeGreaterThanOrEqual(4);
        });

        it("should respect default estimated time option", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                defaultEstimatedTime: 8,
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            // Most tasks should be around the default time (adjusted for complexity)
            const avgTime =
                parsed.tasks.reduce(
                    (sum: number, t: any) => sum + t.estimatedHours,
                    0,
                ) / parsed.tasks.length;
            expect(avgTime).toBeGreaterThanOrEqual(7);
            expect(avgTime).toBeLessThanOrEqual(10);
        });
    });

    describe("Export Options", () => {
        it("should support grouping tasks by type", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                groupByType: true,
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            expect(typeof parsed.tasks).toBe("object");
            expect(parsed.tasks).not.toBeInstanceOf(Array);
            expect(parsed.tasks).toHaveProperty("Foundation");
            expect(parsed.tasks).toHaveProperty("UI & Polish");
        });

        it("should include implementation hints when requested", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                includeHints: true,
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            const uiTask = parsed.tasks.find(
                (t: any) => t.type === "ui-component",
            );
            expect(uiTask.hints).toBeDefined();
            expect(Array.isArray(uiTask.hints)).toBe(true);
            expect(uiTask.hints.length).toBeGreaterThan(0);
            expect(uiTask.hints).toContainEqual(
                expect.stringContaining("Shadcn/ui"),
            );
        });

        it("should not include hints when not requested", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                includeHints: false,
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            for (const task of parsed.tasks) {
                expect(task.hints).toBeUndefined();
            }
        });

        it("should respect default priority option", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                defaultPriority: "high",
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            // Non-critical tasks should default to high
            const serviceTask = parsed.tasks.find(
                (t: any) => t.type === "service" && t.id === "node-4",
            );
            expect(serviceTask.priority).toBe("high");
        });

        it("should include metadata about the source diagram", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.source).toEqual({
                type: "diagram",
                id: "diagram-123",
                nodeCount: 5,
                edgeCount: 4,
            });
        });

        it("should include owner information when available", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.owner).toEqual({
                id: "user-789",
                name: "Test User",
                email: "test@example.com",
            });
        });

        it("should support custom author in options", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            const options: CursorExportOptions = {
                author: "Custom Author",
            };

            const result = await engine.export(diagram, "cursor", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.author).toBe("Custom Author");
        });
    });

    describe("Position and Metadata", () => {
        it("should include diagram position for each task", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const task = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(task.diagramPosition).toEqual({ x: 100, y: 100 });
        });

        it("should preserve node metadata in tasks", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const infraTask = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(infraTask.metadata).toEqual({ provider: "Cloudflare" });
        });
    });

    describe("Edge Cases", () => {
        it("should handle diagram with single node", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.nodes = [diagram.nodes[0]];
            diagram.edges = [];

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.tasks).toHaveLength(1);
            expect(parsed.tasks[0].dependencies).toBeUndefined();
            expect(parsed.tasks[0].relatedComponents).toBeUndefined();
        });

        it("should handle nodes with no labels", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.nodes[0].data.label = undefined;

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const task = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(task.title).toBe("Configure node-1 Infrastructure");
        });

        it("should handle nodes with no descriptions", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.nodes[0].data.description = undefined;

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const task = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(task.description).toContain("infrastructure configuration");
        });

        it("should handle unknown node types gracefully", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.nodes[0].type = "unknown-type";

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const task = parsed.tasks.find((t: any) => t.id === "node-1");
            expect(task.title).toContain("Cloudflare Workers");
            expect(task.phase).toBe("Core Features");
        });

        it("should handle complex dependency graphs", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            // Add more edges to create complex dependencies
            diagram.edges.push(
                {
                    id: "edge-5",
                    source: "node-1",
                    target: "node-3",
                    type: "dependency",
                },
                {
                    id: "edge-6",
                    source: "node-2",
                    target: "node-4",
                    type: "dependency",
                },
                {
                    id: "edge-7",
                    source: "node-3",
                    target: "node-5",
                    type: "data-flow",
                },
            );

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            const apiTask = parsed.tasks.find((t: any) => t.id === "node-3");
            // Should have dependencies from both node-1 and node-2
            expect(apiTask.dependencies.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Progress Reporting", () => {
        it("should report progress during export", async () => {
            const progressUpdates: Array<{
                stage: string;
                percentage: number;
            }> = [];
            const engine = new ExportEngine((progress) => {
                progressUpdates.push({
                    stage: progress.stage,
                    percentage: progress.percentage,
                });
            });
            const diagram = createSampleDiagram();

            await engine.export(diagram, "cursor");

            expect(progressUpdates.length).toBeGreaterThan(0);
            expect(progressUpdates[0].stage).toBe("preparing");
            expect(progressUpdates[progressUpdates.length - 1].stage).toBe(
                "complete",
            );
        });
    });

    describe("Error Handling", () => {
        it("should validate required diagram fields", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.id = "";

            await expect(engine.export(diagram, "cursor")).rejects.toThrow(
                "Diagram ID is required",
            );
        });

        it("should handle missing project information", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();
            diagram.projectName = undefined;

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            // Should fall back to diagram name
            expect(parsed.project.name).toBe("Sample Architecture Diagram");
        });
    });

    describe("Output Format Validation", () => {
        it("should produce valid JSON that can be parsed", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");

            expect(() => JSON.parse(result.content as string)).not.toThrow();
        });

        it("should include schema version for compatibility", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.$schema).toBe(
                "https://cursor.sh/schemas/tasks/v1.0.0",
            );
            expect(parsed.version).toBe("1.0.0");
        });

        it("should format JSON with proper indentation", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");
            const content = result.content as string;

            // Should be pretty-printed with indentation
            expect(content).toContain("\n");
            expect(content).toContain('  "');
        });
    });

    describe("Integration with ExportResult", () => {
        it("should return complete ExportResult structure", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");

            expect(result).toHaveProperty("format");
            expect(result).toHaveProperty("content");
            expect(result).toHaveProperty("mimeType");
            expect(result).toHaveProperty("filename");
            expect(result).toHaveProperty("metadata");
        });

        it("should include correct metadata in ExportResult", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");

            expect(result.metadata.nodeCount).toBe(5);
            expect(result.metadata.edgeCount).toBe(4);
            expect(result.metadata.generatedAt).toBeInstanceOf(Date);
        });

        it("should generate appropriate filename", async () => {
            const engine = new ExportEngine();
            const diagram = createSampleDiagram();

            const result = await engine.export(diagram, "cursor");

            expect(result.filename).toMatch(
                /^sample-architecture-diagram-\d{4}-\d{2}-\d{2}\.cursor\.json$/,
            );
        });
    });
});
