"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

// Node type definitions
export type NodeType =
    | "uiComponent"
    | "apiEndpoint"
    | "database"
    | "service"
    | "infrastructure";

export interface NodePaletteItem {
    type: NodeType;
    label: string;
    icon: string;
    description: string;
    defaultData: {
        label: string;
        [key: string]: any;
    };
}

// Node palette configuration
const NODE_PALETTE: NodePaletteItem[] = [
    {
        type: "uiComponent",
        label: "UI Component",
        icon: "🎨",
        description: "Frontend UI elements",
        defaultData: {
            label: "New UI Component",
            componentType: "button",
            framework: "React",
            description: "Interactive UI element",
        },
    },
    {
        type: "apiEndpoint",
        label: "API Endpoint",
        icon: "🔌",
        description: "HTTP API endpoints",
        defaultData: {
            label: "/api/endpoint",
            method: "GET",
            protocol: "REST",
            path: "/api/endpoint",
            description: "API endpoint",
        },
    },
    {
        type: "database",
        label: "Database",
        icon: "🗄️",
        description: "Data storage systems",
        defaultData: {
            label: "Database",
            dbType: "sql",
            engine: "PostgreSQL",
            description: "Database system",
        },
    },
    {
        type: "service",
        label: "Service",
        icon: "⚙️",
        description: "Backend services",
        defaultData: {
            label: "Service",
            serviceType: "microservice",
            runtime: "Node.js",
            description: "Backend service",
        },
    },
    {
        type: "infrastructure",
        label: "Infrastructure",
        icon: "🏗️",
        description: "Infrastructure components",
        defaultData: {
            label: "Infrastructure",
            infraType: "loadbalancer",
            provider: "Cloudflare",
            description: "Infrastructure component",
        },
    },
];

export default function Sidebar() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Handle drag start - set the node type and default data
    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        item: NodePaletteItem,
    ) => {
        // Set data to be transferred during drag
        event.dataTransfer.setData(
            "application/reactflow",
            JSON.stringify({
                type: item.type,
                data: item.defaultData,
            }),
        );
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="w-64 h-full bg-background border-r border-border flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Node Palette
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Drag nodes onto the canvas
                </p>
            </div>

            {/* Node items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {NODE_PALETTE.map((item) => (
                    <Card
                        key={item.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        onMouseEnter={() => setHoveredItem(item.type)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                            p-3 cursor-move transition-all duration-200
                            hover:shadow-md hover:scale-105 active:scale-95
                            ${hoveredItem === item.type ? "border-primary" : "border-border"}
                        `}
                    >
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="text-2xl flex-shrink-0">
                                {item.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-foreground">
                                    {item.label}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Footer hint */}
            <div className="p-3 border-t border-border bg-muted/50">
                <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">💡 Tip:</span>
                        <span>Drag to add nodes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">⌨️</span>
                        <span>Use toolbar for quick add</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

