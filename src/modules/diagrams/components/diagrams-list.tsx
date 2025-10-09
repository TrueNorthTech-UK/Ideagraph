"use client";

import { Calendar, Loader2, Network, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Diagram {
    id: string;
    projectId: string;
    name: string;
    nodes: string;
    edges: string;
    metadata: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface DiagramsListProps {
    projectId: string;
    refreshTrigger?: number;
}

export function DiagramsList({ projectId, refreshTrigger }: DiagramsListProps) {
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDiagrams = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                `/api/diagrams?projectId=${projectId}`,
            );
            const data = (await response.json()) as {
                error?: string;
                diagrams?: Diagram[];
                success?: boolean;
            };

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch diagrams");
            }

            setDiagrams(data.diagrams || []);
        } catch (error) {
            console.error("Error fetching diagrams:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to load diagrams";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchDiagrams();
    }, [fetchDiagrams, refreshTrigger]);

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getNodeCount = (nodesJson: string) => {
        try {
            const nodes = JSON.parse(nodesJson) as unknown[];
            return nodes.length;
        } catch {
            return 0;
        }
    };

    const getEdgeCount = (edgesJson: string) => {
        try {
            const edges = JSON.parse(edgesJson) as unknown[];
            return edges.length;
        } catch {
            return 0;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
                    <p className="text-gray-600">Loading diagrams...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-800 font-medium mb-2">
                        Error loading diagrams
                    </p>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <Button
                        onClick={fetchDiagrams}
                        variant="outline"
                        className="border-red-300 hover:bg-red-50"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Empty state
    if (diagrams.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 max-w-2xl mx-auto border border-purple-100">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Network className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No Diagrams Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your first diagram to start visualizing your
                        architecture. Use the "New Diagram" button above to get
                        started.
                    </p>
                </div>
            </div>
        );
    }

    // Diagrams grid
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((diagram) => (
                <Card
                    key={diagram.id}
                    className="hover:shadow-lg transition-all hover:border-purple-300 group"
                >
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Network className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg truncate">
                                        {diagram.name}
                                    </CardTitle>
                                </div>
                            </div>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                            {getNodeCount(diagram.nodes)} nodes,{" "}
                            {getEdgeCount(diagram.edges)} edges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(diagram.createdAt)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Link
                            href={`/dashboard/diagrams/${diagram.id}`}
                            className="flex-1"
                        >
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                <Edit className="mr-2 h-4 w-4" />
                                Open Diagram
                            </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
