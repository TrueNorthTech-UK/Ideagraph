/**
 * IdeaGraph Modern Theme Configuration
 *
 * Centralized theme configuration for all node types, edges, typography,
 * spacing, and animations. This provides a single source of truth for
 * styling across the application.
 */

import type {
    Theme,
    NodeTypeStyle,
    NodeColorScheme,
    ApiMethod,
    ApiProtocol,
    UIComponentType,
    DatabaseType,
    ServiceType,
    InfrastructureType,
} from "./types";

// ============================================================================
// Color Definitions (aligned with globals.css)
// ============================================================================

const baseColors = {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    primaryForeground: "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    secondaryForeground: "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    accentForeground: "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
} as const;

// ============================================================================
// Node Color Schemes
// ============================================================================

const nodeColorScheme = {
    blue: {
        background: "bg-blue-500/10",
        foreground: "text-blue-700 dark:text-blue-300",
        border: "border-blue-500/20",
    } as NodeColorScheme,
    green: {
        background: "bg-green-500/10",
        foreground: "text-green-700 dark:text-green-300",
        border: "border-green-500/20",
    } as NodeColorScheme,
    purple: {
        background: "bg-purple-500/10",
        foreground: "text-purple-700 dark:text-purple-300",
        border: "border-purple-500/20",
    } as NodeColorScheme,
    orange: {
        background: "bg-orange-500/10",
        foreground: "text-orange-700 dark:text-orange-300",
        border: "border-orange-500/20",
    } as NodeColorScheme,
    pink: {
        background: "bg-pink-500/10",
        foreground: "text-pink-700 dark:text-pink-300",
        border: "border-pink-500/20",
    } as NodeColorScheme,
    teal: {
        background: "bg-teal-500/10",
        foreground: "text-teal-700 dark:text-teal-300",
        border: "border-teal-500/20",
    } as NodeColorScheme,
    gray: {
        background: "bg-gray-500/10",
        foreground: "text-gray-700 dark:text-gray-300",
        border: "border-gray-500/20",
    } as NodeColorScheme,
    red: {
        background: "bg-red-500/10",
        foreground: "text-red-700 dark:text-red-300",
        border: "border-red-500/20",
    } as NodeColorScheme,
    yellow: {
        background: "bg-yellow-500/10",
        foreground: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-500/20",
    } as NodeColorScheme,
    amber: {
        background: "bg-amber-500/10",
        foreground: "text-amber-700 dark:text-amber-300",
        border: "border-amber-500/20",
    } as NodeColorScheme,
    indigo: {
        background: "bg-indigo-500/10",
        foreground: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-500/20",
    } as NodeColorScheme,
    cyan: {
        background: "bg-cyan-500/10",
        foreground: "text-cyan-700 dark:text-cyan-300",
        border: "border-cyan-500/20",
    } as NodeColorScheme,
    violet: {
        background: "bg-violet-500/10",
        foreground: "text-violet-700 dark:text-violet-300",
        border: "border-violet-500/20",
    } as NodeColorScheme,
    slate: {
        background: "bg-slate-500/10",
        foreground: "text-slate-700 dark:text-slate-300",
        border: "border-slate-500/20",
    } as NodeColorScheme,
    emerald: {
        background: "bg-emerald-500/10",
        foreground: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-500/20",
    } as NodeColorScheme,
};

// ============================================================================
// UI Component Node Styles
// ============================================================================

