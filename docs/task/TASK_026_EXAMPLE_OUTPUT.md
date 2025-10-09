# Task 026: Theme Config and Styling Baseline - Example Output

**Date:** October 9, 2025  
**Version:** 0.1.26

---

## 🎨 Theme Configuration Example

### Complete Theme Structure

```typescript
// src/lib/theme/config.ts
export const modernTheme: Theme = {
    name: "IdeaGraph Modern",
    colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        primary: "oklch(0.205 0 0)",
        // ... all base colors
    },
    nodeTypes: {
        uiComponent: { /* ... */ },
        apiEndpoint: { /* ... */ },
        database: { /* ... */ },
        service: { /* ... */ },
        infrastructure: { /* ... */ },
        group: { /* ... */ }
    },
    edges: {
        dataFlow: { color: "#3b82f6", strokeWidth: 2, animated: true },
        dependency: { color: "#a855f7", strokeWidth: 2, strokeDasharray: "5,5" },
        userFlow: { color: "#22c55e", strokeWidth: 3 }
    },
    typography: { /* ... */ },
    spacing: { /* ... */ },
    borderRadius: { /* ... */ },
    animation: { /* ... */ }
};
```

---

## 💡 Usage Examples

### Example 1: Using Theme in UI Component Node

```typescript
// src/components/diagram/nodes/UIComponentNode.tsx
import {
    getUIComponentBadgeColor,
    getNodeCardClassName,
    getNodeHandleClassName,
    type UIComponentType,
} from "@/lib/theme";

const UIComponentNodeComponent = ({ data, selected }: NodeProps) => {
    const componentType = data.componentType || "other";
    const typeColor = getUIComponentBadgeColor(componentType);

    return (
        <div className="relative">
            <Handle
                type="target"
                position={Position.Top}
                className={getNodeHandleClassName()}
                style={{ top: -6 }}
            />

            <Card className={getNodeCardClassName(selected)}>
                <CardHeader>
                    <CardTitle>{data.label}</CardTitle>
                    <Badge className={typeColor}>
                        {componentType}
                    </Badge>
                </CardHeader>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                className={getNodeHandleClassName()}
                style={{ bottom: -6 }}
            />
        </div>
    );
};
```

**Result:**
- Button component → Blue badge (`bg-blue-500/10 text-blue-700 dark:text-blue-300`)
- Input component → Green badge
- Form component → Purple badge
- Consistent card styling with selection states

---

### Example 2: Using Theme in API Endpoint Node

```typescript
// src/components/diagram/nodes/ApiEndpointNode.tsx
import {
    getApiMethodBadgeColor,
    getApiProtocolBadgeColor,
    getNodeCardClassName,
    type ApiMethod,
} from "@/lib/theme";

const ApiEndpointNodeComponent = ({ data, selected }: NodeProps) => {
    const methodColor = getApiMethodBadgeColor(data.method);
    const protocolColor = getApiProtocolBadgeColor(data.protocol);

    return (
        <Card className={`min-w-[250px] max-w-[350px] ${getNodeCardClassName(selected)}`}>
            <CardHeader>
                <Badge className={methodColor}>{data.method}</Badge>
                <Badge className={protocolColor}>{data.protocol}</Badge>
            </CardHeader>
        </Card>
    );
};
```

**Result:**
- GET requests → Blue badge
- POST requests → Green badge
- DELETE requests → Red badge
- GraphQL protocol → Pink badge
- REST protocol → Indigo badge

---

### Example 3: Using Theme in Database Node

```typescript
// src/components/diagram/nodes/DatabaseNode.tsx
import {
    getDatabaseTypeBadgeColor,
    getDatabaseTypeIcon,
    getNodeCardClassName,
    type DatabaseType,
} from "@/lib/theme";

const DatabaseNodeComponent = ({ data, selected }: NodeProps) => {
    const typeColor = getDatabaseTypeBadgeColor(data.databaseType);
    const icon = getDatabaseTypeIcon(data.databaseType);

    return (
        <Card className={`min-w-[220px] ${getNodeCardClassName(selected)}`}>
            <CardHeader>
                <span className="text-xl">{icon}</span>
                <CardTitle>{data.label}</CardTitle>
                <Badge className={typeColor}>
                    {data.databaseType.toUpperCase()}
                </Badge>
            </CardHeader>
        </Card>
    );
};
```

**Result:**
- SQL database → Blue badge with 🗄️ icon
- NoSQL database → Green badge with 📦 icon
- Cache → Orange badge with ⚡ icon
- Vector database → Purple badge with 🧮 icon

---

## 🎨 Color Palette Reference

### Node Type Colors

```typescript
// All colors support light and dark modes
const nodeColorScheme = {
    blue: {
        background: "bg-blue-500/10",
        foreground: "text-blue-700 dark:text-blue-300",
        border: "border-blue-500/20",
    },
    green: {
        background: "bg-green-500/10",
        foreground: "text-green-700 dark:text-green-300",
        border: "border-green-500/20",
    },
    // ... 12 more color schemes
};
```

### Edge Colors

