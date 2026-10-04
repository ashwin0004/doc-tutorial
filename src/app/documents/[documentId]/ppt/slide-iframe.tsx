"use client";

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef, memo } from "react";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "./slide-templates";
import { SlideAnimationType } from "./types";
import { useOthersConnectionIds, useOther, useUpdateMyPresence } from "@liveblocks/react/suspense";
import { MousePointer2 } from "lucide-react";
import { connectionIdToColor } from "@/lib/utils";

export interface SelectedElementStyle {
  tagName: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fontSize: string;
  fontFamily: string;
  color: string;
  textAlign: string;
  hasSelection: boolean;
}

export interface SlideIframeHandle {
  executeFormat: (command: string, value?: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
}

interface SlideIframeProps {
  html: string;
  slideId?: string;
  animation?: SlideAnimationType;
  animationDuration?: string;
  onHtmlChange?: (newHtml: string) => void;
  isReadOnly?: boolean;
  onSelectionStyleChange?: (style: SelectedElementStyle | null) => void;
}

interface SlideCursorProps {
  connectionId: number;
  currentSlideId?: string;
}

// Dedicated memoized cursor component to avoid re-rendering SlideIframe on presence ticks
const SlideCursor = memo(({ connectionId, currentSlideId }: SlideCursorProps) => {
  const presence = useOther(connectionId, (user) => user.presence);
  const info = useOther(connectionId, (user) => user.info);

  if (!presence) return null;

  // Filter out collaborator cursor if they are on a different slide
  if (presence.slideCursor) {
    if (currentSlideId && presence.slideCursor.slideId !== currentSlideId) {
      return null;
    }
  }

  const cursor = presence.slideCursor || presence.cursor;
  if (!cursor) return null;

  const { x, y } = cursor;
  const userColor = connectionIdToColor(connectionId);
  const userName = info?.name || "Collaborator";

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 drop-shadow-md z-50 transition-transform duration-75 ease-out will-change-transform select-none"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      <MousePointer2
        className="size-5"
        style={{
          fill: userColor,
          color: userColor,
        }}
      />
      <div
        className="absolute left-4 top-2 px-1.5 py-0.5 rounded text-[11px] text-white font-semibold whitespace-nowrap shadow-sm pointer-events-none select-none"
        style={{ backgroundColor: userColor }}
      >
        {userName}
      </div>
    </div>
  );
});

SlideCursor.displayName = "SlideCursor";

