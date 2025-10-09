import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["**/__tests__/**/*.test.ts", "**/*.spec.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/**/__tests__/**",
                "src/**/*.test.ts",
                "src/**/*.spec.ts",
                "src/**/types.ts",
                "src/**/index.ts",
            ],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        // Disable middleware for tests
        middlewareMode: false,
    },
});
