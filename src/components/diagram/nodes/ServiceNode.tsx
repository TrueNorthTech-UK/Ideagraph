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
    getServiceTypeBadgeColor,
    getServiceTypeIcon,
    getNodeCardClassName,
    getNodeHandleClassName,
    type ServiceType,
} from "@/lib/theme";

export type ServiceNodeData = {
    label: string;
    description?: string;
    serviceType: ServiceType;
    language?: string;
    framework?: string;
    runtime?: string;
    dependencies?: string[];
    endpoints?: number;
    healthCheck?: "enabled" | "disabled";
    scaling?: "manual" | "auto" | "scheduled";
};

const ServiceNodeComponent = ({ data, selected }: NodeProps) => {
    const nodeData = data as ServiceNodeData;
    const serviceType = nodeData.serviceType || "other";
    const typeColor = getServiceTypeBadgeColor(serviceType);
    const icon = getServiceTypeIcon(serviceType);

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
                                aria-label={serviceType}
                            >
                                {icon}
                            </span>
                            <CardTitle className="text-base font-semibold leading-tight">
                                {nodeData.label}
                            </CardTitle>
                        </div>
                        <Badge variant="secondary" className={typeColor}>
                            {serviceType}
                        </Badge>
                    </div>
                    {nodeData.description && (
                        <CardDescription className="text-xs mt-1">
                            {nodeData.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="pt-0 pb-3 space-y-2">
                    {/* Technology Stack */}
                    <div className="flex gap-1 flex-wrap">
                        {nodeData.language && (
                            <Badge variant="outline" className="text-xs">
                                {nodeData.language}
                            </Badge>
                        )}
                        {nodeData.framework && (
                            <Badge variant="outline" className="text-xs">
                                {nodeData.framework}
                            </Badge>
                        )}
                        {nodeData.runtime && (
                            <Badge variant="outline" className="text-xs">
                                {nodeData.runtime}
                            </Badge>
                        )}
                    </div>

                    {/* Service Metadata */}
                    <div className="flex gap-1 flex-wrap text-xs">
                        {nodeData.endpoints !== undefined &&
                            nodeData.endpoints > 0 && (
                                <Badge variant="outline" className="text-xs">
                                    📡 {nodeData.endpoints} endpoints
                                </Badge>
                            )}
                        {nodeData.healthCheck === "enabled" && (
                            <Badge
                                variant="outline"
                                className="text-xs text-green-700 dark:text-green-300"
                            >
                                ✓ health
                            </Badge>
                        )}
                        {nodeData.scaling && nodeData.scaling !== "manual" && (
                            <Badge variant="outline" className="text-xs">
                                📊 {nodeData.scaling}
                            </Badge>
                        )}
                    </div>

                    {/* Dependencies */}
                    {nodeData.dependencies &&
                        nodeData.dependencies.length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    Dependencies:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {nodeData.dependencies
                                        .slice(0, 3)
                                        .map((dep) => (
                                            <Badge
                                                key={dep}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {dep}
                                            </Badge>
                                        ))}
                                    {nodeData.dependencies.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{nodeData.dependencies.length - 3}
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
export default memo(ServiceNodeComponent);
