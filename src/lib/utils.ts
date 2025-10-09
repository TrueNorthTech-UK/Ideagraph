import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes with clsx
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Environment Variable Validation Utilities
 *
 * These utilities help validate and safely access environment variables
 * across both server and edge runtime environments.
 */

/**
 * Validates that a required environment variable is present
 *
 * @param key - The environment variable key
 * @param errorMessage - Optional custom error message
 * @returns The environment variable value
 * @throws {Error} If the environment variable is not set or is empty
 */
export function requireEnv(key: string, errorMessage?: string): string {
    const value = process.env[key];

    if (!value || value.trim() === "") {
        throw new Error(
            errorMessage || `Required environment variable ${key} is not set`,
        );
    }

    return value;
}

/**
 * Gets an environment variable with a fallback value
 *
 * @param key - The environment variable key
 * @param fallback - The fallback value if not set
 * @returns The environment variable value or fallback
 */
export function getEnv(key: string, fallback: string): string {
    return process.env[key] || fallback;
}

/**
 * Gets an optional environment variable
 *
 * @param key - The environment variable key
 * @returns The environment variable value or undefined
 */
export function getOptionalEnv(key: string): string | undefined {
    const value = process.env[key];
    return value && value.trim() !== "" ? value : undefined;
}

/**
 * Validates all required environment variables for the application
 *
 * This should be called during application startup to ensure all
 * necessary configuration is present.
 *
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnvironment(): void {
    const required = [
        "BETTER_AUTH_SECRET",
        // ANTHROPIC_API_KEY is validated when the client is first used
    ];

    const missing: string[] = [];

    for (const key of required) {
        try {
            requireEnv(key);
        } catch (error) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}\n` +
                "Please configure these in your .env.local file or Cloudflare secrets.",
        );
    }
}

/**
 * Checks if running in production environment
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

/**
 * Checks if running in development environment
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
}

/**
 * Checks if running in test environment
 */
export function isTest(): boolean {
    return process.env.NODE_ENV === "test";
}
