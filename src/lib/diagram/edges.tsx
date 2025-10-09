import type { Edge, EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import React from "react";

/**
 * Edge Types for IdeaGraph Diagrams
 *
 * Defines three distinct edge types with different visual styles and behaviors:
 * - dataFlow: Represents data/information flow between components
 * - dependency: Shows dependencies and requirements
 * - userFlow: Illustrates user interaction paths
 */

// Edge type definitions
export type EdgeType = "dataFlow" | "dependency" | "userFlow";

// Edge style configuration
export interface EdgeStyle {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
    animated?: boolean;
    markerEnd?: string;
}

// Custom edge data interface
export interface CustomEdgeData extends Record<string, unknown> {
    edgeType?: EdgeType;
    label?: string;
    animated?: boolean;
    color?: string;
    width?: number;
    dashed?: boolean;
}

// Extended edge type with custom data
export type CustomEdge = Edge<CustomEdgeData>;

/**
 * Edge Style Presets
 * Pre-defined styles for each edge type
 */
export const EDGE_STYLES: Record<EdgeType, EdgeStyle> = {
    dataFlow: {
        stroke: "#3b82f6", // Blue
        strokeWidth: 2,
        animated: true,
        markerEnd: "arrow-dataFlow",
    },
    dependency: {
        stroke: "#8b5cf6", // Purple
        strokeWidth: 2,
        strokeDasharray: "5,5",
        animated: false,
        markerEnd: "arrow-dependency",
    },
    userFlow: {
        stroke: "#10b981", // Green
        strokeWidth: 3,
        animated: false,
        markerEnd: "arrow-userFlow",
    },
};

/**
 * Color presets for edge customization
 */
export const EDGE_COLORS = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#10b981",
    orange: "#f59e0b",
    red: "#ef4444",
    gray: "#6b7280",
    pink: "#ec4899",
    cyan: "#06b6d4",
} as const;

/**
 * Get edge style based on edge type and custom data
 */
export function getEdgeStyle(edge: CustomEdge): EdgeStyle {
    const baseStyle = edge.data?.edgeType
        ? EDGE_STYLES[edge.data.edgeType]
        : EDGE_STYLES.dataFlow;

    // Override with custom data if provided
    return {
        ...baseStyle,
        stroke: edge.data?.color || baseStyle.stroke,
        strokeWidth: edge.data?.width || baseStyle.strokeWidth,
        strokeDasharray: edge.data?.dashed ? "5,5" : baseStyle.strokeDasharray,
        animated: edge.data?.animated ?? baseStyle.animated,
    };
}

/**
 * Create a custom edge with default data
 */
export function createCustomEdge(
    id: string,
    source: string,
    target: string,
    edgeType: EdgeType = "dataFlow",
    data?: Partial<CustomEdgeData>,
): CustomEdge {
    return {
        id,
        source,
        target,
        type: edgeType,
        data: {
            edgeType,
            ...data,
        },
    };
}

/**
 * Data Flow Edge Component
 * Animated edge for data transfer visualization
 */
export function DataFlowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const style = getEdgeStyle({
        id,
        source: "",
        target: "",
        data,
    } as CustomEdge);

    return (
        <React.Fragment>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: style.stroke,
                    strokeWidth: style.strokeWidth,
                    strokeDasharray: style.strokeDasharray,
                }}
                className={style.animated ? "animate-dash" : ""}
            />
            {data?.label ? (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan bg-background px-2 py-1 rounded text-xs border border-border"
                    >
                        {String(data.label)}
                    </div>
                </EdgeLabelRenderer>
            ) : null}
        </React.Fragment>
    );
}

/**
 * Dependency Edge Component
 * Dashed edge for showing dependencies
 */
export function DependencyEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const style = getEdgeStyle({
        id,
        source: "",
        target: "",
        data,
    } as CustomEdge);

    return (
        <React.Fragment>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: style.stroke,
                    strokeWidth: style.strokeWidth,
                    strokeDasharray: style.strokeDasharray,
                }}
            />
            {data?.label ? (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan bg-background px-2 py-1 rounded text-xs border border-border"
                    >
                        {String(data.label)}
                    </div>
                </EdgeLabelRenderer>
            ) : null}
        </React.Fragment>
    );
}

/**
 * User Flow Edge Component
 * Thick edge for user interaction flows
 */
export function UserFlowEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const style = getEdgeStyle({
        id,
        source: "",
        target: "",
        data,
    } as CustomEdge);

    return (
        <React.Fragment>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: style.stroke,
                    strokeWidth: style.strokeWidth,
                    strokeDasharray: style.strokeDasharray,
                }}
            />
            {data?.label ? (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "all",
                        }}
                        className="nodrag nopan bg-background px-2 py-1 rounded text-xs border border-border font-medium"
                    >
                        {String(data.label)}
                    </div>
                </EdgeLabelRenderer>
            ) : null}
        </React.Fragment>
    );
}

/**
 * Edge Type Registry
 * Maps edge type names to their components
 */
export const EDGE_TYPES = {
    dataFlow: DataFlowEdge,
    dependency: DependencyEdge,
    userFlow: UserFlowEdge,
};

/**
 * Default edge configuration
 */
export const DEFAULT_EDGE_OPTIONS = {
    type: "dataFlow" as EdgeType,
    animated: true,
    style: {
        strokeWidth: 2,
        stroke: EDGE_COLORS.blue,
    },
};

/**
 * Marker definitions for edge arrows
 * These should be added to the SVG defs in the parent component
 */
export function EdgeMarkerDefinitions(): React.ReactElement {
    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            }}
        >
            <defs>
                {/* Data Flow Arrow */}
                <marker
                    id="arrow-dataFlow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_COLORS.blue} />
                </marker>

                {/* Dependency Arrow */}
                <marker
                    id="arrow-dependency"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_COLORS.purple} />
                </marker>

                {/* User Flow Arrow */}
                <marker
                    id="arrow-userFlow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_COLORS.green} />
                </marker>
            </defs>
        </svg>
    );
}
