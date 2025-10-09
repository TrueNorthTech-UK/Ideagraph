"use client";

import { useCallback } from "react";
import { useDiagramActions } from "@/lib/diagram/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Plus,
    Square,
    Circle,
    Link2,
    Database,
    Server,
    Cloud,
    Layout,
} from "lucide-react";

/**
 * Toolbar Component
 *
 * Provides quick actions for creating nodes and edges.
 * Includes buttons for common node types and edge creation.
 */
export default function Toolbar() {
    const { addNode, addEdge } = useDiagramActions();

    // Generate unique ID for new nodes
    const generateId = useCallback(() => {
        return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add UI Component Node
    const handleAddUIComponent = useCallback(() => {
        const id = generateId();
        addNode({
            id,
            type: "uiComponent",
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: {
                label: "New UI Component",
                description: "Click to edit description",
                componentType: "page",
            },
        });
    }, [addNode, generateId]);

    // Add API Endpoint Node
    const handleAddAPIEndpoint = useCallback(() => {
        const id = generateId();
        addNode({
            id,
            type: "apiEndpoint",
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: {
                label: "/api/new-endpoint",
                method: "GET",
                description: "Click to edit endpoint details",
            },
        });
    }, [addNode, generateId]);

    // Add Database Node
    const handleAddDatabase = useCallback(() => {
        const id = generateId();
        addNode({
            id,
            type: "database",
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: {
                label: "New Database",
                dbType: "PostgreSQL",
                description: "Click to edit database details",
            },
        });
    }, [addNode, generateId]);

    // Add Service Node
    const handleAddService = useCallback(() => {
        const id = generateId();
        addNode({
            id,
            type: "service",
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: {
                label: "New Service",
                serviceType: "backend",
                description: "Click to edit service details",
            },
        });
    }, [addNode, generateId]);

    // Add Infrastructure Node
    const handleAddInfrastructure = useCallback(() => {
        const id = generateId();
        addNode({
            id,
            type: "infrastructure",
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: {
                label: "New Infrastructure",
                infraType: "server",
                description: "Click to edit infrastructure details",
            },
        });
    }, [addNode, generateId]);

    return (
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg shadow-lg p-2">
            {/* Node Creation Section */}
            <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground px-2">
                    Add Node:
                </span>

                {/* UI Component */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddUIComponent}
                    title="Add UI Component"
                    className="h-8"
                >
                    <Layout className="h-4 w-4 mr-1" />
                    UI
                </Button>

                {/* API Endpoint */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddAPIEndpoint}
                    title="Add API Endpoint"
                    className="h-8"
                >
                    <Link2 className="h-4 w-4 mr-1" />
                    API
                </Button>

                {/* Database */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddDatabase}
                    title="Add Database"
                    className="h-8"
                >
                    <Database className="h-4 w-4 mr-1" />
                    DB
                </Button>

                {/* Service */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddService}
                    title="Add Service"
                    className="h-8"
                >
                    <Server className="h-4 w-4 mr-1" />
                    Service
                </Button>

                {/* Infrastructure */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddInfrastructure}
                    title="Add Infrastructure"
                    className="h-8"
                >
                    <Cloud className="h-4 w-4 mr-1" />
                    Infra
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Additional Actions */}
            <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground px-2">
                    Actions:
                </span>

                {/* Help text for connecting nodes */}
                <span className="text-xs text-muted-foreground px-2">
                    Drag from node handles to create edges
                </span>
            </div>
        </div>
    );
}
