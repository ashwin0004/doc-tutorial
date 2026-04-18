"use client";

import { memo } from "react";

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({
    x,
    y,
    width,
    height,
    onResizeHandlePointerDown,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    onResizeHandlePointerDown: (e: React.PointerEvent, corner: number) => void;
}) => {
    return (
        <>
            <rect
                className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
                x={x}
                y={y}
                width={width}
                height={height}
            />
            {/* Top Left */}
            <rect
                className="fill-white stroke-blue-500 stroke-1"
                x={x - HANDLE_WIDTH / 2}
                y={y - HANDLE_WIDTH / 2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onResizeHandlePointerDown(e, 0); // 0 = TL
                }}
            />
            {/* Top Right */}
            <rect
                className="fill-white stroke-blue-500 stroke-1"
                x={x + width - HANDLE_WIDTH / 2}
                y={y - HANDLE_WIDTH / 2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onResizeHandlePointerDown(e, 1); // 1 = TR
                }}
            />
            {/* Bottom Left */}
            <rect
                className="fill-white stroke-blue-500 stroke-1"
                x={x - HANDLE_WIDTH / 2}
                y={y + height - HANDLE_WIDTH / 2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onResizeHandlePointerDown(e, 2); // 2 = BL
                }}
            />
            {/* Bottom Right */}
            <rect
                className="fill-white stroke-blue-500 stroke-1"
                x={x + width - HANDLE_WIDTH / 2}
                y={y + height - HANDLE_WIDTH / 2}
                width={HANDLE_WIDTH}
                height={HANDLE_WIDTH}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onResizeHandlePointerDown(e, 3); // 3 = BR
                }}
            />
        </>
    );
});

SelectionBox.displayName = "SelectionBox";
