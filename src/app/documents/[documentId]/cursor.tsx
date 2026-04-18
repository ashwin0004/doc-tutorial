"use client";

import { MousePointer2 } from "lucide-react";
import { memo } from "react";
import { useOther } from "@liveblocks/react/suspense";
import { connectionIdToColor } from "@/lib/utils";

interface CursorProps {
    connectionId: number;
    camera: { x: number; y: number };
    zoom: number;
}

export const Cursor = memo(({ connectionId, camera, zoom }: CursorProps) => {
    const cursor = useOther(connectionId, (user) => user.presence.cursor);
    const info = useOther(connectionId, (user) => user.info);

    if (!cursor) {
        return null;
    }

    const { x, y } = cursor;
    const color = connectionIdToColor(connectionId);

    return (
        <div
            className="pointer-events-none absolute top-0 left-0 drop-shadow-md z-50 transition-transform duration-75"
            style={{
                transform: `translateX(${x * zoom + camera.x}px) translateY(${y * zoom + camera.y}px)`
            }}
        >
            <MousePointer2
                className="h-5 w-5"
                style={{
                    fill: color,
                    color: color,
                }}
            />
            {info?.name && (
                <div
                    className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold whitespace-nowrap"
                    style={{ backgroundColor: color }}
                >
                    {info.name}
                </div>
            )}
        </div>
    );
});

Cursor.displayName = "Cursor";
