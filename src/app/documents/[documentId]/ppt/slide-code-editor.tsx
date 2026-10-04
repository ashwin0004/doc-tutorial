"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RotateCcw, Code2 } from "lucide-react";
import { toast } from "sonner";

interface SlideCodeEditorProps {
  html: string;
  onChange: (html: string) => void;
}

export const SlideCodeEditor: React.FC<SlideCodeEditorProps> = ({ html, onChange }) => {
  const [code, setCode] = useState(html);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(html);
  }, [html]);

  const handleApply = () => {
    onChange(code);
    toast.success("Slide code updated!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("HTML copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(html);
    toast.info("Code reset to saved version");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-slate-200 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Code2 className="size-4 text-orange-400" />
          <span>slide-template.html</span>
          <span className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">1280x720 16:9</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-700"
          >
            {copied ? <Check className="size-3.5 mr-1 text-emerald-400" /> : <Copy className="size-3.5 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white font-medium"
          >
            Apply Code Changes
          </Button>
        </div>
      </div>

      {/* Code Textarea with line numbers feeling */}
      <div className="relative flex-1 flex overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-4 font-mono text-sm bg-transparent text-emerald-400 resize-none outline-none leading-relaxed selection:bg-orange-500/30"
          placeholder="<!-- Slide HTML and inline CSS -->"
        />
      </div>
    </div>
  );
};
