"use client";

import { useState } from "react";
import {
    Upload,
    FileText,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ArrowLeft,
    Copy,
    Download,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PrdAnalysisResult } from "@/app/api/ai/analyze-prd/route";

type AnalysisStatus = "idle" | "analyzing" | "success" | "error";

interface AnalysisState {
    status: AnalysisStatus;
    result: PrdAnalysisResult | null;
    error: string | null;
}

export default function ImportPage() {
    const [prdContent, setPrdContent] = useState("");
    const [fileName, setFileName] = useState<string>("");
    const [analysis, setAnalysis] = useState<AnalysisState>({
        status: "idle",
        result: null,
        error: null,
    });

    // Character count and validation
    const charCount = prdContent.length;
    const minChars = 100;
    const maxChars = 100000;
    const isValid = charCount >= minChars && charCount <= maxChars;

    // Handle text paste/input
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrdContent(e.target.value);
        // Reset analysis state when content changes
        if (analysis.status !== "idle") {
            setAnalysis({ status: "idle", result: null, error: null });
        }
    };

    // Handle file upload (stub for future implementation)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            // TODO: Implement file parsing in Task 050/060
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setPrdContent(text);
            };
            reader.readAsText(file);
        }
    };

    // Handle PRD analysis
    const handleAnalyze = async () => {
        if (!isValid) return;

        setAnalysis({ status: "analyzing", result: null, error: null });

        try {
            const response = await fetch("/api/ai/analyze-prd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: prdContent,
                    fileName: fileName || undefined,
                }),
            });

            const data = (await response.json()) as {
                success?: boolean;
                error?: string;
                [key: string]: unknown;
            };

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            if (data.success) {
                setAnalysis({
                    status: "success",
                    result: data as unknown as PrdAnalysisResult,
                    error: null,
                });
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (error) {
            console.error("Analysis error:", error);
            setAnalysis({
                status: "error",
                result: null,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to analyze PRD",
            });
        }
    };

    // Handle copying results to clipboard
    const handleCopyResults = () => {
        if (analysis.result) {
            const resultsText = JSON.stringify(analysis.result, null, 2);
            navigator.clipboard.writeText(resultsText);
            // Could add a toast notification here
        }
    };

    // Handle downloading results
    const handleDownloadResults = () => {
        if (analysis.result) {
            const resultsText = JSON.stringify(analysis.result, null, 2);
            const blob = new Blob([resultsText], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `prd-analysis-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Import PRD Document
                </h1>
                <p className="text-lg text-gray-600">
                    Upload or paste your Product Requirements Document to
                    generate architecture diagrams automatically with AI
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-green-600" />
                                Input Method
                            </CardTitle>
                            <CardDescription>
                                Choose how to provide your PRD content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="file-upload"
                                    className="text-base font-medium"
                                >
                                    Upload Document
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            document
                                                .getElementById("file-upload")
                                                ?.click()
                                        }
                                        disabled={
                                            analysis.status === "analyzing"
                                        }
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose File
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".txt,.md"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                                {fileName && (
                                    <p className="text-sm text-gray-600">
                                        Selected: {fileName}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Supported formats: TXT, MD (PDF, DOCX coming
                                    soon)
                                </p>
                            </div>

                            <Separator />

                            {/* Text Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="prd-content"
                                    className="text-base font-medium"
                                >
                                    Or Paste Content
                                </Label>
                                <Textarea
                                    id="prd-content"
                                    placeholder="Paste your PRD content here... (minimum 100 characters)"
                                    value={prdContent}
                                    onChange={handleContentChange}
                                    className="min-h-[300px] font-mono text-sm"
                                    disabled={analysis.status === "analyzing"}
                                />
                                <div className="flex justify-between text-xs">
                                    <span
                                        className={
                                            charCount < minChars
                                                ? "text-red-600"
                                                : charCount > maxChars
                                                  ? "text-red-600"
                                                  : "text-gray-500"
                                        }
                                    >
                                        {charCount.toLocaleString()} /{" "}
                                        {maxChars.toLocaleString()} characters
                                    </span>
                                    {charCount > 0 && charCount < minChars && (
                                        <span className="text-red-600">
                                            {minChars - charCount} more needed
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <Button
                                onClick={handleAnalyze}
                                disabled={
                                    !isValid || analysis.status === "analyzing"
                                }
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="lg"
                            >
                                {analysis.status === "analyzing" ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing PRD...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Analyze with AI
                                    </>
                                )}
                            </Button>

                            {!isValid && charCount > 0 && (
                                <p className="text-sm text-red-600 text-center">
                                    {charCount < minChars
                                        ? `PRD must be at least ${minChars} characters`
                                        : `PRD must be less than ${maxChars} characters`}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                How it works
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-600">
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Upload a file or paste your PRD content</li>
                                <li>
                                    Click "Analyze with AI" to start processing
                                </li>
                                <li>
                                    AI extracts entities, relationships, and
                                    flows
                                </li>
                                <li>
                                    Review the analysis results and
                                    recommendations
                                </li>
                                <li>
                                    Use results to generate visual diagrams
                                    (coming soon)
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Progress/Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    Analysis Results
                                </span>
                                {analysis.status === "success" && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopyResults}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownloadResults}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {analysis.status === "idle" && (
                                <div className="text-center py-12 text-gray-500">
                                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>
                                        Paste or upload your PRD to begin
                                        analysis
                                    </p>
                                </div>
                            )}

                            {analysis.status === "analyzing" && (
                                <div className="text-center py-12">
                                    <Loader2 className="h-12 w-12 mx-auto mb-4 text-green-600 animate-spin" />
                                    <p className="text-lg font-medium mb-2">
                                        Analyzing your PRD...
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        This may take 10-30 seconds depending on
                                        content length
                                    </p>
                                    <div className="mt-6 space-y-2 text-sm text-left max-w-md mx-auto">
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse" />
                                            Extracting architectural entities...
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse animation-delay-200" />
                                            Identifying relationships...
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse animation-delay-400" />
                                            Mapping data flows...
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mr-3 animate-pulse animation-delay-600" />
                                            Generating recommendations...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {analysis.status === "error" && (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                                    <p className="text-lg font-medium mb-2 text-red-600">
                                        Analysis Failed
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {analysis.error}
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setAnalysis({
                                                status: "idle",
                                                result: null,
                                                error: null,
                                            })
                                        }
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {analysis.status === "success" &&
                                analysis.result && (
                                    <div className="space-y-6">
                                        {/* Success Header */}
                                        <div className="text-center pb-4 border-b">
                                            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                                            <p className="text-lg font-medium mb-1">
                                                Analysis Complete!
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Processed in{" "}
                                                {(
                                                    analysis.result.metadata
                                                        .processingTime / 1000
                                                ).toFixed(1)}
                                                s
                                            </p>
                                        </div>

                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                                <CardContent className="pt-6 text-center">
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        {
                                                            analysis.result
                                                                .analysis
                                                                .entities.length
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Entities Found
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="pt-6 text-center">
                                                    <div className="text-3xl font-bold text-purple-600">
                                                        {
                                                            analysis.result
                                                                .analysis
                                                                .relationships
                                                                .length
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Relationships
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="pt-6 text-center">
                                                    <div className="text-3xl font-bold text-green-600">
                                                        {
                                                            analysis.result
                                                                .analysis.flows
                                                                .length
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Data Flows
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent className="pt-6 text-center">
                                                    <div className="text-3xl font-bold text-orange-600">
                                                        {
                                                            analysis.result
                                                                .analysis
                                                                .recommendations
                                                                .length
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Recommendations
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Confidence Score */}
                                        <Card>
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium">
                                                        Confidence Score
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            analysis.result
                                                                .analysis
                                                                .confidence >=
                                                            0.8
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {(
                                                            analysis.result
                                                                .analysis
                                                                .confidence *
                                                            100
                                                        ).toFixed(0)}
                                                        %
                                                    </Badge>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${analysis.result.analysis.confidence * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Entities Preview */}
                                        {analysis.result.analysis.entities
                                            .length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-base">
                                                        Entities Detected
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                        {analysis.result.analysis.entities
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    entity,
                                                                    idx,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                                    >
                                                                        <span className="font-medium text-sm">
                                                                            {
                                                                                entity.label
                                                                            }
                                                                        </span>
                                                                        <Badge variant="outline">
                                                                            {
                                                                                entity.type
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                ),
                                                            )}
                                                        {analysis.result
                                                            .analysis.entities
                                                            .length > 5 && (
                                                            <p className="text-xs text-gray-500 text-center pt-2">
                                                                +
                                                                {analysis.result
                                                                    .analysis
                                                                    .entities
                                                                    .length -
                                                                    5}{" "}
                                                                more entities
                                                            </p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Next Steps */}
                                        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                                            <CardHeader>
                                                <CardTitle className="text-base text-green-800">
                                                    Next Steps
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 text-sm">
                                                <p className="text-gray-700">
                                                    Your PRD has been
                                                    successfully analyzed!
                                                    Here's what you can do next:
                                                </p>
                                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                                    <li>
                                                        Download the full
                                                        analysis as JSON
                                                    </li>
                                                    <li>
                                                        Create a new diagram
                                                        from these results
                                                        (coming soon)
                                                    </li>
                                                    <li>
                                                        Review AI
                                                        recommendations for
                                                        improvements
                                                    </li>
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
