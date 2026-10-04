"use client";

import React from "react";
import { SlideData } from "./types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
} from "lucide-react";

interface SlideSidebarProps {
  slides: SlideData[];
  activeSlideId: string;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (id: string) => void;
  onDeleteSlide: (id: string) => void;
  onMoveSlide: (index: number, direction: "up" | "down") => void;
}

export const SlideSidebar: React.FC<SlideSidebarProps> = ({
  slides,
  activeSlideId,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  return (
    <aside className="w-56 shrink-0 bg-slate-50 dark:bg-slate-900/50 border-r border-border flex flex-col h-full select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-white dark:bg-slate-900">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="size-3.5 text-orange-600" />
          Slides ({slides.length})
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={onAddSlide}
          className="size-7 hover:bg-orange-50 hover:text-orange-600"
          title="Add Slide"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId;

          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(slide.id)}
              className="group relative flex items-start gap-2 cursor-pointer"
            >
              {/* Slide Number Badge */}
              <span
                className={`text-[11px] font-mono mt-1 font-semibold w-4 text-right shrink-0 ${
                  isActive ? "text-orange-600 font-bold" : "text-slate-400"
                }`}
              >
                {index + 1}
              </span>

              {/* Thumbnail Container */}
              <div
                className={`relative flex-1 aspect-video rounded-md border-2 overflow-hidden transition-all bg-white dark:bg-slate-800 shadow-xs ${
                  isActive
                    ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-[1.02]"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                }`}
              >
                {/* Mini Sandboxed Preview */}
                <iframe
                  srcDoc={slide.html}
                  title={`Thumbnail ${index + 1}`}
                  className="pointer-events-none w-[1280px] h-[720px] origin-top-left border-0"
                  style={{
                    transform: "scale(0.13)", // Scaled down to fit ~160px width
                  }}
                  sandbox="allow-same-origin"
                />

                {/* Overlay hover menu */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded bg-black/60 hover:bg-black/80 text-white shadow-xs"
                      >
                        <MoreVertical className="size-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 text-xs">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateSlide(slide.id);
                        }}
                      >
                        <Copy className="size-3.5 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSlide(index, "up");
                        }}
                      >
                        <ArrowUp className="size-3.5 mr-2" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === slides.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSlide(index, "down");
                        }}
                      >
                        <ArrowDown className="size-3.5 mr-2" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={slides.length <= 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSlide(slide.id);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Delete Slide
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slide Bottom Button */}
      <div className="p-3 border-t border-border bg-white dark:bg-slate-900">
        <Button
          size="sm"
          variant="outline"
          onClick={onAddSlide}
          className="w-full text-xs font-semibold gap-1.5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
        >
          <Plus className="size-3.5" />
          Add Slide
        </Button>
      </div>
    </aside>
  );
};
