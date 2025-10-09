import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Node, Edge, Viewport } from "@xyflow/react";

// Type definitions for diagram state
export interface DiagramState {
    // Core state
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    diagramId: string | null;

    // Save state tracking
    isSaving: boolean;
    lastSaved: Date | null;
    saveError: string | null;
    hasUnsavedChanges: boolean;

    // Optimistic update tracking
    pendingOperations: Map<string, PendingOperation>;
    failedOperations: FailedOperation[];

    // Actions
    setDiagramId: (id: string) => void;
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
    setViewport: (viewport: Viewport) => void;
    addNode: (node: Node) => void;
    updateNode: (id: string, updates: Partial<Node>) => void;
    deleteNode: (id: string) => void;
    addEdge: (edge: Edge) => void;
    updateEdge: (id: string, updates: Partial<Edge>) => void;
    deleteEdge: (id: string) => void;

    // Save operations
    setSaving: (saving: boolean) => void;
    setSaveSuccess: () => void;
    setSaveError: (error: string) => void;
    clearSaveError: () => void;

    // Optimistic updates
    addPendingOperation: (operation: PendingOperation) => void;
    removePendingOperation: (id: string) => void;
    rollbackOperation: (id: string) => void;
    addFailedOperation: (operation: FailedOperation) => void;
    clearFailedOperations: () => void;

    // Reset and initialization
    initializeDiagram: (
        diagramId: string,
        nodes: Node[],
        edges: Edge[],
        viewport?: Viewport,
    ) => void;
    reset: () => void;
}

// Operation tracking types
export interface PendingOperation {
    id: string;
    type: "add" | "update" | "delete";
    entityType: "node" | "edge";
    entityId: string;
    timestamp: number;
    previousState?: Node | Edge;
}

export interface FailedOperation extends PendingOperation {
    error: string;
    retryCount: number;
}

// Default viewport
const DEFAULT_VIEWPORT: Viewport = {
    x: 0,
    y: 0,
    zoom: 1,
};

// Initial state
const initialState = {
    nodes: [],
    edges: [],
    viewport: DEFAULT_VIEWPORT,
    diagramId: null,
    isSaving: false,
    lastSaved: null,
    saveError: null,
    hasUnsavedChanges: false,
    pendingOperations: new Map(),
    failedOperations: [],
};

