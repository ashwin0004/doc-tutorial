"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SlideData } from "./types";
import { SLIDE_WIDTH, SLIDE_HEIGHT, getAnimationCss } from "./slide-templates";
import { ChevronLeft, ChevronRight, X, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideshowPresenterProps {
  slides: SlideData[];
  initialSlideIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const SlideshowPresenter: React.FC<SlideshowPresenterProps> = ({
  slides,
  initialSlideIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex]);

  const currentSlide = slides[currentIndex] || slides[0];

  // Auto-scale to fill fullscreen
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const availWidth = window.innerWidth;
    const availHeight = window.innerHeight;

    const scaleX = availWidth / SLIDE_WIDTH;
    const scaleY = availHeight / SLIDE_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  // Request Native Fullscreen
  const enterFullscreen = useCallback(async () => {
    const el = containerRef.current || document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((el as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (el as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
      } else if ((el as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (el as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  }, []);

  // Exit Native Fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Exit fullscreen error:", err);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
    };
    const isCurrentlyFullscreen = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
    if (isCurrentlyFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  // Enter native fullscreen automatically when presentation begins
  useEffect(() => {
    if (isOpen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [isOpen, enterFullscreen, exitFullscreen]);

  // Sync fullscreen state & auto-scale on resize/fullscreen change
  useEffect(() => {
    if (!isOpen) return;

    const handleFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      const active = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      setIsFullscreen(active);
      updateScale();
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", updateScale);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [isOpen, updateScale]);

  const handleExit = useCallback(() => {
    exitFullscreen();
    onClose();
  }, [exitFullscreen, onClose]);

  const goNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, slides.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown" || e.key === "Enter") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goNext, goPrev, handleExit]);

  // Controls auto-hide on mouse idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Enriched slide HTML with guaranteed transition keyframes and slide-container animations
  const injectedSlideHtml = useMemo(() => {
    if (!currentSlide?.html) return "";

    let cleanHtml = currentSlide.html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, "text/html");
      doc.querySelectorAll(".ppt-resize-handle").forEach((el) => el.remove());
      doc.querySelectorAll("[data-ppt-hover]").forEach((el) => el.removeAttribute("data-ppt-hover"));
      doc.querySelectorAll("[data-ppt-selected]").forEach((el) => el.removeAttribute("data-ppt-selected"));
      doc.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
      doc.querySelectorAll("#editor-interactive-styles").forEach((el) => el.remove());
      cleanHtml = "<!doctype html>\n" + doc.documentElement.outerHTML;
    } catch {
      // fallback
    }

    const anim = currentSlide.animation || "fade";
    const dur = currentSlide.animationDuration || "0.5s";
    const animCss = getAnimationCss(anim, dur).replace(";", " !important;");

    const animStyleTag = `
      <style id="ppt-slideshow-anim">
        @keyframes pptFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pptSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pptSlideDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pptSlideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pptZoomIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes pptFlipIn { from { opacity: 0; transform: perspective(1000px) rotateX(15deg); } to { opacity: 1; transform: perspective(1000px) rotateX(0deg); } }
        @keyframes pptSwirl { from { opacity: 0; transform: scale(0.85) rotate(-6deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes pptBlur { from { opacity: 0; filter: blur(14px); } to { opacity: 1; filter: blur(0px); } }
        @keyframes pptBounce { 0% { opacity: 0; transform: scale(0.8); } 60% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pptWipeIn { from { clip-path: inset(0 100% 0 0); opacity: 0.5; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
        .slide-container {
          ${animCss}
        }
      </style>
    `;

    if (cleanHtml.includes("</head>")) {
      return cleanHtml.replace("</head>", `${animStyleTag}</head>`);
    }
    return cleanHtml + animStyleTag;
  }, [currentSlide]);

  if (!isOpen || !currentSlide) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-none select-none"
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* 16:9 Scaled Slide Canvas */}
      <div
        style={{
          width: `${SLIDE_WIDTH}px`,
          height: `${SLIDE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="relative bg-white shadow-2xl overflow-hidden"
      >
        <iframe
          key={`${currentSlide.id}-${currentIndex}`}
          srcDoc={injectedSlideHtml}
          title="Presentation Slide"
          className="w-full h-full border-0 pointer-events-none"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Floating Bottom Control Bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md text-white border border-white/20 shadow-2xl transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          disabled={currentIndex === 0}
          onClick={goPrev}
          className="size-8 rounded-full text-white hover:bg-white/20 disabled:opacity-30"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <span className="font-mono text-xs font-semibold px-2">
          {currentIndex + 1} / {slides.length}
        </span>

        <Button
          size="icon"
          variant="ghost"
          disabled={currentIndex === slides.length - 1}
          onClick={goNext}
          className="size-8 rounded-full text-white hover:bg-white/20 disabled:opacity-30"
          title="Next Slide (Right Arrow / Space)"
        >
          <ChevronRight className="size-5" />
        </Button>

        <div className="h-4 w-[1px] bg-white/30 mx-1" />

        {/* Toggle Fullscreen Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          className="size-8 rounded-full text-white hover:bg-white/20"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleExit}
          className="size-8 rounded-full text-white hover:bg-white/20"
          title="Exit Slideshow (Esc)"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
};
