"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
    Handle,
    Position,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
    NodeChange,
    EdgeChange,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useClient, useRoom, useMutation, useStorage } from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";
import { toPng } from "html-to-image";

const DiamondNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="relative w-24 h-24 group">
            {/* The rotated square (visual diamond) */}
            <div className="absolute inset-0 m-auto w-16 h-16 bg-white border border-gray-700 transform rotate-45 shadow-sm group-hover:shadow-md transition-shadow" />

            {/* The Label */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium z-10 pointer-events-none">
                {data.label}
            </div>

            {/* Standard Handles at the compass points (Tips of the diamond) */}
            <Handle id="top-target" type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500" />
            <Handle id="top-source" type="source" position={Position.Top} className="w-2 h-2 !bg-gray-500" />

            <Handle id="right-target" type="target" position={Position.Right} className="w-2 h-2 !bg-gray-500 z-50" />
            <Handle id="right-source" type="source" position={Position.Right} className="w-2 h-2 !bg-gray-500 z-50" />

            <Handle id="bottom-target" type="target" position={Position.Bottom} className="w-2 h-2 !bg-gray-500" />
            <Handle id="bottom-source" type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500" />

            <Handle id="left-target" type="target" position={Position.Left} className="w-2 h-2 !bg-gray-500" />
            <Handle id="left-source" type="source" position={Position.Left} className="w-2 h-2 !bg-gray-500" />
        </div>
    );
};

export const Flowchart = () => {
    const client = useClient();
    const room = useRoom();

    // Check if storage is initialized
    const storageNodes = useStorage((root) => root.nodes);
    const storageEdges = useStorage((root) => root.edges);

    const initStorage = useMutation(({ storage }: { storage: LiveObject<any> | any }) => {
        const nodes = storage.get("nodes");
        const edges = storage.get("edges");

        if (!nodes) {
            storage.set("nodes", new LiveList([]));
        }
        if (!edges) {
            storage.set("edges", new LiveList([]));
        }
    }, []);

    useEffect(() => {
        // If keys are missing, initialize them
        if (storageNodes === undefined || storageEdges === undefined) {
            initStorage();
        }
    }, [storageNodes, storageEdges, initStorage]);

    if (storageNodes === undefined || storageEdges === undefined) {
        return <div className="h-full flex items-center justify-center">Initializing Flowchart Storage...</div>;
    }

    return (
        <ReactFlowProvider>
            <FlowchartInner />
        </ReactFlowProvider>
    );
};

