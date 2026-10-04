"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, FileText } from "lucide-react";

interface SpeakerNotesProps {
  notes?: string;
  onChangeNotes: (notes: string) => void;
}

export const SpeakerNotes: React.FC<SpeakerNotesProps> = ({
  notes = "",
  onChangeNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-border bg-white dark:bg-slate-900 transition-all select-none">
      {/* Bar toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-muted-foreground font-medium"
      >
        <div className="flex items-center gap-1.5">
          <FileText className="size-3.5 text-orange-600" />
          <span>Speaker Notes</span>
          {notes && (
            <span className="size-1.5 rounded-full bg-orange-500" title="Has notes" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] opacity-70">
            {isExpanded ? "Collapse" : "Click to add speaker notes"}
          </span>
          {isExpanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronUp className="size-3.5" />
          )}
        </div>
      </div>

      {/* Expanded Textarea */}
      {isExpanded && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-border">
          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Type speaker notes here. These notes are visible during presentation prep..."
            className="w-full h-20 p-2.5 text-xs bg-white dark:bg-slate-900 border border-border rounded-md outline-none focus:ring-1 focus:ring-orange-500 resize-none font-sans leading-relaxed text-foreground"
          />
        </div>
      )}
    </div>
  );
};
