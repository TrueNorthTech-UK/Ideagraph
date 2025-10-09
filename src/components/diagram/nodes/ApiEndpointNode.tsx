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
    getApiMethodBadgeColor,
    getApiProtocolBadgeColor,
    getNodeCardClassName,
    getNodeHandleClassName,
    type ApiMethod,
    type ApiProtocol,
} from "@/lib/theme";

export type ApiEndpointNodeData = {
    label: string;
    description?: string;
    method: ApiMethod;
    path: string;
    protocol?: ApiProtocol;
    authentication?: "none" | "apiKey" | "bearer" | "oauth" | "basic";
    requestBody?: Record<string, unknown>;
    responseType?: string;
    statusCodes?: number[];
};

const ApiEndpointNodeComponent = ({ data, selected }: NodeProps) => {
    const nodeData = data as ApiEndpointNodeData;
    const methodColor = getApiMethodBadgeColor(nodeData.method);
    const protocol = nodeData.protocol || "REST";
    const protocolColor = getApiProtocolBadgeColor(protocol);

    // Truncate path if too long for display
    const displayPath =
        nodeData.path.length > 40
            ? `${nodeData.path.substring(0, 37)}...`
            : nodeData.path;

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
                className={`min-w-[250px] max-w-[350px] ${getNodeCardClassName(selected)}`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                            {nodeData.label}
                        </CardTitle>
                        <div className="flex gap-1 flex-shrink-0">
                            <Badge variant="secondary" className={methodColor}>
                                {nodeData.method}
                            </Badge>
                        </div>
                    </div>

                    {/* API Path */}
                    <div className="font-mono text-xs bg-muted px-2 py-1 rounded border break-all">
                        {displayPath}
                    </div>

                    {nodeData.description && (
                        <CardDescription className="text-xs mt-2">
                            {nodeData.description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="pt-0 pb-3 space-y-2">
                    {/* Protocol and Authentication */}
                    <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className={protocolColor}>
                            {protocol}
                        </Badge>
                        {nodeData.authentication &&
                            nodeData.authentication !== "none" && (
                                <Badge variant="outline" className="text-xs">
                                    🔐 {nodeData.authentication}
                                </Badge>
                            )}
                    </div>

                    {/* Request Body */}
                    {nodeData.requestBody &&
                        Object.keys(nodeData.requestBody).length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    Request Body:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {Object.keys(nodeData.requestBody)
                                        .slice(0, 3)
                                        .map((field) => (
                                            <Badge
                                                key={field}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {field}
                                            </Badge>
                                        ))}
                                    {Object.keys(nodeData.requestBody).length >
                                        3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +
                                            {Object.keys(nodeData.requestBody)
                                                .length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Response Type */}
                    {nodeData.responseType && (
                        <div className="text-xs">
                            <span className="font-medium text-muted-foreground">
                                Response:{" "}
                            </span>
                            <Badge variant="outline" className="text-xs">
                                {nodeData.responseType}
                            </Badge>
                        </div>
                    )}

                    {/* Status Codes */}
                    {nodeData.statusCodes &&
                        nodeData.statusCodes.length > 0 && (
                            <div className="text-xs">
                                <div className="font-medium text-muted-foreground mb-1">
                                    Status Codes:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {nodeData.statusCodes
                                        .slice(0, 4)
                                        .map((code) => (
                                            <Badge
                                                key={code}
                                                variant="outline"
                                                className={`text-xs ${
                                                    code >= 200 && code < 300
                                                        ? "text-green-700 dark:text-green-300"
                                                        : code >= 400
                                                          ? "text-red-700 dark:text-red-300"
                                                          : ""
                                                }`}
                                            >
                                                {code}
                                            </Badge>
                                        ))}
                                    {nodeData.statusCodes.length > 4 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{nodeData.statusCodes.length - 4}
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
export default memo(ApiEndpointNodeComponent);
