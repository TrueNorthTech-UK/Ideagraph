# Component Hierarchy

## High-Level Tree
```
app/
  layout
  page (landing)
  (auth)/
    login/page
    signup/page
  dashboard/
    layout
    page
    diagrams/[diagramId]/page (or module route)
    import/page
components/
  navigation
  diagram/
    DiagramCanvas
    controls/
      Toolbar
      ViewControls
    nodes/
      UIComponentNode
      ApiEndpointNode
      DatabaseNode
      ServiceNode
      InfrastructureNode
```

## Props and State
- `DiagramCanvas`: `diagramId: string`
- Nodes receive strongly typed data per `lib/diagram/types.ts`

## Responsibilities
- `DiagramCanvas`: load/save diagram, wire React Flow, connect store
- Node components: render visuals, metadata badges, handles
- Controls: zoom, fit, export triggers
- Navigation: route links and auth-aware items
