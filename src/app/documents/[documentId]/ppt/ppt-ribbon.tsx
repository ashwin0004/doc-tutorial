"use client";

import React, { useState } from "react";
import { RibbonTab, SlideLayoutType, SlideTheme, SlideAnimationType } from "./types";
import { SLIDE_THEMES } from "./slide-templates";
import { SelectedElementStyle } from "./slide-iframe";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Play,
  Sparkles,
  Type,
  LayoutTemplate,
  Palette,
  Undo2,
  Redo2,
  Columns,
  BarChart3,
  Quote,
  Square,
  Circle,
  FileCode,
  Download,
  Printer,
  Grid3X3,
  Layers,
  BotMessageSquare,
  Eye,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Copy,
  Clock,
  Image as ImageIcon,
  Table as TableIcon,
  AArrowDown,
  AArrowUp,
  Baseline,
  PaintBucket,
  BringToFront,
  SendToBack,
  Diamond,
  Triangle,
  ArrowRight,
  Star,
  Shapes,
} from "lucide-react";
import { InsertElementType } from "./types";

interface PptRibbonProps {
  activeTab: RibbonTab;
  setActiveTab: (tab: RibbonTab) => void;
  onNewSlide: (layout?: SlideLayoutType) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onInsertElement: (type: InsertElementType | string) => void;
  onApplyTheme: (themeId: string, applyToAll?: boolean) => void;
  currentThemeId: string;
  onOpenCustomDesign?: () => void;
  themes?: SlideTheme[];
  currentAnimation?: SlideAnimationType;
  onChangeAnimation?: (anim: SlideAnimationType) => void;
  currentAnimationDuration?: string;
  onChangeAnimationDuration?: (duration: string) => void;
  onOpenImageModal?: () => void;
  onStartPresent: () => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  activeViewMode: "slide" | "code";
  setActiveViewMode: (mode: "slide" | "code") => void;
  onExportHtml: () => void;
  onPrintPdf: () => void;
  selectionStyle: SelectedElementStyle | null;
  onFormat: (command: string, value?: string) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
}

const FONT_FAMILIES = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Courier", value: "'Courier Prime', monospace" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
];

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

