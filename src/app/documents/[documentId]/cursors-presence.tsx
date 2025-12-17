"use client";

import { useOthersConnectionIds, useOther } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";

function Cursor({ connectionId }: { connectionId: number }) {
    const cursor = useOther(connectionId, (user) => (user.presence as any).cursor);

    if (!cursor) {
        return null;
    }

    const { x, y } = cursor;

    return (
        <div
            className="pointer-events-none absolute top-0 left-0 drop-shadow-md"
            style={{
                transform: `translateX(${x}px) translateY(${y}px)`
            }}
        >
            <MousePointer2
                className="h-5 w-5 fill-blue-500 text-blue-500" // dynamic color later
            />
            {/* Name tag could go here */}
        </div>
    );
}

export const CursorsPresence = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionId) => (
                <Cursor
                    key={connectionId}
                    connectionId={connectionId}
                />
            ))}
        </>
    );
};
