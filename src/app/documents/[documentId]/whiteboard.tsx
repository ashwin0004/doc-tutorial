"use client";

import { useStorage, useMutation, useHistory, useCanRedo, useCanUndo } from "@liveblocks/react/suspense";
import { CanvasMode, CanvasState, WhiteboardToolbar } from "./whiteboard-toolbar";
import { CursorsPresence } from "./cursors-presence";
import { SelectionBox } from "./selection-box";
import { useState } from "react";
import { nanoid } from "nanoid";
import { LiveObject, LiveMap, LiveList } from "@liveblocks/client";
import { LayerType, PathLayer, Layer } from "../../../../liveblocks.config";
import { getStroke } from "perfect-freehand";
import { COLORS } from "@/lib/utils";

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    d.push("Z");
    return d.join(" ");
}

export const Whiteboard = () => {
    const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const layers = useStorage((root) => root.layers);
    const layerIds = useStorage((root) => root.layerIds);

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const [currentPath, setCurrentPath] = useState<number[][] | null>(null);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

    const onWheel = (e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    };



    const onLayerPointerDown = useMutation((
        { },
        e: React.PointerEvent,
        layerId: string
    ) => {
        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;

        history.pause();
        e.stopPropagation();

        const point = {
            x: (e.nativeEvent.offsetX - camera.x) / zoom,
            y: (e.nativeEvent.offsetY - camera.y) / zoom
        };

        if (selectedLayerId !== layerId) {
            setSelectedLayerId(layerId);
        }

        setCanvasState({
            mode: CanvasMode.Translating,
            current: point
        });

    }, [canvasState, camera, selectedLayerId, history]);

    const onResizeHandlePointerDown = useMutation((
        { },
        e: React.PointerEvent,
        corner: number
    ) => {
        e.stopPropagation();
        history.pause();

        const layer = layers?.get(selectedLayerId!);
        if (!layer) return;

        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds: {
                x: layer.x,
                y: layer.y,
                width: layer.width,
                height: layer.height,
            },
            corner,
        });

    }, [history, layers, selectedLayerId]);

    const onPointerDown = useMutation((
        { storage },
        e: React.PointerEvent
    ) => {
        const point = {
            x: (e.nativeEvent.offsetX - camera.x) / zoom,
            y: (e.nativeEvent.offsetY - camera.y) / zoom
        };

        if (canvasState.mode === CanvasMode.Inserting) {
            e.preventDefault();
            // Create the layer
            let liveLayers = storage.get("layers");
            if (!liveLayers) {
                liveLayers = new LiveMap([]);
                storage.set("layers", liveLayers);
            }
            let liveLayerIds = storage.get("layerIds");
            if (!liveLayerIds) {
                liveLayerIds = new LiveList([]);
                storage.set("layerIds", liveLayerIds);
            }

            const layerType = canvasState.layerType === 0 ? LayerType.Rectangle : LayerType.Ellipse;
            const layerId = nanoid();
            const layer = new LiveObject({
                type: layerType,
                x: point.x,
                y: point.y,
                height: 100,
                width: 100,
                fill: { r: 0, g: 0, b: 0 },
            } as Layer);
            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer);
            setCanvasState({ mode: CanvasMode.None });
            return;
        }

        if (canvasState.mode === CanvasMode.Pencil) {
            e.preventDefault();
            setCurrentPath([[point.x, point.y]]);
            return;
        }

        // Deselect if clicking empty space
        setSelectedLayerId(null);
        setCanvasState({ mode: CanvasMode.None });

    }, [canvasState, camera]);

    const onPointerMove = useMutation((
        { storage, setMyPresence },
        e: React.PointerEvent
    ) => {
        e.preventDefault();
        const current = {
            x: (e.nativeEvent.offsetX - camera.x) / zoom,
            y: (e.nativeEvent.offsetY - camera.y) / zoom
        };
        setMyPresence({ cursor: current });

        if (canvasState.mode === CanvasMode.Pencil && currentPath) {
            setCurrentPath([...currentPath, [current.x, current.y]]);
        }

        if (canvasState.mode === CanvasMode.Translating && selectedLayerId) {
            const layer = storage.get("layers").get(selectedLayerId);
            if (layer && canvasState.mode === CanvasMode.Translating) { // Added type guard for canvasState.current
                const deltaX = current.x - canvasState.current.x;
                const deltaY = current.y - canvasState.current.y;

                layer.update({
                    x: layer.get("x") + deltaX,
                    y: layer.get("y") + deltaY,
                });

                setCanvasState({
                    mode: CanvasMode.Translating,
                    current,
                });
            }
        }

        if (canvasState.mode === CanvasMode.Resizing && selectedLayerId) {
            const layer = storage.get("layers").get(selectedLayerId);
            if (layer && canvasState.mode === CanvasMode.Resizing) { // Added type guard for canvasState.initialBounds and canvasState.corner
                const { initialBounds, corner } = canvasState;

                let newX = initialBounds.x;
                let newY = initialBounds.y;
                let newWidth = initialBounds.width;
                let newHeight = initialBounds.height;

                // 0: TL, 1: TR, 2: BL, 3: BR
                if (corner === 0) { // Top-Left
                    newX = current.x;
                    newY = current.y;
                    newWidth = initialBounds.width + (initialBounds.x - newX);
                    newHeight = initialBounds.height + (initialBounds.y - newY);
                } else if (corner === 1) { // Top-Right
                    newX = initialBounds.x;
                    newY = current.y;
                    newWidth = current.x - initialBounds.x;
                    newHeight = initialBounds.height + (initialBounds.y - newY);
                } else if (corner === 2) { // Bottom-Left
                    newX = current.x;
                    newY = initialBounds.y;
                    newWidth = initialBounds.width + (initialBounds.x - newX);
                    newHeight = current.y - initialBounds.y;
                } else if (corner === 3) { // Bottom-Right
                    newX = initialBounds.x;
                    newY = initialBounds.y;
                    newWidth = current.x - initialBounds.x;
                    newHeight = current.y - initialBounds.y;
                }

                if (newWidth > 0 && newHeight > 0) {
                    layer.update({ x: newX, y: newY, width: newWidth, height: newHeight });
                }
            }
        }

    }, [canvasState, currentPath, camera, selectedLayerId]);

    const onPointerLeave = useMutation((
        { setMyPresence }
    ) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerUp = useMutation((
        { storage }
    ) => {
        history.resume();
        if (canvasState.mode === CanvasMode.Resizing || canvasState.mode === CanvasMode.Translating) {
            setCanvasState({ mode: CanvasMode.None });
        }

        if (canvasState.mode === CanvasMode.Pencil && currentPath) {
            let liveLayers = storage.get("layers");
            if (!liveLayers) {
                liveLayers = new LiveMap([]);
                storage.set("layers", liveLayers);
            }
            let liveLayerIds = storage.get("layerIds");
            if (!liveLayerIds) {
                liveLayerIds = new LiveList([]);
                storage.set("layerIds", liveLayerIds);
            }

            // Compute bounding box for the drawn path and store points relative
            const xs = currentPath.map((p) => p[0]);
            const ys = currentPath.map((p) => p[1]);
            const minX = Math.min(...xs);
            const minY = Math.min(...ys);
            const maxX = Math.max(...xs);
            const maxY = Math.max(...ys);

            const relPoints = currentPath.map(([x, y]) => [x - minX, y - minY]);

            const layerId = nanoid();
            const layer = new LiveObject<PathLayer>({
                type: LayerType.Path,
                x: minX,
                y: minY,
                height: maxY - minY,
                width: maxX - minX,
                fill: { r: 0, g: 0, b: 0 },
                points: relPoints,
            });

            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer);
            setCurrentPath(null);
        }
    }, [canvasState.mode, currentPath, history]);

    const deleteLayer = useMutation(({ storage }) => {
        if (!selectedLayerId) return;
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");
        if (liveLayers && liveLayerIds) {
            liveLayers.delete(selectedLayerId);
            const index = liveLayerIds.indexOf(selectedLayerId);
            if (index !== -1) liveLayerIds.delete(index);
        }
        setSelectedLayerId(null);
    }, [selectedLayerId]);

    const changeColor = useMutation(({ storage }, fill: { r: number, g: number, b: number }) => {
        if (!selectedLayerId) return;
        const liveLayers = storage.get("layers");
        const layer = liveLayers?.get(selectedLayerId);
        if (layer) {
            layer.update({ fill });
        }
    }, [selectedLayerId]);

    const selectedLayer = selectedLayerId ? layers?.get(selectedLayerId) : null;

    return (
        <div className="h-full w-full relative bg-[#F1F4F9] touch-none overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerLeave}
            onWheel={onWheel}
        >
            <WhiteboardToolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                undo={history.undo}
                redo={history.redo}
                canUndo={canUndo}
                canRedo={canRedo}
                zoom={zoom}
                setZoom={setZoom}
            />
            <CursorsPresence camera={camera} zoom={zoom} />
            <svg
                className="h-full w-full"
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`
                    }}
                >
                    {layerIds?.map((layerId) => {
                        const layer = layers?.get(layerId);
                        if (!layer) return null;

                        const isSelected = selectedLayerId === layerId;



                        if (layer.type === LayerType.Rectangle) {
                            return (
                                <rect
                                    key={layerId}
                                    x={layer.x}
                                    y={layer.y}
                                    width={layer.width}
                                    height={layer.height}
                                    fill={`rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})`}
                                    stroke={isSelected ? "#00f" : "transparent"}
                                    strokeWidth={2}
                                    onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                                />
                            );
                        }
                        if (layer.type === LayerType.Ellipse) {
                            return (
                                <ellipse
                                    key={layerId}
                                    cx={layer.x + layer.width / 2}
                                    cy={layer.y + layer.height / 2}
                                    rx={layer.width / 2}
                                    ry={layer.height / 2}
                                    fill={`rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})`}
                                    stroke={isSelected ? "#00f" : "transparent"}
                                    strokeWidth={2}
                                    onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                                />
                            );
                        }

                        if (layer.type === LayerType.Path) {
                            // Guard against malformed, single-point, or zero-size paths which can render a stray dot at 0,0
                            if (!layer.points || !Array.isArray(layer.points)) {
                                return null;
                            }

                            const pts = layer.points as number[][];
                            if (pts.length < 2) return null;
                            if (!Number.isFinite(layer.width) || !Number.isFinite(layer.height)) return null;
                            // If the stored bounding box has no area, skip rendering the path
                            if (layer.width <= 1 && layer.height <= 1) return null;
                            const stroke = getStroke(pts, {
                                size: 16,
                                thinning: 0.5,
                                smoothing: 0.5,
                                streamline: 0.5,
                            });
                            const d = getSvgPathFromStroke(stroke);
                            if (!d) return null;

                            const tx = Number.isFinite(layer.x) ? layer.x : 0;
                            const ty = Number.isFinite(layer.y) ? layer.y : 0;

                            return <path
                                key={layerId}
                                d={d}
                                transform={`translate(${tx}, ${ty})`}
                                fill={`rgb(${layer.fill.r}, ${layer.fill.g}, ${layer.fill.b})`}
                                stroke={isSelected ? "#00f" : "transparent"}
                                strokeWidth={isSelected ? 1 : 0}
                                onPointerDown={(e) => onLayerPointerDown(e, layerId)}
                            />;
                        }
                        return null;
                    })}

                    {currentPath && (
                        <path
                            d={getSvgPathFromStroke(getStroke(currentPath, {
                                size: 16,
                                thinning: 0.5,
                                smoothing: 0.5,
                                streamline: 0.5,
                            }))}
                            fill="#000"
                            opacity={0.5}
                        />
                    )}

                    {selectedLayer && selectedLayer.type !== LayerType.Path &&
                        typeof selectedLayer.width === "number" && typeof selectedLayer.height === "number" &&
                        selectedLayer.width > 0 && selectedLayer.height > 0 && (
                            <SelectionBox
                                x={selectedLayer.x}
                                y={selectedLayer.y}
                                width={selectedLayer.width}
                                height={selectedLayer.height}
                                onResizeHandlePointerDown={onResizeHandlePointerDown}
                            />
                        )}
                </g>
            </svg>

            {selectedLayerId && (
                <div
                    className="absolute top-20 right-4 bg-white p-2 border rounded shadow-md flex flex-col gap-2"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className="text-xs font-bold mb-1">Color</div>
                    <div className="flex gap-1 flex-wrap w-36">
                        {COLORS.map((c, i) => (
                            <button
                                key={i}
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: c }}
                                onClick={() => changeColor(hexToRgb(c))}
                            />
                        ))}
                    </div>
                    <button
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-2"
                        onClick={() => deleteLayer()}
                    >
                        Delete
                    </button>
                    <button
                        className="text-xs text-gray-500 mt-1"
                        onClick={() => setSelectedLayerId(null)}
                    >
                        Deselect
                    </button>
                </div>
            )}
        </div>
    );
};
