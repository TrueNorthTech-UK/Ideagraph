import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { diagrams, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import type { Node, Edge } from "@xyflow/react";

interface DiagramPageProps {
    params: Promise<{ id: string }>;
}

export default async function DiagramPage({ params }: DiagramPageProps) {
    // Check authentication
    const user = await auth();
    if (!user) {
        redirect("/login");
    }

    const { id: diagramId } = await params;

    // Get database connection
    const db = await getDb();

    // Fetch the diagram and join with projects to verify ownership
    const result = await db
        .select({
            diagram: diagrams,
            project: projects,
        })
        .from(diagrams)
        .innerJoin(projects, eq(diagrams.projectId, projects.id))
        .where(and(eq(diagrams.id, diagramId), eq(projects.ownerId, user.id)))
        .limit(1);

    if (result.length === 0) {
        notFound();
    }

    const { diagram, project } = result[0];

    // Parse nodes and edges from JSON strings
    let initialNodes: Node[] = [];
    let initialEdges: Edge[] = [];

    try {
        if (diagram.nodes) {
            initialNodes = JSON.parse(diagram.nodes);
        }
        if (diagram.edges) {
            initialEdges = JSON.parse(diagram.edges);
        }
    } catch (error) {
        console.error("Error parsing diagram data:", error);
    }

    // If no nodes exist, create a default starting node
    if (initialNodes.length === 0) {
        initialNodes = [
            {
                id: "1",
                type: "default",
                position: { x: 250, y: 150 },
                data: { label: "Start Here" },
            },
        ];
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="border-b bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{diagram.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Project: {project.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/dashboard/projects/${project.id}`}
                            className="px-4 py-2 text-sm border rounded hover:bg-accent"
                        >
                            Back to Project
                        </a>
                    </div>
                </div>
            </header>

            {/* Canvas */}
            <div className="flex-1 relative">
                <DiagramCanvas
                    diagramId={diagramId}
                    initialNodes={initialNodes}
                    initialEdges={initialEdges}
                />
            </div>
        </div>
    );
}
