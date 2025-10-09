import { FolderKanban } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateProjectDialog } from "@/modules/projects/components/create-project-dialog";
import { ProjectsList } from "@/modules/projects/components/projects-list";

export default async function ProjectsPage() {
    // Check authentication
    const user = await auth();
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-3 shadow-md">
                        <FolderKanban className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Projects
                        </h1>
                        <p className="text-gray-600">
                            Manage your architecture projects
                        </p>
                    </div>
                </div>
                <CreateProjectDialog />
            </div>

            <ProjectsList />
        </div>
    );
}
