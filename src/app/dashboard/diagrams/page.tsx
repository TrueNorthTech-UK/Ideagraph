"use client";

import { Network, FolderKanban } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Diagram {
    id: string;
    name: string;
    description: string | null;
    projectId: string;
    projectName?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Project {
    id: string;
    name: string;
    description: string | null;
}

export default function DiagramsListPage() {
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch projects
                const projectsResponse = await fetch("/api/projects");
                const projectsData = await projectsResponse.json();

                if (!projectsResponse.ok) {
                    throw new Error(projectsData.error || "Failed to fetch projects");
                }

                const projectsList = projectsData.projects || [];
                setProjects(projectsList);

                // Fetch all diagrams from all projects
                const allDiagrams: Diagram[] = [];
                for (const project of projectsList) {
                    try {
                        const diagramsResponse = await fetch(
                            `/api/diagrams?projectId=${project.id}`,
                        );
                        const diagramsData = await diagramsResponse.json();

                        if (diagramsResponse.ok && diagramsData.diagrams) {
                            const diagramsWithProject = diagramsData.diagrams.map(
                                (d: Diagram) => ({
                                    ...d,
                                    projectName: project.name,
                                }),
                            );
                            allDiagrams.push(...diagramsWithProject);
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching diagrams for project ${project.id}:`,
                            error,
                        );
                    }
                }

                setDiagrams(allDiagrams);
            } catch (error) {
                console.error("Error fetching data:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to load diagrams";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading diagrams...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Network className="h-10 w-10 text-purple-600" />
                    All Diagrams
                </h1>
                <p className="text-gray-600 mt-2">
                    View and manage all your architecture diagrams across projects
                </p>
            </div>

            {/* No diagrams state */}
            {diagrams.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Network className="h-16 w-16 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-700">
                            No diagrams yet
                        </h3>
                        <p className="text-gray-600 max-w-md">
                            Create a diagram within a project to get started with your
                            architecture visualization
                        </p>
                        <Link href="/dashboard/projects">
                            <Button className="mt-4">
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Go to Projects
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Diagrams grid */}
            {diagrams.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diagrams.map((diagram) => (
                        <Link
                            key={diagram.id}
                            href={`/dashboard/diagrams/${diagram.id}`}
                        >
                            <Card className="hover:shadow-lg transition-all hover:border-purple-500 cursor-pointer h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-3">
                                            <Network className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                                                {diagram.name}
                                            </h3>
                                            {diagram.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {diagram.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                                        <FolderKanban className="h-4 w-4" />
                                        <span className="truncate">
                                            {diagram.projectName}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        Updated{" "}
                                        {new Date(diagram.updatedAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

