import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic AI Client Configuration
 *
 * This module provides a centralized, configured Anthropic client for server-side use.
 * The client is initialized with API key from environment variables and configured
 * for edge runtime compatibility.
 *
 * Usage:
 * ```typescript
 * import { anthropicClient, createAnthropicClient } from '@/lib/ai/client';
 *
 * // Use the default singleton client
 * const response = await anthropicClient.messages.create({...});
 *
 * // Or create a custom client with specific configuration
 * const customClient = createAnthropicClient({ apiKey: 'custom-key' });
 * ```
 */

/**
 * Default Anthropic client configuration
 */
const DEFAULT_CONFIG = {
    maxRetries: 3,
    timeout: 60000, // 60 seconds
} as const;

/**
 * Validates that the Anthropic API key is present in the environment
 *
 * @throws {Error} If ANTHROPIC_API_KEY is not set
 */
function validateAnthropicApiKey(): string {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
        throw new Error(
            "ANTHROPIC_API_KEY is not configured. Please set it in your environment variables or Cloudflare secrets.",
        );
    }

    return apiKey;
}

/**
 * Creates a new Anthropic client instance with the specified configuration
 *
 * @param options - Optional configuration to override defaults
 * @returns Configured Anthropic client instance
 */
export function createAnthropicClient(options?: {
    apiKey?: string;
    maxRetries?: number;
    timeout?: number;
}): Anthropic {
    const apiKey = options?.apiKey || validateAnthropicApiKey();

    return new Anthropic({
        apiKey,
        maxRetries: options?.maxRetries ?? DEFAULT_CONFIG.maxRetries,
        timeout: options?.timeout ?? DEFAULT_CONFIG.timeout,
    });
}

/**
 * Singleton Anthropic client instance for server-side use
 *
 * This client is initialized lazily on first access and reused across requests.
 * It uses the ANTHROPIC_API_KEY environment variable for authentication.
 *
 * @throws {Error} If ANTHROPIC_API_KEY is not configured
 */
export const anthropicClient = createAnthropicClient();

/**
 * Type exports for Anthropic SDK types
 */
export type { Anthropic };
export type AnthropicMessage = Anthropic.Messages.Message;
export type AnthropicMessageParam = Anthropic.Messages.MessageParam;
export type AnthropicModel =
    | "claude-3-5-sonnet-20241022"
    | "claude-3-5-haiku-20241022"
    | "claude-3-opus-20240229"
    | "claude-3-sonnet-20240229"
    | "claude-3-haiku-20240307";

/**
 * Default model configuration for different use cases
 */
export const ANTHROPIC_MODELS = {
    // High-quality analysis and complex reasoning
    SONNET: "claude-3-5-sonnet-20241022" as AnthropicModel,
    // Fast responses for simple tasks
    HAIKU: "claude-3-5-haiku-20241022" as AnthropicModel,
    // Maximum capability for critical tasks
    OPUS: "claude-3-opus-20240229" as AnthropicModel,
} as const;

/**
 * System prompts for different agent types
 * These will be expanded in Task 018 for the PRDAnalysisAgent
 */
export const SYSTEM_PROMPTS = {
    PRD_ANALYZER: `You are an expert software architect analyzing Product Requirements Documents (PRDs).
Your task is to extract architectural entities, relationships, and flows from the provided PRD content.
Always respond with valid JSON following the specified schema.`,

    ARCHITECT: `You are a system architect expert specializing in software architecture design.`,

    DATABASE: `You are a database expert specializing in data modeling and schema design.`,

    FRONTEND: `You are a frontend expert specializing in UI/UX and component architecture.`,

    BACKEND: `You are a backend expert specializing in API design and service architecture.`,
} as const;
