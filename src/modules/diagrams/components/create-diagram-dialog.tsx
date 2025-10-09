"use client";

import { Network, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateDiagramDialogProps {
    projectId: string;
    projectName?: string;
    onDiagramCreated?: () => void;
}

export function CreateDiagramDialog({
    projectId,
    projectName,
    onDiagramCreated,
}: CreateDiagramDialogProps) {
    const [open, setOpen] = useState(false);
    const [diagramName, setDiagramName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!diagramName.trim()) {
            toast.error("Please enter a diagram name");
            return;
        }

        if (diagramName.length < 3) {
            toast.error("Diagram name must be at least 3 characters");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch("/api/diagrams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    projectId,
                    name: diagramName.trim(),
                    nodes: "[]",
                    edges: "[]",
                }),
            });

            const data = (await response.json()) as {
                error?: string;
                diagram?: {
                    id: string;
                    name: string;
                };
                success?: boolean;
            };

            if (!response.ok) {
                throw new Error(data.error || "Failed to create diagram");
            }

            toast.success(`Diagram "${diagramName}" created successfully!`);
            setDiagramName("");
            setOpen(false);

            // Call callback if provided
            if (onDiagramCreated) {
                onDiagramCreated();
            }

            // Navigate to the new diagram or refresh the page
            router.refresh();
        } catch (error) {
            console.error("Error creating diagram:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create diagram";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setDiagramName("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Diagram
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-purple-600">
                        <Network className="mr-2 h-5 w-5" />
                        Create New Diagram
                    </DialogTitle>
                    <DialogDescription>
                        {projectName
                            ? `Create a new diagram in "${projectName}"`
                            : "Create a new architecture diagram"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="diagram-name">Diagram Name</Label>
                            <Input
                                id="diagram-name"
                                placeholder="e.g., System Architecture, API Flow, Database Schema"
                                value={diagramName}
                                onChange={(e) => setDiagramName(e.target.value)}
                                maxLength={100}
                                disabled={isSubmitting}
                                autoFocus
                            />
                            <p className="text-xs text-gray-500">
                                Choose a descriptive name for your diagram
                                (3-100 characters)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !diagramName.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">
                                        ⏳
                                    </span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Diagram
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
