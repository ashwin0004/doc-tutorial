import { SlideTheme, SlideLayoutType, SlideData, SlideAnimationType } from "./types";

export const SLIDE_WIDTH = 1280;
export const SLIDE_HEIGHT = 720;

export const SLIDE_THEMES: SlideTheme[] = [
  {
    id: "dark-modern",
    name: "Dark Modern",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    background: "#0f172a",
    textColor: "#f8fafc",
    accentColor: "#6366f1",
    cardBg: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.12)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    background: "#f8fafc",
    textColor: "#0f172a",
    accentColor: "#2563eb",
    cardBg: "#ffffff",
    borderColor: "#cbd5e1",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: "emerald-tech",
    name: "Emerald Tech",
    gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    background: "#022c22",
    textColor: "#ecfdf5",
    accentColor: "#10b981",
    cardBg: "rgba(255, 255, 255, 0.07)",
    borderColor: "rgba(16, 185, 129, 0.25)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: "sunset-vibrant",
    name: "Sunset Vibrant",
    gradient: "linear-gradient(135deg, #18181b 0%, #31102f 100%)",
    background: "#18181b",
    textColor: "#ffffff",
    accentColor: "#f43f5e",
    cardBg: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(244, 63, 94, 0.3)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: "minimal-clean",
    name: "Clean Minimal",
    gradient: "#ffffff",
    background: "#ffffff",
    textColor: "#18181b",
    accentColor: "#09090b",
    cardBg: "#f4f4f5",
    borderColor: "#e4e4e7",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    gradient: "linear-gradient(135deg, #050505 0%, #0d1117 100%)",
    background: "#050505",
    textColor: "#f0f6fc",
    accentColor: "#00f0ff",
    cardBg: "rgba(0, 240, 255, 0.04)",
    borderColor: "rgba(0, 240, 255, 0.25)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
];

export function getTheme(idOrTheme?: string | SlideTheme): SlideTheme {
  if (typeof idOrTheme === "object" && idOrTheme !== null) {
    return idOrTheme;
  }
  return SLIDE_THEMES.find((t) => t.id === idOrTheme) || SLIDE_THEMES[0];
}

export function getAnimationCss(animation: SlideAnimationType = "fade", duration = "0.5s"): string {
  switch (animation) {
    case "fade":
      return `animation: pptFadeIn ${duration} ease-out both;`;
    case "slide-up":
      return `animation: pptSlideUp ${duration} cubic-bezier(0.16, 1, 0.3, 1) both;`;
    case "slide-down":
      return `animation: pptSlideDown ${duration} cubic-bezier(0.16, 1, 0.3, 1) both;`;
    case "slide-left":
      return `animation: pptSlideLeft ${duration} cubic-bezier(0.16, 1, 0.3, 1) both;`;
    case "zoom":
      return `animation: pptZoomIn ${duration} cubic-bezier(0.16, 1, 0.3, 1) both;`;
    case "flip":
      return `animation: pptFlipIn ${duration} ease-out both;`;
    case "swirl":
      return `animation: pptSwirl ${duration} cubic-bezier(0.16, 1, 0.3, 1) both;`;
    case "blur":
      return `animation: pptBlur ${duration} ease-out both;`;
    case "bounce":
      return `animation: pptBounce ${duration} cubic-bezier(0.34, 1.56, 0.64, 1) both;`;
    case "wipe":
      return `animation: pptWipeIn ${duration} ease-out both;`;
    case "none":
    default:
      return "animation: none;";
  }
}

