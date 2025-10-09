"use client";

import { useCallback, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from "lucide-react";

/**
 * ViewControls Component
 *
 * Provides zoom, pan, and fit-view controls for the diagram canvas.
 * Includes keyboard shortcuts for common operations.
 */
export default function ViewControls() {
    const { zoomIn, zoomOut, fitView, setCenter, getViewport } = useReactFlow();

    // Zoom in handler
    const handleZoomIn = useCallback(() => {
        zoomIn({ duration: 200 });
    }, [zoomIn]);

    // Zoom out handler
    const handleZoomOut = useCallback(() => {
        zoomOut({ duration: 200 });
    }, [zoomOut]);

    // Fit view handler - fits all nodes in viewport
    const handleFitView = useCallback(() => {
        fitView({
            duration: 300,
            padding: 0.2, // 20% padding around nodes
        });
    }, [fitView]);

    // Reset view to center (0,0) with default zoom
    const handleResetView = useCallback(() => {
        setCenter(0, 0, { zoom: 1, duration: 300 });
    }, [setCenter]);

    // Zoom to 100% (actual size)
    const handleActualSize = useCallback(() => {
        const viewport = getViewport();
        setCenter(viewport.x, viewport.y, { zoom: 1, duration: 300 });
    }, [setCenter, getViewport]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if user is typing in an input field
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            const modifierKey = isMac ? event.metaKey : event.ctrlKey;

            // Cmd/Ctrl + Plus or Equal: Zoom In
            if (modifierKey && (event.key === "+" || event.key === "=")) {
                event.preventDefault();
                handleZoomIn();
            }

            // Cmd/Ctrl + Minus: Zoom Out
            else if (modifierKey && event.key === "-") {
                event.preventDefault();
                handleZoomOut();
            }

            // Cmd/Ctrl + 0: Actual Size (100%)
            else if (modifierKey && event.key === "0") {
                event.preventDefault();
                handleActualSize();
            }

            // Cmd/Ctrl + 1: Fit View
            else if (modifierKey && event.key === "1") {
                event.preventDefault();
                handleFitView();
            }

            // Cmd/Ctrl + Shift + R: Reset View
            else if (modifierKey && event.shiftKey && event.key === "R") {
                event.preventDefault();
                handleResetView();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        handleZoomIn,
        handleZoomOut,
        handleActualSize,
        handleFitView,
        handleResetView,
    ]);

    return (
        <div className="flex flex-col gap-1 bg-card border border-border rounded-lg shadow-lg p-2">
            {/* Zoom In */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                title="Zoom In (Ctrl/Cmd +)"
                className="h-8 w-8"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>

            {/* Zoom Out */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                title="Zoom Out (Ctrl/Cmd -)"
                className="h-8 w-8"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="h-px bg-border my-1" />

            {/* Fit View */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleFitView}
                title="Fit View (Ctrl/Cmd 1)"
                className="h-8 w-8"
            >
                <Maximize2 className="h-4 w-4" />
            </Button>

            {/* Actual Size (100%) */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleActualSize}
                title="Actual Size 100% (Ctrl/Cmd 0)"
                className="h-8 w-8"
            >
                <Minimize2 className="h-4 w-4" />
            </Button>

            {/* Reset View */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleResetView}
                title="Reset View (Ctrl/Cmd Shift R)"
                className="h-8 w-8"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
    );
}
