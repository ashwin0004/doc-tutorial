"use client";

import React, { useState } from "react";
import { SlideTheme, SlideAnimationType } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Play, Check, RotateCcw } from "lucide-react";

interface CustomDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomTheme: (theme: SlideTheme, applyToAll: boolean) => void;
  initialTheme?: SlideTheme;
}

const FONT_OPTIONS = [
  { label: "Inter (Modern Sans)", value: "'Inter', system-ui, -apple-system, sans-serif" },
  { label: "Outfit (Tech & Bold)", value: "'Outfit', sans-serif" },
  { label: "Roboto (Clean Crisp)", value: "'Roboto', sans-serif" },
  { label: "Playfair Display (Elegant Serif)", value: "'Playfair Display', Georgia, serif" },
  { label: "Montserrat (Geometric)", value: "'Montserrat', sans-serif" },
  { label: "Poppins (Friendly)", value: "'Poppins', sans-serif" },
  { label: "Fira Code (Developer)", value: "'Fira Code', monospace" },
];

const ANIMATION_OPTIONS: { label: string; value: SlideAnimationType }[] = [
  { label: "Smooth Fade (Default)", value: "fade" },
  { label: "Slide Up", value: "slide-up" },
  { label: "Slide Down", value: "slide-down" },
  { label: "Slide Left", value: "slide-left" },
  { label: "Zoom In", value: "zoom" },
  { label: "3D Perspective Flip", value: "flip" },
  { label: "Swirl & Scale", value: "swirl" },
  { label: "Cinematic Blur", value: "blur" },
  { label: "Pop Bounce", value: "bounce" },
  { label: "Curtain Wipe", value: "wipe" },
  { label: "None (Instant)", value: "none" },
];

