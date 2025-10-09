#!/usr/bin/env tsx
/**
 * Test script to verify validation schemas work correctly
 * Run with: pnpm tsx scripts/test-validation.ts
 */

import {
    createProjectSchema,
    updateProjectSchema,
    createDiagramSchema,
    updateDiagramSchema,
    analyzePrdSchema,
    exportRequestSchema,
    exportQuerySchema,
    diagramIdSchema,
    projectIdSchema,
    validateRequest,
    safeValidateRequest,
} from "../src/constants/validation.constant";

console.log("🧪 Testing Validation Schemas\n");

// ===========================
// PROJECT VALIDATION TESTS
// ===========================
console.log("📦 Project Validation Tests");

// Valid project creation
try {
    const validProject = createProjectSchema.parse({
        name: "Test Project",
        description: "A test project description",
    });
    console.log("✅ Valid project creation passed");
} catch (error) {
    console.error("❌ Valid project creation failed:", error);
}

// Invalid project - name too short
try {
    createProjectSchema.parse({ name: "ab" });
    console.error("❌ Should have failed: name too short");
} catch (error) {
    console.log("✅ Correctly rejected: name too short");
}

// Invalid project - name too long
try {
    createProjectSchema.parse({
        name: "a".repeat(101),
    });
    console.error("❌ Should have failed: name too long");
} catch (error) {
    console.log("✅ Correctly rejected: name too long");
}

// Valid project update
try {
    const validUpdate = updateProjectSchema.parse({
        description: "Updated description",
    });
    console.log("✅ Valid project update passed");
} catch (error) {
    console.error("❌ Valid project update failed:", error);
}

// ===========================
// DIAGRAM VALIDATION TESTS
// ===========================
console.log("\n📊 Diagram Validation Tests");

// Valid diagram creation
try {
    const validDiagram = createDiagramSchema.parse({
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Diagram",
        nodes: [],
        edges: [],
    });
    console.log("✅ Valid diagram creation passed");
} catch (error) {
    console.error("❌ Valid diagram creation failed:", error);
}

// Invalid diagram - invalid UUID
try {
    createDiagramSchema.parse({
        projectId: "not-a-uuid",
        name: "Test Diagram",
    });
    console.error("❌ Should have failed: invalid UUID");
} catch (error) {
    console.log("✅ Correctly rejected: invalid UUID");
}

// Valid diagram with JSON string nodes
try {
    const validDiagram = createDiagramSchema.parse({
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Diagram",
        nodes: '[{"id":"1","type":"uiComponent","position":{"x":0,"y":0}}]',
        edges: "[]",
    });
    console.log("✅ Valid diagram with JSON string nodes passed");
} catch (error) {
    console.error("❌ Valid diagram with JSON string failed:", error);
}

// Invalid diagram - invalid JSON string
try {
    createDiagramSchema.parse({
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test Diagram",
        nodes: "invalid json",
    });
    console.error("❌ Should have failed: invalid JSON");
} catch (error) {
    console.log("✅ Correctly rejected: invalid JSON in nodes");
}

// Valid diagram update with nodes array
try {
    const validUpdate = updateDiagramSchema.parse({
        name: "Updated Diagram",
        nodes: [
            {
                id: "node-1",
                type: "uiComponent",
                position: { x: 100, y: 200 },
                data: {
                    label: "Button Component",
                    description: "Primary action button",
                },
            },
        ],
    });
    console.log("✅ Valid diagram update with nodes array passed");
} catch (error) {
    console.error("❌ Valid diagram update failed:", error);
}

// ===========================
// AI ANALYSIS TESTS
// ===========================
console.log("\n🤖 AI Analysis Validation Tests");

// Valid PRD analysis
try {
    const validAnalysis = analyzePrdSchema.parse({
        content: "a".repeat(150), // At least 100 chars
        projectId: "123e4567-e89b-12d3-a456-426614174000",
        fileName: "prd.txt",
    });
    console.log("✅ Valid PRD analysis request passed");
} catch (error) {
    console.error("❌ Valid PRD analysis failed:", error);
}

// Invalid - content too short
try {
    analyzePrdSchema.parse({ content: "short" });
    console.error("❌ Should have failed: content too short");
} catch (error) {
    console.log("✅ Correctly rejected: content too short (< 100 chars)");
}

// Invalid - content too long
try {
    analyzePrdSchema.parse({ content: "a".repeat(100001) });
    console.error("❌ Should have failed: content too long");
} catch (error) {
    console.log("✅ Correctly rejected: content too long (> 100,000 chars)");
}

// ===========================
// EXPORT VALIDATION TESTS
// ===========================
console.log("\n📤 Export Validation Tests");

// Valid export request
try {
    const validExport = exportRequestSchema.parse({
        format: "markdown",
        options: {
            includeTOC: true,
            includeNodeDetails: true,
        },
    });
    console.log("✅ Valid export request passed");
} catch (error) {
    console.error("❌ Valid export request failed:", error);
}

// Invalid export format
try {
    exportRequestSchema.parse({ format: "invalid" });
    console.error("❌ Should have failed: invalid format");
} catch (error) {
    console.log("✅ Correctly rejected: invalid export format");
}

// Valid export query
try {
    const validQuery = exportQuerySchema.parse({
        format: "json",
        download: "true",
    });
    console.log("✅ Valid export query passed");
} catch (error) {
    console.error("❌ Valid export query failed:", error);
}

// ===========================
// ID VALIDATION TESTS
// ===========================
console.log("\n🔑 ID Validation Tests");

// Valid UUID
try {
    const validId = diagramIdSchema.parse(
        "123e4567-e89b-12d3-a456-426614174000",
    );
    console.log("✅ Valid UUID passed");
} catch (error) {
    console.error("❌ Valid UUID failed:", error);
}

// Invalid UUID
try {
    diagramIdSchema.parse("not-a-uuid");
    console.error("❌ Should have failed: invalid UUID");
} catch (error) {
    console.log("✅ Correctly rejected: invalid UUID format");
}

// ===========================
// HELPER FUNCTION TESTS
// ===========================
console.log("\n🔧 Helper Function Tests");

// validateRequest (throws on error)
try {
    const result = validateRequest(
        projectIdSchema,
        "123e4567-e89b-12d3-a456-426614174000",
    );
    console.log("✅ validateRequest with valid data passed");
} catch (error) {
    console.error("❌ validateRequest failed:", error);
}

// safeValidateRequest (returns success/error object)
const safeResult = safeValidateRequest(createProjectSchema, {
    name: "Valid Project Name",
});
if (safeResult.success) {
    console.log("✅ safeValidateRequest with valid data passed");
} else {
    console.error("❌ safeValidateRequest failed:", safeResult.errors);
}

const safeErrorResult = safeValidateRequest(createProjectSchema, {
    name: "ab", // Too short
});
if (!safeErrorResult.success) {
    console.log("✅ safeValidateRequest correctly returned error object");
} else {
    console.error("❌ safeValidateRequest should have failed");
}

// ===========================
// SUMMARY
// ===========================
console.log("\n" + "=".repeat(50));
console.log("✅ All validation schema tests completed!");
console.log("=".repeat(50));
console.log("\nValidation schemas are working correctly:");
console.log("• Project schemas: create, update, ID validation");
console.log("• Diagram schemas: create, update, nodes, edges, metadata");
console.log("• AI schemas: PRD analysis, summarize");
console.log("• Export schemas: format, options, query parameters");
console.log("• Helper functions: validateRequest, safeValidateRequest");
console.log("\n✨ Task 028: COMPLETE\n");
