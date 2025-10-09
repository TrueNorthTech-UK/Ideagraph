import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import handleApiError, {
    unauthorizedError,
    validationError,
    aiServiceError,
    rateLimitError,
    toErrorResponse,
} from "@/lib/api-error";
import { analyzePrd } from "@/lib/ai/agents/PRDAnalysisAgent";
import type {
    NodeType,
    EdgeType,
    AnalyzedEntity,
    AnalyzedRelationship,
    AnalyzedFlow,
    AIRecommendation,
} from "@/lib/diagram/types";
import { getDb } from "@/db";
import { importSessions } from "@/db/schema";
import { analyzePrdSchema } from "@/constants/validation.constant";

/**
 * Type definitions for PRD analysis response (API format)
 */
export interface PrdAnalysisResult {
    success: true;
    analysis: {
        entities: AnalyzedEntity[];
        relationships: AnalyzedRelationship[];
        flows: AnalyzedFlow[];
        recommendations: AIRecommendation[];
        confidence: number;
    };
    metadata: {
        processingTime: number;
        contentLength: number;
        timestamp: string;
        modelUsed?: string;
        tokenCount?: number;
    };
}

// Re-export types for external use
export type {
    NodeType,
    EdgeType,
    AnalyzedEntity,
    AnalyzedRelationship,
    AnalyzedFlow,
};

/**
 * POST /api/ai/analyze-prd
 * Analyze PRD content and extract architectural entities, relationships, and flows
 *
 * Uses the PRDAnalysisAgent to send content to Claude and extract structured
 * architectural information including entities, relationships, flows, and AI recommendations.
 *
 * @param request - Next.js request containing PRD content
 * @returns JSON response with analysis results or error
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = randomUUID();

    try {
        // Check authentication
        const user = await auth();
        if (!user) {
            throw unauthorizedError();
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = analyzePrdSchema.safeParse(body);

        if (!validation.success) {
            throw validationError(
                "Invalid request data",
                undefined,
                validation.error.issues,
            );
        }

        const { content, projectId, fileName } = validation.data;

        // Log analysis request
        console.log("PRD Analysis Request:", {
            userId: user.id,
            projectId,
            fileName,
            contentLength: content.length,
        });

        // Call PRDAnalysisAgent to analyze the PRD
        const analysis = await analyzePrd({
            content,
            maxTokens: 4096,
        });

        const processingTime = Date.now() - startTime;

        // Construct response
        const result: PrdAnalysisResult = {
            success: true,
            analysis: {
                entities: analysis.entities,
                relationships: analysis.relationships,
                flows: analysis.flows,
                recommendations: analysis.recommendations,
                confidence: analysis.confidence,
            },
            metadata: {
                processingTime,
                contentLength: content.length,
                timestamp: new Date().toISOString(),
                modelUsed: analysis.metadata?.modelUsed,
                tokenCount: analysis.metadata?.tokenCount,
            },
        };

        console.log("PRD Analysis Complete:", {
            userId: user.id,
            entitiesFound: analysis.entities.length,
            relationshipsFound: analysis.relationships.length,
            flowsFound: analysis.flows.length,
            recommendationsCount: analysis.recommendations.length,
            confidence: analysis.confidence,
            processingTime: result.metadata.processingTime,
            tokenCount: result.metadata.tokenCount,
        });

        // Persist import session to database
        try {
            const db = await getDb();
            const sessionId = randomUUID();

            await db.insert(importSessions).values({
                id: sessionId,
                userId: user.id,
                projectId: projectId || null,
                fileName: fileName || null,
                originalContent: content,
                contentLength: content.length,
                processedEntities: JSON.stringify(analysis.entities),
                processedRelationships: JSON.stringify(analysis.relationships),
                processedFlows: JSON.stringify(analysis.flows),
                recommendations: JSON.stringify(analysis.recommendations),
                confidence: Math.round(analysis.confidence * 100), // Convert to integer 0-100
                processingTime,
                modelUsed:
                    analysis.metadata?.modelUsed ||
                    "claude-3-5-sonnet-20241022",
                tokenCount: analysis.metadata?.tokenCount || null,
                status: "completed",
                completedAt: new Date(),
            });

            console.log("Import session persisted:", {
                sessionId,
                userId: user.id,
                projectId,
            });

            // Add session ID to response metadata
            result.metadata = {
                ...result.metadata,
                sessionId,
            } as typeof result.metadata & { sessionId: string };
        } catch (dbError) {
            // Log error but don't fail the request - the analysis was successful
            console.error("Failed to persist import session:", dbError);
            // Continue with response even if persistence fails
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error analyzing PRD:", {
            error: error instanceof Error ? error.message : String(error),
            requestId,
        });

        // Transform known errors into ApiErrors with better messages
        if (error instanceof Error) {
            if (
                error.message.includes("API key") ||
                error.message.includes("Anthropic")
            ) {
                return toErrorResponse(
                    aiServiceError(
                        "AI service configuration error. Please contact support.",
                    ),
                    requestId,
                );
            }

            if (error.message.includes("rate limit")) {
                return toErrorResponse(
                    rateLimitError(
                        "Too many requests. Please try again in a moment.",
                    ),
                    requestId,
                );
            }

            if (error.message.includes("parse")) {
                return toErrorResponse(
                    aiServiceError(
                        "Failed to parse AI response. Please try again.",
                    ),
                    requestId,
                );
            }
        }

        return handleApiError(error, requestId);
    }
}
