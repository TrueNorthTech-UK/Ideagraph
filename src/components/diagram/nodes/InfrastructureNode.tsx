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
    getInfrastructureTypeBadgeColor,
    getInfrastructureTypeIcon,
    getNodeCardClassName,
    getNodeHandleClassName,
    type InfrastructureType,
} from "@/lib/theme";

export type InfrastructureNodeData = {
    label: string;
    description?: string;
    infraType: InfrastructureType;
    provider?: string;
    region?: string;
    configuration?: Record<string, unknown>;
    capacity?: string;
    redundancy?: "single" | "multi-az" | "multi-region" | "global";
    monitoring?: "enabled" | "disabled";
};

const InfrastructureNodeComponent = ({ data, selected }: NodeProps) => {
    const nodeData = data as InfrastructureNodeData;
    const infraType = nodeData.infraType || "other";
    const typeColor = getInfrastructureTypeBadgeColor(infraType);
    const icon = getInfrastructureTypeIcon(infraType);

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

            <Card
                className={`min-w-[220px] max-w-[320px] ${getNodeCardClassName(selected)}`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span
                                className="text-xl"
                                role="img"
                                aria-label={infraType}
                            >
                                {icon}
                            </span>
                            <CardTitle className="text-base font-semibold leading-tight">
                                {nodeData.label}
                            </CardTitle>
                        </div>
                        <Badge variant="secondary" className={typeColor}>
                            {infraType.toUpperCase()}
                        </Badge>
                    </div>
                    {nodeData.description && (
                        <CardDescription className="text-xs mt-1">
                            {nodeData.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="pt-0 pb-3 space-y-2">
                    {/* Provider and Region */}
                    <div className="flex gap-1 flex-wrap">
                        {nodeData.provider && (
                            <Badge variant="outline" className="text-xs">
                                {nodeData.provider}
                            </Badge>
                        )}
                        {nodeData.region && (
                            <Badge variant="outline" className="text-xs">
                                📍 {nodeData.region}
                            </Badge>
                        )}
                    </div>

                    {/* Capacity and Redundancy */}
                    <div className="flex gap-1 flex-wrap">
                        {nodeData.capacity && (
                            <Badge variant="outline" className="text-xs">
                                💪 {nodeData.capacity}
                            </Badge>
                        )}
                        {nodeData.redundancy &&
                            nodeData.redundancy !== "single" && (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-green-700 dark:text-green-300"
                                >
                                    🔄 {nodeData.redundancy}
                                </Badge>
                            )}
                        {nodeData.monitoring === "enabled" && (
                            <Badge variant="outline" className="text-xs">
                                📊 monitoring
                            </Badge>
                        )}
                    </div>

                    {/* Configuration */}
                    {nodeData.configuration &&
                        Object.keys(nodeData.configuration).length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    Configuration:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {Object.keys(nodeData.configuration)
                                        .slice(0, 3)
                                        .map((key) => (
                                            <Badge
                                                key={key}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {key}
                                            </Badge>
                                        ))}
                                    {Object.keys(nodeData.configuration)
                                        .length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +
                                            {Object.keys(nodeData.configuration)
                                                .length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                </CardContent>
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
export default memo(InfrastructureNodeComponent);