export const PptRibbon: React.FC<PptRibbonProps> = ({
  activeTab,
  setActiveTab,
  onNewSlide,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onInsertElement,
  onApplyTheme,
  currentThemeId,
  onOpenCustomDesign,
  themes,
  currentAnimation,
  onChangeAnimation,
  currentAnimationDuration = "0.5s",
  onChangeAnimationDuration,
  onOpenImageModal,
  onStartPresent,
  onToggleAiChat,
  isAiChatOpen,
  activeViewMode,
  setActiveViewMode,
  onExportHtml,
  onPrintPdf,
  selectionStyle,
  onFormat,
  onDeleteSelected,
  onDuplicateSelected,
  onBringForward,
  onSendBackward,
}) => {
  const [selectedColor, setSelectedColor] = useState("#f97316");
  const [fillColor, setFillColor] = useState("#f97316");
  const [borderColor, setBorderColor] = useState("#f97316");

  const hasSelection = Boolean(selectionStyle?.hasSelection);

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border-b border-border shadow-xs select-none">
      {/* Top Tab Bar (PowerPoint style) */}
      <div className="flex items-center justify-between px-3 pt-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition-colors ${
              activeTab === "home"
                ? "bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("insert")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition-colors ${
              activeTab === "insert"
                ? "bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Insert
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition-colors ${
              activeTab === "design"
                ? "bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Design & Themes
          </button>
          <button
            onClick={() => setActiveTab("present")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition-colors ${
              activeTab === "present"
                ? "bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Slide Show
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition-colors flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 border-b-2 border-orange-600"
                : "text-orange-600/80 hover:text-orange-600 font-medium"
            }`}
          >
            <Sparkles className="size-3 text-orange-500 animate-pulse" />
            AI Assistant
          </button>
        </div>

        {/* Right Quick Actions: Mode View, Present & AI Drawer */}
        <div className="flex items-center gap-2 pb-1">
          {/* Slide View vs Code View Switcher (from GitHub repo) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs">
            <button
              onClick={() => setActiveViewMode("slide")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                activeViewMode === "slide"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Eye className="size-3.5" />
              Slide
            </button>
            <button
              onClick={() => setActiveViewMode("code")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                activeViewMode === "code"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <FileCode className="size-3.5" />
              Code
            </button>
          </div>

          {/* Fullscreen Presentation Mode Button */}
          <Button
            size="sm"
            onClick={onStartPresent}
            className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white font-medium flex items-center gap-1 shadow-xs"
          >
            <Play className="size-3 fill-current" />
            Present
          </Button>

          {/* AI Toggle Button */}
          <Button
            size="sm"
            variant={isAiChatOpen ? "secondary" : "outline"}
            onClick={onToggleAiChat}
            className={`h-7 text-xs flex items-center gap-1.5 ${
              isAiChatOpen ? "bg-orange-100 dark:bg-orange-950/60 text-orange-700 border-orange-300" : ""
            }`}
          >
            <BotMessageSquare className="size-3.5 text-orange-600" />
            AI Chat
          </Button>
        </div>
      </div>

      {/* Tab Specific Ribbon Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 min-h-[46px] bg-slate-50/80 dark:bg-slate-900/60 overflow-x-auto">
        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="flex items-center gap-1.5 flex-nowrap">
            {/* New Slide Layouts Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1 bg-white dark:bg-slate-800">
                  <Plus className="size-3.5 text-orange-600" />
                  New Slide
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs">Slide Layouts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNewSlide("title")}>
                  <LayoutTemplate className="size-4 mr-2 text-blue-500" />
                  Title Slide
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("title-content")}>
                  <Layers className="size-4 mr-2 text-indigo-500" />
                  Title & Content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("two-column")}>
                  <Columns className="size-4 mr-2 text-emerald-500" />
                  Two Columns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("features")}>
                  <Grid3X3 className="size-4 mr-2 text-amber-500" />
                  3 Feature Cards
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("stats")}>
                  <BarChart3 className="size-4 mr-2 text-rose-500" />
                  Stats & Metrics Grid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("comparison")}>
                  <Columns className="size-4 mr-2 text-purple-500" />
                  Comparison Table
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("quote")}>
                  <Quote className="size-4 mr-2 text-teal-500" />
                  Quote / Keynote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewSlide("blank")}>
                  <Square className="size-4 mr-2 text-slate-400" />
                  Blank Slide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                disabled={!canUndo}
                onClick={onUndo}
                className="size-7"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                disabled={!canRedo}
                onClick={onRedo}
                className="size-7"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="size-3.5" />
              </Button>
            </div>

            <div className="h-5 w-[1px] bg-border mx-1" />

            {/* Font Family selector */}
            <select
              value={selectionStyle?.fontFamily || "'Inter', sans-serif"}
              onChange={(e) => onFormat("fontFamily", e.target.value)}
              className="h-8 px-2 text-xs rounded border border-border bg-white dark:bg-slate-800 text-foreground outline-none"
              title="Font Family"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Font Size decrease / increase */}
            <div className="flex items-center border border-border rounded bg-white dark:bg-slate-800">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("fontSizeDelta", "-2")}
                className="size-7 rounded-none"
                title="Decrease Font Size"
              >
                <AArrowDown className="size-3.5" />
              </Button>
              <span className="text-xs font-mono px-1.5 min-w-[28px] text-center">
                {selectionStyle?.fontSize ? parseInt(selectionStyle.fontSize, 10) : 18}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("fontSizeDelta", "2")}
                className="size-7 rounded-none"
                title="Increase Font Size"
              >
                <AArrowUp className="size-3.5" />
              </Button>
            </div>

            {/* Bold / Italic / Underline */}
            <div className="flex items-center border border-border rounded bg-white dark:bg-slate-800">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("bold")}
                className={`size-7 rounded-none ${selectionStyle?.isBold ? "bg-orange-100 text-orange-600 font-bold" : ""}`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("italic")}
                className={`size-7 rounded-none ${selectionStyle?.isItalic ? "bg-orange-100 text-orange-600 italic" : ""}`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("underline")}
                className={`size-7 rounded-none ${selectionStyle?.isUnderline ? "bg-orange-100 text-orange-600 underline" : ""}`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="size-3.5" />
              </Button>
            </div>

            {/* Text Color Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="size-8 bg-white dark:bg-slate-800" title="Text Color">
                  <div className="flex flex-col items-center">
                    <Baseline className="size-3.5" />
                    <span className="w-3.5 h-1 mt-0.5 rounded-full" style={{ backgroundColor: selectedColor }} />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-48">
                <DropdownMenuLabel className="text-xs">Theme Colors</DropdownMenuLabel>
                <div className="grid grid-cols-6 gap-1 p-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedColor(c);
                        onFormat("color", c);
                      }}
                      className="size-5 rounded-full border border-black/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Alignment Group */}
            <div className="flex items-center border border-border rounded bg-white dark:bg-slate-800">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("textAlign", "left")}
                className={`size-7 rounded-none ${selectionStyle?.textAlign === "left" ? "bg-slate-200 text-foreground" : ""}`}
                title="Align Left"
              >
                <AlignLeft className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("textAlign", "center")}
                className={`size-7 rounded-none ${selectionStyle?.textAlign === "center" ? "bg-slate-200 text-foreground" : ""}`}
                title="Align Center"
              >
                <AlignCenter className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("textAlign", "right")}
                className={`size-7 rounded-none ${selectionStyle?.textAlign === "right" ? "bg-slate-200 text-foreground" : ""}`}
                title="Align Right"
              >
                <AlignRight className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onFormat("textAlign", "justify")}
                className={`size-7 rounded-none ${selectionStyle?.textAlign === "justify" ? "bg-slate-200 text-foreground" : ""}`}
                title="Justify"
              >
                <AlignJustify className="size-3.5" />
              </Button>
            </div>

            <div className="h-5 w-[1px] bg-border mx-1" />

            {/* Shape Fill Color Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 px-2 text-xs gap-1.5 bg-white dark:bg-slate-800" title="Shape Fill Color">
                  <PaintBucket className="size-3.5 text-amber-500" />
                  <span className="w-3.5 h-3.5 rounded-sm border border-black/20" style={{ backgroundColor: fillColor }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-48">
                <DropdownMenuLabel className="text-xs">Fill Color</DropdownMenuLabel>
                <div className="grid grid-cols-6 gap-1 p-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setFillColor(c);
                        onFormat("fillColor", c);
                      }}
                      className="size-5 rounded-full border border-black/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    onClick={() => {
                      setFillColor("transparent");
                      onFormat("fillColor", "transparent");
                    }}
                    className="col-span-6 mt-1 text-[11px] py-1 border border-dashed rounded text-center hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    No Fill (Transparent)
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shape Border Color Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 px-2 text-xs gap-1.5 bg-white dark:bg-slate-800" title="Shape Outline & Border">
                  <Square className="size-3.5 text-indigo-500" />
                  <span className="w-3.5 h-3.5 rounded-sm border-2" style={{ borderColor: borderColor }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-48">
                <DropdownMenuLabel className="text-xs">Border Color</DropdownMenuLabel>
                <div className="grid grid-cols-6 gap-1 p-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setBorderColor(c);
                        onFormat("borderColor", c);
                      }}
                      className="size-5 rounded-full border border-black/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Border Width</DropdownMenuLabel>
                <div className="flex items-center gap-1 p-1">
                  {["1px", "2px", "4px", "6px"].map((w) => (
                    <Button
                      key={w}
                      size="sm"
                      variant="ghost"
                      onClick={() => onFormat("borderWidth", w)}
                      className="h-6 px-1.5 text-[11px] font-mono"
                    >
                      {w}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Layering: Bring Forward / Send Backward */}
            <div className="flex items-center border border-border rounded bg-white dark:bg-slate-800">
              <Button
                size="icon"
                variant="ghost"
                disabled={!hasSelection}
                onClick={onBringForward || (() => onFormat("zIndex", "forward"))}
                className="size-7 rounded-none"
                title="Bring Forward"
              >
                <BringToFront className="size-3.5 text-blue-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                disabled={!hasSelection}
                onClick={onSendBackward || (() => onFormat("zIndex", "backward"))}
                className="size-7 rounded-none"
                title="Send Backward"
              >
                <SendToBack className="size-3.5 text-blue-500" />
              </Button>
            </div>

            <div className="h-5 w-[1px] bg-border mx-1" />

            {/* Shapes Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800 font-medium">
                  <Shapes className="size-3.5 text-orange-500" />
                  Shapes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2">
                <DropdownMenuLabel className="text-xs">Insert Shape</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onInsertElement("rect")} className="gap-2 text-xs cursor-pointer">
                  <Square className="size-4 text-orange-500" />
                  Rectangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("rounded-rect")} className="gap-2 text-xs cursor-pointer">
                  <Square className="size-4 text-emerald-500 rounded-sm" />
                  Rounded Rectangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("circle")} className="gap-2 text-xs cursor-pointer">
                  <Circle className="size-4 text-blue-500" />
                  Circle / Ellipse
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("diamond")} className="gap-2 text-xs cursor-pointer">
                  <Diamond className="size-4 text-purple-500" />
                  Diamond
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("triangle")} className="gap-2 text-xs cursor-pointer">
                  <Triangle className="size-4 text-amber-500" />
                  Triangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("arrow")} className="gap-2 text-xs cursor-pointer">
                  <ArrowRight className="size-4 text-rose-500" />
                  Arrow
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("star")} className="gap-2 text-xs cursor-pointer">
                  <Star className="size-4 text-yellow-500" />
                  Star
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Insert Fast Elements */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onInsertElement("textbox")}
              className="h-8 text-xs gap-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Type className="size-3.5 text-blue-500" />
              Text Box
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onInsertElement("card")}
              className="h-8 text-xs gap-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Square className="size-3.5 text-amber-500" />
              Card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onInsertElement("stats")}
              className="h-8 text-xs gap-1 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <BarChart3 className="size-3.5 text-rose-500" />
              Stat
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onOpenImageModal || (() => onInsertElement("image"))}
              className="h-8 text-xs gap-1 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Insert Image (Upload from PC or Web)"
            >
              <ImageIcon className="size-3.5 text-emerald-500" />
              Image
            </Button>

            <div className="h-5 w-[1px] bg-border mx-1" />

            {/* Element Actions: Duplicate & Delete */}
            <Button
              size="icon"
              variant="ghost"
              disabled={!hasSelection}
              onClick={onDuplicateSelected}
              className="size-8"
              title="Duplicate Selected Element"
            >
              <Copy className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={!hasSelection}
              onClick={onDeleteSelected}
              className="size-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              title="Delete Selected Element (Del)"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}

        {/* INSERT TAB */}
        {activeTab === "insert" && (
          <div className="flex items-center gap-1.5 flex-nowrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("textbox")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Type className="size-3.5 text-blue-500" />
              Text Box
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("rect")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800 font-medium"
            >
              <Square className="size-3.5 text-orange-500" />
              Rectangle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("circle")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800 font-medium"
            >
              <Circle className="size-3.5 text-blue-500" />
              Circle
            </Button>

            {/* More Shapes Menu in Insert Tab */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1 bg-white dark:bg-slate-800">
                  <Shapes className="size-3.5 text-indigo-500" />
                  More Shapes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2">
                <DropdownMenuItem onClick={() => onInsertElement("rounded-rect")} className="gap-2 text-xs cursor-pointer">
                  <Square className="size-4 text-emerald-500 rounded-sm" />
                  Rounded Rectangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("diamond")} className="gap-2 text-xs cursor-pointer">
                  <Diamond className="size-4 text-purple-500" />
                  Diamond
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("triangle")} className="gap-2 text-xs cursor-pointer">
                  <Triangle className="size-4 text-amber-500" />
                  Triangle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("arrow")} className="gap-2 text-xs cursor-pointer">
                  <ArrowRight className="size-4 text-rose-500" />
                  Arrow
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertElement("star")} className="gap-2 text-xs cursor-pointer">
                  <Star className="size-4 text-yellow-500" />
                  Star
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("card")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Square className="size-3.5 text-amber-500" />
              Glass Card
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("stats")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <BarChart3 className="size-3.5 text-rose-500" />
              Metric Badge
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("quote")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Quote className="size-3.5 text-teal-500" />
              Quote Block
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenImageModal || (() => onInsertElement("image"))}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
              title="Upload from computer or paste web URL"
            >
              <ImageIcon className="size-3.5 text-emerald-500" />
              Insert Image
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("table")}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <TableIcon className="size-3.5 text-cyan-500" />
              Table
            </Button>
            <div className="h-5 w-[1px] bg-border mx-1" />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInsertElement("continuation")}
              className="h-8 text-xs gap-1.5 bg-orange-50/80 border-orange-300 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/30 dark:border-orange-900/50 dark:text-orange-400 font-semibold"
              title="If slide is full, continue to a new slide with top alignment"
            >
              <Plus className="size-3.5 text-orange-600" />
              Continue to Next Slide
            </Button>
          </div>
        )}

        {/* DESIGN & THEMES TAB */}
        {activeTab === "design" && (
          <div className="flex items-center gap-2.5 flex-nowrap shrink-0">
            {/* Custom Design Creator */}
            <Button
              size="sm"
              onClick={onOpenCustomDesign}
              className="h-8 px-3 text-xs font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-xs flex items-center gap-1.5 shrink-0 rounded-md"
            >
              <Sparkles className="size-3.5" />
              Custom Design
            </Button>

            <div className="h-5 w-[1px] bg-border shrink-0" />

            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium shrink-0">
              <Palette className="size-3.5" />
              Themes:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {(themes || SLIDE_THEMES).map((theme: SlideTheme) => (
                <button
                  key={theme.id}
                  onClick={() => onApplyTheme(theme.id, false)}
                  className={`flex items-center gap-1.5 px-2.5 h-8 rounded-md text-xs border font-medium transition-all shrink-0 ${
                    currentThemeId === theme.id
                      ? "border-orange-500 ring-2 ring-orange-500/20 bg-white dark:bg-slate-800 shadow-xs text-orange-600 font-semibold"
                      : "border-border hover:border-slate-400 bg-white dark:bg-slate-800 text-foreground"
                  }`}
                >
                  <span
                    className="size-3.5 rounded-full border border-black/10 shrink-0 shadow-xs"
                    style={{ background: theme.background }}
                  />
                  <span className="truncate max-w-[100px]">{theme.name}</span>
                </button>
              ))}
            </div>

            <div className="h-5 w-[1px] bg-border shrink-0" />

            {/* Slide Transition Animations */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium shrink-0">
                <Play className="size-3 text-orange-500" />
                Animation:
              </span>
              <select
                value={currentAnimation || "fade"}
                onChange={(e) => onChangeAnimation?.(e.target.value as SlideAnimationType)}
                className="h-8 text-xs rounded-md border border-input bg-white dark:bg-slate-800 px-2.5 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="fade">Fade In</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-down">Slide Down</option>
                <option value="slide-left">Slide Left</option>
                <option value="zoom">Zoom In</option>
                <option value="flip">3D Flip</option>
                <option value="swirl">Swirl & Scale</option>
                <option value="blur">Cinematic Blur</option>
                <option value="bounce">Pop Bounce</option>
                <option value="wipe">Curtain Wipe</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Slide Transition Timing / Speed */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium shrink-0">
                <Clock className="size-3 text-orange-500" />
                Timing:
              </span>
              <select
                value={currentAnimationDuration || "0.5s"}
                onChange={(e) => onChangeAnimationDuration?.(e.target.value)}
                className="h-8 text-xs rounded-md border border-input bg-white dark:bg-slate-800 px-2 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="0.3s">0.3s (Fast)</option>
                <option value="0.5s">0.5s (Normal)</option>
                <option value="0.8s">0.8s (Smooth)</option>
                <option value="1.2s">1.2s (Slow)</option>
                <option value="1.5s">1.5s (Cinematic)</option>
              </select>
            </div>

            <div className="h-5 w-[1px] bg-border shrink-0" />

            <Button
              size="sm"
              variant="outline"
              onClick={() => onApplyTheme(currentThemeId, true)}
              className="h-8 px-3 text-xs font-medium shrink-0 bg-white dark:bg-slate-800"
            >
              Apply to All Slides
            </Button>
          </div>
        )}

        {/* PRESENT TAB */}
        {activeTab === "present" && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onStartPresent}
              className="h-8 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
            >
              <Play className="size-3.5 fill-current" />
              Start Slideshow (F5)
            </Button>
            <div className="h-5 w-[1px] bg-border mx-1" />
            <Button
              size="sm"
              variant="outline"
              onClick={onExportHtml}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Download className="size-3.5 text-blue-500" />
              Export HTML Presentation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onPrintPdf}
              className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Printer className="size-3.5 text-emerald-500" />
              Print / Save as PDF
            </Button>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === "ai" && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onToggleAiChat}
              className="h-8 text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white gap-1.5"
            >
              <Sparkles className="size-3.5" />
              {isAiChatOpen ? "Close AI Assistant" : "Open AI Assistant"}
            </Button>
            <div className="h-5 w-[1px] bg-border mx-1" />
            <span className="text-xs text-muted-foreground">
              Tip: Ask AI to generate pitch decks, create comparison slides, or update slide metrics in real time!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
