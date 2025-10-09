/**
 * JSON Export Tests
 *
 * Comprehensive test suite for JSON export functionality.
 * Tests schema validation, formatting options, data normalization,
 * and computed properties.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ExportEngine, exportDiagram } from "../ExportEngine";
import type { DiagramExportData, JsonExportOptions } from "../types";

describe("JSON Export", () => {
    let sampleData: DiagramExportData;
    let engine: ExportEngine;

    beforeEach(() => {
        // Sample diagram data for testing
        sampleData = {
            id: "diagram-123",
            name: "Test Architecture Diagram",
            description: "A test diagram for JSON export validation",
            projectId: "project-456",
            projectName: "Test Project",
            nodes: [
                {
                    id: "node-1",
                    type: "ui-component",
                    position: { x: 100, y: 100 },
                    data: {
                        label: "Login Component",
                        description: "User authentication UI",
                    },
                },
                {
                    id: "node-2",
                    type: "api-endpoint",
                    position: { x: 300, y: 100 },
                    data: {
                        label: "Auth API",
                        description: "Authentication endpoint",
                    },
                },
                {
                    id: "node-3",
                    type: "database",
                    position: { x: 500, y: 100 },
                    data: { label: "User DB", description: "User database" },
                },
                {
                    id: "node-4",
                    type: "service",
                    position: { x: 300, y: 300 },
                    data: {
                        label: "Email Service",
                        description: "Email notifications",
                    },
                },
            ],
            edges: [
                {
                    id: "edge-1",
                    source: "node-1",
                    target: "node-2",
                    type: "data-flow",
                    data: { label: "Login request" },
                },
                {
                    id: "edge-2",
                    source: "node-2",
                    target: "node-3",
                    type: "data-flow",
                    data: { label: "Query user" },
                },
                {
                    id: "edge-3",
                    source: "node-2",
                    target: "node-4",
                    type: "dependency",
                    data: { label: "Send notification" },
                },
            ],
            viewport: { x: 0, y: 0, zoom: 1 },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-15"),
            owner: {
                id: "user-789",
                name: "Test User",
                email: "test@example.com",
            },
        };

        engine = new ExportEngine();
    });

    describe("Schema and Structure", () => {
        it("should include schema version", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed).toHaveProperty(
                "$schema",
                "ideagraph-diagram-export",
            );
            expect(parsed).toHaveProperty("version");
            expect(typeof parsed.version).toBe("string");
            expect(parsed.version).toMatch(/^\d+\.\d+\.\d+$/);
        });

        it("should have required top-level sections", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed).toHaveProperty("$schema");
            expect(parsed).toHaveProperty("version");
            expect(parsed).toHaveProperty("metadata");
            expect(parsed).toHaveProperty("diagram");
            expect(parsed).toHaveProperty("statistics");
        });

        it("should validate against schema structure", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            // Metadata structure
            expect(parsed.metadata).toHaveProperty("id");
            expect(parsed.metadata).toHaveProperty("name");
            expect(parsed.metadata).toHaveProperty("project");

            // Diagram structure
            expect(parsed.diagram).toHaveProperty("nodes");
            expect(parsed.diagram).toHaveProperty("edges");
            expect(Array.isArray(parsed.diagram.nodes)).toBe(true);
            expect(Array.isArray(parsed.diagram.edges)).toBe(true);

            // Statistics structure
            expect(parsed.statistics).toHaveProperty("summary");
            expect(parsed.statistics).toHaveProperty("nodes");
            expect(parsed.statistics).toHaveProperty("edges");
        });
    });

    describe("Metadata Section", () => {
        it("should include basic metadata", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.id).toBe("diagram-123");
            expect(parsed.metadata.name).toBe("Test Architecture Diagram");
            expect(parsed.metadata.description).toBe(
                "A test diagram for JSON export validation",
            );
        });

        it("should include project information", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.project).toEqual({
                id: "project-456",
                name: "Test Project",
            });
        });

        it("should include author information", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.author).toBe("Test User");
            expect(parsed.metadata.authorId).toBe("user-789");
            expect(parsed.metadata.authorEmail).toBe("test@example.com");
        });

        it("should include timestamps by default", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.timestamps).toBeDefined();
            expect(parsed.metadata.timestamps.exported).toBeDefined();
            expect(parsed.metadata.timestamps.created).toBe(
                "2024-01-01T00:00:00.000Z",
            );
            expect(parsed.metadata.timestamps.updated).toBe(
                "2024-01-15T00:00:00.000Z",
            );
        });

        it("should exclude timestamps when option is false", async () => {
            const options: JsonExportOptions = { includeTimestamps: false };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.timestamps).toBeUndefined();
        });

        it("should use custom export title and description", async () => {
            const options: JsonExportOptions = {
                title: "Custom Export Title",
                description: "Custom export description",
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.exportTitle).toBe("Custom Export Title");
            expect(parsed.metadata.exportDescription).toBe(
                "Custom export description",
            );
        });

        it("should include custom metadata", async () => {
            const dataWithMetadata = {
                ...sampleData,
                metadata: {
                    customField: "customValue",
                    version: "2.0",
                    tags: ["architecture", "auth"],
                },
            };

            const result = await engine.export(dataWithMetadata, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.metadata.custom).toEqual({
                customField: "customValue",
                version: "2.0",
                tags: ["architecture", "auth"],
            });
        });
    });

    describe("Diagram Section", () => {
        it("should include all nodes", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.nodes).toHaveLength(4);
        });

        it("should normalize node data", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            const node = parsed.diagram.nodes[0];
            expect(node).toHaveProperty("id");
            expect(node).toHaveProperty("type");
            expect(node).toHaveProperty("position");
            expect(node).toHaveProperty("data");
        });

        it("should include all edges", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.edges).toHaveLength(3);
        });

        it("should normalize edge data", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            const edge = parsed.diagram.edges[0];
            expect(edge).toHaveProperty("id");
            expect(edge).toHaveProperty("source");
            expect(edge).toHaveProperty("target");
            expect(edge).toHaveProperty("type");
        });

        it("should include viewport data", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
        });

        it("should handle nodes without viewport", async () => {
            const dataWithoutViewport = { ...sampleData, viewport: undefined };
            const result = await engine.export(dataWithoutViewport, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.viewport).toBeUndefined();
        });
    });

    describe("Statistics Section", () => {
        it("should include summary statistics", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.statistics.summary.totalNodes).toBe(4);
            expect(parsed.statistics.summary.totalEdges).toBe(3);
            expect(parsed.statistics.summary.nodeTypes).toBe(4); // ui-component, api-endpoint, database, service
            expect(parsed.statistics.summary.edgeTypes).toBe(2); // data-flow, dependency
        });

        it("should group nodes by type", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            const nodesByType = parsed.statistics.nodes.byType;
            expect(Array.isArray(nodesByType)).toBe(true);
            expect(nodesByType.length).toBeGreaterThan(0);

            const uiComponents = nodesByType.find(
                (g: any) => g.type === "ui-component",
            );
            expect(uiComponents.count).toBe(1);
            expect(uiComponents.ids).toContain("node-1");
        });

        it("should group edges by type", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            const edgesByType = parsed.statistics.edges.byType;
            expect(Array.isArray(edgesByType)).toBe(true);

            const dataFlows = edgesByType.find(
                (g: any) => g.type === "data-flow",
            );
            expect(dataFlows.count).toBe(2);

            const dependencies = edgesByType.find(
                (g: any) => g.type === "dependency",
            );
            expect(dependencies.count).toBe(1);
        });
    });

    describe("Computed Properties", () => {
        it("should not include computed properties by default", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.computed).toBeUndefined();
        });

        it("should include computed properties when enabled", async () => {
            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.computed).toBeDefined();
            expect(parsed.computed).toHaveProperty("connectivity");
            expect(parsed.computed).toHaveProperty("flows");
            expect(parsed.computed).toHaveProperty("complexity");
        });

        it("should compute connectivity metrics", async () => {
            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            const connectivity = parsed.computed.connectivity;
            expect(Array.isArray(connectivity.nodes)).toBe(true);
            expect(connectivity.nodes).toHaveLength(4);

            // Node-2 (Auth API) should have 2 incoming and 2 outgoing = 4 total
            const node2Connectivity = connectivity.nodes.find(
                (n: any) => n.id === "node-2",
            );
            expect(node2Connectivity.incoming).toBe(1);
            expect(node2Connectivity.outgoing).toBe(2);
            expect(node2Connectivity.total).toBe(3);
        });

        it("should identify highly connected nodes", async () => {
            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            const highlyConnected =
                parsed.computed.connectivity.highlyConnected;
            expect(Array.isArray(highlyConnected)).toBe(true);
            expect(highlyConnected.length).toBeGreaterThan(0);
            expect(highlyConnected.length).toBeLessThanOrEqual(5);
        });

        it("should compute flow analysis", async () => {
            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            const flows = parsed.computed.flows;
            expect(flows.dataFlow.count).toBe(2);
            expect(flows.dependencies.count).toBe(1);
            expect(flows.userFlow.count).toBe(0);
        });

        it("should compute complexity metrics", async () => {
            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            const complexity = parsed.computed.complexity;
            expect(complexity.nodeCount).toBe(4);
            expect(complexity.edgeCount).toBe(3);
            expect(typeof complexity.averageConnections).toBe("number");
            expect(typeof complexity.density).toBe("number");
            expect(typeof complexity.score).toBe("number");
            expect(complexity.score).toBeGreaterThanOrEqual(0);
            expect(complexity.score).toBeLessThanOrEqual(100);
        });
    });

    describe("Formatting Options", () => {
        it("should pretty print by default", async () => {
            const result = await engine.export(sampleData, "json");
            const content = result.content as string;

            // Pretty printed JSON should have newlines and indentation
            expect(content).toContain("\n");
            expect(content).toContain("  "); // 2-space indentation (default)
        });

        it("should use custom indentation", async () => {
            const options: JsonExportOptions = { prettyPrint: true, indent: 4 };
            const result = await engine.export(sampleData, "json", options);
            const content = result.content as string;

            // Should have 4-space indentation
            expect(content).toContain("    "); // 4-space indentation
        });

        it("should minify when prettyPrint is false", async () => {
            const options: JsonExportOptions = { prettyPrint: false };
            const result = await engine.export(sampleData, "json", options);
            const content = result.content as string;
            const parsed = JSON.parse(content);

            // Minified JSON should be parseable but compact
            expect(parsed).toBeDefined();
            // Should not have excess whitespace
            const lines = content.split("\n");
            expect(lines.length).toBe(1); // Single line for minified
        });
    });

    describe("Data Normalization", () => {
        it("should handle nodes with minimal data", async () => {
            const minimalData: DiagramExportData = {
                id: "test",
                name: "Test",
                projectId: "proj",
                nodes: [
                    {
                        id: "node-1",
                        position: { x: 0, y: 0 },
                        data: {},
                    },
                ],
                edges: [],
            };

            const result = await engine.export(minimalData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.nodes[0]).toHaveProperty("id");
            expect(parsed.diagram.nodes[0]).toHaveProperty("type", "unknown");
            expect(parsed.diagram.nodes[0]).toHaveProperty("position");
        });

        it("should handle edges with minimal data", async () => {
            const minimalData: DiagramExportData = {
                id: "test",
                name: "Test",
                projectId: "proj",
                nodes: [
                    { id: "node-1", position: { x: 0, y: 0 }, data: {} },
                    { id: "node-2", position: { x: 100, y: 0 }, data: {} },
                ],
                edges: [
                    {
                        id: "edge-1",
                        source: "node-1",
                        target: "node-2",
                    },
                ],
            };

            const result = await engine.export(minimalData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.edges[0]).toHaveProperty("id");
            expect(parsed.diagram.edges[0]).toHaveProperty("source");
            expect(parsed.diagram.edges[0]).toHaveProperty("target");
            expect(parsed.diagram.edges[0]).toHaveProperty("type", "default");
        });

        it("should preserve optional node properties", async () => {
            const dataWithOptionalProps: DiagramExportData = {
                id: "test",
                name: "Test",
                projectId: "proj",
                nodes: [
                    {
                        id: "node-1",
                        position: { x: 0, y: 0 },
                        data: { label: "Test" },
                        width: 200,
                        height: 100,
                        selected: true,
                        zIndex: 5,
                    },
                ],
                edges: [],
            };

            const result = await engine.export(dataWithOptionalProps, "json");
            const parsed = JSON.parse(result.content as string);

            const node = parsed.diagram.nodes[0];
            expect(node.width).toBe(200);
            expect(node.height).toBe(100);
            expect(node.selected).toBe(true);
            expect(node.zIndex).toBe(5);
        });

        it("should preserve optional edge properties", async () => {
            const dataWithOptionalProps: DiagramExportData = {
                id: "test",
                name: "Test",
                projectId: "proj",
                nodes: [
                    { id: "node-1", position: { x: 0, y: 0 }, data: {} },
                    { id: "node-2", position: { x: 100, y: 0 }, data: {} },
                ],
                edges: [
                    {
                        id: "edge-1",
                        source: "node-1",
                        target: "node-2",
                        animated: true,
                        selected: true,
                        label: "Test Connection",
                    },
                ],
            };

            const result = await engine.export(dataWithOptionalProps, "json");
            const parsed = JSON.parse(result.content as string);

            const edge = parsed.diagram.edges[0];
            expect(edge.animated).toBe(true);
            expect(edge.selected).toBe(true);
            expect(edge.label).toBe("Test Connection");
        });
    });

    describe("Export Result Metadata", () => {
        it("should return correct result format", async () => {
            const result = await engine.export(sampleData, "json");

            expect(result.format).toBe("json");
            expect(result.mimeType).toBe("application/json");
            expect(result.filename).toMatch(/\.json$/);
            expect(typeof result.content).toBe("string");
        });

        it("should include result metadata", async () => {
            const result = await engine.export(sampleData, "json");

            expect(result.metadata.nodeCount).toBe(4);
            expect(result.metadata.edgeCount).toBe(3);
            expect(result.metadata.generatedAt).toBeInstanceOf(Date);
        });

        it("should generate valid filename", async () => {
            const result = await engine.export(sampleData, "json");

            expect(result.filename).toMatch(
                /^test-architecture-diagram-\d{4}-\d{2}-\d{2}\.json$/,
            );
        });
    });

    describe("Empty Diagrams", () => {
        it("should handle diagrams with no nodes", async () => {
            const emptyData: DiagramExportData = {
                id: "empty",
                name: "Empty Diagram",
                projectId: "proj",
                nodes: [],
                edges: [],
            };

            const result = await engine.export(emptyData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.nodes).toHaveLength(0);
            expect(parsed.diagram.edges).toHaveLength(0);
            expect(parsed.statistics.summary.totalNodes).toBe(0);
            expect(parsed.statistics.summary.totalEdges).toBe(0);
        });

        it("should handle complexity for empty diagrams", async () => {
            const emptyData: DiagramExportData = {
                id: "empty",
                name: "Empty Diagram",
                projectId: "proj",
                nodes: [],
                edges: [],
            };

            const options: JsonExportOptions = {
                includeComputedProperties: true,
            };
            const result = await engine.export(emptyData, "json", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.computed.complexity.nodeCount).toBe(0);
            expect(parsed.computed.complexity.edgeCount).toBe(0);
            expect(parsed.computed.complexity.averageConnections).toBe(0);
            expect(parsed.computed.complexity.density).toBe(0);
        });
    });

    describe("Large Diagrams", () => {
        it("should handle diagrams with many nodes", async () => {
            const largeData: DiagramExportData = {
                id: "large",
                name: "Large Diagram",
                projectId: "proj",
                nodes: Array.from({ length: 100 }, (_, i) => ({
                    id: `node-${i}`,
                    position: { x: i * 10, y: i * 10 },
                    data: { label: `Node ${i}` },
                })),
                edges: Array.from({ length: 150 }, (_, i) => ({
                    id: `edge-${i}`,
                    source: `node-${i % 100}`,
                    target: `node-${(i + 1) % 100}`,
                })),
            };

            const result = await engine.export(largeData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.diagram.nodes).toHaveLength(100);
            expect(parsed.diagram.edges).toHaveLength(150);
            expect(parsed.statistics.summary.totalNodes).toBe(100);
            expect(parsed.statistics.summary.totalEdges).toBe(150);
        });
    });

    describe("Convenience Function", () => {
        it("should work with exportDiagram convenience function", async () => {
            const result = await exportDiagram(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.$schema).toBe("ideagraph-diagram-export");
            expect(parsed.metadata.id).toBe("diagram-123");
        });

        it("should accept options in convenience function", async () => {
            const options: JsonExportOptions = {
                prettyPrint: false,
                includeComputedProperties: true,
            };
            const result = await exportDiagram(sampleData, "json", options);
            const parsed = JSON.parse(result.content as string);

            expect(parsed.computed).toBeDefined();
        });
    });

    describe("JSON Validity", () => {
        it("should produce valid JSON", async () => {
            const result = await engine.export(sampleData, "json");

            expect(() => JSON.parse(result.content as string)).not.toThrow();
        });

        it("should produce parseable and re-serializable JSON", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);
            const reserialized = JSON.stringify(parsed);

            expect(() => JSON.parse(reserialized)).not.toThrow();
        });

        it("should produce same structure for same input", async () => {
            const result1 = await engine.export(sampleData, "json", {
                includeTimestamps: false,
                prettyPrint: false,
            });
            const result2 = await engine.export(sampleData, "json", {
                includeTimestamps: false,
                prettyPrint: false,
            });

            expect(result1.content).toBe(result2.content);
        });
    });

    describe("Backward Compatibility", () => {
        it("should include schema version for compatibility tracking", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            expect(parsed.version).toBeDefined();
            expect(typeof parsed.version).toBe("string");
        });

        it("should maintain consistent structure across exports", async () => {
            const result = await engine.export(sampleData, "json");
            const parsed = JSON.parse(result.content as string);

            // These fields should always be present for backward compatibility
            const requiredFields = [
                "$schema",
                "version",
                "metadata",
                "diagram",
                "statistics",
            ];

            for (const field of requiredFields) {
                expect(parsed).toHaveProperty(field);
            }
        });
    });
});
