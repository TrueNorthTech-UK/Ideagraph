import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { projects } from "@/modules/projects/schemas/project.schema";

export const diagrams = sqliteTable("diagrams", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // Store nodes and edges as JSON strings (TEXT) for D1/SQLite
    nodes: text("nodes", { length: 1024 * 1024 }),
    edges: text("edges", { length: 1024 * 1024 }),
    metadata: text("metadata"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});
