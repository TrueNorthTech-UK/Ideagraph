import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/modules/auth/schemas/auth.schema";
import { projects } from "@/modules/projects/schemas/project.schema";

/**
 * Import Sessions Table
 *
 * Stores PRD import sessions with original content and processed results.
 * Each session captures a complete import operation including AI analysis results,
 * enabling audit trails, recovery, and future re-processing capabilities.
 */
export const importSessions = sqliteTable("import_sessions", {
    id: text("id").primaryKey(),

    // User who created the import session
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),

    // Optional project association
    projectId: text("project_id").references(() => projects.id, {
        onDelete: "set null",
    }),

    // Original input data
    fileName: text("file_name"),
    originalContent: text("original_content", {
        length: 1024 * 1024,
    }).notNull(), // Up to 1MB
    contentLength: integer("content_length").notNull(),

    // AI Analysis Results (stored as JSON strings)
    processedEntities: text("processed_entities", { length: 512 * 1024 }), // Analyzed entities
    processedRelationships: text("processed_relationships", {
        length: 512 * 1024,
    }), // Relationships
    processedFlows: text("processed_flows", { length: 512 * 1024 }), // Flows
    recommendations: text("recommendations", { length: 256 * 1024 }), // AI recommendations

    // Processing metadata
    confidence: integer("confidence"), // 0-100 confidence score
    processingTime: integer("processing_time"), // Milliseconds
    modelUsed: text("model_used"), // AI model identifier
    tokenCount: integer("token_count"), // Tokens consumed

    // Session status
    status: text("status", { enum: ["pending", "completed", "failed"] })
        .notNull()
        .default("pending"),
    errorMessage: text("error_message"),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
});

/**
 * Type inference for import sessions
 */
export type ImportSession = typeof importSessions.$inferSelect;
export type NewImportSession = typeof importSessions.$inferInsert;