// Create the store with persist middleware
export const useDiagramStore = create<DiagramState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Set diagram ID
            setDiagramId: (id) => set({ diagramId: id }),

            // Node operations
            setNodes: (nodes) =>
                set((state) => ({
                    nodes:
                        typeof nodes === "function"
                            ? nodes(state.nodes)
                            : nodes,
                    hasUnsavedChanges: true,
                })),

            addNode: (node) =>
                set((state) => {
                    const operationId = `add-node-${node.id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "add",
                        entityType: "node",
                        entityId: node.id,
                        timestamp: Date.now(),
                    });

                    return {
                        nodes: [...state.nodes, node],
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            updateNode: (id, updates) =>
                set((state) => {
                    const nodeIndex = state.nodes.findIndex((n) => n.id === id);
                    if (nodeIndex === -1) return state;

                    const previousNode = state.nodes[nodeIndex];
                    const operationId = `update-node-${id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "update",
                        entityType: "node",
                        entityId: id,
                        timestamp: Date.now(),
                        previousState: previousNode,
                    });

                    const updatedNodes = [...state.nodes];
                    updatedNodes[nodeIndex] = { ...previousNode, ...updates };

                    return {
                        nodes: updatedNodes,
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            deleteNode: (id) =>
                set((state) => {
                    const node = state.nodes.find((n) => n.id === id);
                    if (!node) return state;

                    const operationId = `delete-node-${id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "delete",
                        entityType: "node",
                        entityId: id,
                        timestamp: Date.now(),
                        previousState: node,
                    });

                    return {
                        nodes: state.nodes.filter((n) => n.id !== id),
                        // Also remove edges connected to this node
                        edges: state.edges.filter(
                            (e) => e.source !== id && e.target !== id,
                        ),
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            // Edge operations
            setEdges: (edges) =>
                set((state) => ({
                    edges:
                        typeof edges === "function"
                            ? edges(state.edges)
                            : edges,
                    hasUnsavedChanges: true,
                })),

            addEdge: (edge) =>
                set((state) => {
                    const operationId = `add-edge-${edge.id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "add",
                        entityType: "edge",
                        entityId: edge.id,
                        timestamp: Date.now(),
                    });

                    return {
                        edges: [...state.edges, edge],
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            updateEdge: (id, updates) =>
                set((state) => {
                    const edgeIndex = state.edges.findIndex((e) => e.id === id);
                    if (edgeIndex === -1) return state;

                    const previousEdge = state.edges[edgeIndex];
                    const operationId = `update-edge-${id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "update",
                        entityType: "edge",
                        entityId: id,
                        timestamp: Date.now(),
                        previousState: previousEdge,
                    });

                    const updatedEdges = [...state.edges];
                    updatedEdges[edgeIndex] = { ...previousEdge, ...updates };

                    return {
                        edges: updatedEdges,
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            deleteEdge: (id) =>
                set((state) => {
                    const edge = state.edges.find((e) => e.id === id);
                    if (!edge) return state;

                    const operationId = `delete-edge-${id}-${Date.now()}`;
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operationId, {
                        id: operationId,
                        type: "delete",
                        entityType: "edge",
                        entityId: id,
                        timestamp: Date.now(),
                        previousState: edge,
                    });

                    return {
                        edges: state.edges.filter((e) => e.id !== id),
                        hasUnsavedChanges: true,
                        pendingOperations: newPendingOperations,
                    };
                }),

            // Viewport operations
            setViewport: (viewport) => set({ viewport }),

            // Save state management
            setSaving: (saving) => set({ isSaving: saving }),

            setSaveSuccess: () =>
                set({
                    isSaving: false,
                    lastSaved: new Date(),
                    saveError: null,
                    hasUnsavedChanges: false,
                    pendingOperations: new Map(), // Clear pending operations on successful save
                }),

            setSaveError: (error) =>
                set({
                    isSaving: false,
                    saveError: error,
                }),

            clearSaveError: () => set({ saveError: null }),

            // Optimistic update management
            addPendingOperation: (operation) =>
                set((state) => {
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.set(operation.id, operation);
                    return { pendingOperations: newPendingOperations };
                }),

            removePendingOperation: (id) =>
                set((state) => {
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.delete(id);
                    return { pendingOperations: newPendingOperations };
                }),

            rollbackOperation: (id) =>
                set((state) => {
                    const operation = state.pendingOperations.get(id);
                    if (!operation || !operation.previousState) return state;

                    let newState = { ...state };
                    const newPendingOperations = new Map(
                        state.pendingOperations,
                    );
                    newPendingOperations.delete(id);

                    // Rollback based on operation type and entity type
                    if (operation.entityType === "node") {
                        if (operation.type === "add") {
                            // Remove the added node
                            newState.nodes = state.nodes.filter(
                                (n) => n.id !== operation.entityId,
                            );
                        } else if (
                            operation.type === "update" &&
                            operation.previousState
                        ) {
                            // Restore the previous node state
                            const nodeIndex = state.nodes.findIndex(
                                (n) => n.id === operation.entityId,
                            );
                            if (nodeIndex !== -1) {
                                const updatedNodes = [...state.nodes];
                                updatedNodes[nodeIndex] =
                                    operation.previousState as Node;
                                newState.nodes = updatedNodes;
                            }
                        } else if (
                            operation.type === "delete" &&
                            operation.previousState
                        ) {
                            // Restore the deleted node
                            newState.nodes = [
                                ...state.nodes,
                                operation.previousState as Node,
                            ];
                        }
                    } else if (operation.entityType === "edge") {
                        if (operation.type === "add") {
                            // Remove the added edge
                            newState.edges = state.edges.filter(
                                (e) => e.id !== operation.entityId,
                            );
                        } else if (
                            operation.type === "update" &&
                            operation.previousState
                        ) {
                            // Restore the previous edge state
                            const edgeIndex = state.edges.findIndex(
                                (e) => e.id === operation.entityId,
                            );
                            if (edgeIndex !== -1) {
                                const updatedEdges = [...state.edges];
                                updatedEdges[edgeIndex] =
                                    operation.previousState as Edge;
                                newState.edges = updatedEdges;
                            }
                        } else if (
                            operation.type === "delete" &&
                            operation.previousState
                        ) {
                            // Restore the deleted edge
                            newState.edges = [
                                ...state.edges,
                                operation.previousState as Edge,
                            ];
                        }
                    }

                    return {
                        ...newState,
                        pendingOperations: newPendingOperations,
                    };
                }),

            addFailedOperation: (operation) =>
                set((state) => ({
                    failedOperations: [...state.failedOperations, operation],
                })),

            clearFailedOperations: () => set({ failedOperations: [] }),

            // Initialization and reset
            initializeDiagram: (diagramId, nodes, edges, viewport) =>
                set({
                    diagramId,
                    nodes,
                    edges,
                    viewport: viewport || DEFAULT_VIEWPORT,
                    isSaving: false,
                    lastSaved: null,
                    saveError: null,
                    hasUnsavedChanges: false,
                    pendingOperations: new Map(),
                    failedOperations: [],
                }),

            reset: () => set(initialState),
        }),
        {
            name: "diagram-storage", // Storage key
            storage: createJSONStorage(() => localStorage),
            // Only persist essential state, not transient state
            partialize: (state) => ({
                viewport: state.viewport,
                diagramId: state.diagramId,
            }),
        },
    ),
);

// Selectors for performance optimization
export const useDiagramNodes = () => useDiagramStore((state) => state.nodes);
export const useDiagramEdges = () => useDiagramStore((state) => state.edges);
export const useDiagramViewport = () =>
    useDiagramStore((state) => state.viewport);
export const useDiagramId = () => useDiagramStore((state) => state.diagramId);
export const useIsSaving = () => useDiagramStore((state) => state.isSaving);
export const useLastSaved = () => useDiagramStore((state) => state.lastSaved);
export const useSaveError = () => useDiagramStore((state) => state.saveError);
export const useHasUnsavedChanges = () =>
    useDiagramStore((state) => state.hasUnsavedChanges);
export const usePendingOperations = () =>
    useDiagramStore((state) => state.pendingOperations);
export const useFailedOperations = () =>
    useDiagramStore((state) => state.failedOperations);

// Action selectors
export const useDiagramActions = () =>
    useDiagramStore((state) => ({
        setDiagramId: state.setDiagramId,
        setNodes: state.setNodes,
        setEdges: state.setEdges,
        setViewport: state.setViewport,
        addNode: state.addNode,
        updateNode: state.updateNode,
        deleteNode: state.deleteNode,
        addEdge: state.addEdge,
        updateEdge: state.updateEdge,
        deleteEdge: state.deleteEdge,
        setSaving: state.setSaving,
        setSaveSuccess: state.setSaveSuccess,
        setSaveError: state.setSaveError,
        clearSaveError: state.clearSaveError,
        addPendingOperation: state.addPendingOperation,
        removePendingOperation: state.removePendingOperation,
        rollbackOperation: state.rollbackOperation,
        addFailedOperation: state.addFailedOperation,
        clearFailedOperations: state.clearFailedOperations,
        initializeDiagram: state.initializeDiagram,
        reset: state.reset,
    }));
