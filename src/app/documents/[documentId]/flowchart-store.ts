import { create } from "zustand";
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    MarkerType,
} from "@xyflow/react";
import { liveblocks } from "@liveblocks/zustand";
import { Client } from "@liveblocks/client";

type FlowchartState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
};

// We need to create the store instance per-room usually, but @liveblocks/zustand
// middleware connects to the room via the `client` or context.
// However, the middleware creates a single store synced to *a* room.
// To handle dynamic rooms in Next.js, we often use a store creator or reset the store?
// Actually simpler: we can use a component that provides the store context, OR
// if we assume we just navigate to one document at a time, we *could* rely on the fact 
// that the client enters the room.
// But strictly, we should create a store using the `client.enterRoom` or standard middleware 
// which uses the `client` instance.
//
// The standard @liveblocks/zustand Usage:
// const useStore = create(liveblocks(..., { client }))
//
// We will create the store *unbound* initially or rely on a setup step?
// Actually, let's look at how we can inject the room. 
// A common pattern is to just define it, and ensure we only mount it inside RoomProvider.
// But the middleware needs the `client`.
//
// Let's try to export a function that creates the hook.

export const createFlowchartStore = (client: Client) => {
    return create<FlowchartState>()(
        liveblocks(
            (set, get) => ({
                nodes: [],
                edges: [],
                onNodesChange: (changes: NodeChange[]) => {
                    set({
                        nodes: applyNodeChanges(changes, get().nodes),
                    });
                },
                onEdgesChange: (changes: EdgeChange[]) => {
                    set({
                        edges: applyEdgeChanges(changes, get().edges),
                    });
                },
                onConnect: (connection: Connection) => {
                    const edge = { ...connection, markerEnd: { type: MarkerType.ArrowClosed } };
                    set({
                        edges: addEdge(edge, get().edges),
                    });
                },
                setNodes: (nodes: Node[]) => set({ nodes }),
                setEdges: (edges: Edge[]) => set({ edges }),
            }),
            {
                client: client as any,
                storageMapping: {
                    nodes: true,
                    edges: true,
                },
            }
        )
    );
};
