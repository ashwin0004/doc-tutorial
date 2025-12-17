import { MousePointer2 } from "lucide-react";
import { memo } from "react";
import { connectionIdToColor } from "@/lib/utils"; // Assumes you have this or will implement simple hasher

// Simple hash function if utility doesn't exist
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
}

interface CursorProps {
    connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
    // In a real app we'd consume useOther(connectionId, user => user.presence.cursor)
    // But for performance passing presence down or using selector is better.
    // Here we'll just accept cursor as prop or use context if avail. 
    // Wait, typical Liveblocks pattern is to map over useOthers().
    // Let's rely on parent passing the info to keep this dumb.
    return null;
});

// changing approach to standard Liveblocks "Cursors" 
