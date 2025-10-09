import { anthropicClient, ANTHROPIC_MODELS } from "@/lib/ai/client";
import type {
    AnalyzedEntity,
    AnalyzedRelationship,
    AnalyzedFlow,
    AIRecommendation,
    PrdAnalysis,
    NodeType,
    EdgeType,
} from "@/lib/diagram/types";
import { isValidNodeType, isValidEdgeType } from "@/lib/diagram/types";

/**
 * PRDAnalysisAgent
 *
 * This agent analyzes Product Requirements Documents (PRDs) and extracts:
 * - Architectural entities (nodes)
 * - Relationships between entities (edges)
 * - User/data flows
 * - AI-powered recommendations
 *
 * The agent uses Claude 3.5 Sonnet for high-quality analysis and includes
 * robust JSON parsing with fallbacks for non-JSON responses.
 */

/**
 * System prompt for PRD analysis
 * Instructs Claude to extract architectural information and return structured JSON
 */
const PRD_ANALYSIS_SYSTEM_PROMPT = `You are an expert software architect analyzing Product Requirements Documents (PRDs).

Your task is to analyze the provided PRD content and extract architectural information in a structured format.

EXTRACTION GUIDELINES:

1. ENTITIES (Nodes):
   - Identify UI components, API endpoints, databases, services, and infrastructure
   - Extract clear labels and descriptions
   - Assign appropriate types: ui-component, api-endpoint, database, service, infrastructure
   - Provide position hints based on architectural layers (frontend, backend, data, infrastructure)

2. RELATIONSHIPS (Edges):
   - Identify data flows between components
   - Identify dependencies and service calls
   - Identify user interaction flows
   - Assign types: data-flow, dependency, user-flow

3. FLOWS:
   - Extract complete user workflows or data processing flows
   - Include step-by-step descriptions
   - Link to involved entities

4. RECOMMENDATIONS:
   - Suggest missing components or relationships
   - Identify best practices
   - Flag potential issues or improvements
   - Provide confidence scores (0.0-1.0)

CRITICAL: Respond ONLY with valid JSON. Do not include any text before or after the JSON.

JSON SCHEMA:
{
  "entities": [
    {
      "id": "unique-id",
      "type": "ui-component|api-endpoint|database|service|infrastructure",
      "label": "Component Name",
      "description": "What this component does",
      "metadata": {},
      "positionHint": {
        "layer": "frontend|backend|data|infrastructure",
        "group": "optional-group-name"
      }
    }
  ],
  "relationships": [
    {
      "id": "unique-id",
      "source": "entity-id",
      "target": "entity-id",
      "type": "data-flow|dependency|user-flow",
      "label": "Description of relationship"
    }
  ],
  "flows": [
    {
      "id": "unique-id",
      "name": "Flow Name",
      "description": "What this flow accomplishes",
      "steps": ["Step 1", "Step 2", "..."],
      "involvedEntities": ["entity-id-1", "entity-id-2"]
    }
  ],
  "recommendations": [
    {
      "id": "unique-id",
      "type": "add-entity|add-relationship|modify-entity|best-practice",
      "title": "Recommendation Title",
      "description": "Detailed recommendation",
      "confidence": 0.85,
      "actionable": true
    }
  ],
  "confidence": 0.85
}`;

/**
 * Input parameters for PRD analysis
 */
export interface AnalyzePrdInput {
    content: string;
    previousMessages?: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
    maxTokens?: number;
}

/**
 * Raw response from Claude before parsing
 */
interface ClaudeRawResponse {
    content: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

/**
 * Extracts JSON from Claude's response, handling various formats
 *
 * Claude may return:
 * 1. Pure JSON
 * 2. JSON wrapped in markdown code blocks
 * 3. JSON with explanatory text before/after
 *
 * This function handles all cases with robust fallbacks.
 */
function extractJSON(response: string): string {
    // Try to find JSON in markdown code blocks first
    const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
        return codeBlockMatch[1];
    }

    // Try to find JSON object in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return jsonMatch[0];
    }

    // If no JSON found, return original (will fail parsing, but we want the error)
    return response;
}

/**
 * Validates and sanitizes the parsed PRD analysis
 */
