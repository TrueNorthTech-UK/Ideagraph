"use client";

import { ArrowLeft, FolderKanban, Network } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateDiagramDialog } from "@/modules/diagrams/components/create-diagram-dialog";
import { DiagramsList } from "@/modules/diagrams/components/diagrams-list";

interface Project {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const resolvedParams = use(params);
    const projectId = resolvedParams.projectId;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);

                const response = await fetch("/api/projects");
                const data = (await response.json()) as {
                    error?: string;
                    projects?: Project[];
                    success?: boolean;
                };

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch project");
                }

                const foundProject = data.projects?.find(
                    (p) => p.id === projectId,
                );
                if (!foundProject) {
                    toast.error("Project not found");
                    return;
                }

                setProject(foundProject);
            } catch (error) {
                console.error("Error fetching project:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to load project";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleDiagramCreated = () => {
        // Trigger refresh of diagrams list
        setRefreshTrigger((prev) => prev + 1);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">Project not found</p>
                    <Link href="/dashboard/projects">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard/projects">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </Link>

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
                            <FolderKanban className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {project.name}
                            </h1>
                            {project.description && (
                                <p className="text-gray-600 mt-2">
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                            <Network className="mr-2 h-4 w-4 text-purple-600" />
                            Diagrams
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">
                            {/* This will be calculated from DiagramsList */}
                            --
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Diagrams Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Network className="mr-3 h-6 w-6 text-purple-600" />
                        Diagrams
                    </h2>
                    <CreateDiagramDialog
                        projectId={projectId}
                        projectName={project.name}
                        onDiagramCreated={handleDiagramCreated}
                    />
                </div>

                <DiagramsList
                    projectId={projectId}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}