export function generateSlideHtml(
  layout: SlideLayoutType,
  themeOrId: string | SlideTheme = "dark-modern",
  custom?: { title?: string; subtitle?: string; content?: string }
): string {
  const t = getTheme(themeOrId);
  const animation = t.animation || "fade";
  const duration = t.animationDuration || "0.5s";
  const animCss = getAnimationCss(animation, duration);

  const baseStyle = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1280px;
      height: 720px;
      overflow: hidden;
      background: ${t.gradient};
      background-color: ${t.background};
      color: ${t.textColor};
      font-family: ${t.fontFamily};
      -webkit-font-smoothing: antialiased;
    }
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
    .slide-container {
      width: 1280px;
      height: 720px;
      padding: 72px 88px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      ${animCss}
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: ${t.cardBg};
      border: 1px solid ${t.borderColor};
      color: ${t.accentColor};
      width: fit-content;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 54px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 18px;
    }
    h2 {
      font-size: 40px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.01em;
      margin-bottom: 14px;
    }
    h3 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${t.textColor};
    }
    p {
      font-size: 20px;
      line-height: 1.6;
      opacity: 0.85;
      max-width: 900px;
    }
    .card {
      background: ${t.cardBg};
      border: 1px solid ${t.borderColor};
      border-radius: 16px;
      padding: 28px;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .highlight {
      color: ${t.accentColor};
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      opacity: 0.6;
      border-top: 1px solid ${t.borderColor};
      padding-top: 20px;
      margin-top: auto;
    }
  `;

  let bodyContent = "";

  switch (layout) {
    case "title":
      bodyContent = `
        <div class="slide-container" style="justify-content: center; align-items: flex-start; text-align: left;">
          <div class="badge">Next Generation Presentation</div>
          <h1 style="font-size: 64px; max-width: 1000px;">
            ${custom?.title || 'Interactive AI <span class="highlight">Slideshow</span> Platform'}
          </h1>
          <p style="font-size: 24px; max-width: 780px; margin-bottom: 36px;">
            ${custom?.subtitle || "Real-time multiplayer collaboration, AI-driven slide authoring, and state-of-the-art presentation design."}
          </p>
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="padding: 12px 24px; background: ${t.accentColor}; color: #ffffff; border-radius: 10px; font-weight: 600; font-size: 16px;">
              Executive Briefing
            </div>
            <div style="padding: 12px 24px; border: 1px solid ${t.borderColor}; border-radius: 10px; font-weight: 500; font-size: 16px;">
              Confidential & Proprietary
            </div>
          </div>
          <div class="footer" style="width: 100%; position: absolute; bottom: 40px; left: 88px; width: calc(100% - 176px);">
            <span>Project Alpha 2026</span>
            <span>Slide 1</span>
          </div>
        </div>
      `;
      break;

    case "two-column":
      bodyContent = `
        <div class="slide-container">
          <div>
            <div class="badge">Architecture & Overview</div>
            <h2>${custom?.title || "Modern Strategy & Execution"}</h2>
            <p style="font-size: 18px; margin-bottom: 32px;">${custom?.subtitle || "How we bridge vision with scalable collaborative infrastructure."}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 24px;">
            <div class="card">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: ${t.accentColor}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">01</div>
                <h3>Collaborative Realtime Core</h3>
              </div>
              <p style="font-size: 16px; opacity: 0.8;">
                Built on Liveblocks synchronization with conflict-free CRDT data structures. Every slide edit, presence indicator, and element placement syncs across users with sub-50ms latency.
              </p>
            </div>
            <div class="card">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: ${t.accentColor}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">02</div>
                <h3>Intelligent AI Co-Pilot</h3>
              </div>
              <p style="font-size: 16px; opacity: 0.8;">
                Leverage generative proposals to turn natural language prompts into stunning 16:9 slides. Review diffs with live preview before committing changes.
              </p>
            </div>
          </div>
          <div class="footer">
            <span>Core Pillars</span>
            <span>Presentation Deck</span>
          </div>
        </div>
      `;
      break;

    case "features":
      bodyContent = `
        <div class="slide-container">
          <div>
            <div class="badge">Key Capabilities</div>
            <h2>${custom?.title || "Designed For Impact"}</h2>
            <p style="font-size: 18px; margin-bottom: 28px;">${custom?.subtitle || "Everything you need to craft high-converting pitch decks and reports."}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div class="card">
              <div style="font-size: 28px; margin-bottom: 12px;">⚡</div>
              <h3>Visual WYSIWYG</h3>
              <p style="font-size: 15px; opacity: 0.8;">Click, drag, resize and edit text directly on the canvas with seamless desktop-class ergonomics.</p>
            </div>
            <div class="card">
              <div style="font-size: 28px; margin-bottom: 12px;">🤖</div>
              <h3>AI Slide Generation</h3>
              <p style="font-size: 15px; opacity: 0.8;">Generate full deck proposals or refine existing slides using conversational prompts and multi-turn edits.</p>
            </div>
            <div class="card">
              <div style="font-size: 28px; margin-bottom: 12px;">📊</div>
              <h3>Rich Data & Charts</h3>
              <p style="font-size: 15px; opacity: 0.8;">Embed beautiful statistics cards, comparison matrices, and clean diagrams ready for board presentations.</p>
            </div>
          </div>
          <div class="footer">
            <span>Features Overview</span>
            <span>Slide Deck</span>
          </div>
        </div>
      `;
      break;

    case "stats":
      bodyContent = `
        <div class="slide-container">
          <div>
            <div class="badge">Performance & Metrics</div>
            <h2>${custom?.title || "Growth & Key Highlights"}</h2>
            <p style="font-size: 18px; margin-bottom: 32px;">${custom?.subtitle || "Measurable milestones achieved in Q1 2026."}</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px;">
            <div class="card" style="text-align: center; padding: 32px 16px;">
              <div style="font-size: 46px; font-weight: 800; color: ${t.accentColor}; margin-bottom: 8px;">10x</div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Faster Creation</div>
              <div style="font-size: 13px; opacity: 0.7;">From prompt to deck</div>
            </div>
            <div class="card" style="text-align: center; padding: 32px 16px;">
              <div style="font-size: 46px; font-weight: 800; color: ${t.accentColor}; margin-bottom: 8px;">99.9%</div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Uptime SLA</div>
              <div style="font-size: 13px; opacity: 0.7;">Multiplayer sync</div>
            </div>
            <div class="card" style="text-align: center; padding: 32px 16px;">
              <div style="font-size: 46px; font-weight: 800; color: ${t.accentColor}; margin-bottom: 8px;">50ms</div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Realtime Latency</div>
              <div style="font-size: 13px; opacity: 0.7;">Global edge presence</div>
            </div>
            <div class="card" style="text-align: center; padding: 32px 16px;">
              <div style="font-size: 46px; font-weight: 800; color: ${t.accentColor}; margin-bottom: 8px;">100k+</div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Active Users</div>
              <div style="font-size: 13px; opacity: 0.7;">Trusted globally</div>
            </div>
          </div>
          <div class="footer">
            <span>Verified Analytics</span>
            <span>Slide Deck</span>
          </div>
        </div>
      `;
      break;

    case "comparison":
      bodyContent = `
        <div class="slide-container">
          <div>
            <div class="badge">Competitive Advantage</div>
            <h2>${custom?.title || "Why We Lead The Market"}</h2>
            <p style="font-size: 18px; margin-bottom: 28px;">${custom?.subtitle || "Side-by-side comparison of traditional slide makers vs our solution."}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 24px;">
            <div class="card" style="border-left: 4px solid #ef4444;">
              <h3 style="color: #ef4444; margin-bottom: 16px;">Traditional Presentation Tools</h3>
              <ul style="list-style: none; font-size: 16px; display: flex; flex-direction: column; gap: 12px; opacity: 0.85;">
                <li>❌ Manual copy-pasting and formatting bottlenecks</li>
                <li>❌ Version conflicts and outdated desktop files</li>
                <li>❌ Clunky AI without full design context</li>
                <li>❌ Limited real-time multiplayer co-authoring</li>
              </ul>
            </div>
            <div class="card" style="border-left: 4px solid ${t.accentColor};">
              <h3 style="color: ${t.accentColor}; margin-bottom: 16px;">Next-Gen PPT Platform</h3>
              <ul style="list-style: none; font-size: 16px; display: flex; flex-direction: column; gap: 12px; opacity: 0.95;">
                <li>✅ Context-aware AI generating complete styled slides</li>
                <li>✅ Conflict-free multiplayer Liveblocks storage</li>
                <li>✅ Instant visual + code editing in one place</li>
                <li>✅ Seamless one-click presentation mode and exports</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <span>Market Positioning</span>
            <span>Slide Deck</span>
          </div>
        </div>
      `;
      break;

    case "quote":
      bodyContent = `
        <div class="slide-container" style="justify-content: center; align-items: center; text-align: center;">
          <div class="badge">Vision & Philosophy</div>
          <div style="font-size: 72px; line-height: 1; color: ${t.accentColor}; margin-bottom: -16px; opacity: 0.8;">“</div>
          <blockquote style="font-size: 38px; font-weight: 700; line-height: 1.35; max-width: 950px; margin-bottom: 28px;">
            ${custom?.title || "Great presentations do not just inform—they inspire conviction and drive immediate action."}
          </blockquote>
          <p style="font-size: 20px; font-weight: 600; color: ${t.accentColor}; margin-bottom: 6px;">
            ${custom?.subtitle || "Leadership Team"}
          </p>
          <div style="font-size: 14px; opacity: 0.6;">Keynote 2026</div>
        </div>
      `;
      break;

    case "blank":
      bodyContent = `
        <div class="slide-container">
          <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <div class="badge">Canvas Ready</div>
            <h2>${custom?.title || "Start Creating"}</h2>
            <p style="font-size: 18px; max-width: 600px; margin-top: 12px;">
              ${custom?.subtitle || "Use the Ribbon bar above to insert text, cards, shapes, images, or ask the AI Assistant to generate custom content."}
            </p>
          </div>
        </div>
      `;
      break;

    case "title-content":
    default:
      bodyContent = `
        <div class="slide-container">
          <div>
            <div class="badge">Deep Dive</div>
            <h2>${custom?.title || "Strategic Objectives"}</h2>
            <p style="font-size: 18px; margin-bottom: 28px;">${custom?.subtitle || "Focused execution plan for enterprise acceleration."}</p>
          </div>
          <div class="card" style="margin-bottom: 24px;">
            <p style="font-size: 20px; line-height: 1.7; margin-bottom: 20px;">
              ${custom?.content || "We deliver a unified presentation ecosystem where AI assists your workflow without replacing human creativity. Build decks in minutes, iterate collaboratively, and captivate stakeholders."}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; border-top: 1px solid ${t.borderColor}; padding-top: 20px;">
              <div>
                <strong style="color: ${t.accentColor}; font-size: 18px;">Target Audience</strong>
                <p style="font-size: 15px; margin-top: 4px; opacity: 0.8;">Founders, product leaders, designers, and sales teams.</p>
              </div>
              <div>
                <strong style="color: ${t.accentColor}; font-size: 18px;">Delivery Timeline</strong>
                <p style="font-size: 15px; margin-top: 4px; opacity: 0.8;">Full rollout scheduled for immediate deployment.</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <span>Actionable Execution</span>
            <span>Slide Deck</span>
          </div>
        </div>
      `;
      break;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1280, initial-scale=1" />
    <style>${baseStyle}</style>
  </head>
  <body>
    ${bodyContent}
  </body>
</html>`;
}