function validatePrdAnalysis(data: unknown): PrdAnalysis {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid response: not an object");
    }

    const result = data as Record<string, unknown>;

    // Validate entities
    const entities = (
        Array.isArray(result.entities) ? result.entities : []
    ).filter((entity: unknown) => {
        if (!entity || typeof entity !== "object") return false;
        const e = entity as Record<string, unknown>;
        return (
            typeof e.id === "string" &&
            typeof e.type === "string" &&
            isValidNodeType(e.type) &&
            typeof e.label === "string" &&
            typeof e.description === "string"
        );
    }) as AnalyzedEntity[];

    // Validate relationships
    const relationships = (
        Array.isArray(result.relationships) ? result.relationships : []
    ).filter((rel: unknown) => {
        if (!rel || typeof rel !== "object") return false;
        const r = rel as Record<string, unknown>;
        return (
            typeof r.id === "string" &&
            typeof r.source === "string" &&
            typeof r.target === "string" &&
            typeof r.type === "string" &&
            isValidEdgeType(r.type)
        );
    }) as AnalyzedRelationship[];

    // Validate flows
    const flows = (Array.isArray(result.flows) ? result.flows : []).filter(
        (flow: unknown) => {
            if (!flow || typeof flow !== "object") return false;
            const f = flow as Record<string, unknown>;
            return (
                typeof f.id === "string" &&
                typeof f.name === "string" &&
                typeof f.description === "string" &&
                Array.isArray(f.steps)
            );
        },
    ) as AnalyzedFlow[];

    // Validate recommendations
    const recommendations = (
        Array.isArray(result.recommendations) ? result.recommendations : []
    ).filter((rec: unknown) => {
        if (!rec || typeof rec !== "object") return false;
        const r = rec as Record<string, unknown>;
        return (
            typeof r.id === "string" &&
            typeof r.type === "string" &&
            typeof r.title === "string" &&
            typeof r.description === "string" &&
            typeof r.confidence === "number"
        );
    }) as AIRecommendation[];

    const confidence =
        typeof result.confidence === "number" ? result.confidence : 0.5;

    return {
        entities,
        relationships,
        flows,
        recommendations,
        confidence,
    };
}

/**
 * Main PRD analysis function
 *
 * Sends the PRD content to Claude and parses the response into structured data
 *
 * @param input - PRD content and optional conversation history
 * @returns Structured PRD analysis with entities, relationships, flows, and recommendations
 * @throws Error if the API call fails or response is invalid
 */
export async function analyzePrd(input: AnalyzePrdInput): Promise<PrdAnalysis> {
    const startTime = Date.now();

    try {
        // Prepare messages for Claude
        const messages: Array<{ role: "user" | "assistant"; content: string }> =
            [
                ...(input.previousMessages || []),
                {
                    role: "user" as const,
                    content: `Analyze the following PRD and extract architectural information:\n\n${input.content}`,
                },
            ];

        // Call Claude API
        const response = await anthropicClient.messages.create({
            model: ANTHROPIC_MODELS.SONNET, // Use Sonnet for high-quality analysis
            max_tokens: input.maxTokens || 4096,
            system: PRD_ANALYSIS_SYSTEM_PROMPT,
            messages,
        });

        // Extract text content from response
        const textContent = response.content
            .filter((block) => block.type === "text")
            .map((block) => ("text" in block ? block.text : ""))
            .join("\n");

        if (!textContent) {
            throw new Error("No text content in Claude response");
        }

        // Create raw response object for metadata
        const rawResponse: ClaudeRawResponse = {
            content: textContent,
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens,
            },
        };

        // Extract and parse JSON
        const jsonString = extractJSON(textContent);
        let parsedData: unknown;

        try {
            parsedData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Attempted to parse:", jsonString.substring(0, 500));
            throw new Error(
                `Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
            );
        }

        // Validate and return structured data
        const analysis = validatePrdAnalysis(parsedData);

        // Add metadata
        analysis.metadata = {
            analysisTime: Date.now() - startTime,
            modelUsed: ANTHROPIC_MODELS.SONNET,
            tokenCount:
                rawResponse.usage.input_tokens +
                rawResponse.usage.output_tokens,
        };

        return analysis;
    } catch (error) {
        console.error("PRD Analysis Error:", error);

        // Provide helpful error messages
        if (error instanceof Error) {
            if (error.message.includes("API key")) {
                throw new Error(
                    "Anthropic API key is invalid or missing. Please check your configuration.",
                );
            }
            if (error.message.includes("rate limit")) {
                throw new Error(
                    "Rate limit exceeded. Please try again in a moment.",
                );
            }
            throw error;
        }

        throw new Error("Unknown error during PRD analysis");
    }
}

/**
 * Utility function to generate entity IDs based on label
 */
export function generateEntityId(label: string, index: number): string {
    const sanitized = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return `entity-${sanitized}-${index}`;
}

/**
 * Utility function to generate relationship IDs
 */
export function generateRelationshipId(
    source: string,
    target: string,
    type: EdgeType,
): string {
    return `rel-${source}-${target}-${type}`;
}

/**
 * Utility function to generate flow IDs
 */
export function generateFlowId(name: string, index: number): string {
    const sanitized = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return `flow-${sanitized}-${index}`;
}

/**
 * Utility function to generate recommendation IDs
 */
export function generateRecommendationId(title: string, index: number): string {
    const sanitized = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return `rec-${sanitized}-${index}`;
}
