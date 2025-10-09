"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    getUIComponentBadgeColor,
    getNodeCardClassName,
    getNodeHandleClassName,
    type UIComponentType,
} from "@/lib/theme";

export type UIComponentNodeData = {
    label: string;
    description?: string;
    componentType?: UIComponentType;
    props?: Record<string, unknown>;
    state?: Record<string, unknown>;
    events?: string[];
};

const UIComponentNodeComponent = ({ data, selected }: NodeProps) => {
    const nodeData = data as UIComponentNodeData;
    const componentType = nodeData.componentType || "other";
    const typeColor = getUIComponentBadgeColor(componentType);

    return (
        <div className="relative">
            {/* Input Handle - Top */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                className={getNodeHandleClassName()}
                style={{ top: -6 }}
            />

            {/* Input Handle - Left */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                className={getNodeHandleClassName()}
                style={{ left: -6 }}
            />

            <Card className={getNodeCardClassName(selected)}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                            {nodeData.label}
                        </CardTitle>
                        <Badge variant="secondary" className={typeColor}>
                            {componentType}
                        </Badge>
                    </div>
                    {nodeData.description && (
                        <CardDescription className="text-xs mt-1">
                            {nodeData.description}
                        </CardDescription>
                    )}
                </CardHeader>

                {(nodeData.props || nodeData.state || nodeData.events) && (
                    <CardContent className="pt-0 pb-3 space-y-2">
                        {/* Props */}
                        {nodeData.props &&
                            Object.keys(nodeData.props).length > 0 && (
                                <div className="text-xs">
                                    <div className="font-medium text-muted-foreground mb-1">
                                        Props:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.keys(nodeData.props)
                                            .slice(0, 3)
                                            .map((prop) => (
                                                <Badge
                                                    key={prop}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {prop}
                                                </Badge>
                                            ))}
                                        {Object.keys(nodeData.props).length >
                                            3 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +
                                                {Object.keys(nodeData.props)
                                                    .length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* State */}
                        {nodeData.state &&
                            Object.keys(nodeData.state).length > 0 && (
                                <div className="text-xs">
                                    <div className="font-medium text-muted-foreground mb-1">
                                        State:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.keys(nodeData.state)
                                            .slice(0, 3)
                                            .map((stateKey) => (
                                                <Badge
                                                    key={stateKey}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {stateKey}
                                                </Badge>
                                            ))}
                                        {Object.keys(nodeData.state).length >
                                            3 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +
                                                {Object.keys(nodeData.state)
                                                    .length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Events */}
                        {nodeData.events && nodeData.events.length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    Events:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {nodeData.events
                                        .slice(0, 3)
                                        .map((event) => (
                                            <Badge
                                                key={event}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {event}
                                            </Badge>
                                        ))}
                                    {nodeData.events.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{nodeData.events.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Output Handle - Right */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                className={getNodeHandleClassName()}
                style={{ right: -6 }}
            />

            {/* Output Handle - Bottom */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                className={getNodeHandleClassName()}
                style={{ bottom: -6 }}
            />
        </div>
    );
};

// Memoize component for performance optimization
export default memo(UIComponentNodeComponent);