export const STARTER_SLIDES: SlideData[] = [
  {
    id: "slide-1",
    title: "Title Slide",
    layout: "title",
    theme: "dark-modern",
    html: generateSlideHtml("title", "dark-modern", {
      title: 'Interactive AI <span class="highlight">Slideshow</span> Platform',
      subtitle: "Multiplayer collaboration, AI slide generation, and high-impact presentation design.",
    }),
    notes: "Introduce the topic and set an energetic tone. Welcome key stakeholders.",
  },
  {
    id: "slide-2",
    title: "Key Capabilities",
    layout: "features",
    theme: "dark-modern",
    html: generateSlideHtml("features", "dark-modern", {
      title: "Core System Capabilities",
      subtitle: "Built to accelerate deck generation and teamwork.",
    }),
    notes: "Walk through the 3 pillars: Visual WYSIWYG, AI co-pilot, and rich data components.",
  },
  {
    id: "slide-3",
    title: "Key Metrics",
    layout: "stats",
    theme: "dark-modern",
    html: generateSlideHtml("stats", "dark-modern", {
      title: "Performance & Impact Metrics",
      subtitle: "Tangible business results observed across all benchmark categories.",
    }),
    notes: "Emphasize the 10x faster creation time and sub-50ms latency.",
  },
  {
    id: "slide-4",
    title: "Competitive Edge",
    layout: "comparison",
    theme: "dark-modern",
    html: generateSlideHtml("comparison", "dark-modern", {
      title: "Why We Outperform Traditional Slide Tools",
      subtitle: "Side-by-side comparison of old-school slides vs our AI-powered ecosystem.",
    }),
    notes: "Address competitor alternatives and highlight our real-time collaboration advantage.",
  },
];