const uiComponentVariants: Record<UIComponentType, NodeTypeStyle> = {
    button: {
        colors: nodeColorScheme.blue,
        badgeColor: `${nodeColorScheme.blue.background} ${nodeColorScheme.blue.foreground}`,
        icon: { emoji: "🔘" },
    },
    input: {
        colors: nodeColorScheme.green,
        badgeColor: `${nodeColorScheme.green.background} ${nodeColorScheme.green.foreground}`,
        icon: { emoji: "📝" },
    },
    form: {
        colors: nodeColorScheme.purple,
        badgeColor: `${nodeColorScheme.purple.background} ${nodeColorScheme.purple.foreground}`,
        icon: { emoji: "📋" },
    },
    card: {
        colors: nodeColorScheme.orange,
        badgeColor: `${nodeColorScheme.orange.background} ${nodeColorScheme.orange.foreground}`,
        icon: { emoji: "🗃️" },
    },
    modal: {
        colors: nodeColorScheme.pink,
        badgeColor: `${nodeColorScheme.pink.background} ${nodeColorScheme.pink.foreground}`,
        icon: { emoji: "🪟" },
    },
    list: {
        colors: nodeColorScheme.teal,
        badgeColor: `${nodeColorScheme.teal.background} ${nodeColorScheme.teal.foreground}`,
        icon: { emoji: "📜" },
    },
    other: {
        colors: nodeColorScheme.gray,
        badgeColor: `${nodeColorScheme.gray.background} ${nodeColorScheme.gray.foreground}`,
        icon: { emoji: "🧩" },
    },
};

// ============================================================================
// API Endpoint Node Styles
// ============================================================================

const apiMethods: Record<ApiMethod, NodeTypeStyle> = {
    GET: {
        colors: nodeColorScheme.blue,
        badgeColor: `${nodeColorScheme.blue.background} ${nodeColorScheme.blue.foreground} ${nodeColorScheme.blue.border}`,
        icon: { emoji: "📥" },
    },
    POST: {
        colors: nodeColorScheme.green,
        badgeColor: `${nodeColorScheme.green.background} ${nodeColorScheme.green.foreground} ${nodeColorScheme.green.border}`,
        icon: { emoji: "📤" },
    },
    PUT: {
        colors: nodeColorScheme.orange,
        badgeColor: `${nodeColorScheme.orange.background} ${nodeColorScheme.orange.foreground} ${nodeColorScheme.orange.border}`,
        icon: { emoji: "✏️" },
    },
    PATCH: {
        colors: nodeColorScheme.yellow,
        badgeColor: `${nodeColorScheme.yellow.background} ${nodeColorScheme.yellow.foreground} ${nodeColorScheme.yellow.border}`,
        icon: { emoji: "🔧" },
    },
    DELETE: {
        colors: nodeColorScheme.red,
        badgeColor: `${nodeColorScheme.red.background} ${nodeColorScheme.red.foreground} ${nodeColorScheme.red.border}`,
        icon: { emoji: "🗑️" },
    },
    OPTIONS: {
        colors: nodeColorScheme.purple,
        badgeColor: `${nodeColorScheme.purple.background} ${nodeColorScheme.purple.foreground} ${nodeColorScheme.purple.border}`,
        icon: { emoji: "⚙️" },
    },
    HEAD: {
        colors: nodeColorScheme.gray,
        badgeColor: `${nodeColorScheme.gray.background} ${nodeColorScheme.gray.foreground} ${nodeColorScheme.gray.border}`,
        icon: { emoji: "📊" },
    },
};

const apiProtocols: Record<ApiProtocol, NodeTypeStyle> = {
    HTTP: {
        colors: nodeColorScheme.slate,
        badgeColor: `${nodeColorScheme.slate.background} ${nodeColorScheme.slate.foreground}`,
        icon: { emoji: "🌐" },
    },
    HTTPS: {
        colors: nodeColorScheme.emerald,
        badgeColor: `${nodeColorScheme.emerald.background} ${nodeColorScheme.emerald.foreground}`,
        icon: { emoji: "🔒" },
    },
    REST: {
        colors: nodeColorScheme.indigo,
        badgeColor: `${nodeColorScheme.indigo.background} ${nodeColorScheme.indigo.foreground}`,
        icon: { emoji: "🔄" },
    },
    GraphQL: {
        colors: nodeColorScheme.pink,
        badgeColor: `${nodeColorScheme.pink.background} ${nodeColorScheme.pink.foreground}`,
        icon: { emoji: "⚡" },
    },
    gRPC: {
        colors: nodeColorScheme.cyan,
        badgeColor: `${nodeColorScheme.cyan.background} ${nodeColorScheme.cyan.foreground}`,
        icon: { emoji: "🚀" },
    },
    WebSocket: {
        colors: nodeColorScheme.violet,
        badgeColor: `${nodeColorScheme.violet.background} ${nodeColorScheme.violet.foreground}`,
        icon: { emoji: "🔌" },
    },
};

