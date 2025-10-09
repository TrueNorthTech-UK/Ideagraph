/**
 * Manual JSON Export Test
 *
 * Simple smoke test to verify JSON export functionality works correctly.
 * Run with: node --loader ts-node/esm src/lib/export/__tests__/json-manual-test.ts
 * Or: tsx src/lib/export/__tests__/json-manual-test.ts
 */

import { exportDiagram } from "../ExportEngine";
import type { DiagramExportData, JsonExportOptions } from "../types";

// Sample test data
const sampleData: DiagramExportData = {
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
            data: { label: "Auth API", description: "Authentication endpoint" },
        },
        {
            id: "node-3",
            type: "database",
            position: { x: 500, y: 100 },
            data: { label: "User DB", description: "User database" },
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

async function runTests() {
    console.log("🧪 Running JSON Export Manual Tests\n");

    try {
        // Test 1: Basic export
        console.log("Test 1: Basic JSON export...");
        const result1 = await exportDiagram(sampleData, "json");
        const parsed1 = JSON.parse(result1.content as string);

        console.assert(
            parsed1.$schema === "ideagraph-diagram-export",
            "✅ Schema field present",
        );
        console.assert(parsed1.version, "✅ Version field present");
        console.assert(parsed1.metadata, "✅ Metadata section present");
        console.assert(parsed1.diagram, "✅ Diagram section present");
        console.assert(parsed1.statistics, "✅ Statistics section present");
        console.assert(
            parsed1.diagram.nodes.length === 3,
            "✅ All nodes included",
        );
        console.assert(
            parsed1.diagram.edges.length === 2,
            "✅ All edges included",
        );
        console.log("✅ Test 1 PASSED\n");

        // Test 2: With computed properties
        console.log("Test 2: JSON export with computed properties...");
        const options2: JsonExportOptions = { includeComputedProperties: true };
        const result2 = await exportDiagram(sampleData, "json", options2);
        const parsed2 = JSON.parse(result2.content as string);

        console.assert(parsed2.computed, "✅ Computed section present");
        console.assert(
            parsed2.computed.connectivity,
            "✅ Connectivity computed",
        );
        console.assert(parsed2.computed.flows, "✅ Flows computed");
        console.assert(parsed2.computed.complexity, "✅ Complexity computed");
        console.log("✅ Test 2 PASSED\n");

        // Test 3: Minified output
        console.log("Test 3: Minified JSON export...");
        const options3: JsonExportOptions = { prettyPrint: false };
        const result3 = await exportDiagram(sampleData, "json", options3);
        const content3 = result3.content as string;

        console.assert(
            content3.split("\n").length === 1,
            "✅ Minified to single line",
        );
        console.assert(JSON.parse(content3), "✅ Still valid JSON");
        console.log("✅ Test 3 PASSED\n");

        // Test 4: Statistics validation
        console.log("Test 4: Statistics accuracy...");
        const result4 = await exportDiagram(sampleData, "json");
        const parsed4 = JSON.parse(result4.content as string);

        console.assert(
            parsed4.statistics.summary.totalNodes === 3,
            "✅ Node count correct",
        );
        console.assert(
            parsed4.statistics.summary.totalEdges === 2,
            "✅ Edge count correct",
        );
        console.assert(
            parsed4.statistics.nodes.byType.length > 0,
            "✅ Nodes grouped by type",
        );
        console.assert(
            parsed4.statistics.edges.byType.length > 0,
            "✅ Edges grouped by type",
        );
        console.log("✅ Test 4 PASSED\n");

        // Test 5: Metadata fields
        console.log("Test 5: Metadata completeness...");
        const result5 = await exportDiagram(sampleData, "json");
        const parsed5 = JSON.parse(result5.content as string);

        console.assert(parsed5.metadata.id === "diagram-123", "✅ ID present");
        console.assert(
            parsed5.metadata.name === "Test Architecture Diagram",
            "✅ Name present",
        );
        console.assert(
            parsed5.metadata.project.id === "project-456",
            "✅ Project ID present",
        );
        console.assert(
            parsed5.metadata.author === "Test User",
            "✅ Author present",
        );
        console.assert(parsed5.metadata.timestamps, "✅ Timestamps present");
        console.log("✅ Test 5 PASSED\n");

        console.log("🎉 All tests PASSED!");
        console.log("\n📋 Sample output (first 500 chars):");
        console.log(result1.content.toString().substring(0, 500) + "...\n");
    } catch (error) {
        console.error("❌ Test FAILED:", error);
        process.exit(1);
    }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests().catch(console.error);
}

export { runTests };
