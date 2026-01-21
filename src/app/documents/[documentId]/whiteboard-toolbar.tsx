import {
    MousePointer2,
    Pencil,
    Square,
    Circle,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}

export type CanvasState =
    | {
        mode: CanvasMode.None;
    }
    | {
        mode: CanvasMode.Pressing;
        origin: { x: number; y: number };
    }
    | {
        mode: CanvasMode.SelectionNet;
        origin: { x: number; y: number };
        current?: { x: number; y: number };
    }
    | {
        mode: CanvasMode.Translating;
        current: { x: number; y: number };
    }
    | {
        mode: CanvasMode.Inserting;
        layerType: number; // LayerType enum
    }
    | {
        mode: CanvasMode.Resizing;
        initialBounds: { x: number; y: number; width: number; height: number };
        corner: number; // Side or Corner handle
    }
    | {
        mode: CanvasMode.Pencil;
    };

interface WhiteboardToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    zoom: number;
    setZoom: (zoom: number) => void;
}

export const WhiteboardToolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
}: WhiteboardToolbarProps) => {
    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-12 flex items-center shadow-sm p-1.5 bg-white rounded-md border gap-x-1 z-50">
            <Button
                onClick={() => setCanvasState({ mode: CanvasMode.None })}
                variant={canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Translating || canvasState.mode === CanvasMode.SelectionNet || canvasState.mode === CanvasMode.Pressing || canvasState.mode === CanvasMode.Resizing ? "secondary" : "ghost"}
                size="icon"
            >
                <MousePointer2 className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                variant={canvasState.mode === CanvasMode.Pencil ? "secondary" : "ghost"}
                size="icon"
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: 0 })} // Rectangle
                variant={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === 0 ? "secondary" : "ghost"}
                size="icon"
            >
                <Square className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: 1 })} // Ellipse
                variant={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === 1 ? "secondary" : "ghost"}
                size="icon"
            >
                <Circle className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />



            <Button
                onClick={undo}
                disabled={!canUndo}
                variant="ghost"
                size="icon"
            >
                <Undo2 className="h-4 w-4" />
            </Button>
            <Button
                onClick={redo}
                disabled={!canRedo}
                variant="ghost"
                size="icon"
            >
                <Redo2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
                onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                variant="ghost"
                size="icon"
                title="Zoom Out"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="text-[10px] font-medium min-w-[32px] text-center">
                {Math.round(zoom * 100)}%
            </div>
            <Button
                onClick={() => setZoom(Math.min(5, zoom + 0.1))}
                variant="ghost"
                size="icon"
                title="Zoom In"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => setZoom(1)}
                variant="ghost"
                size="icon"
                title="Reset Zoom"
            >
                <Maximize className="h-4 w-4" />
            </Button>
        </div>
    );
};
