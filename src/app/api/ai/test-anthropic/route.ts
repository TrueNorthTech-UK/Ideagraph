import { NextResponse } from "next/server";
import { anthropicClient, ANTHROPIC_MODELS } from "@/lib/ai/client";
import { auth } from "@/lib/auth";

/**
 * Test endpoint for Anthropic AI client
 *
 * This endpoint verifies that the Anthropic client is properly configured
 * and can successfully communicate with the API.
 *
 * This is a temporary endpoint created for Task 017 testing.
 * It will be removed once the main AI functionality is implemented.
 */
export async function GET() {
    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized - Please log in to test AI features",
                },
                { status: 401 },
            );
        }

        // Make a trivial test call to Anthropic API
        const startTime = Date.now();

        const response = await anthropicClient.messages.create({
            model: ANTHROPIC_MODELS.HAIKU, // Use fastest model for testing
            max_tokens: 100,
            messages: [
                {
                    role: "user",
                    content:
                        "Hello! Respond with 'Anthropic client is working correctly.' if you can read this.",
                },
            ],
        });

        const endTime = Date.now();

        // Extract the response text
        const contentBlock = response.content[0];
        const responseText =
            contentBlock.type === "text" ? contentBlock.text : "";

        return NextResponse.json({
            success: true,
            message: "Anthropic client test successful",
            data: {
                response: responseText,
                model: response.model,
                usage: {
                    inputTokens: response.usage.input_tokens,
                    outputTokens: response.usage.output_tokens,
                },
                latency: `${endTime - startTime}ms`,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Anthropic client test failed:", error);

        // Provide helpful error messages
        if (error instanceof Error) {
            if (error.message.includes("ANTHROPIC_API_KEY")) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "API key not configured",
                        message:
                            "Please set ANTHROPIC_API_KEY in your environment variables or Cloudflare secrets",
                    },
                    { status: 500 },
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Unknown error occurred while testing Anthropic client",
            },
            { status: 500 },
        );
    }
}
