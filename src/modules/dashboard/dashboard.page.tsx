import {
    FolderKanban,
    Network,
    Plus,
    FileText,
    Sparkles,
    Users,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
    return (
        <div className="container mx-auto py-12 px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to IdeaGraph
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Transform your ideas into visual architecture diagrams with
                    AI-powered analysis. Design, collaborate, and document your
                    system architecture effortlessly.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                <Card className="hover:shadow-lg transition-all hover:border-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-600">
                            <Plus className="mr-2 h-5 w-5" />
                            New Project
                        </CardTitle>
                        <CardDescription>
                            Start a new architecture project from scratch
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/projects">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Create Project
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:border-purple-500">
                    <CardHeader>
                        <CardTitle className="flex items-center text-purple-600">
                            <Network className="mr-2 h-5 w-5" />
                            View Diagrams
                        </CardTitle>
                        <CardDescription>
                            Browse all your architecture diagrams
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/diagrams">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                View Diagrams
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:border-green-500">
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                            <FileText className="mr-2 h-5 w-5" />
                            Import PRD
                        </CardTitle>
                        <CardDescription>
                            Generate diagrams from your PRD documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/import">
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                Import Document
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Browse Section */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FolderKanban className="mr-2 h-5 w-5 text-blue-600" />
                            My Projects
                        </CardTitle>
                        <CardDescription>
                            Browse and manage all your architecture projects
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/projects">
                            <Button className="w-full" variant="outline">
                                View Projects
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Network className="mr-2 h-5 w-5 text-purple-600" />
                            My Diagrams
                        </CardTitle>
                        <CardDescription>
                            Access all your diagrams and architecture
                            visualizations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/diagrams">
                            <Button className="w-full" variant="outline">
                                View Diagrams
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Features Section */}
            <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Powerful Features
                </h2>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    Everything you need to design, visualize, and document your
                    system architecture
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Sparkles className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                            AI-Powered Analysis
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Import PRDs and let AI generate architecture
                            diagrams automatically
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Network className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                            Visual Diagrams
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Create beautiful, interactive architecture diagrams
                            with custom nodes
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                            Real-time Collaboration
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Work together with your team in real-time on
                            architecture designs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
