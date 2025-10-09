/**
 * Core diagram type definitions for IdeaGraph
 *
 * This module defines the fundamental types for nodes, edges, and diagrams
 * used throughout the application. These types are compatible with React Flow
 * while adding our custom metadata and AI-specific properties.
 */

/**
 * Node types supported in IdeaGraph diagrams
 */
export type NodeType =
    | "ui-component"
    | "api-endpoint"
    | "database"
    | "service"
    | "infrastructure";

/**
 * Edge types representing different relationship types
 */
export type EdgeType = "data-flow" | "dependency" | "user-flow";

/**
 * Position in the diagram canvas
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Core node data structure
 * Compatible with React Flow Node while adding our custom properties
 */
export interface DiagramNode {
    id: string;
    type: NodeType;
    position: Position;
    data: {
        label: string;
        description?: string;
        metadata?: Record<string, unknown>;
    };
}

/**
 * Core edge data structure
 * Compatible with React Flow Edge while adding our custom properties
 */
export interface DiagramEdge {
    id: string;
    type: EdgeType;
    source: string;
    target: string;
    data?: {
        label?: string;
        metadata?: Record<string, unknown>;
    };
}

/**
 * User flow representation
 */
export interface DiagramFlow {
    id: string;
    name: string;
    description: string;
    steps: string[];
}

/**
 * AI-extracted entity before conversion to diagram node
 */
export interface AnalyzedEntity {
    id: string;
    type: NodeType;
    label: string;
    description: string;
    metadata?: Record<string, unknown>;
    // Optional position hints from AI
    positionHint?: {
        layer?: "frontend" | "backend" | "data" | "infrastructure";
        group?: string;
    };
}

/**
 * AI-extracted relationship before conversion to diagram edge
 */
export interface AnalyzedRelationship {
    id: string;
    source: string;
    target: string;
    type: EdgeType;
    label?: string;
    metadata?: Record<string, unknown>;
}

/**
 * AI-extracted flow
 */
export interface AnalyzedFlow {
    id: string;
    name: string;
    description: string;
    steps: string[];
    involvedEntities?: string[]; // IDs of entities in this flow
}

/**
 * AI recommendation
 */
export interface AIRecommendation {
    id: string;
    type: "add-entity" | "add-relationship" | "modify-entity" | "best-practice";
    title: string;
    description: string;
    confidence: number;
    actionable?: boolean;
    metadata?: Record<string, unknown>;
}

/**
 * Complete PRD analysis result from AI
 */
export interface PrdAnalysis {
    entities: AnalyzedEntity[];
    relationships: AnalyzedRelationship[];
    flows: AnalyzedFlow[];
    recommendations: AIRecommendation[];
    confidence: number;
    metadata?: {
        analysisTime?: number;
        modelUsed?: string;
        tokenCount?: number;
    };
}

/**
 * Auto-layout configuration
 */
export interface LayoutConfig {
    algorithm: "layered" | "force-directed" | "circular" | "manual";
    spacing: {
        horizontal: number;
        vertical: number;
    };
    direction?: "TB" | "LR" | "BT" | "RL"; // Top-Bottom, Left-Right, etc.
}

/**
 * Helper function to convert AnalyzedEntity to DiagramNode
 * Includes automatic position calculation based on layer hints
 */
export function entityToNode(
    entity: AnalyzedEntity,
    index: number,
    config?: LayoutConfig,
): DiagramNode {
    const spacing = config?.spacing || { horizontal: 300, vertical: 200 };

    // Calculate position based on layer hint
    let position: Position;

    if (entity.positionHint?.layer) {
        const layerMap = {
            frontend: { x: 100, y: 100 },
            backend: { x: 100, y: 500 },
            data: { x: 100, y: 900 },
            infrastructure: { x: 600, y: 700 },
        };
        const basePos = layerMap[entity.positionHint.layer];
        position = {
            x: basePos.x + (index % 3) * spacing.horizontal,
            y: basePos.y + Math.floor(index / 3) * spacing.vertical,
        };
    } else {
        // Default grid layout
        position = {
            x: 100 + (index % 4) * spacing.horizontal,
            y: 100 + Math.floor(index / 4) * spacing.vertical,
        };
    }

    return {
        id: entity.id,
        type: entity.type,
        position,
        data: {
            label: entity.label,
            description: entity.description,
            metadata: entity.metadata,
        },
    };
}

/**
 * Helper function to convert AnalyzedRelationship to DiagramEdge
 */
export function relationshipToEdge(
    relationship: AnalyzedRelationship,
): DiagramEdge {
    return {
        id: relationship.id,
        type: relationship.type,
        source: relationship.source,
        target: relationship.target,
        data: {
            label: relationship.label,
            metadata: relationship.metadata,
        },
    };
}

/**
 * Validates that a node type is valid
 */
export function isValidNodeType(type: string): type is NodeType {
    return [
        "ui-component",
        "api-endpoint",
        "database",
        "service",
        "infrastructure",
    ].includes(type);
}

/**
 * Validates that an edge type is valid
 */
export function isValidEdgeType(type: string): type is EdgeType {
    return ["data-flow", "dependency", "user-flow"].includes(type);
}
