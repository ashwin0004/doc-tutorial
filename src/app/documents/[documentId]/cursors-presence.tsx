"use client";

import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";

interface CursorsPresenceProps {
    camera: { x: number; y: number };
    zoom: number;
}

export const CursorsPresence = ({ camera, zoom }: CursorsPresenceProps) => {

    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionId) => (
                <Cursor
                    key={connectionId}
                    connectionId={connectionId}
                    camera={camera}
                    zoom={zoom}
                />
            ))}
        </>
    );
};
