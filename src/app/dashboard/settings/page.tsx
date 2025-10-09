"use client";

import { Settings, User, Bell, Lock, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="h-10 w-10 text-gray-600" />
                    Settings
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Settings sections */}
            <div className="space-y-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Profile Settings
                        </CardTitle>
                        <CardDescription>
                            Manage your personal information and profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Profile settings are coming soon. You'll be able to update your
                            name, email, and profile picture.
                        </p>
                        <Button disabled variant="outline">
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-green-600" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Configure your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Notification settings will allow you to control email alerts,
                            in-app notifications, and more.
                        </p>
                        <Button disabled variant="outline">
                            Configure Notifications
                        </Button>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-red-600" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Manage your password and security settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Security settings will let you change your password, enable
                            two-factor authentication, and manage active sessions.
                        </p>
                        <Button disabled variant="outline">
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Appearance Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-600" />
                            Appearance
                        </CardTitle>
                        <CardDescription>
                            Customize the look and feel of your workspace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Theme customization will allow you to choose between light and
                            dark modes, and customize color schemes.
                        </p>
                        <Button disabled variant="outline">
                            Customize Theme
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

