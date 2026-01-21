"use client";
import { useState } from "react";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { Whiteboard } from "./whiteboard";
import { TodoList } from "./todo-list";
import { api } from "../../../../convex/_generated/api";
import dynamic from "next/dynamic";

const Flowchart = dynamic(() => import("./flowchart").then(mod => mod.Flowchart), { ssr: false });
const SpreadsheetComponent = dynamic(() => import("./spreadsheet").then(mod => mod.SpreadsheetComponent), { ssr: false });

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
};

export const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);
  const [activeView, setActiveView] = useState<"document" | "whiteboard" | "todo" | "flowchart" | "spreadsheet">(document.type === "spreadsheet" ? "spreadsheet" : "document");

  return (
    <Room>
      <div className="min-h-screen bg-[#FAFBFD]">
        <div className="felx flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} activeView={activeView} setActiveView={setActiveView} />
          <div className={activeView === "document" ? "block" : "hidden"}>
            <Toolbar />
          </div>
        </div>
        <div className="pt-[114px] print:pt-0">
          <div className={activeView === "document" ? "block" : "hidden"}>
            <Editor initialContent={document.initialContent} />
          </div>
          {activeView === "whiteboard" && (
            <div className="fixed top-[114px] left-0 right-0 bottom-0 z-0 h-[calc(100vh-114px)]">
              <Whiteboard />
            </div>
          )}
          {activeView === "todo" && (
            <div className="fixed top-[114px] left-0 right-0 bottom-0 z-0 h-[calc(100vh-114px)]">
              <TodoList />
            </div>
          )}
          {activeView === "flowchart" && (
            <div className="fixed top-[114px] left-0 right-0 bottom-0 z-0 h-[calc(100vh-114px)]">
              <Flowchart />
            </div>
          )}
          {activeView === "spreadsheet" && (
            <div className="fixed top-[114px] left-0 right-0 bottom-0 z-0 h-[calc(100vh-114px)]">
              <SpreadsheetComponent />
            </div>
          )}
        </div>
      </div>
    </Room>
  );
};