export const CustomDesignModal: React.FC<CustomDesignModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomTheme,
  initialTheme,
}) => {
  const [themeName, setThemeName] = useState(initialTheme?.name || "My Custom Design");
  const [bgType, setBgType] = useState<"gradient" | "solid">("gradient");
  const [color1, setColor1] = useState("#0f172a");
  const [color2, setColor2] = useState("#311042");
  const [gradientAngle] = useState(135);
  const [textColor, setTextColor] = useState("#f8fafc");
  const [accentColor, setAccentColor] = useState("#ec4899");
  const [cardBg] = useState("rgba(255, 255, 255, 0.08)");
  const [borderColor, setBorderColor] = useState("rgba(236, 72, 153, 0.25)");
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [animation, setAnimation] = useState<SlideAnimationType>("slide-up");
  const [duration, setDuration] = useState(initialTheme?.animationDuration || "0.5s");
  const [replayKey, setReplayKey] = useState(0);

  const computedGradient =
    bgType === "solid"
      ? color1
      : `linear-gradient(${gradientAngle}deg, ${color1} 0%, ${color2} 100%)`;

  const handleApply = (applyToAll: boolean) => {
    const customTheme: SlideTheme = {
      id: `custom-${Date.now()}`,
      name: themeName || "Custom Design",
      gradient: computedGradient,
      background: color1,
      textColor,
      accentColor,
      cardBg,
      borderColor,
      fontFamily,
      animation,
      animationDuration: duration,
      isCustom: true,
    };

    onApplyCustomTheme(customTheme, applyToAll);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Palette className="size-5 text-orange-500" />
            Custom Design & Animation Creator
          </DialogTitle>
          <DialogDescription>
            Craft a bespoke presentation design with personalized gradients, typography, accents, and slide transitions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold">Design Name</Label>
              <Input
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="e.g. Modern Velocity"
                className="mt-1 h-8 text-xs"
              />
            </div>

            {/* Background Style */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Background Type</Label>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded text-[11px]">
                  <button
                    type="button"
                    onClick={() => setBgType("gradient")}
                    className={`px-2 py-0.5 rounded font-medium ${bgType === "gradient" ? "bg-white dark:bg-slate-800 shadow-xs text-primary" : "text-muted-foreground"}`}
                  >
                    Gradient
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgType("solid")}
                    className={`px-2 py-0.5 rounded font-medium ${bgType === "solid" ? "bg-white dark:bg-slate-800 shadow-xs text-primary" : "text-muted-foreground"}`}
                  >
                    Solid
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Primary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="size-8 rounded cursor-pointer border border-border"
                    />
                    <Input
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                {bgType === "gradient" && (
                  <div>
                    <Label className="text-[11px] text-muted-foreground">Secondary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="size-8 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Typography & Accent */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] text-muted-foreground">Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="size-8 rounded cursor-pointer border border-border"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] text-muted-foreground">Accent Highlight</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      setBorderColor(`${e.target.value}40`);
                    }}
                    className="size-8 rounded cursor-pointer border border-border"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <Label className="text-xs font-semibold">Font Family</Label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full mt-1 h-8 text-xs rounded-md border border-input bg-transparent px-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Slide Transition Animation & Timing */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Play className="size-3.5 text-orange-500" />
                  Transition
                </Label>
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value as SlideAnimationType)}
                  className="w-full mt-1 h-8 text-xs rounded-md border border-input bg-transparent px-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {ANIMATION_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  Timing / Speed
                </Label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full mt-1 h-8 text-xs rounded-md border border-input bg-transparent px-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="0.3s">0.3s (Fast)</option>
                  <option value="0.5s">0.5s (Normal)</option>
                  <option value="0.8s">0.8s (Smooth)</option>
                  <option value="1.2s">1.2s (Slow)</option>
                  <option value="1.5s">1.5s (Cinematic)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live 16:9 Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold">Live Design Preview</Label>
              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Replay slide animation"
              >
                <RotateCcw className="size-3" />
                Replay Animation
              </button>
            </div>

            <style>{`
              @keyframes pptModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes pptModalSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes pptModalSlideDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes pptModalSlideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
              @keyframes pptModalZoomIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
              @keyframes pptModalFlipIn { from { opacity: 0; transform: perspective(800px) rotateX(15deg); } to { opacity: 1; transform: perspective(800px) rotateX(0deg); } }
              @keyframes pptModalSwirl { from { opacity: 0; transform: scale(0.85) rotate(-6deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
              @keyframes pptModalBlur { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0px); } }
              @keyframes pptModalBounce { 0% { opacity: 0; transform: scale(0.8); } 60% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); } }
              @keyframes pptModalWipeIn { from { clip-path: inset(0 100% 0 0); opacity: 0.4; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
            `}</style>

            <div
              key={`${animation}-${duration}-${replayKey}`}
              className="relative aspect-video rounded-xl border border-border overflow-hidden p-6 flex flex-col justify-between shadow-lg"
              style={{
                background: computedGradient,
                color: textColor,
                fontFamily,
                animation:
                  animation === "fade"
                    ? `pptModalFadeIn ${duration} ease-out both`
                    : animation === "slide-up"
                    ? `pptModalSlideUp ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`
                    : animation === "slide-down"
                    ? `pptModalSlideDown ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`
                    : animation === "slide-left"
                    ? `pptModalSlideLeft ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`
                    : animation === "zoom"
                    ? `pptModalZoomIn ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`
                    : animation === "flip"
                    ? `pptModalFlipIn ${duration} ease-out both`
                    : animation === "swirl"
                    ? `pptModalSwirl ${duration} cubic-bezier(0.16, 1, 0.3, 1) both`
                    : animation === "blur"
                    ? `pptModalBlur ${duration} ease-out both`
                    : animation === "bounce"
                    ? `pptModalBounce ${duration} cubic-bezier(0.34, 1.56, 0.64, 1) both`
                    : animation === "wipe"
                    ? `pptModalWipeIn ${duration} ease-out both`
                    : "none",
              }}
            >
              <div>
                <div
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    color: accentColor,
                  }}
                >
                  Custom Design
                </div>
                <h4 className="text-lg font-bold leading-tight">
                  High-Impact <span style={{ color: accentColor }}>Presentation</span>
                </h4>
                <p className="text-xs opacity-80 mt-1 line-clamp-2">
                  Real-time previews showing your custom gradient, glass cards, and fonts.
                </p>
              </div>

              <div
                className="rounded-lg p-3 backdrop-blur-md"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Active Transition:</span>
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                  >
                    {animation}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center justify-between text-[10px] opacity-60 border-t pt-2"
                style={{ borderColor }}
              >
                <span>{themeName}</span>
                <span>16:9 Widescreen</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-3">
              This custom style will be encoded into your slide templates with automatic typography and layout hierarchy.
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApply(false)}
              className="h-8 text-xs"
            >
              Apply to Current Slide
            </Button>
            <Button
              size="sm"
              onClick={() => handleApply(true)}
              className="h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white font-semibold gap-1.5"
            >
              <Check className="size-3.5" />
              Apply to All Slides
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
