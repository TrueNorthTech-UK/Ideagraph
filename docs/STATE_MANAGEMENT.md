# State Management (Zustand)

## Store Structure
```ts
interface DiagramState {
  nodes: IdeaGraphNode[];
  edges: IdeaGraphEdge[];
  viewport?: { x: number; y: number; zoom: number };
  setNodes(nodes: IdeaGraphNode[]): void;
  setEdges(edges: IdeaGraphEdge[]): void;
  setViewport(v: { x: number; y: number; zoom: number }): void;
  addNode(node: IdeaGraphNode): void;
  addEdge(edge: IdeaGraphEdge): void;
  removeNode(id: string): void;
  removeEdge(id: string): void;
  saveDebounced(): Promise<void>;
}
```

## Actions and Mutations
- Pure immutable updates
- Optimistic updates with rollback on API error

## Selectors
- `selectNodeById`, `selectEdgesForNode`, memoized to reduce re-renders

## Persistence Strategy
- Debounced PUT to `app/api/diagrams/[diagramId]`
- Periodic snapshots saved for collaboration recovery

## Middleware
- `subscribeWithSelector` for fine-grained updates
- `persist` for local cache (optional)

## Optimization
- Batched updates for drag operations
- Avoid passing raw store into deeply nested nodes
