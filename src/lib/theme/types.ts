/**
 * Theme System Types
 *
 * Centralized type definitions for the IdeaGraph theme system.
 * Supports node type styling, typography, spacing, animation, and color schemes.
 */

// ============================================================================
// Color System Types
// ============================================================================

export type ColorValue = string;

export interface ColorPalette {
    background: ColorValue;
    foreground: ColorValue;
    border: ColorValue;
    accent: ColorValue;
}

export interface NodeColorScheme {
    background: ColorValue;
    foreground: ColorValue;
    border: ColorValue;
    hoverBorder?: ColorValue;
    selectedBorder?: ColorValue;
}

// ============================================================================
// Node Type Styling
// ============================================================================

export type NodeType =
    | "uiComponent"
    | "apiEndpoint"
    | "database"
    | "service"
    | "infrastructure"
    | "group";

export type UIComponentType =
    | "button"
    | "input"
    | "form"
    | "card"
    | "modal"
    | "list"
    | "other";

export type ApiMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS"
    | "HEAD";

export type ApiProtocol =
    | "HTTP"
    | "HTTPS"
    | "REST"
    | "GraphQL"
    | "gRPC"
    | "WebSocket";

export type DatabaseType =
    | "sql"
    | "nosql"
    | "cache"
    | "vector"
    | "timeseries"
    | "graph"
    | "other";

export type ServiceType =
    | "microservice"
    | "monolith"
    | "lambda"
    | "worker"
    | "cron"
    | "queue"
    | "other";

export type InfrastructureType =
    | "cdn"
    | "loadbalancer"
    | "gateway"
    | "storage"
    | "network"
    | "security"
    | "other";

export interface NodeTypeColors {
    [key: string]: NodeColorScheme;
}

export interface NodeIcon {
    emoji?: string;
    lucideIcon?: string;
    customSvg?: string;
}

export interface NodeTypeStyle {
    colors: NodeColorScheme;
    icon?: NodeIcon;
    badgeColor: ColorValue;
}

// ============================================================================
// Typography System
// ============================================================================

export interface FontFamily {
    sans: string;
    mono: string;
    heading?: string;
}

export interface FontSize {
    xs: string; // 0.75rem
    sm: string; // 0.875rem
    base: string; // 1rem
    lg: string; // 1.125rem
    xl: string; // 1.25rem
    "2xl": string; // 1.5rem
    "3xl": string; // 1.875rem
}

export interface FontWeight {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
}

export interface Typography {
    fontFamily: FontFamily;
    fontSize: FontSize;
    fontWeight: FontWeight;
    lineHeight: {
        tight: string;
        normal: string;
        relaxed: string;
    };
}

// ============================================================================
// Spacing System
// ============================================================================

export interface Spacing {
    xs: string; // 0.25rem
    sm: string; // 0.5rem
    md: string; // 1rem
    lg: string; // 1.5rem
    xl: string; // 2rem
    "2xl": string; // 3rem
    "3xl": string; // 4rem
}

export interface BorderRadius {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
}

// ============================================================================
// Animation System
// ============================================================================

export interface AnimationDuration {
    fast: string; // 150ms
    normal: string; // 300ms
    slow: string; // 500ms
}

export interface AnimationEasing {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
}

export interface Animation {
    duration: AnimationDuration;
    easing: AnimationEasing;
}

// ============================================================================
// Edge Styling
// ============================================================================

export type EdgeType = "dataFlow" | "dependency" | "userFlow";

export interface EdgeStyle {
    color: ColorValue;
    strokeWidth: number;
    strokeDasharray?: string;
    animated?: boolean;
    animationDuration?: string;
}

export interface EdgeTypeStyles {
    dataFlow: EdgeStyle;
    dependency: EdgeStyle;
    userFlow: EdgeStyle;
}

// ============================================================================
// Complete Theme Configuration
// ============================================================================

export interface Theme {
    name: string;
    colors: {
        // Base colors from globals.css
        background: ColorValue;
        foreground: ColorValue;
        card: ColorValue;
        cardForeground: ColorValue;
        primary: ColorValue;
        primaryForeground: ColorValue;
        secondary: ColorValue;
        secondaryForeground: ColorValue;
        muted: ColorValue;
        mutedForeground: ColorValue;
        accent: ColorValue;
        accentForeground: ColorValue;
        destructive: ColorValue;
        border: ColorValue;
        input: ColorValue;
        ring: ColorValue;
    };
    nodeTypes: {
        uiComponent: {
            base: NodeColorScheme;
            variants: Record<UIComponentType, NodeTypeStyle>;
        };
        apiEndpoint: {
            base: NodeColorScheme;
            methods: Record<ApiMethod, NodeTypeStyle>;
            protocols: Record<ApiProtocol, NodeTypeStyle>;
        };
        database: {
            base: NodeColorScheme;
            types: Record<DatabaseType, NodeTypeStyle>;
        };
        service: {
            base: NodeColorScheme;
            types: Record<ServiceType, NodeTypeStyle>;
        };
        infrastructure: {
            base: NodeColorScheme;
            types: Record<InfrastructureType, NodeTypeStyle>;
        };
        group: {
            base: NodeColorScheme;
            collapsed: NodeColorScheme;
            expanded: NodeColorScheme;
        };
    };
    edges: EdgeTypeStyles;
    typography: Typography;
    spacing: Spacing;
    borderRadius: BorderRadius;
    animation: Animation;
}

// ============================================================================
// Theme Utilities
// ============================================================================

export interface ThemeConfig {
    theme: Theme;
    darkMode: boolean;
}

export type ThemeMode = "light" | "dark" | "system";
