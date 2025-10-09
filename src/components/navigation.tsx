"use client";

import { FolderKanban, Network, Home, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "../modules/auth/components/logout-button";
import { useState } from "react";

export function Navigation() {
    return (
        <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/dashboard"
                            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Network className="h-6 w-6" />
                            IdeaGraph
                        </Link>
                        <div className="items-center space-x-2 hidden md:flex">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <Home className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard/projects">
                                <Button variant="ghost" size="sm">
                                    <FolderKanban className="mr-2 h-4 w-4" />
                                    Projects
                                </Button>
                            </Link>
                            <Link href="/dashboard/diagrams">
                                <Button variant="ghost" size="sm">
                                    <Network className="mr-2 h-4 w-4" />
                                    Diagrams
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/dashboard/settings"
                            className="hidden md:block"
                        >
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link
                            href="/dashboard/projects"
                            onClick={() => setIsOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                            >
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Projects
                            </Button>
                        </Link>
                        <Link
                            href="/dashboard/diagrams"
                            onClick={() => setIsOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                            >
                                <Network className="mr-2 h-4 w-4" />
                                Diagrams
                            </Button>
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
