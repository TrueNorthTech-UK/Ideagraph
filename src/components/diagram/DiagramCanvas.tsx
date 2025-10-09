"use client";

import { useCallback, useEffect, useRef, useMemo } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
    addEdge as addReactFlowEdge,
    type Connection,
    type NodeChange,
    type EdgeChange,
    Panel,
    SelectionMode,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    useDiagramStore,
    useDiagramNodes,
    useDiagramEdges,
    useDiagramViewport,
    useIsSaving,
    useLastSaved,
    useSaveError,
    useHasUnsavedChanges,
    useDiagramActions,
} from "@/lib/diagram/store";
import type { Node, Edge } from "@xyflow/react";
import UIComponentNode from "./nodes/UIComponentNode";
import ApiEndpointNode from "./nodes/ApiEndpointNode";
import DatabaseNode from "./nodes/DatabaseNode";
import ServiceNode from "./nodes/ServiceNode";
import InfrastructureNode from "./nodes/InfrastructureNode";
import {
    EDGE_TYPES,
    EdgeMarkerDefinitions,
    DEFAULT_EDGE_OPTIONS,
    type CustomEdgeData,
} from "@/lib/diagram/edges";
import Toolbar from "./controls/Toolbar";
import ViewControls from "./controls/ViewControls";
import Sidebar from "./Sidebar";

interface DiagramCanvasProps {
    diagramId: string;
    initialNodes?: Node[];
    initialEdges?: Edge[];
}