// ============================================================================
// Database Node Styles
// ============================================================================

const databaseTypes: Record<DatabaseType, NodeTypeStyle> = {
    sql: {
        colors: nodeColorScheme.blue,
        badgeColor: `${nodeColorScheme.blue.background} ${nodeColorScheme.blue.foreground} ${nodeColorScheme.blue.border}`,
        icon: { emoji: "🗄️" },
    },
    nosql: {
        colors: nodeColorScheme.green,
        badgeColor: `${nodeColorScheme.green.background} ${nodeColorScheme.green.foreground} ${nodeColorScheme.green.border}`,
        icon: { emoji: "📦" },
    },
    cache: {
        colors: nodeColorScheme.orange,
        badgeColor: `${nodeColorScheme.orange.background} ${nodeColorScheme.orange.foreground} ${nodeColorScheme.orange.border}`,
        icon: { emoji: "⚡" },
    },
    vector: {
        colors: nodeColorScheme.purple,
        badgeColor: `${nodeColorScheme.purple.background} ${nodeColorScheme.purple.foreground} ${nodeColorScheme.purple.border}`,
        icon: { emoji: "🧮" },
    },
    timeseries: {
        colors: nodeColorScheme.pink,
        badgeColor: `${nodeColorScheme.pink.background} ${nodeColorScheme.pink.foreground} ${nodeColorScheme.pink.border}`,
        icon: { emoji: "📈" },
    },
    graph: {
        colors: nodeColorScheme.teal,
        badgeColor: `${nodeColorScheme.teal.background} ${nodeColorScheme.teal.foreground} ${nodeColorScheme.teal.border}`,
        icon: { emoji: "🕸️" },
    },
    other: {
        colors: nodeColorScheme.gray,
        badgeColor: `${nodeColorScheme.gray.background} ${nodeColorScheme.gray.foreground} ${nodeColorScheme.gray.border}`,
        icon: { emoji: "💾" },
    },
};

// ============================================================================
// Service Node Styles
// ============================================================================

const serviceTypes: Record<ServiceType, NodeTypeStyle> = {
    microservice: {
        colors: nodeColorScheme.indigo,
        badgeColor: `${nodeColorScheme.indigo.background} ${nodeColorScheme.indigo.foreground} ${nodeColorScheme.indigo.border}`,
        icon: { emoji: "🔧" },
    },
    monolith: {
        colors: nodeColorScheme.slate,
        badgeColor: `${nodeColorScheme.slate.background} ${nodeColorScheme.slate.foreground} ${nodeColorScheme.slate.border}`,
        icon: { emoji: "🏢" },
    },
    lambda: {
        colors: nodeColorScheme.yellow,
        badgeColor: `${nodeColorScheme.yellow.background} ${nodeColorScheme.yellow.foreground} ${nodeColorScheme.yellow.border}`,
        icon: { emoji: "⚡" },
    },
    worker: {
        colors: nodeColorScheme.cyan,
        badgeColor: `${nodeColorScheme.cyan.background} ${nodeColorScheme.cyan.foreground} ${nodeColorScheme.cyan.border}`,
        icon: { emoji: "👷" },
    },
    cron: {
        colors: nodeColorScheme.violet,
        badgeColor: `${nodeColorScheme.violet.background} ${nodeColorScheme.violet.foreground} ${nodeColorScheme.violet.border}`,
        icon: { emoji: "⏰" },
    },
    queue: {
        colors: nodeColorScheme.emerald,
        badgeColor: `${nodeColorScheme.emerald.background} ${nodeColorScheme.emerald.foreground} ${nodeColorScheme.emerald.border}`,
        icon: { emoji: "📨" },
    },
    other: {
        colors: nodeColorScheme.gray,
        badgeColor: `${nodeColorScheme.gray.background} ${nodeColorScheme.gray.foreground} ${nodeColorScheme.gray.border}`,
        icon: { emoji: "⚙️" },
    },
};

// ============================================================================
// Infrastructure Node Styles
// ============================================================================

