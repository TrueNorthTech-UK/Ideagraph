"use client";

import {
    Calendar,
    FileText,
    FolderKanban,
    Loader2,
    Network,
} from "lucide-react";
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

interface Project {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/projects");
            const data = (await response.json()) as {
                error?: string;
                projects?: Project[];
                success?: boolean;
            };

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch projects");
            }

            setProjects(data.projects || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to load projects";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading projects...</p>
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
                        Error loading projects
                    </p>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <Button
                        onClick={fetchProjects}
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
    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 max-w-2xl mx-auto border border-blue-100">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FolderKanban className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No Projects Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Get started by creating your first architecture project.
                        Projects help you organize your diagrams and collaborate
                        with your team.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Projects grid
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <Card
                    key={project.id}
                    className="hover:shadow-lg transition-all hover:border-blue-300 group"
                >
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FolderKanban className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg truncate">
                                        {project.name}
                                    </CardTitle>
                                </div>
                            </div>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                            {project.description || "No description provided"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(project.createdAt)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Link
                            href={`/dashboard/projects/${project.id}`}
                            className="flex-1"
                        >
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        </Link>
                        <Link
                            href={`/dashboard/projects/${project.id}/diagrams`}
                        >
                            <Button variant="outline" size="icon">
                                <Network className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
