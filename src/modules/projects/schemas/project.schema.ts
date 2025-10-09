import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/modules/auth/schemas/auth.schema";

export const projects = sqliteTable("projects", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    ownerId: text("owner_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});
