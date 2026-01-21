"use client";

import { toast } from "sonner";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { FullscreenLoader } from "@/components/fullscreen-loader";
import { RIGHT_MARGIN_DEFAULT, LEFT_MARGIN_DEFAULT } from "@/constants/margins";

import { getUsers, getDocuments } from "./actions";
import { Id } from "../../../../convex/_generated/dataModel";
import { Layer, Todo } from "../../../../liveblocks.config";

type User = { id: string; name: string; avatar: string; color: string; };

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const authEndpoint = useCallback(async () => {
    const endpoint = "/api/liveblocks-auth";
    const room = params.documentId as string;

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ room }),
    });

    return await response.json();
  }, [params.documentId]);

  const resolveUsers = useCallback(({ userIds }: { userIds: string[] }) => {
    return userIds.map(
      (userId) => users.find((user) => user.id === userId) ?? undefined
    )
  }, [users]);

  const resolveMentionSuggestions = useCallback(({ text }: { text: string }) => {
    let filteredUsers = users;

    if (text) {
      filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    return filteredUsers.map((user) => user.id);
  }, [users]);

  const resolveRoomsInfo = useCallback(async ({ roomIds }: { roomIds: string[] }) => {
    const documents = await getDocuments(roomIds as Id<"documents">[]);
    return documents.map((document) => ({
      id: document.id,
      name: document.name,
    }));
  }, []);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={authEndpoint}
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
      resolveRoomsInfo={resolveRoomsInfo}
    >
      <RoomProvider
        id={params.documentId as string}
        initialPresence={{ cursor: null }}
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT,
          layers: new LiveMap<string, LiveObject<Layer>>([]),
          layerIds: new LiveList<string>([]),
          todos: new LiveList<LiveObject<Todo>>([]),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodes: new LiveList<any>([]),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          edges: new LiveList<any>([]),
          spreadsheet: new LiveList([]),
          columnSizes: new LiveMap<string, number>([]),
          rowSizes: new LiveMap<string, number>([]),
          rowHeaderWidth: 40,
          columnHeaderHeight: 32,
        }}
      >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider >
  );
}