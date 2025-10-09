/**
 * Theme System Utilities
 *
 * Helper functions for working with the theme system.
 */

import { modernTheme } from "./config";
import type {
    UIComponentType,
    ApiMethod,
    ApiProtocol,
    DatabaseType,
    ServiceType,
    InfrastructureType,
    NodeTypeStyle,
    Theme,
} from "./types";

// ============================================================================
// Theme Access Utilities
// ============================================================================

/**
 * Get the current theme (defaults to modernTheme)
 */
export function getTheme(): Theme {
    return modernTheme;
}

// ============================================================================
// UI Component Node Utilities
// ============================================================================

/**
 * Get styling for a specific UI component type
 */
export function getUIComponentStyle(
    componentType: UIComponentType,
): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.uiComponent.variants[componentType] ||
        theme.nodeTypes.uiComponent.variants.other
    );
}

/**
 * Get badge color class string for UI component type
 */
export function getUIComponentBadgeColor(
    componentType: UIComponentType,
): string {
    return getUIComponentStyle(componentType).badgeColor;
}

/**
 * Get icon for UI component type
 */
export function getUIComponentIcon(componentType: UIComponentType): string {
    return getUIComponentStyle(componentType).icon?.emoji || "🧩";
}

// ============================================================================
// API Endpoint Node Utilities
// ============================================================================

/**
 * Get styling for API method
 */
export function getApiMethodStyle(method: ApiMethod): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.apiEndpoint.methods[method] ||
        theme.nodeTypes.apiEndpoint.methods.GET
    );
}

/**
 * Get badge color class string for API method
 */
export function getApiMethodBadgeColor(method: ApiMethod): string {
    return getApiMethodStyle(method).badgeColor;
}

/**
 * Get styling for API protocol
 */
export function getApiProtocolStyle(protocol: ApiProtocol): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.apiEndpoint.protocols[protocol] ||
        theme.nodeTypes.apiEndpoint.protocols.REST
    );
}

/**
 * Get badge color class string for API protocol
 */
export function getApiProtocolBadgeColor(protocol: ApiProtocol): string {
    return getApiProtocolStyle(protocol).badgeColor;
}

// ============================================================================
// Database Node Utilities
// ============================================================================

/**
 * Get styling for database type
 */
export function getDatabaseTypeStyle(
    databaseType: DatabaseType,
): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.database.types[databaseType] ||
        theme.nodeTypes.database.types.other
    );
}

/**
 * Get badge color class string for database type
 */
export function getDatabaseTypeBadgeColor(databaseType: DatabaseType): string {
    return getDatabaseTypeStyle(databaseType).badgeColor;
}

/**
 * Get icon for database type
 */
export function getDatabaseTypeIcon(databaseType: DatabaseType): string {
    return getDatabaseTypeStyle(databaseType).icon?.emoji || "💾";
}

// ============================================================================
// Service Node Utilities
// ============================================================================

/**
 * Get styling for service type
 */
export function getServiceTypeStyle(serviceType: ServiceType): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.service.types[serviceType] ||
        theme.nodeTypes.service.types.other
    );
}

/**
 * Get badge color class string for service type
 */
export function getServiceTypeBadgeColor(serviceType: ServiceType): string {
    return getServiceTypeStyle(serviceType).badgeColor;
}

/**
 * Get icon for service type
 */
export function getServiceTypeIcon(serviceType: ServiceType): string {
    return getServiceTypeStyle(serviceType).icon?.emoji || "🔧";
}

// ============================================================================
// Infrastructure Node Utilities
// ============================================================================

/**
 * Get styling for infrastructure type
 */
export function getInfrastructureTypeStyle(
    infrastructureType: InfrastructureType,
): NodeTypeStyle {
    const theme = getTheme();
    return (
        theme.nodeTypes.infrastructure.types[infrastructureType] ||
        theme.nodeTypes.infrastructure.types.other
    );
}

/**
 * Get badge color class string for infrastructure type
 */
export function getInfrastructureTypeBadgeColor(
    infrastructureType: InfrastructureType,
): string {
    return getInfrastructureTypeStyle(infrastructureType).badgeColor;
}

/**
 * Get icon for infrastructure type
 */
export function getInfrastructureTypeIcon(
    infrastructureType: InfrastructureType,
): string {
    return getInfrastructureTypeStyle(infrastructureType).icon?.emoji || "🔩";
}

// ============================================================================
// Edge Utilities
// ============================================================================

/**
 * Get edge style by type
 */
export function getEdgeStyle(edgeType: "dataFlow" | "dependency" | "userFlow") {
    const theme = getTheme();
    return theme.edges[edgeType];
}

// ============================================================================
// Generic Node Utilities
// ============================================================================

/**
 * Get base node styling (for card background, borders, etc.)
 */
export function getBaseNodeStyle() {
    const theme = getTheme();
    return theme.nodeTypes.uiComponent.base;
}

/**
 * Build className string for node card
 */
export function getNodeCardClassName(selected: boolean): string {
    return `min-w-[200px] max-w-[300px] transition-all ${
        selected ? "ring-2 ring-primary shadow-lg" : "shadow-md hover:shadow-lg"
    }`;
}

/**
 * Build className string for node handle
 */
export function getNodeHandleClassName(): string {
    return "w-3 h-3 !bg-primary";
}