const FlowchartInner = () => {
    // Read state directly from Liveblocks
    // Cast to any[] and Node[]/Edge[] to satisfy React Flow types while reading from readonly LiveList
    const nodes = useStorage((root) => root.nodes) as unknown as Node[];
    const edges = useStorage((root) => root.edges) as unknown as Edge[];

    const { getNodes } = useReactFlow();

    // -- Mutations for Write Operations --

    const updateNodePosition = useMutation(({ storage }, id: string, position: { x: number, y: number }) => {
        const liveNodes = storage.get("nodes");
        if (!liveNodes) return;
        const index = liveNodes.findIndex((n: Node) => n.id === id);
        if (index !== -1) {
            const node = liveNodes.get(index);
            liveNodes.set(index, { ...node, position });
        }
    }, []);

    const deleteNode = useMutation(({ storage }, id: string) => {
        const liveNodes = storage.get("nodes");
        if (!liveNodes) return;
        const index = liveNodes.findIndex((n: Node) => n.id === id);
        if (index !== -1) liveNodes.delete(index);
    }, []);

    const deleteEdge = useMutation(({ storage }, id: string) => {
        const liveEdges = storage.get("edges");
        if (!liveEdges) return;
        const index = liveEdges.findIndex((e: Edge) => e.id === id);
        if (index !== -1) liveEdges.delete(index);
    }, []);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        changes.forEach((change) => {
            if (change.type === 'position' && change.position) {
                updateNodePosition(change.id, change.position);
            } else if (change.type === 'remove') {
                deleteNode(change.id);
            }
        });
    }, [updateNodePosition, deleteNode]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        changes.forEach((change) => {
            if (change.type === 'remove') {
                deleteEdge(change.id);
            }
        });
    }, [deleteEdge]);

    const onConnect = useMutation(({ storage }, connection: Connection) => {
        const liveEdges = storage.get("edges");
        if (!liveEdges) return;

        const newEdge: Edge = {
            ...connection,
            id: `edge_${Date.now()}`,
            markerEnd: { type: MarkerType.ArrowClosed }
        };
        liveEdges.push(newEdge);
    }, []);

    const addNode = useMutation(({ storage }, newNode: Node) => {
        const liveNodes = storage.get("nodes");
        if (liveNodes) liveNodes.push(newNode);
    }, []);

    const updateNodeLabel = useMutation(({ storage }, nodeId: string, label: string) => {
        const liveNodes = storage.get("nodes");
        if (!liveNodes) return;
        const index = liveNodes.findIndex((n: Node) => n.id === nodeId);
        if (index !== -1) {
            const node = liveNodes.get(index);
            liveNodes.set(index, { ...node, data: { ...node.data, label } });
        }
    }, []);

    const nodeTypes = useMemo(() => ({
        diamond: DiamondNode
    }), []);

    const onAddNode = useCallback((type: 'rectangle' | 'circle' | 'diamond') => {
        const id = `node_${Date.now()}`;
        let newNode: Node = {
            id,
            position: { x: Math.random() * 300, y: Math.random() * 300 },
            data: { label: type === 'diamond' ? 'Decision' : (type === 'circle' ? 'Start/End' : 'Process') },
        };

        if (type === 'rectangle') {
            newNode.style = {
                backgroundColor: '#fff',
                border: '1px solid #777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px'
            };
        } else if (type === 'circle') {
            newNode.style = {
                backgroundColor: '#fff',
                border: '1px solid #777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                borderRadius: '50%',
                width: 100,
                height: 100
            };
        } else if (type === 'diamond') {
            newNode.type = 'diamond';
        }

        addNode(newNode);
    }, [addNode]);

    const onNodeDoubleClick = useCallback((e: React.MouseEvent, node: Node) => {
        const currentLabel = typeof node.data.label === 'string' ? node.data.label : '';
        const newLabel = window.prompt("Enter new name:", currentLabel);
        if (newLabel && newLabel !== currentLabel) {
            updateNodeLabel(node.id, newLabel);
        }
    }, [updateNodeLabel]);

    const onPrint = () => {
        const nodes = getNodes();
        if (nodes.length === 0) return;

        const bounds = getNodesBounds(nodes);
        const imageWidth = bounds.width;
        const imageHeight = bounds.height;
        const transform = getViewportForBounds(bounds, imageWidth, imageHeight, 0.5, 2, 0);

        const viewport = document.querySelector('.react-flow__viewport');
        if (viewport instanceof HTMLElement) {
            toPng(viewport, {
                backgroundColor: '#fff',
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: imageWidth + 'px',
                    height: imageHeight + 'px',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                },
            }).then((dataUrl) => {
                const windowContent = `
                    <!DOCTYPE html>
                    <html>
                    <head><title>Print Flowchart</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center;">
                        <img src="${dataUrl}" id="print-image" style="max-width:100%; max-height:100%;" />
                        <script>
                            document.getElementById('print-image').onload = () => {
                                window.print();
                                setTimeout(() => window.close(), 500);
                            };
                        </script>
                    </body>
                    </html>
                 `;
                const printWindow = window.open('', '', 'width=800,height=600');
                if (printWindow) {
                    printWindow.document.write(windowContent);
                    printWindow.document.close();
                }
            });
        }
    };

    if (!nodes || !edges) {
        return <div className="h-full flex items-center justify-center">Loading Flowchart...</div>;
    }

    return (
        <div className="h-full w-full bg-slate-50 relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                    className="bg-white p-2 rounded shadow-sm border text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                    onClick={() => onAddNode('rectangle')}
                >
                    <div className="w-4 h-4 border border-gray-500 bg-gray-100" />
                    Rectangle
                </button>
                <button
                    className="bg-white p-2 rounded shadow-sm border text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                    onClick={() => onAddNode('circle')}
                >
                    <div className="w-4 h-4 border border-gray-500 bg-gray-100 rounded-full" />
                    Circle
                </button>
                <button
                    className="bg-white p-2 rounded shadow-sm border text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                    onClick={() => onAddNode('diamond')}
                >
                    <div className="w-4 h-4 border border-gray-500 bg-gray-100 rotate-45" />
                    Diamond
                </button>
                <button
                    className="bg-white p-2 rounded shadow-sm border text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                    onClick={onPrint}
                >
                    Print
                </button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};