const infrastructureTypes: Record<InfrastructureType, NodeTypeStyle> = {
    cdn: {
        colors: nodeColorScheme.purple,
        badgeColor: `${nodeColorScheme.purple.background} ${nodeColorScheme.purple.foreground} ${nodeColorScheme.purple.border}`,
        icon: { emoji: "🌐" },
    },
    loadbalancer: {
        colors: nodeColorScheme.blue,
        badgeColor: `${nodeColorScheme.blue.background} ${nodeColorScheme.blue.foreground} ${nodeColorScheme.blue.border}`,
        icon: { emoji: "⚖️" },
    },
    gateway: {
        colors: nodeColorScheme.green,
        badgeColor: `${nodeColorScheme.green.background} ${nodeColorScheme.green.foreground} ${nodeColorScheme.green.border}`,
        icon: { emoji: "🚪" },
    },
    storage: {
        colors: nodeColorScheme.orange,
        badgeColor: `${nodeColorScheme.orange.background} ${nodeColorScheme.orange.foreground} ${nodeColorScheme.orange.border}`,
        icon: { emoji: "💿" },
    },
    network: {
        colors: nodeColorScheme.cyan,
        badgeColor: `${nodeColorScheme.cyan.background} ${nodeColorScheme.cyan.foreground} ${nodeColorScheme.cyan.border}`,
        icon: { emoji: "🔌" },
    },
    security: {
        colors: nodeColorScheme.red,
        badgeColor: `${nodeColorScheme.red.background} ${nodeColorScheme.red.foreground} ${nodeColorScheme.red.border}`,
        icon: { emoji: "🔒" },
    },
    other: {
        colors: nodeColorScheme.gray,
        badgeColor: `${nodeColorScheme.gray.background} ${nodeColorScheme.gray.foreground} ${nodeColorScheme.gray.border}`,
        icon: { emoji: "🏗️" },
    },
};

// ============================================================================
// Modern Theme Configuration
// ============================================================================

export const modernTheme: Theme = {
    name: "IdeaGraph Modern",
    colors: baseColors,
    nodeTypes: {
        uiComponent: {
            base: {
                background: "bg-card",
                foreground: "text-card-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            variants: uiComponentVariants,
        },
        apiEndpoint: {
            base: {
                background: "bg-card",
                foreground: "text-card-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            methods: apiMethods,
            protocols: apiProtocols,
        },
        database: {
            base: {
                background: "bg-card",
                foreground: "text-card-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            types: databaseTypes,
        },
        service: {
            base: {
                background: "bg-card",
                foreground: "text-card-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            types: serviceTypes,
        },
        infrastructure: {
            base: {
                background: "bg-card",
                foreground: "text-card-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            types: infrastructureTypes,
        },
        group: {
            base: {
                background: "bg-muted",
                foreground: "text-muted-foreground",
                border: "border-border",
                selectedBorder: "border-primary",
                hoverBorder: "border-ring",
            },
            collapsed: {
                background: "bg-muted",
                foreground: "text-muted-foreground",
                border: "border-border",
            },
            expanded: {
                background: "bg-background",
                foreground: "text-foreground",
                border: "border-border",
            },
        },
    },
    edges: {
        dataFlow: {
            color: "#3b82f6", // blue-500
            strokeWidth: 2,
            animated: true,
            animationDuration: "0.5s",
        },
        dependency: {
            color: "#a855f7", // purple-500
            strokeWidth: 2,
            strokeDasharray: "5,5",
            animated: false,
        },
        userFlow: {
            color: "#22c55e", // green-500
            strokeWidth: 3,
            animated: false,
        },
    },
    typography: {
        fontFamily: {
            sans: "var(--font-geist-sans)",
            mono: "var(--font-geist-mono)",
        },
        fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: "1.25",
            normal: "1.5",
            relaxed: "1.75",
        },
    },
    spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
    },
    borderRadius: {
        none: "0",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        full: "9999px",
    },
    animation: {
        duration: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms",
        },
        easing: {
            linear: "linear",
            easeIn: "cubic-bezier(0.4, 0, 1, 1)",
            easeOut: "cubic-bezier(0, 0, 0.2, 1)",
            easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
    },
};

// ============================================================================
// Default Export
// ============================================================================

export const defaultTheme = modernTheme;