// Inner component that has access to ReactFlow context
function DiagramCanvasInner({
    diagramId,
    initialNodes = [],
    initialEdges = [],
}: DiagramCanvasProps) {
    // Use Zustand store selectors for optimal re-rendering
    const nodes = useDiagramNodes();
    const edges = useDiagramEdges();
    const viewport = useDiagramViewport();
    const isSaving = useIsSaving();
    const lastSaved = useLastSaved();
    const saveError = useSaveError();
    const hasUnsavedChanges = useHasUnsavedChanges();

    // Get actions from store
    const {
        initializeDiagram,
        setNodes,
        setEdges,
        setViewport,
        addEdge,
        addNode,
        setSaving,
        setSaveSuccess,
        setSaveError,
        rollbackOperation,
    } = useDiagramActions();

    // Get ReactFlow instance for coordinate conversion
    const { screenToFlowPosition } = useReactFlow();

    // Track if diagram has been initialized
    const initializedRef = useRef(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize diagram on mount
    useEffect(() => {
        if (!initializedRef.current) {
            initializeDiagram(diagramId, initialNodes, initialEdges);
            initializedRef.current = true;
        }
    }, [diagramId, initialNodes, initialEdges, initializeDiagram]);

    // Handle node changes from React Flow
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((currentNodes) => {
                let updatedNodes = [...currentNodes];

                for (const change of changes) {
                    if (change.type === "remove") {
                        updatedNodes = updatedNodes.filter(
                            (n) => n.id !== change.id,
                        );
                    } else if (change.type === "position" && change.position) {
                        const nodeIndex = updatedNodes.findIndex(
                            (n) => n.id === change.id,
                        );
                        if (nodeIndex !== -1) {
                            updatedNodes[nodeIndex] = {
                                ...updatedNodes[nodeIndex],
                                position: change.position,
                            };
                        }
                    } else if (change.type === "select") {
                        const nodeIndex = updatedNodes.findIndex(
                            (n) => n.id === change.id,
                        );
                        if (nodeIndex !== -1) {
                            updatedNodes[nodeIndex] = {
                                ...updatedNodes[nodeIndex],
                                selected: change.selected,
                            };
                        }
                    } else if (
                        change.type === "dimensions" &&
                        change.dimensions
                    ) {
                        const nodeIndex = updatedNodes.findIndex(
                            (n) => n.id === change.id,
                        );
                        if (nodeIndex !== -1) {
                            updatedNodes[nodeIndex] = {
                                ...updatedNodes[nodeIndex],
                                // @ts-ignore - dimensions exist on Node
                                dimensions: change.dimensions,
                            };
                        }
                    }
                }

                return updatedNodes;
            });
        },
        [setNodes],
    );

    // Handle edge changes from React Flow
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((currentEdges) => {
                let updatedEdges = [...currentEdges];

                for (const change of changes) {
                    if (change.type === "remove") {
                        updatedEdges = updatedEdges.filter(
                            (e) => e.id !== change.id,
                        );
                    } else if (change.type === "select") {
                        const edgeIndex = updatedEdges.findIndex(
                            (e) => e.id === change.id,
                        );
                        if (edgeIndex !== -1) {
                            updatedEdges[edgeIndex] = {
                                ...updatedEdges[edgeIndex],
                                selected: change.selected,
                            };
                        }
                    }
                }

                return updatedEdges;
            });
        },
        [setEdges],
    );

    // Handle connections between nodes
    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge = {
                id: `e${connection.source}-${connection.target}`,
                source: connection.source as string,
                target: connection.target as string,
                sourceHandle: connection.sourceHandle,
                targetHandle: connection.targetHandle,
            };
            addEdge(newEdge);
        },
        [addEdge],
    );

    // Handle drag over - required for drop to work
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    // Handle drop - create new node from palette
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            // Get the node type and data from the drag event
            const nodeDataString = event.dataTransfer.getData(
                "application/reactflow",
            );
            if (!nodeDataString) return;

            try {
                const { type, data } = JSON.parse(nodeDataString);

                // Convert screen coordinates to React Flow coordinates
                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                // Generate unique ID for the new node
                const nodeId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                // Create new node
                const newNode: Node = {
                    id: nodeId,
                    type,
                    position,
                    data,
                };

                // Add node to store
                addNode(newNode);
            } catch (error) {
                console.error("Error creating node from drop:", error);
            }
        },
        [screenToFlowPosition, addNode],
    );

    // Handle viewport changes
    const onViewportChange = useCallback(
        (newViewport: { x: number; y: number; zoom: number }) => {
            setViewport(newViewport);
        },
        [setViewport],
    );

    // Debounced save function
    useEffect(() => {
        // Skip save if no changes or if diagram not initialized
        if (!hasUnsavedChanges || !initializedRef.current) return;
        if (nodes.length === 0 && edges.length === 0) return;

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for debounced save
        saveTimeoutRef.current = setTimeout(async () => {
            await saveDiagram();
        }, 2000); // 2 second debounce

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges, hasUnsavedChanges]);

    // Save diagram to API with optimistic updates
    const saveDiagram = async () => {
        setSaving(true);

        // Get current pending operations for potential rollback
        const currentPendingOps = Array.from(
            useDiagramStore.getState().pendingOperations.keys(),
        );

        try {
            const response = await fetch(`/api/diagrams/${diagramId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nodes: JSON.stringify(nodes),
                    edges: JSON.stringify(edges),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save diagram");
            }

            setSaveSuccess();
        } catch (error) {
            console.error("Error saving diagram:", error);
            setSaveError("Failed to save changes");

            // Rollback pending operations on failure
            for (const opId of currentPendingOps) {
                rollbackOperation(opId);
            }
        }
    };

    // Manual save trigger
    const handleManualSave = async () => {
        await saveDiagram();
    };

    // Define custom node types
    const nodeTypes = useMemo(
        () => ({
            uiComponent: UIComponentNode,
            apiEndpoint: ApiEndpointNode,
            database: DatabaseNode,
            service: ServiceNode,
            infrastructure: InfrastructureNode,
        }),
        [],
    );

    // Define custom edge types
    const edgeTypes = useMemo(() => EDGE_TYPES as any, []);

    return (
        <div className="w-full h-full">
            <EdgeMarkerDefinitions />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onViewportChange={onViewportChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
                defaultViewport={viewport}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
                fitView
                className="bg-background"
                // Selection configuration
                panOnDrag={[1, 2]} // Pan with left or middle mouse button
                selectionOnDrag // Enable box/marquee selection with mouse drag
                selectionMode={SelectionMode.Partial} // Select nodes that are partially in the selection box
                multiSelectionKeyCode="Shift" // Hold Shift for multi-select
                deleteKeyCode="Delete" // Delete selected nodes with Delete key
                selectionKeyCode="Shift" // Hold Shift for adding to selection
                selectNodesOnDrag={false} // Don't select nodes while dragging
            >
                <Background />
                <MiniMap />

                {/* Toolbar - Top Center */}
                <Panel position="top-center" className="mt-4">
                    <Toolbar />
                </Panel>

                {/* View Controls - Bottom Right */}
                <Panel position="bottom-right" className="mb-4 mr-4">
                    <ViewControls />
                </Panel>

                {/* Status Panel - Top Right */}
                <Panel
                    position="top-right"
                    className="bg-card p-2 rounded-lg shadow-lg"
                >
                    <div className="flex items-center gap-2 text-sm">
                        {/* Saving status */}
                        {isSaving && (
                            <span className="text-muted-foreground flex items-center gap-1">
                                <span className="animate-spin">⏳</span>
                                Saving...
                            </span>
                        )}

                        {/* Last saved time */}
                        {!isSaving && lastSaved && !hasUnsavedChanges && (
                            <span className="text-green-600 dark:text-green-400">
                                ✓ Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}

                        {/* Unsaved changes indicator */}
                        {!isSaving && hasUnsavedChanges && (
                            <span className="text-amber-600 dark:text-amber-400">
                                ● Unsaved changes
                            </span>
                        )}

                        {/* Error message */}
                        {saveError && (
                            <span className="text-destructive flex items-center gap-1">
                                ⚠️ {saveError}
                            </span>
                        )}

                        {/* Manual save button */}
                        <button
                            type="button"
                            onClick={handleManualSave}
                            disabled={isSaving}
                            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            Save Now
                        </button>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}

// Main component with Sidebar layout
export default function DiagramCanvas(props: DiagramCanvasProps) {
    return (
        <ReactFlowProvider>
            <div className="flex w-full h-full">
                {/* Sidebar */}
                <Sidebar />

                {/* Canvas */}
                <div className="flex-1 h-full">
                    <DiagramCanvasInner {...props} />
                </div>
            </div>
        </ReactFlowProvider>
    );
}
