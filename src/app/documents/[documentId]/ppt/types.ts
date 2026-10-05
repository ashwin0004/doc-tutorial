export interface SlideData {
  [key: string]: string | undefined;
  id: string;
  title: string;
  html: string;
  notes?: string;
  theme?: string;
  layout?: string;
  animation?: SlideAnimationType;
  animationDuration?: string;
}

export type SlideLayoutType =
  | "title"
  | "title-content"
  | "two-column"
  | "stats"
  | "features"
  | "comparison"
  | "quote"
  | "blank";

export type SlideAnimationType =
  | "none"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "zoom"
  | "flip"
  | "swirl"
  | "blur"
  | "bounce"
  | "wipe";

export type SlideAnimationDuration = "0.3s" | "0.5s" | "0.8s" | "1.2s" | "1.5s";

export interface SlideTheme {
  id: string;
  name: string;
  gradient: string;
  background: string;
  textColor: string;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  fontFamily: string;
  animation?: SlideAnimationType;
  animationDuration?: string;
  isCustom?: boolean;
}

export interface SlideProposal {
  id: string;
  title: string;
  html: string;
  targetSlideId?: string;
  isNewSlide?: boolean;
  notes?: string;
  summary?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  thinking?: string;
  proposals?: SlideProposal[];
  suggestions?: string[];
  isStreaming?: boolean;
}

export type RibbonTab = "home" | "insert" | "design" | "present" | "ai";

export type InsertElementType =
  | "textbox"
  | "card"
  | "stats"
  | "quote"
  | "rect"
  | "rounded-rect"
  | "circle"
  | "diamond"
  | "triangle"
  | "arrow"
  | "star"
  | "image"
  | "table"
  | "continuation";

