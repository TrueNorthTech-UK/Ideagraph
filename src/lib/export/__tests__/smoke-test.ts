/**
 * Export Engine Smoke Test
 *
 * Quick verification that the export engine compiles and can be invoked.
 * Run with: pnpm tsx src/lib/export/__tests__/smoke-test.ts
 */

import { createExportEngine, exportDiagram } from "../ExportEngine";
import type { DiagramExportData } from "../types";

// Sample diagram data
const sampleDiagram: DiagramExportData = {
    id: "smoke-test-diagram",
    name: "Smoke Test Diagram",
    description: "Testing export engine",
    projectId: "test-project",
    nodes: [
        {
            id: "node-1",
            type: "uiComponent",
            position: { x: 0, y: 0 },
            data: { label: "Test Node" },
        },
    ],
    edges: [
        {
            id: "edge-1",
            source: "node-1",
            target: "node-1",
            type: "default",
        },
    ],
};

async function runSmokeTest() {
    console.log("🧪 Running Export Engine Smoke Test...\n");

    try {
        // Test 1: Create engine instance
        console.log("✓ Test 1: Creating export engine...");
        const engine = createExportEngine((progress) => {
            console.log(
                `  Progress: ${progress.stage} (${progress.percentage}%)`,
            );
        });
        console.log("✓ Export engine created successfully\n");

        // Test 2: Export to Markdown
        console.log("✓ Test 2: Exporting to Markdown...");
        const markdownResult = await engine.export(sampleDiagram, "markdown", {
            title: "Test Export",
            includeMetadata: true,
        });
        console.log(`✓ Markdown export successful: ${markdownResult.filename}`);
        console.log(
            `  Content length: ${markdownResult.content.toString().length} bytes\n`,
        );

        // Test 3: Export to JSON
        console.log("✓ Test 3: Exporting to JSON...");
        const jsonResult = await exportDiagram(sampleDiagram, "json", {
            prettyPrint: true,
        });
        console.log(`✓ JSON export successful: ${jsonResult.filename}`);
        console.log(`  Node count: ${jsonResult.metadata.nodeCount}`);
        console.log(`  Edge count: ${jsonResult.metadata.edgeCount}\n`);

        // Test 4: Export to Cursor tasks
        console.log("✓ Test 4: Exporting to Cursor tasks...");
        const cursorResult = await engine.export(sampleDiagram, "cursor", {
            defaultPriority: "high",
            defaultEstimatedTime: 6,
        });
        console.log(
            `✓ Cursor tasks export successful: ${cursorResult.filename}\n`,
        );

        // Test 5: Verify unimplemented formats throw correctly
        console.log("✓ Test 5: Verifying unimplemented formats...");
        try {
            await engine.export(sampleDiagram, "pdf");
            console.log(
                "✗ PDF export should have thrown NOT_IMPLEMENTED error",
            );
            process.exit(1);
        } catch (error: any) {
            if (error.code === "NOT_IMPLEMENTED") {
                console.log("✓ PDF export correctly throws NOT_IMPLEMENTED\n");
            } else {
                throw error;
            }
        }

        // Test 6: Verify validation
        console.log("✓ Test 6: Testing data validation...");
        try {
            await engine.export({ ...sampleDiagram, id: "" }, "json");
            console.log("✗ Validation should have caught missing ID");
            process.exit(1);
        } catch (error: any) {
            if (error.code === "INVALID_DATA") {
                console.log("✓ Validation correctly catches invalid data\n");
            } else {
                throw error;
            }
        }

        console.log("✅ All smoke tests passed!\n");
        console.log("📊 Summary:");
        console.log("  - Engine instantiation: ✓");
        console.log("  - Markdown export: ✓");
        console.log("  - JSON export: ✓");
        console.log("  - Cursor tasks export: ✓");
        console.log("  - Format validation: ✓");
        console.log("  - Data validation: ✓");
        console.log("\n✨ Export Engine is ready for use!");
    } catch (error) {
        console.error("\n❌ Smoke test failed:", error);
        process.exit(1);
    }
}

runSmokeTest();
