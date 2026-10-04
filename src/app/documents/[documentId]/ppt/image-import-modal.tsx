"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link2, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

interface ImageImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (snippet: string) => void;
}

const STOCK_PRESETS = [
  {
    title: "AI & Neural Tech",
    category: "Technology",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Global Collaboration",
    category: "Business",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Modern Architecture",
    category: "Creative",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Vibrant Gradient",
    category: "Abstract",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Data Analytics Screen",
    category: "Charts",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Minimalist Workspace",
    category: "Productivity",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  },
];

export const ImageImportModal: React.FC<ImageImportModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const [imageCaption, setImageCaption] = useState<string>("");
  const [widthPreset, setWidthPreset] = useState<"compact" | "medium" | "large" | "full">("medium");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, SVG, WebP, GIF)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file is too large (max 8MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImageSrc(result);
        if (!imageCaption) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          setImageCaption(nameWithoutExt);
        }
        toast.success("Image imported from your device!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInsert = () => {
    if (!selectedImageSrc) {
      toast.error("Please choose or upload an image first");
      return;
    }

    let maxWidth = "480px";
    if (widthPreset === "compact") maxWidth = "320px";
    else if (widthPreset === "medium") maxWidth = "500px";
    else if (widthPreset === "large") maxWidth = "720px";
    else if (widthPreset === "full") maxWidth = "1000px";

    const captionHtml = imageCaption
      ? `<div style="font-size: 13px; opacity: 0.75; margin-top: 8px; font-style: italic; text-align: center;">${imageCaption}</div>`
      : "";

    const snippet = `
      <div class="ppt-image-card" style="position: relative; max-width: ${maxWidth}; margin: 16px auto; width: 100%;">
        <div style="border-radius: 14px; overflow: hidden; box-shadow: 0 14px 35px rgba(0,0,0,0.22); border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.2);">
          <img src="${selectedImageSrc}" alt="${imageCaption || "Slide visual"}" style="width: 100%; height: auto; display: block; object-fit: cover;" />
        </div>
        ${captionHtml}
      </div>
    `;

    onInsertImage(snippet);
    setSelectedImageSrc("");
    setImageCaption("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="size-5 text-orange-600" />
            Import & Insert Image
          </DialogTitle>
          <DialogDescription className="text-xs">
            Import images from your computer, paste a web link, or choose from our curated stock collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "url" | "presets")}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="upload" className="text-xs flex items-center gap-1.5">
                <Upload className="size-3.5" />
                Upload from PC
              </TabsTrigger>
              <TabsTrigger value="url" className="text-xs flex items-center gap-1.5">
                <Link2 className="size-3.5" />
                Web Image URL
              </TabsTrigger>
              <TabsTrigger value="presets" className="text-xs flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Stock Visuals
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: LOCAL FILE UPLOAD */}
            <TabsContent value="upload" className="space-y-3 pt-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                    : "border-border hover:border-orange-500/70 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mb-3 shadow-xs">
                  <Upload className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">Click to browse or drag & drop image here</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, JPEG, SVG, WebP, and GIF (up to 8MB)
                </p>
                <div className="mt-3 text-[11px] font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/40">
                  Embeds offline directly into slide HTML
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: URL IMPORT */}
            <TabsContent value="url" className="space-y-3 pt-3">
              <div>
                <Label className="text-xs font-semibold">Image URL Link</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={selectedImageSrc}
                    onChange={(e) => setSelectedImageSrc(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                  {selectedImageSrc && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedImageSrc("")}
                      className="h-9 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: CURATED STOCK VISUALS */}
            <TabsContent value="presets" className="pt-3">
              <div className="grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                {STOCK_PRESETS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageSrc(item.url);
                      setImageCaption(item.title);
                    }}
                    className={`group relative rounded-lg overflow-hidden border text-left transition-all aspect-video ${
                      selectedImageSrc === item.url
                        ? "border-orange-500 ring-2 ring-orange-500/30"
                        : "border-border hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-[10px] font-bold truncate">{item.title}</span>
                      <span className="text-[9px] opacity-75">{item.category}</span>
                    </div>
                    {selectedImageSrc === item.url && (
                      <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* PREVIEW & FORMATTING OPTIONS */}
          {selectedImageSrc && (
            <div className="border border-border rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-16 rounded-md overflow-hidden border border-border shrink-0 bg-black/10">
                  <img
                    src={selectedImageSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <Label className="text-[11px] font-semibold">Image Caption (Optional)</Label>
                    <Input
                      placeholder="e.g. AI Workflow architecture diagram"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      className="h-7 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Size preset pills */}
              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-xs text-muted-foreground font-medium">Display Width:</span>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded text-xs">
                  <button
                    type="button"
                    onClick={() => setWidthPreset("compact")}
                    className={`px-2 py-0.5 rounded font-medium ${widthPreset === "compact" ? "bg-white dark:bg-slate-800 shadow-xs text-orange-600" : "text-muted-foreground"}`}
                  >
                    Compact (320px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWidthPreset("medium")}
                    className={`px-2 py-0.5 rounded font-medium ${widthPreset === "medium" ? "bg-white dark:bg-slate-800 shadow-xs text-orange-600" : "text-muted-foreground"}`}
                  >
                    Medium (500px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWidthPreset("large")}
                    className={`px-2 py-0.5 rounded font-medium ${widthPreset === "large" ? "bg-white dark:bg-slate-800 shadow-xs text-orange-600" : "text-muted-foreground"}`}
                  >
                    Large (720px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWidthPreset("full")}
                    className={`px-2 py-0.5 rounded font-medium ${widthPreset === "full" ? "bg-white dark:bg-slate-800 shadow-xs text-orange-600" : "text-muted-foreground"}`}
                  >
                    Wide Banner
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-3 border-t">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selectedImageSrc}
            onClick={handleInsert}
            className="h-8 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
          >
            <ImageIcon className="size-3.5" />
            Insert Image to Slide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
