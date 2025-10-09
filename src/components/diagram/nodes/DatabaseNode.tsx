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
    getDatabaseTypeBadgeColor,
    getDatabaseTypeIcon,
    getNodeCardClassName,
    getNodeHandleClassName,
    type DatabaseType,
} from "@/lib/theme";

export type DatabaseNodeData = {
    label: string;
    description?: string;
    databaseType: DatabaseType;
    technology?: string;
    collections?: string[];
    schema?: Record<string, unknown>;
    indexes?: string[];
    replication?: "single" | "master-slave" | "multi-master" | "sharded";
    backup?: "enabled" | "disabled";
};

const DatabaseNodeComponent = ({ data, selected }: NodeProps) => {
    const nodeData = data as DatabaseNodeData;
    const databaseType = nodeData.databaseType || "other";
    const typeColor = getDatabaseTypeBadgeColor(databaseType);
    const icon = getDatabaseTypeIcon(databaseType);

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
                                aria-label={databaseType}
                            >
                                {icon}
                            </span>
                            <CardTitle className="text-base font-semibold leading-tight">
                                {nodeData.label}
                            </CardTitle>
                        </div>
                        <Badge variant="secondary" className={typeColor}>
                            {databaseType.toUpperCase()}
                        </Badge>
                    </div>
                    {nodeData.description && (
                        <CardDescription className="text-xs mt-1">
                            {nodeData.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="pt-0 pb-3 space-y-2">
                    {/* Technology */}
                    {nodeData.technology && (
                        <div className="flex gap-1 items-center">
                            <Badge variant="outline" className="text-xs">
                                {nodeData.technology}
                            </Badge>
                            {nodeData.replication &&
                                nodeData.replication !== "single" && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {nodeData.replication}
                                    </Badge>
                                )}
                            {nodeData.backup === "enabled" && (
                                <Badge variant="outline" className="text-xs">
                                    💾 backup
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Collections/Tables */}
                    {nodeData.collections &&
                        nodeData.collections.length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    {databaseType === "sql"
                                        ? "Tables:"
                                        : "Collections:"}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {nodeData.collections
                                        .slice(0, 3)
                                        .map((collection) => (
                                            <Badge
                                                key={collection}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {collection}
                                            </Badge>
                                        ))}
                                    {nodeData.collections.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{nodeData.collections.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Indexes */}
                    {nodeData.indexes && nodeData.indexes.length > 0 && (
                        <div className="text-xs">
                            <div className="font-medium text-muted-foreground mb-1">
                                Indexes:
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {nodeData.indexes.slice(0, 3).map((index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {index}
                                    </Badge>
                                ))}
                                {nodeData.indexes.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        +{nodeData.indexes.length - 3}
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
export default memo(DatabaseNodeComponent);
