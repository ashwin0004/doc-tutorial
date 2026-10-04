"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useStorage,
  useMutation,
  useHistory,
  useCanUndo,
  useCanRedo,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import { SlideData, RibbonTab, SlideLayoutType, SlideProposal, SlideTheme, SlideAnimationType } from "./types";
import {
  generateSlideHtml,
  generateContinuationSlideHtml,
  getTheme,
  SLIDE_THEMES,
  STARTER_SLIDES,
} from "./slide-templates";
import { PptRibbon } from "./ppt-ribbon";
import { SlideSidebar } from "./slide-sidebar";
import { SlideIframe, SlideIframeHandle, SelectedElementStyle } from "./slide-iframe";
import { SlideCodeEditor } from "./slide-code-editor";
import { AiChatDrawer } from "./ai-chat-drawer";
import { SpeakerNotes } from "./speaker-notes";
import { SlideshowPresenter } from "./slideshow-presenter";
import { CustomDesignModal } from "./custom-design-modal";
import { ImageImportModal } from "./image-import-modal";
import { toast } from "sonner";

export const PptEditor: React.FC = () => {
  const slidesStorage = useStorage((root) => root.slides);
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const slideIframeRef = useRef<SlideIframeHandle>(null);
  const [selectionStyle, setSelectionStyle] = useState<SelectedElementStyle | null>(null);

  const [activeTab, setActiveTab] = useState<RibbonTab>("home");
  const [activeViewMode, setActiveViewMode] = useState<"slide" | "code">("slide");
  const [activeSlideId, setActiveSlideId] = useState<string>("");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [previewedProposal, setPreviewedProposal] = useState<SlideProposal | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState("dark-modern");
  const [currentAnimation, setCurrentAnimation] = useState<SlideAnimationType>("fade");
  const [currentAnimationDuration, setCurrentAnimationDuration] = useState("0.5s");
  const [isCustomDesignOpen, setIsCustomDesignOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [customThemes, setCustomThemes] = useState<SlideTheme[]>([]);

  const allThemes = useMemo(() => {
    return [...SLIDE_THEMES, ...customThemes];
  }, [customThemes]);

  // Initialize slides in storage if empty
  const initSlides = useMutation(({ storage }) => {
    const slides = storage.get("slides");
    if (!slides) return;
    if (slides.length === 0) {
      for (const starter of STARTER_SLIDES) {
        slides.push(
          new LiveObject<SlideData>({
            id: starter.id,
            title: starter.title,
            html: starter.html,
            notes: starter.notes,
            theme: starter.theme,
            animation: ((starter as unknown as { animation?: SlideAnimationType }).animation) || "fade",
            layout: starter.layout,
          })
        );
      }
    }
  }, []);

  useEffect(() => {
    if (slidesStorage && slidesStorage.length === 0) {
      initSlides();
    }
  }, [slidesStorage, initSlides]);

  // Convert Liveblocks storage to plain array
  const slides: SlideData[] = useMemo(() => {
    if (!slidesStorage || slidesStorage.length === 0) {
      return STARTER_SLIDES;
    }
    return slidesStorage.map((slideObj) => ({
      id: slideObj.id,
      title: slideObj.title,
      html: slideObj.html,
      notes: slideObj.notes || "",
      theme: slideObj.theme || "dark-modern",
      animation: (slideObj.animation as SlideAnimationType) || "fade",
      animationDuration: (slideObj.animationDuration as string) || "0.5s",
      layout: slideObj.layout || "title-content",
    }));
  }, [slidesStorage]);

  // Ensure activeSlideId is valid
  useEffect(() => {
    if (slides.length > 0) {
      if (!activeSlideId || !slides.some((s) => s.id === activeSlideId)) {
        setActiveSlideId(slides[0].id);
      }
    }
  }, [slides, activeSlideId]);

  const activeSlide = useMemo(() => {
    return slides.find((s) => s.id === activeSlideId) || slides[0] || STARTER_SLIDES[0];
  }, [slides, activeSlideId]);

  const activeSlideIndex = useMemo(() => {
    const idx = slides.findIndex((s) => s.id === activeSlideId);
    return idx >= 0 ? idx : 0;
  }, [slides, activeSlideId]);

  // Synchronize currentThemeId, currentAnimation & currentAnimationDuration with active slide
  useEffect(() => {
    if (activeSlide) {
      if (activeSlide.theme && activeSlide.theme !== currentThemeId) {
        setCurrentThemeId(activeSlide.theme);
      }
      if (activeSlide.animation && activeSlide.animation !== currentAnimation) {
        setCurrentAnimation(activeSlide.animation as SlideAnimationType);
      }
      if (activeSlide.animationDuration && activeSlide.animationDuration !== currentAnimationDuration) {
        setCurrentAnimationDuration(activeSlide.animationDuration);
      }
    }
  }, [activeSlide, currentThemeId, currentAnimation, currentAnimationDuration]);

  // Global F5 shortcut to start fullscreen slideshow
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        setIsPresenting(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Mutations
  const updateSlideHtml = useMutation(
    ({ storage }, newHtml: string) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;
      for (let i = 0; i < liveSlides.length; i++) {
        const slide = liveSlides.get(i);
        if (slide && slide.get("id") === activeSlideId) {
          slide.set("html", newHtml);
          break;
        }
      }
    },
    [activeSlideId]
  );

  const updateSlideNotes = useMutation(
    ({ storage }, newNotes: string) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;
      for (let i = 0; i < liveSlides.length; i++) {
        const slide = liveSlides.get(i);
        if (slide && slide.get("id") === activeSlideId) {
          slide.set("notes", newNotes);
          break;
        }
      }
    },
    [activeSlideId]
  );

  const addSlide = useMutation(
    ({ storage }, layout: SlideLayoutType = "title-content") => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;
      const newId = `slide-${Date.now()}`;
      const newSlide = new LiveObject<SlideData>({
        id: newId,
        title: `Slide ${liveSlides.length + 1}`,
        html: generateSlideHtml(layout, currentThemeId),
        notes: "",
        theme: currentThemeId,
        layout,
      });
      liveSlides.push(newSlide);
      setActiveSlideId(newId);
      toast.success("New slide added");
    },
    [currentThemeId]
  );

  const duplicateSlide = useMutation(
    ({ storage }, slideId: string) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;
      const target = slides.find((s) => s.id === slideId);
      if (!target) return;

      const newId = `slide-${Date.now()}`;
      const clone = new LiveObject<SlideData>({
        id: newId,
        title: `${target.title} (Copy)`,
        html: target.html,
        notes: target.notes,
        theme: target.theme,
        layout: target.layout,
      });

      const idx = slides.findIndex((s) => s.id === slideId);
      if (idx >= 0 && idx < liveSlides.length) {
        liveSlides.insert(clone, idx + 1);
      } else {
        liveSlides.push(clone);
      }
      setActiveSlideId(newId);
      toast.success("Slide duplicated");
    },
    [slides]
  );

  const deleteSlide = useMutation(
    ({ storage }, slideId: string) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides || liveSlides.length <= 1) {
        toast.error("Presentations must contain at least one slide");
        return;
      }
      for (let i = 0; i < liveSlides.length; i++) {
        const s = liveSlides.get(i);
        if (s && s.get("id") === slideId) {
          liveSlides.delete(i);
          break;
        }
      }
      toast.success("Slide deleted");
    },
    []
  );

  const moveSlide = useMutation(
    ({ storage }, index: number, direction: "up" | "down") => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= liveSlides.length) return;

      const item = liveSlides.get(index);
      if (item) {
        liveSlides.move(index, targetIndex);
      }
    },
    []
  );

  const applyTheme = useMutation(
    ({ storage }, themeId: string, applyToAll = false, themeObj?: SlideTheme) => {
      setCurrentThemeId(themeId);
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;

      const t = themeObj || allThemes.find((x) => x.id === themeId) || getTheme(themeId);
      if (t.animation) {
        setCurrentAnimation(t.animation);
      }
      if (t.animationDuration) {
        setCurrentAnimationDuration(t.animationDuration);
      }

      const applyThemeToHtml = (html: string, theme: SlideTheme): string => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          if (doc.body) {
            doc.body.style.background = theme.gradient;
            doc.body.style.backgroundColor = theme.background;
            doc.body.style.color = theme.textColor;
            doc.body.style.fontFamily = theme.fontFamily;
          }
          const container = doc.querySelector(".slide-container") as HTMLElement | null;
          if (container) {
            if (theme.animation === "fade") container.style.animation = "pptFadeIn 0.5s ease-out both";
            else if (theme.animation === "slide-up") container.style.animation = "pptSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both";
            else if (theme.animation === "zoom") container.style.animation = "pptZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both";
            else if (theme.animation === "flip") container.style.animation = "pptFlipIn 0.55s ease-out both";
            else if (theme.animation === "wipe") container.style.animation = "pptWipeIn 0.55s ease-out both";
            else container.style.animation = "none";
          }
          doc.querySelectorAll(".badge").forEach((el) => {
            (el as HTMLElement).style.background = theme.cardBg;
            (el as HTMLElement).style.borderColor = theme.borderColor;
            (el as HTMLElement).style.color = theme.accentColor;
          });
          doc.querySelectorAll(".highlight").forEach((el) => {
            (el as HTMLElement).style.color = theme.accentColor;
          });
          return "<!doctype html>\n" + doc.documentElement.outerHTML;
        } catch {
          return html;
        }
      };

      if (applyToAll) {
        for (let i = 0; i < liveSlides.length; i++) {
          const s = liveSlides.get(i);
          if (s) {
            s.set("theme", themeId);
            if (t.animation) {
              s.set("animation", t.animation);
            }
            if (t.animationDuration) {
              s.set("animationDuration", t.animationDuration);
            }
            const updated = applyThemeToHtml(s.get("html") || "", t);
            s.set("html", updated);
          }
        }
        toast.success("Theme applied to all slides");
      } else {
        for (let i = 0; i < liveSlides.length; i++) {
          const s = liveSlides.get(i);
          if (s && s.get("id") === activeSlideId) {
            s.set("theme", themeId);
            if (t.animation) {
              s.set("animation", t.animation);
            }
            if (t.animationDuration) {
              s.set("animationDuration", t.animationDuration);
            }
            const updated = applyThemeToHtml(s.get("html") || "", t);
            s.set("html", updated);
            break;
          }
        }
        toast.success("Theme applied to current slide");
      }
    },
    [activeSlideId, allThemes]
  );

  const handleApplyCustomTheme = (theme: SlideTheme, applyToAll: boolean) => {
    setCustomThemes((prev) => {
      const exists = prev.some((t) => t.id === theme.id);
      return exists ? prev.map((t) => (t.id === theme.id ? theme : t)) : [...prev, theme];
    });
    setCurrentThemeId(theme.id);
    if (theme.animation) {
      setCurrentAnimation(theme.animation);
    }
    applyTheme(theme.id, applyToAll, theme);
  };

  const handleChangeAnimation = useMutation(
    ({ storage }, anim: SlideAnimationType) => {
      setCurrentAnimation(anim);
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;

      for (let i = 0; i < liveSlides.length; i++) {
        const s = liveSlides.get(i);
        if (s && s.get("id") === activeSlideId) {
          s.set("animation", anim);
          break;
        }
      }
      toast.success(`Transition set to ${anim}`);
    },
    [activeSlideId]
  );

  const handleChangeAnimationDuration = useMutation(
    ({ storage }, duration: string) => {
      setCurrentAnimationDuration(duration);
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;

      for (let i = 0; i < liveSlides.length; i++) {
        const s = liveSlides.get(i);
        if (s && s.get("id") === activeSlideId) {
          s.set("animationDuration", duration);
          break;
        }
      }
      toast.success(`Transition speed set to ${duration}`);
    },
    [activeSlideId]
  );

  const createContinuationSlide = useMutation(
    ({ storage }, initialSnippet: string) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides || !activeSlide) return;

      const newId = `slide-${Date.now()}`;
      const baseTitle = activeSlide.title.replace(/\s*\(Cont\.\)/i, "").trim() || "Slide";
      const continuationTitle = `${baseTitle} (Cont.)`;

      const currentThemeObj = allThemes.find((t) => t.id === currentThemeId) || currentThemeId;

      const newHtml = generateContinuationSlideHtml(
        continuationTitle,
        currentThemeObj,
        initialSnippet
      );

      const currentIndex = slides.findIndex((s) => s.id === activeSlideId);
      const insertIndex = currentIndex >= 0 ? currentIndex + 1 : liveSlides.length;

      liveSlides.insert(
        new LiveObject<SlideData>({
          id: newId,
          title: continuationTitle,
          html: newHtml,
          notes: `Continuation of ${baseTitle}`,
          theme: currentThemeId,
        }),
        insertIndex
      );

      setActiveSlideId(newId);
      toast.success("Slide reached capacity — created continuation slide!", {
        description: "New content placed at the top of the next slide.",
      });
    },
    [activeSlide, activeSlideId, currentThemeId, slides, allThemes]
  );

  const applyProposal = useMutation(
    ({ storage }, proposal: SlideProposal) => {
      const liveSlides = storage.get("slides");
      if (!liveSlides) return;

      if (proposal.isNewSlide) {
        const newId = `slide-${Date.now()}`;
        liveSlides.push(
          new LiveObject<SlideData>({
            id: newId,
            title: proposal.title,
            html: proposal.html,
            notes: proposal.notes || "",
            theme: currentThemeId,
          })
        );
        setActiveSlideId(newId);
      } else {
        const targetId = proposal.targetSlideId || activeSlideId;
        for (let i = 0; i < liveSlides.length; i++) {
          const s = liveSlides.get(i);
          if (s && s.get("id") === targetId) {
            s.set("html", proposal.html);
            if (proposal.notes) s.set("notes", proposal.notes);
            break;
          }
        }
      }
      setPreviewedProposal(null);
    },
    [activeSlideId, currentThemeId]
  );

  // Insert Element to slide with intelligent auto-continuation pagination
  const handleInsertElement = useCallback(
    (type: "textbox" | "card" | "stats" | "quote" | "rect" | "circle" | "image" | "table" | "continuation") => {
      if (!activeSlide) return;

      if (type === "continuation") {
        createContinuationSlide(
          `<div class="card" style="padding: 24px;"><h3>Continuation Section</h3><p style="font-size: 16px; opacity: 0.85; margin-top: 8px;">Double click to add continued thoughts or insights here.</p></div>`
        );
        return;
      }

      let snippet = "";
      switch (type) {
        case "textbox":
          snippet = `<div style="position: relative; padding: 12px; margin: 12px 0; font-size: 26px; font-weight: 700; color: inherit; width: fit-content;">Double click to edit title</div>`;
          break;
        case "card":
          snippet = `<div class="card" style="position: relative; margin: 16px 0; max-width: 480px;"><h3>New Insight Card</h3><p style="font-size: 16px; opacity: 0.85; margin-top: 8px;">Highlight key value propositions or project milestones here.</p></div>`;
          break;
        case "stats":
          snippet = `<div class="card" style="position: relative; text-align: center; padding: 24px; margin: 16px 0; width: 220px;"><div style="font-size: 46px; font-weight: 800; color: #f97316;">99.9%</div><div style="font-size: 15px; font-weight: 600; margin-top: 4px;">Milestone KPI</div></div>`;
          break;
        case "quote":
          snippet = `<blockquote style="position: relative; font-size: 26px; font-weight: 600; border-left: 4px solid #f97316; padding-left: 20px; margin: 20px 0; max-width: 800px;">“Simplicity is the ultimate sophistication.”</blockquote>`;
          break;
        case "rect":
          snippet = `<div style="position: relative; width: 260px; height: 130px; border-radius: 12px; background: rgba(249, 115, 22, 0.12); border: 2px solid #f97316; margin: 16px 0;"></div>`;
          break;
        case "circle":
          snippet = `<div style="position: relative; width: 140px; height: 140px; border-radius: 9999px; background: rgba(59, 130, 246, 0.15); border: 2px solid #3b82f6; margin: 16px 0;"></div>`;
          break;
        case "image": {
          setIsImageModalOpen(true);
          return;
        }
        case "table":
          snippet = `
            <table style="width: 100%; max-width: 700px; border-collapse: collapse; margin: 20px 0; font-size: 15px;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(255,255,255,0.2);">
                  <th style="padding: 10px; text-align: left;">Category</th>
                  <th style="padding: 10px; text-align: left;">Metric</th>
                  <th style="padding: 10px; text-align: left;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <td style="padding: 10px;">Growth</td>
                  <td style="padding: 10px;">+142%</td>
                  <td style="padding: 10px; color: #10b981;">On Track</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <td style="padding: 10px;">Retention</td>
                  <td style="padding: 10px;">96.8%</td>
                  <td style="padding: 10px; color: #10b981;">Optimal</td>
                </tr>
              </tbody>
            </table>
          `;
          break;
      }

      if (!snippet) return;

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(activeSlide.html, "text/html");
        const container = doc.querySelector(".slide-container") || doc.body;

        // Check if current slide is at capacity
        const contentChildren = Array.from(container.children).filter(
          (el) => !el.classList.contains("badge") && !el.classList.contains("footer") && el.tagName !== "H1" && el.tagName !== "H2"
        );
        const hasLargeGrid = container.querySelector("table, [style*='grid-template-columns']") !== null;
        const isSlideFull = contentChildren.length >= 3 || (hasLargeGrid && contentChildren.length >= 2);

        if (isSlideFull) {
          // Slide has no more vertical space - automatically continue onto next slide!
          createContinuationSlide(snippet);
          return;
        }

        const temp = doc.createElement("div");
        temp.innerHTML = snippet;
        const newEl = temp.firstElementChild;
        if (newEl) {
          container.appendChild(newEl);
          const clean = "<!doctype html>\n" + doc.documentElement.outerHTML;
          updateSlideHtml(clean);
          toast.success("Element inserted into slide");
        }
      } catch {
        updateSlideHtml(activeSlide.html.replace("</body>", `${snippet}</body>`));
        toast.success("Element inserted into slide");
      }
    },
    [activeSlide, updateSlideHtml, createContinuationSlide]
  );

  // Custom Image Inserter from ImageImportModal
  const handleInsertCustomImage = useCallback(
    (snippet: string) => {
      if (!activeSlide) return;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(activeSlide.html, "text/html");
        const container = doc.querySelector(".slide-container") || doc.body;

        const temp = doc.createElement("div");
        temp.innerHTML = snippet;
        const newEl = temp.firstElementChild;
        if (newEl) {
          container.appendChild(newEl);
          const clean = "<!doctype html>\n" + doc.documentElement.outerHTML;
          updateSlideHtml(clean);
          toast.success("Image inserted into slide");
        }
      } catch {
        updateSlideHtml(activeSlide.html.replace("</body>", `${snippet}</body>`));
        toast.success("Image inserted into slide");
      }
    },
    [activeSlide, updateSlideHtml]
  );

  // Perfect Slide-Only Print / Save as PDF
  const handlePrintPdf = useCallback(() => {
    if (slides.length === 0) {
      toast.error("No slides available to print");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const printDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!printDoc) {
      toast.error("Could not initialize print document");
      iframe.remove();
      return;
    }

    const slidesMarkup = slides
      .map((slide, idx) => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(slide.html, "text/html");

          doc.querySelectorAll("[data-ppt-hover]").forEach((el) => el.removeAttribute("data-ppt-hover"));
          doc.querySelectorAll("[data-ppt-selected]").forEach((el) => el.removeAttribute("data-ppt-selected"));
          doc.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
          doc.querySelectorAll("#editor-interactive-styles").forEach((el) => el.remove());
          doc.querySelectorAll("#ppt-slideshow-anim").forEach((el) => el.remove());

          const container = doc.querySelector(".slide-container") as HTMLElement | null;
          if (container) {
            container.style.animation = "none";
            container.style.transition = "none";
            container.style.boxShadow = "none";
          }

          const bg = doc.body.style.background || doc.body.style.backgroundColor || "#0f172a";
          const textColor = doc.body.style.color || "#f8fafc";
          const fontFamily = doc.body.style.fontFamily || "'Inter', sans-serif";
          const styleContent = Array.from(doc.querySelectorAll("style"))
            .map((s) => s.innerHTML)
            .join("\n");

          return `
            <div class="print-slide-page" id="slide-${idx + 1}" style="background: ${bg}; color: ${textColor}; font-family: ${fontFamily};">
              <style>${styleContent}</style>
              ${container ? container.outerHTML : doc.body.innerHTML}
            </div>
          `;
        } catch {
          return `<div class="print-slide-page">${slide.html}</div>`;
        }
      })
      .join("\n");

    const printHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Presentation Deck - Slides</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page {
      size: 1280px 720px landscape;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 1280px;
      height: 720px;
      background: white;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-slide-page {
      width: 1280px !important;
      height: 720px !important;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      overflow: hidden;
      position: relative;
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slide-container {
      width: 1280px !important;
      height: 720px !important;
      animation: none !important;
      transition: none !important;
      box-shadow: none !important;
    }
  </style>
</head>
<body>
  ${slidesMarkup}
</body>
</html>`;

    printDoc.open();
    printDoc.write(printHtml);
    printDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print error:", err);
      } finally {
        setTimeout(() => iframe.remove(), 3000);
      }
    }, 450);

    toast.success("Preparing PDF print preview (slides only)...");
  }, [slides]);

  // Full HTML Presentation Export
  const handleExportHtml = () => {
    const combinedSlides = slides
      .map(
        (s, idx) => `
        <div class="presentation-slide" id="slide-${idx + 1}" style="width: 1280px; height: 720px; margin: 40px auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden;">
          <iframe srcdoc="${s.html.replace(/"/g, "&quot;")}" style="width: 1280px; height: 720px; border: 0;" sandbox="allow-same-origin"></iframe>
        </div>
      `
      )
      .join("\n");

    const exportDoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Presentation Deck</title>
  <style>
    body { background: #0b0f19; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
  </style>
</head>
<body>
  ${combinedSlides}
</body>
</html>`;

    const blob = new Blob([exportDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presentation-deck-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML presentation downloaded!");
  };

  const currentDisplayHtml = previewedProposal ? previewedProposal.html : activeSlide.html;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] w-full overflow-hidden bg-background">
      {/* Top PowerPoint Ribbon */}
      <PptRibbon
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewSlide={addSlide}
        onUndo={() => history.undo()}
        onRedo={() => history.redo()}
        canUndo={canUndo}
        canRedo={canRedo}
        onInsertElement={handleInsertElement}
        onApplyTheme={applyTheme}
        currentThemeId={currentThemeId}
        onOpenCustomDesign={() => setIsCustomDesignOpen(true)}
        themes={allThemes}
        currentAnimation={currentAnimation}
        onChangeAnimation={handleChangeAnimation}
        currentAnimationDuration={currentAnimationDuration}
        onChangeAnimationDuration={handleChangeAnimationDuration}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onStartPresent={() => setIsPresenting(true)}
        onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        isAiChatOpen={isAiChatOpen}
        activeViewMode={activeViewMode}
        setActiveViewMode={setActiveViewMode}
        onExportHtml={handleExportHtml}
        onPrintPdf={handlePrintPdf}
        selectionStyle={selectionStyle}
        onFormat={(cmd, val) => slideIframeRef.current?.executeFormat(cmd, val)}
        onDeleteSelected={() => slideIframeRef.current?.deleteSelected()}
        onDuplicateSelected={() => slideIframeRef.current?.duplicateSelected()}
      />

      {/* Main Workspace: Left Thumbnails + Center Canvas + Right AI Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Thumbnails Sidebar */}
        <SlideSidebar
          slides={slides}
          activeSlideId={activeSlideId}
          onSelectSlide={setActiveSlideId}
          onAddSlide={() => addSlide("title-content")}
          onDuplicateSlide={duplicateSlide}
          onDeleteSlide={deleteSlide}
          onMoveSlide={moveSlide}
        />

        {/* Center Presentation Canvas Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-100/60 dark:bg-slate-950/40">
          {/* Proposal Preview Banner if user is previewing an AI suggestion */}
          {previewedProposal && (
            <div className="bg-blue-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md shrink-0 select-none">
              <span className="font-semibold flex items-center gap-2">
                <span>🔍 Previewing AI Proposal:</span>
                <span className="underline">{previewedProposal.title}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewedProposal(null)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium"
                >
                  Exit Preview
                </button>
                <button
                  onClick={() => {
                    applyProposal(previewedProposal);
                    toast.success("Proposal applied to presentation!");
                  }}
                  className="px-3 py-1 bg-white text-blue-700 hover:bg-blue-50 rounded text-xs font-bold"
                >
                  Apply Proposal
                </button>
              </div>
            </div>
          )}

          {/* Canvas or Code View */}
          <div className="flex-1 overflow-hidden relative">
            {activeViewMode === "slide" ? (
              <SlideIframe
                ref={slideIframeRef}
                slideId={activeSlideId}
                animation={currentAnimation}
                animationDuration={currentAnimationDuration}
                html={currentDisplayHtml}
                onHtmlChange={previewedProposal ? undefined : updateSlideHtml}
                isReadOnly={Boolean(previewedProposal)}
                onSelectionStyleChange={setSelectionStyle}
              />
            ) : (
              <div className="p-4 h-full">
                <SlideCodeEditor
                  html={activeSlide.html}
                  onChange={updateSlideHtml}
                />
              </div>
            )}
          </div>

          {/* Speaker Notes */}
          <SpeakerNotes
            notes={activeSlide.notes}
            onChangeNotes={updateSlideNotes}
          />
        </div>

        {/* Right AI Slideshow Assistant Drawer */}
        <AiChatDrawer
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          currentSlideId={activeSlideId}
          currentSlideHtml={activeSlide.html}
          onApplyProposal={applyProposal}
          onPreviewProposal={setPreviewedProposal}
          previewedProposalId={previewedProposal?.id}
          onApplyTheme={(themeId) => applyTheme(themeId, false)}
        />
      </div>

      {/* Fullscreen Presenter Mode */}
      <SlideshowPresenter
        slides={slides}
        initialSlideIndex={activeSlideIndex}
        isOpen={isPresenting}
        onClose={() => setIsPresenting(false)}
      />

      {/* Custom Design & Animations Creator Modal */}
      <CustomDesignModal
        isOpen={isCustomDesignOpen}
        onClose={() => setIsCustomDesignOpen(false)}
        onApplyCustomTheme={handleApplyCustomTheme}
        initialTheme={allThemes.find((t) => t.id === currentThemeId)}
      />

      {/* Image Import & Local File Upload Modal */}
      <ImageImportModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={handleInsertCustomImage}
      />
    </div>
  );
};