```typescript
edges: {
    dataFlow: {
        color: "#3b82f6",          // blue-500
        strokeWidth: 2,
        animated: true,
        animationDuration: "0.5s"
    },
    dependency: {
        color: "#a855f7",          // purple-500
        strokeWidth: 2,
        strokeDasharray: "5,5",
        animated: false
    },
    userFlow: {
        color: "#22c55e",          // green-500
        strokeWidth: 3,
        animated: false
    }
}
```

---

## 🔧 Helper Functions Reference

### Node Card Styling

```typescript
getNodeCardClassName(selected: boolean): string
// Returns: "min-w-[200px] max-w-[300px] transition-all ring-2 ring-primary shadow-lg"
// or:     "min-w-[200px] max-w-[300px] transition-all shadow-md hover:shadow-lg"
```

**Usage:**
```tsx
<Card className={getNodeCardClassName(selected)}>
```

### Node Handle Styling

```typescript
getNodeHandleClassName(): string
// Returns: "w-3 h-3 !bg-primary"
```

**Usage:**
```tsx
<Handle className={getNodeHandleClassName()} />
```

---

## 🌓 Dark Mode Support

The theme system is designed to work seamlessly with dark mode:

```typescript
// Colors automatically adapt
foreground: "text-blue-700 dark:text-blue-300"

// Example in light mode: text-blue-700
// Example in dark mode: text-blue-300
```

**All 14 color schemes** include both light and dark mode values:
- blue, green, purple, orange, pink, teal, gray
- red, yellow, indigo, cyan, violet, slate, emerald

---

## 📊 Before vs After Comparison

### Code Duplication Reduced

**Before:**
- 3 files with hardcoded color mappings (27 entries each)
- ~90 lines of duplicated color definitions
- Inconsistent naming and structure

**After:**
- 1 centralized theme config
- 14 reusable color schemes
- Consistent structure across all node types

### Import Simplification

**Before:**
```typescript
// Every node component
const methodColors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    POST: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
    // ... repeat for every method
};
```

**After:**
```typescript
// Import once, use everywhere
import { getApiMethodBadgeColor } from "@/lib/theme";
const color = getApiMethodBadgeColor("GET");
```

---

## 🎯 Acceptance Criteria Evidence

### ✅ Canvas nodes reflect theme colors

**Evidence:**

1. **UIComponentNode** uses `getUIComponentBadgeColor()`:
   ```typescript
   const typeColor = getUIComponentBadgeColor(componentType);
   ```

2. **ApiEndpointNode** uses `getApiMethodBadgeColor()`:
   ```typescript
   const methodColor = getApiMethodBadgeColor(nodeData.method);
   ```

3. **DatabaseNode** uses `getDatabaseTypeBadgeColor()`:
   ```typescript
   const typeColor = getDatabaseTypeBadgeColor(databaseType);
   ```

4. **All nodes** use standardized utilities:
   ```typescript
   className={getNodeCardClassName(selected)}
   className={getNodeHandleClassName()}
   ```

**Result:** All canvas nodes now reflect consistent theme colors from centralized configuration.

---

## 🔄 Integration Points

### With Existing Systems:

1. **globals.css Integration:**
   - Theme uses CSS variables defined in `globals.css`
   - Base colors aligned with existing design tokens
   - Border radius references `var(--radius)`
   - Font families reference Geist fonts

2. **React Flow Integration:**
   - Node components updated to use theme
   - Handle colors consistent via utilities
   - Selection states styled via theme
   - Edge animations configured in theme

3. **Shadcn/ui Integration:**
   - Theme colors work with all shadcn components
   - Badge component supports theme colors
   - Card component uses theme styling
   - Consistent with component library

---

## 📝 Developer Guide

### Adding a New Node Type:

1. **Define the type in `types.ts`:**
```typescript
export type NewNodeType = "type1" | "type2" | "type3";
```

2. **Add to theme config in `config.ts`:**
```typescript
const newNodeTypes: Record<NewNodeType, NodeTypeStyle> = {
    type1: {
        colors: nodeColorScheme.blue,
        badgeColor: `${nodeColorScheme.blue.background} ${nodeColorScheme.blue.foreground}`,
        icon: { emoji: "🎯" },
    },
    // ...
};
```

3. **Add utilities in `utils.ts`:**
```typescript
export function getNewNodeTypeStyle(type: NewNodeType): NodeTypeStyle {
    const theme = getTheme();
    return theme.nodeTypes.newNode.types[type];
}
```

4. **Use in component:**
```typescript
import { getNewNodeTypeStyle } from "@/lib/theme";
const style = getNewNodeTypeStyle(nodeData.type);
```

---

## 🏁 Task Completion Checklist

- [x] Theme types defined (`src/lib/theme/types.ts`)
- [x] Modern theme configured (`src/lib/theme/config.ts`)
- [x] Utility functions created (`src/lib/theme/utils.ts`)
- [x] Export barrel created (`src/lib/theme/index.ts`)
- [x] UIComponentNode updated to use theme
- [x] ApiEndpointNode updated to use theme
- [x] DatabaseNode updated to use theme
- [x] No linting errors
- [x] TypeScript compilation passes
- [x] Version bumped to 0.1.26
- [x] Task completion document created
- [x] CHANGELOG.md updated
- [x] IMPLEMENTATION_TASKS.md updated

---

**Task 026: Theme Config and Styling Baseline - COMPLETE ✅**

