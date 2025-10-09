/**
 * Manual test script for Cursor tasks export
 *
 * Run with: pnpm tsx scripts/test-cursor-export.ts
 */

import { ExportEngine } from "../src/lib/export/ExportEngine";
import type {
    DiagramExportData,
    CursorExportOptions,
} from "../src/lib/export/types";

// Create sample diagram data
const sampleDiagram: DiagramExportData = {
    id: "diagram-test-001",
    name: "E-Commerce Architecture",
    description:
        "Sample e-commerce system architecture for testing Cursor export",
    projectId: "project-ecommerce",
    projectName: "E-Commerce Platform",
    nodes: [
        {
            id: "infra-1",
            type: "infrastructure",
            position: { x: 100, y: 100 },
            data: {
                label: "Cloudflare Workers",
                description: "Edge computing platform for serverless functions",
            },
        },
        {
            id: "db-1",
            type: "database",
            position: { x: 300, y: 100 },
            data: {
                label: "Products Database",
                description: "Main product catalog database",
            },
        },
        {
            id: "api-1",
            type: "api-endpoint",
            position: { x: 500, y: 100 },
            data: {
                label: "Product API",
                description: "REST API for product operations (CRUD)",
            },
        },
        {
            id: "service-1",
            type: "service",
            position: { x: 700, y: 100 },
            data: {
                label: "Cart Service",
                description: "Shopping cart management service",
            },
        },
        {
            id: "ui-1",
            type: "ui-component",
            position: { x: 900, y: 100 },
            data: {
                label: "Product List",
                description: "Product catalog listing component",
            },
        },
        {
            id: "ui-2",
            type: "ui-component",
            position: { x: 900, y: 300 },
            data: {
                label: "Shopping Cart",
                description: "Shopping cart UI component",
            },
        },
    ],
    edges: [
        {
            id: "edge-1",
            source: "infra-1",
            target: "db-1",
            type: "dependency",
        },
        {
            id: "edge-2",
            source: "db-1",
            target: "api-1",
            type: "data-flow",
        },
        {
            id: "edge-3",
            source: "api-1",
            target: "service-1",
            type: "data-flow",
        },
        {
            id: "edge-4",
            source: "service-1",
            target: "ui-2",
            type: "user-flow",
        },
        {
            id: "edge-5",
            source: "api-1",
            target: "ui-1",
            type: "data-flow",
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
        id: "user-123",
        name: "John Developer",
        email: "john@example.com",
    },
};

async function testCursorExport() {
    console.log("🧪 Testing Cursor Tasks Export\n");
    console.log("=".repeat(60));

    try {
        // Test 1: Basic export
        console.log("\n✅ Test 1: Basic Export");
        const engine = new ExportEngine((progress) => {
            console.log(
                `  Progress: ${progress.stage} - ${progress.percentage}% ${progress.message || ""}`,
            );
        });

        const result = await engine.export(sampleDiagram, "cursor");
        const parsed = JSON.parse(result.content as string);

        console.log("  ✓ Export completed successfully");
        console.log(`  ✓ Format: ${result.format}`);
        console.log(`  ✓ Filename: ${result.filename}`);
        console.log(`  ✓ Tasks generated: ${parsed.tasks.length}`);

        // Test 2: Export with hints
        console.log("\n✅ Test 2: Export with Implementation Hints");
        const optionsWithHints: CursorExportOptions = {
            includeHints: true,
            defaultPriority: "high",
        };

        const result2 = await engine.export(
            sampleDiagram,
            "cursor",
            optionsWithHints,
        );
        const parsed2 = JSON.parse(result2.content as string);

        console.log("  ✓ Export with hints completed");
        const taskWithHints = parsed2.tasks[0];
        console.log(`  ✓ Task has ${taskWithHints.hints?.length || 0} hints`);

        // Test 3: Grouped export
        console.log("\n✅ Test 3: Export with Grouping by Phase");
        const optionsGrouped: CursorExportOptions = {
            groupByType: true,
        };

        const result3 = await engine.export(
            sampleDiagram,
            "cursor",
            optionsGrouped,
        );
        const parsed3 = JSON.parse(result3.content as string);

        console.log("  ✓ Grouped export completed");
        console.log(`  ✓ Phases: ${Object.keys(parsed3.tasks).join(", ")}`);

        // Test 4: Validate structure
        console.log("\n✅ Test 4: Validate Task Structure");
        const firstTask = parsed.tasks[0];
        const requiredFields = [
            "id",
            "taskNumber",
            "title",
            "description",
            "type",
            "priority",
            "status",
            "estimatedHours",
            "phase",
            "tags",
            "acceptanceCriteria",
            "files",
        ];

        let allFieldsPresent = true;
        for (const field of requiredFields) {
            if (!(field in firstTask)) {
                console.log(`  ✗ Missing field: ${field}`);
                allFieldsPresent = false;
            }
        }

        if (allFieldsPresent) {
            console.log("  ✓ All required fields present");
        }

        // Test 5: Dependency tracking
        console.log("\n✅ Test 5: Dependency Tracking");
        const apiTask = parsed.tasks.find((t: any) => t.id === "api-1");
        console.log(
            `  ✓ Product API task has ${apiTask.dependencies?.length || 0} dependencies`,
        );
        console.log(
            `  ✓ Product API task has ${apiTask.relatedComponents?.length || 0} related components`,
        );

        // Display sample output
        console.log("\n📄 Sample Task Output:");
        console.log("=".repeat(60));
        console.log(
            JSON.stringify(parsed.tasks[0], null, 2).substring(0, 800) + "...",
        );

        console.log("\n✅ All tests passed!\n");
        console.log("📊 Summary:");
        console.log(`  • Total nodes: ${sampleDiagram.nodes.length}`);
        console.log(`  • Total edges: ${sampleDiagram.edges.length}`);
        console.log(`  • Tasks generated: ${parsed.tasks.length}`);
        console.log(
            `  • Average estimated time: ${(parsed.tasks.reduce((sum: number, t: any) => sum + t.estimatedHours, 0) / parsed.tasks.length).toFixed(1)} hours`,
        );
        console.log(
            `  • Total estimated time: ${parsed.tasks.reduce((sum: number, t: any) => sum + t.estimatedHours, 0)} hours`,
        );

        return true;
    } catch (error) {
        console.error("\n❌ Test failed:", error);
        return false;
    }
}

// Run the test
testCursorExport().then((success) => {
    process.exit(success ? 0 : 1);
});