export const SlideIframe = forwardRef<SlideIframeHandle, SlideIframeProps>(({
  html,
  slideId,
  animation = "fade",
  animationDuration = "0.5s",
  onHtmlChange,
  isReadOnly = false,
  onSelectionStyleChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);

  // Prevention of the backspace/typing feedback loop:
  const isEditingRef = useRef(false);
  const lastEmittedHtmlRef = useRef<string>("");
  const lastLoadedHtmlRef = useRef<string>("");
  const activeSelectedRef = useRef<HTMLElement | null>(null);
  const inputDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Liveblocks presence for live multiplayer cursors
  const updateMyPresence = useUpdateMyPresence();
  const othersConnectionIds = useOthersConnectionIds();

  const slideIdRef = useRef(slideId);
  slideIdRef.current = slideId;

  // High-performance requestAnimationFrame cursor throttling for real-time responsiveness
  const rafIdRef = useRef<number | null>(null);
  const pendingCursorRef = useRef<{ x: number; y: number } | null>(null);

  const emitCursor = useCallback((x: number, y: number) => {
    pendingCursorRef.current = { x, y };
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (pendingCursorRef.current) {
          const { x: px, y: py } = pendingCursorRef.current;
          const currentSlide = slideIdRef.current;
          updateMyPresence({
            cursor: { x: px, y: py },
            slideCursor: currentSlide ? { x: px, y: py, slideId: currentSlide } : null,
          });
        }
      });
    }
  }, [updateMyPresence]);

  const clearCursor = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingCursorRef.current = null;
    updateMyPresence({
      cursor: null,
      slideCursor: null,
    });
  }, [updateMyPresence]);

  useEffect(() => {
    return () => {
      clearCursor();
    };
  }, [clearCursor]);

  // Auto-scale slide to fit viewport container
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const padding = 40;
    const availWidth = Math.max(100, container.clientWidth - padding);
    const availHeight = Math.max(100, container.clientHeight - padding);

    const scaleX = availWidth / SLIDE_WIDTH;
    const scaleY = availHeight / SLIDE_HEIGHT;
    const fitScale = Math.min(scaleX, scaleY, 1.2);
    setScale(fitScale);
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [updateScale]);

  // Serializes iframe document without editor temporary attributes
  const getCleanHtml = useCallback((): string => {
    const iframe = iframeRef.current;
    if (!iframe) return "";
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return "";

    const clone = doc.cloneNode(true) as Document;
    const injectedStyle = clone.getElementById("editor-interactive-styles");
    if (injectedStyle) injectedStyle.remove();

    clone.querySelectorAll("[data-ppt-hover]").forEach((el) => el.removeAttribute("data-ppt-hover"));
    clone.querySelectorAll("[data-ppt-selected]").forEach((el) => el.removeAttribute("data-ppt-selected"));
    clone.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
    clone.querySelectorAll(".slide-container").forEach((el) => {
      el.classList.remove(
        "ppt-anim-fade",
        "ppt-anim-slide-up",
        "ppt-anim-slide-down",
        "ppt-anim-slide-left",
        "ppt-anim-zoom",
        "ppt-anim-flip",
        "ppt-anim-swirl",
        "ppt-anim-blur",
        "ppt-anim-bounce",
        "ppt-anim-wipe",
        "ppt-anim-none"
      );
    });

    return "<!doctype html>\n" + clone.documentElement.outerHTML;
  }, []);

  // Emits changes to parent/Liveblocks with debouncing
  const commitHtmlChange = useCallback((immediate = false) => {
    if (!onHtmlChange) return;

    if (inputDebounceTimerRef.current) {
      clearTimeout(inputDebounceTimerRef.current);
      inputDebounceTimerRef.current = null;
    }

    const doCommit = () => {
      const clean = getCleanHtml();
      if (clean && clean !== lastEmittedHtmlRef.current) {
        lastEmittedHtmlRef.current = clean;
        onHtmlChange(clean);
      }
    };

    if (immediate) {
      doCommit();
    } else {
      inputDebounceTimerRef.current = setTimeout(doCommit, 400);
    }
  }, [getCleanHtml, onHtmlChange]);

  // Reports the selected element's current styling
  const updateSelectionReport = useCallback((el: HTMLElement | null) => {
    if (!onSelectionStyleChange) return;
    if (!el) {
      onSelectionStyleChange(null);
      return;
    }

    const iframe = iframeRef.current;
    const win = iframe?.contentWindow || window;
    const computed = win.getComputedStyle(el);

    onSelectionStyleChange({
      tagName: el.tagName.toLowerCase(),
      isBold: computed.fontWeight === "bold" || parseInt(computed.fontWeight, 10) >= 700,
      isItalic: computed.fontStyle === "italic",
      isUnderline: computed.textDecoration.includes("underline"),
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      color: computed.color,
      textAlign: computed.textAlign,
      hasSelection: true,
    });
  }, [onSelectionStyleChange]);

  // Expose imperative format methods for Ribbon buttons
  useImperativeHandle(ref, () => ({
    executeFormat: (command: string, value?: string) => {
      const el = activeSelectedRef.current;
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
      if (!doc) return;

      const sel = doc.getSelection();
      const hasTextSelection = sel && !sel.isCollapsed && sel.toString().length > 0;

      if (hasTextSelection) {
        switch (command) {
          case "bold":
            doc.execCommand("bold", false);
            break;
          case "italic":
            doc.execCommand("italic", false);
            break;
          case "underline":
            doc.execCommand("underline", false);
            break;
          case "color":
            if (value) doc.execCommand("foreColor", false, value);
            break;
          case "backgroundColor":
            if (value) doc.execCommand("hiliteColor", false, value);
            break;
          case "fontFamily":
            if (value) doc.execCommand("fontName", false, value);
            break;
          case "textAlign":
            if (value === "center") doc.execCommand("justifyCenter", false);
            else if (value === "right") doc.execCommand("justifyRight", false);
            else doc.execCommand("justifyLeft", false);
            break;
        }
        if (el) updateSelectionReport(el);
        commitHtmlChange(true);
        return;
      }

      if (!el) return;

      switch (command) {
        case "bold": {
          const isBold = el.style.fontWeight === "bold" || doc.defaultView?.getComputedStyle(el).fontWeight === "700";
          el.style.fontWeight = isBold ? "normal" : "bold";
          break;
        }
        case "italic": {
          const isItalic = el.style.fontStyle === "italic";
          el.style.fontStyle = isItalic ? "normal" : "italic";
          break;
        }
        case "underline": {
          const isUnderline = el.style.textDecoration.includes("underline");
          el.style.textDecoration = isUnderline ? "none" : "underline";
          break;
        }
        case "fontSize": {
          if (value) el.style.fontSize = value;
          break;
        }
        case "fontSizeDelta": {
          const currentPx = parseInt(doc.defaultView?.getComputedStyle(el).fontSize || "18", 10);
          const delta = parseInt(value || "2", 10);
          const nextPx = Math.max(10, Math.min(120, currentPx + delta));
          el.style.fontSize = `${nextPx}px`;
          break;
        }
        case "fontFamily": {
          if (value) el.style.fontFamily = value;
          break;
        }
        case "color": {
          if (value) el.style.color = value;
          break;
        }
        case "backgroundColor": {
          if (value) el.style.backgroundColor = value;
          break;
        }
        case "textAlign": {
          if (value) el.style.textAlign = value;
          break;
        }
      }

      updateSelectionReport(el);
      commitHtmlChange(true);
    },
    deleteSelected: () => {
      const el = activeSelectedRef.current;
      if (el && el.parentElement && el !== el.ownerDocument.body) {
        el.remove();
        activeSelectedRef.current = null;
        updateSelectionReport(null);
        commitHtmlChange(true);
      }
    },
    duplicateSelected: () => {
      const el = activeSelectedRef.current;
      if (el && el.parentElement && el !== el.ownerDocument.body) {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.removeAttribute("data-ppt-selected");
        clone.removeAttribute("data-ppt-hover");
        clone.removeAttribute("contenteditable");

        const currentTop = parseInt(el.style.top || "0", 10);
        const currentLeft = parseInt(el.style.left || "0", 10);
        clone.style.top = `${currentTop + 20}px`;
        clone.style.left = `${currentLeft + 20}px`;

        el.parentElement.appendChild(clone);
        commitHtmlChange(true);
      }
    },
  }));

  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  const onHtmlChangeRef = useRef(onHtmlChange);
  onHtmlChangeRef.current = onHtmlChange;

  const onSelectionStyleChangeRef = useRef(onSelectionStyleChange);
  onSelectionStyleChangeRef.current = onSelectionStyleChange;

  // Handle iframe document load and event attachment
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Reload iframe document only if the slide HTML has changed from an external source
    const isLocalEdit = isEditingRef.current || (html === lastEmittedHtmlRef.current && lastEmittedHtmlRef.current !== "");
    if (!isLocalEdit && html !== lastLoadedHtmlRef.current) {
      lastLoadedHtmlRef.current = html;
      doc.open();
      doc.write(html);
      doc.close();
    }

    if (isReadOnly) return;

    // Inject editor interaction styles & slide transition keyframes
    let injectedStyle = doc.getElementById("editor-interactive-styles");
    if (!injectedStyle) {
      injectedStyle = doc.createElement("style");
      injectedStyle.id = "editor-interactive-styles";
      injectedStyle.innerHTML = `
        @keyframes pptFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pptSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pptSlideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pptSlideLeft {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pptZoomIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pptFlipIn {
          from { opacity: 0; transform: perspective(1000px) rotateX(15deg); }
          to { opacity: 1; transform: perspective(1000px) rotateX(0deg); }
        }
        @keyframes pptSwirl {
          from { opacity: 0; transform: scale(0.85) rotate(-6deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes pptBlur {
          from { opacity: 0; filter: blur(14px); }
          to { opacity: 1; filter: blur(0px); }
        }
        @keyframes pptBounce {
          0% { opacity: 0; transform: scale(0.8); }
          60% { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pptWipeIn {
          from { clip-path: inset(0 100% 0 0); opacity: 0.5; }
          to { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .ppt-anim-fade { animation: pptFadeIn var(--ppt-anim-dur, 0.5s) ease-out both !important; }
        .ppt-anim-slide-up { animation: pptSlideUp var(--ppt-anim-dur, 0.5s) cubic-bezier(0.16, 1, 0.3, 1) both !important; }
        .ppt-anim-slide-down { animation: pptSlideDown var(--ppt-anim-dur, 0.5s) cubic-bezier(0.16, 1, 0.3, 1) both !important; }
        .ppt-anim-slide-left { animation: pptSlideLeft var(--ppt-anim-dur, 0.5s) cubic-bezier(0.16, 1, 0.3, 1) both !important; }
        .ppt-anim-zoom { animation: pptZoomIn var(--ppt-anim-dur, 0.5s) cubic-bezier(0.16, 1, 0.3, 1) both !important; }
        .ppt-anim-flip { animation: pptFlipIn var(--ppt-anim-dur, 0.55s) ease-out both !important; }
        .ppt-anim-swirl { animation: pptSwirl var(--ppt-anim-dur, 0.55s) cubic-bezier(0.16, 1, 0.3, 1) both !important; }
        .ppt-anim-blur { animation: pptBlur var(--ppt-anim-dur, 0.5s) ease-out both !important; }
        .ppt-anim-bounce { animation: pptBounce var(--ppt-anim-dur, 0.6s) cubic-bezier(0.34, 1.56, 0.64, 1) both !important; }
        .ppt-anim-wipe { animation: pptWipeIn var(--ppt-anim-dur, 0.55s) ease-out both !important; }
        .ppt-anim-none { animation: none !important; }

        [data-ppt-hover="true"] {
          outline: 2px dashed #f97316 !important;
          outline-offset: 3px !important;
          cursor: text !important;
        }
        [data-ppt-selected="true"] {
          outline: 2px solid #ea580c !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.25) !important;
        }
        [contenteditable="true"] {
          outline: 2px solid #10b981 !important;
          outline-offset: 2px !important;
          cursor: text !important;
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        h1, h2, h3, h4, h5, h6, p, span, li, blockquote, td, th, .badge, [data-ppt-text] {
          cursor: text;
        }
      `;
      doc.head.appendChild(injectedStyle);
    }

    // Resolves which element should be made contenteditable when clicked or focused
    const resolveTextElement = (target: HTMLElement): HTMLElement | null => {
      if (!target || target === doc.body || target === doc.documentElement) return null;
      if (target.classList?.contains("slide-container")) return null;

      const inlineTags = ["SPAN", "STRONG", "EM", "B", "I", "U", "S", "SMALL", "MARK", "SUB", "SUP", "A", "CODE"];
      if (inlineTags.includes(target.tagName)) {
        const parentBlock = target.closest("h1, h2, h3, h4, h5, h6, p, blockquote, li, td, th") as HTMLElement | null;
        if (parentBlock) return parentBlock;
        const parentDiv = target.closest("div") as HTMLElement | null;
        if (parentDiv && !parentDiv.classList.contains("slide-container") && !parentDiv.classList.contains("card")) {
          const hasOtherBlocks = parentDiv.querySelector("h1, h2, h3, h4, h5, h6, p, blockquote, li, table");
          if (!hasOtherBlocks) return parentDiv;
        }
        return target;
      }

      const blockTextTags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE", "LI", "TD", "TH", "PRE", "LABEL", "CAPTION"];
      if (blockTextTags.includes(target.tagName)) {
        return target;
      }

      if (target.tagName === "DIV") {
        if (target.classList.contains("badge")) return target;
        const childBlocks = target.querySelector("h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, table, .card");
        if (childBlocks) {
          return null;
        }
        if (target.textContent && target.textContent.trim().length > 0) {
          return target;
        }
      }

      if (target.textContent && target.textContent.trim().length > 0) {
        const childBlocks = target.querySelector("h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, table");
        if (!childBlocks) return target;
      }

      return null;
    };

    let hoveredEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (isEditingRef.current) return;
      const target = e.target as HTMLElement;
      if (!target || target === doc.body || target === doc.documentElement) return;
      if (hoveredEl && hoveredEl !== target) {
        hoveredEl.removeAttribute("data-ppt-hover");
      }
      hoveredEl = target;
      if (hoveredEl !== activeSelectedRef.current) {
        hoveredEl.setAttribute("data-ppt-hover", "true");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.removeAttribute("data-ppt-hover");
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === doc.body || target === doc.documentElement) {
        if (activeSelectedRef.current) {
          activeSelectedRef.current.removeAttribute("data-ppt-selected");
          activeSelectedRef.current.removeAttribute("contenteditable");
          activeSelectedRef.current = null;
          isEditingRef.current = false;
          updateSelectionReport(null);
          commitHtmlChange(true);
        }
        return;
      }

      e.stopPropagation();

      const textEl = resolveTextElement(target);
      if (textEl) {
        if (activeSelectedRef.current && activeSelectedRef.current !== textEl) {
          activeSelectedRef.current.removeAttribute("data-ppt-selected");
          activeSelectedRef.current.removeAttribute("contenteditable");
        }
        activeSelectedRef.current = textEl;
        textEl.removeAttribute("data-ppt-hover");
        textEl.setAttribute("data-ppt-selected", "true");
        textEl.setAttribute("contenteditable", "true");
        isEditingRef.current = true;
        textEl.focus();
        updateSelectionReport(textEl);
      } else {
        if (activeSelectedRef.current && activeSelectedRef.current !== target) {
          activeSelectedRef.current.removeAttribute("data-ppt-selected");
          activeSelectedRef.current.removeAttribute("contenteditable");
        }
        activeSelectedRef.current = target;
        target.removeAttribute("data-ppt-hover");
        target.setAttribute("data-ppt-selected", "true");
        isEditingRef.current = false;
        updateSelectionReport(target);
      }
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === doc.body || target === doc.documentElement) return;
      e.stopPropagation();

      const textEl = resolveTextElement(target);
      if (textEl) {
        if (activeSelectedRef.current && activeSelectedRef.current !== textEl) {
          activeSelectedRef.current.removeAttribute("data-ppt-selected");
          activeSelectedRef.current.removeAttribute("contenteditable");
        }
        activeSelectedRef.current = textEl;
        textEl.setAttribute("data-ppt-selected", "true");
        textEl.setAttribute("contenteditable", "true");
        isEditingRef.current = true;
        textEl.focus();
        updateSelectionReport(textEl);
      }
    };

    const handleInput = () => {
      isEditingRef.current = true;
      commitHtmlChange(false);
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.getAttribute("contenteditable") === "true") {
        isEditingRef.current = false;
        commitHtmlChange(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const el = activeSelectedRef.current;
      if (!el) return;

      const isContentEditable = el.getAttribute("contenteditable") === "true";

      if (e.key === "Escape") {
        el.removeAttribute("contenteditable");
        el.blur();
        isEditingRef.current = false;
        commitHtmlChange(true);
        return;
      }

      if (!isContentEditable && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        el.remove();
        activeSelectedRef.current = null;
        updateSelectionReport(null);
        commitHtmlChange(true);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        const isBold = el.style.fontWeight === "bold" || doc.defaultView?.getComputedStyle(el).fontWeight === "700";
        el.style.fontWeight = isBold ? "normal" : "bold";
        updateSelectionReport(el);
        commitHtmlChange(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        const isItalic = el.style.fontStyle === "italic";
        el.style.fontStyle = isItalic ? "normal" : "italic";
        updateSelectionReport(el);
        commitHtmlChange(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        const isUnderline = el.style.textDecoration.includes("underline");
        el.style.textDecoration = isUnderline ? "none" : "underline";
        updateSelectionReport(el);
        commitHtmlChange(true);
      }
    };

    // Drag-to-move support
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === doc.body || target === doc.documentElement) return;

      const textEl = resolveTextElement(target);
      if (textEl) {
        if (activeSelectedRef.current && activeSelectedRef.current !== textEl) {
          activeSelectedRef.current.removeAttribute("data-ppt-selected");
          activeSelectedRef.current.removeAttribute("contenteditable");
        }
        activeSelectedRef.current = textEl;
        textEl.setAttribute("data-ppt-selected", "true");
        textEl.setAttribute("contenteditable", "true");
        isEditingRef.current = true;
        updateSelectionReport(textEl);
        isDragging = false;
        return;
      }

      if (activeSelectedRef.current && activeSelectedRef.current !== target) {
        activeSelectedRef.current.removeAttribute("data-ppt-selected");
        activeSelectedRef.current.removeAttribute("contenteditable");
      }
      activeSelectedRef.current = target;
      target.setAttribute("data-ppt-selected", "true");
      isEditingRef.current = false;
      updateSelectionReport(target);

      if (target !== doc.body && !target.classList.contains("slide-container")) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        const rect = target.getBoundingClientRect();
        const parentRect = (target.offsetParent as HTMLElement)?.getBoundingClientRect() || rect;
        initialLeft = rect.left - parentRect.left;
        initialTop = rect.top - parentRect.top;

        target.style.position = "relative";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Precise coordinate calculation within the 1280x720 slide bounds
      const docW = doc.documentElement.clientWidth || SLIDE_WIDTH;
      const docH = doc.documentElement.clientHeight || SLIDE_HEIGHT;
      const slideX = Math.round(Math.max(0, Math.min(SLIDE_WIDTH, (e.clientX / docW) * SLIDE_WIDTH)));
      const slideY = Math.round(Math.max(0, Math.min(SLIDE_HEIGHT, (e.clientY / docH) * SLIDE_HEIGHT)));

      emitCursor(slideX, slideY);

      if (!isDragging || !activeSelectedRef.current) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      activeSelectedRef.current.style.left = `${initialLeft + dx}px`;
      activeSelectedRef.current.style.top = `${initialTop + dy}px`;
    };

    const handleMouseLeave = () => {
      clearCursor();
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        commitHtmlChange(true);
      }
    };

    doc.addEventListener("mouseover", handleMouseOver);
    doc.addEventListener("mouseout", handleMouseOut);
    doc.addEventListener("click", handleClick);
    doc.addEventListener("dblclick", handleDblClick);
    doc.addEventListener("input", handleInput);
    doc.addEventListener("blur", handleBlur, true);
    doc.addEventListener("keydown", handleKeyDown);
    doc.addEventListener("mousedown", handleMouseDown);
    doc.addEventListener("mousemove", handleMouseMove);
    doc.addEventListener("mouseleave", handleMouseLeave);
    doc.addEventListener("mouseup", handleMouseUp);
    doc.defaultView?.addEventListener("blur", handleMouseLeave);

    return () => {
      doc.removeEventListener("mouseover", handleMouseOver);
      doc.removeEventListener("mouseout", handleMouseOut);
      doc.removeEventListener("click", handleClick);
      doc.removeEventListener("dblclick", handleDblClick);
      doc.removeEventListener("input", handleInput);
      doc.removeEventListener("blur", handleBlur, true);
      doc.removeEventListener("keydown", handleKeyDown);
      doc.removeEventListener("mousedown", handleMouseDown);
      doc.removeEventListener("mousemove", handleMouseMove);
      doc.removeEventListener("mouseleave", handleMouseLeave);
      doc.removeEventListener("mouseup", handleMouseUp);
      doc.defaultView?.removeEventListener("blur", handleMouseLeave);
    };
  }, [html, isReadOnly, commitHtmlChange, updateSelectionReport, emitCursor, clearCursor]);

  // Trigger animation replay when slideId or animation changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    const container = doc.querySelector(".slide-container") as HTMLElement | null;
    if (!container) return;

    const anim = animation || "fade";
    const dur = animationDuration || "0.5s";
    const allAnimClasses = [
      "ppt-anim-fade",
      "ppt-anim-slide-up",
      "ppt-anim-slide-down",
      "ppt-anim-slide-left",
      "ppt-anim-zoom",
      "ppt-anim-flip",
      "ppt-anim-swirl",
      "ppt-anim-blur",
      "ppt-anim-bounce",
      "ppt-anim-wipe",
      "ppt-anim-none",
    ];
    container.classList.remove(...allAnimClasses);
    container.style.setProperty("--ppt-anim-dur", dur);
    container.style.animation = "none";
    // Trigger DOM reflow to restart CSS animation
    void container.offsetWidth;
    container.classList.add(`ppt-anim-${anim}`);
  }, [slideId, animation, animationDuration]);

  // Handle mouse movements over the container padding area
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!slideBoxRef.current) return;
    const rect = slideBoxRef.current.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const slideX = Math.round(Math.max(0, Math.min(SLIDE_WIDTH, ((e.clientX - rect.left) / rect.width) * SLIDE_WIDTH)));
      const slideY = Math.round(Math.max(0, Math.min(SLIDE_HEIGHT, ((e.clientY - rect.top) / rect.height) * SLIDE_HEIGHT)));
      emitCursor(slideX, slideY);
    } else {
      clearCursor();
    }
  };

  const handleContainerMouseLeave = () => {
    clearCursor();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/10 dark:bg-black/30 p-4 select-none"
    >
      <div
        ref={slideBoxRef}
        style={{
          width: `${SLIDE_WIDTH}px`,
          height: `${SLIDE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
        }}
        className="relative bg-white rounded-lg overflow-hidden border border-border transition-transform duration-75"
      >
        <iframe
          ref={iframeRef}
          title="Slide Canvas"
          className="w-full h-full border-0 select-auto"
          sandbox="allow-same-origin allow-scripts"
        />

        {/* Live Multiplayer Cursors overlay on top of slide */}
        {othersConnectionIds.map((connectionId) => (
          <SlideCursor
            key={connectionId}
            connectionId={connectionId}
            currentSlideId={slideId}
          />
        ))}
      </div>
    </div>
  );
});

SlideIframe.displayName = "SlideIframe";