export function generateContinuationSlideHtml(
  title: string,
  themeOrId: string | SlideTheme = "dark-modern",
  initialElementSnippet = ""
): string {
  const t = getTheme(themeOrId);
  const animation = t.animation || "fade";
  const duration = t.animationDuration || "0.5s";
  const animCss = getAnimationCss(animation, duration);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1280, initial-scale=1" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        width: 1280px;
        height: 720px;
        overflow: hidden;
        background: ${t.gradient};
        background-color: ${t.background};
        color: ${t.textColor};
        font-family: ${t.fontFamily};
        -webkit-font-smoothing: antialiased;
      }
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
        width: 1280px;
        height: 720px;
        padding: 64px 88px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        position: relative;
        ${animCss}
      }
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: ${t.cardBg};
        border: 1px solid ${t.borderColor};
        color: ${t.accentColor};
        width: fit-content;
        margin-bottom: 14px;
      }
      h2 {
        font-size: 36px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.01em;
        margin-bottom: 24px;
      }
      .card {
        background: ${t.cardBg};
        border: 1px solid ${t.borderColor};
        border-radius: 16px;
        padding: 24px;
        backdrop-filter: blur(12px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        opacity: 0.6;
        border-top: 1px solid ${t.borderColor};
        padding-top: 16px;
        margin-top: auto;
      }
    </style>
  </head>
  <body>
    <div class="slide-container">
      <div class="badge">Continued</div>
      <h2>${title}</h2>
      <div class="continuation-content" style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
        ${initialElementSnippet || '<p style="font-size: 18px; opacity: 0.85;">Continued content...</p>'}
      </div>
      <div class="footer">
        <span>Continuation</span>
        <span>Presentation Deck</span>
      </div>
    </div>
  </body>
</html>`;
}
