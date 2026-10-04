import { NextRequest, NextResponse } from "next/server";
import { generateSlideHtml, getTheme, SLIDE_THEMES } from "@/app/documents/[documentId]/ppt/slide-templates";
import { SlideProposal } from "@/app/documents/[documentId]/ppt/types";

interface RequestBody {
  prompt: string;
  action?: "generate-deck" | "edit-slide" | "add-slide" | "theme" | "chat";
  currentSlideHtml?: string;
  currentSlideId?: string;
  slides?: Array<{ id: string; title: string; html: string }>;
  theme?: string;
  model?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { prompt, currentSlideId, theme = "dark-modern" } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    const proposals: SlideProposal[] = [];
    let reply = "";
    let thinking = "";
    const suggestions: string[] = [];

    // Analyze intent from prompt
    const isNewDeck =
      lower.includes("pitch deck") ||
      lower.includes("presentation about") ||
      lower.includes("new deck") ||
      lower.includes("generate deck") ||
      lower.includes("slides for") ||
      lower.includes("create presentation");

    const isMetrics =
      lower.includes("metric") ||
      lower.includes("stat") ||
      lower.includes("kpi") ||
      lower.includes("number") ||
      lower.includes("growth");

    const isComparison =
      lower.includes("compare") ||
      lower.includes("comparison") ||
      lower.includes("vs") ||
      lower.includes("competitor");

    const isFeatures =
      lower.includes("feature") ||
      lower.includes("benefit") ||
      lower.includes("capability") ||
      lower.includes("product") ||
      lower.includes("service");

    const isQuote =
      lower.includes("quote") ||
      lower.includes("testimonial") ||
      lower.includes("vision") ||
      lower.includes("statement");

    // Theme changes
    let detectedTheme = theme;
    for (const t of SLIDE_THEMES) {
      if (lower.includes(t.name.toLowerCase()) || lower.includes(t.id)) {
        detectedTheme = t.id;
        break;
      }
    }
    if (lower.includes("dark") || lower.includes("black")) detectedTheme = "dark-modern";
    if (lower.includes("blue") || lower.includes("corporate")) detectedTheme = "corporate-blue";
    if (lower.includes("emerald") || lower.includes("green")) detectedTheme = "emerald-tech";
    if (lower.includes("sunset") || lower.includes("pink") || lower.includes("red")) detectedTheme = "sunset-vibrant";
    if (lower.includes("minimal") || lower.includes("clean") || lower.includes("white")) detectedTheme = "minimal-clean";
    if (lower.includes("neon") || lower.includes("cyber")) detectedTheme = "cyber-neon";

    thinking = `Identified intent: ${isNewDeck ? "Full Pitch Deck" : isMetrics ? "Metrics/KPIs" : isComparison ? "Comparison" : isFeatures ? "Features" : "Custom Slide Enhancement"}. Selected theme: ${getTheme(detectedTheme).name}. Formatted 16:9 responsive layout with typography and hierarchy.`;

    if (isNewDeck) {
      const topic = prompt.replace(/(create|generate|make|a|pitch deck|presentation|about|slides for)/gi, "").trim() || "Innovative Venture";
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      proposals.push({
        id: `proposal-title-${Date.now()}`,
        title: `${cleanTopic} - Overview`,
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: `Title slide introducing ${cleanTopic}`,
        html: generateSlideHtml("title", detectedTheme, {
          title: `${cleanTopic} <span class="highlight">Vision</span>`,
          subtitle: `Next-generation strategy, execution roadmap, and scalable market opportunity.`,
        }),
        notes: `Opening remarks: introduce ${cleanTopic} and align the audience around our core mission.`,
      });

      proposals.push({
        id: `proposal-feat-${Date.now() + 1}`,
        title: `${cleanTopic} - Core Capabilities`,
        isNewSlide: true,
        summary: `Features & unique value proposition for ${cleanTopic}`,
        html: generateSlideHtml("features", detectedTheme, {
          title: "Revolutionary Capabilities",
          subtitle: `How ${cleanTopic} solves friction points with unmatched efficiency.`,
        }),
        notes: `Walk through our 3 competitive advantages in depth.`,
      });

      proposals.push({
        id: `proposal-stats-${Date.now() + 2}`,
        title: `${cleanTopic} - Milestones & Metrics`,
        isNewSlide: true,
        summary: `Growth trajectory and market metrics`,
        html: generateSlideHtml("stats", detectedTheme, {
          title: "Milestones & Traction",
          subtitle: `Key performance indicators illustrating our exponential velocity.`,
        }),
        notes: `Highlight our 10x performance gains and user adoption metrics.`,
      });

      reply = `I have designed a cohesive 3-slide pitch deck tailored for **${cleanTopic}** using the **${getTheme(detectedTheme).name}** theme. It includes an opening title keynote, core capabilities breakdown, and high-impact traction metrics. Review the proposals below to apply them to your deck.`;
      suggestions.push("Add competitor comparison slide", "Change theme to Cyber Neon", "Add team introduction slide", "Generate executive summary");
    } else if (isMetrics) {
      proposals.push({
        id: `proposal-metrics-${Date.now()}`,
        title: "Traction & KPIs",
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: "High-impact performance metrics grid",
        html: generateSlideHtml("stats", detectedTheme, {
          title: "Performance & Impact Metrics",
          subtitle: "Measurable key milestones and revenue acceleration indicators.",
        }),
        notes: "Emphasize quantitative metrics and ROI for investors/clients.",
      });
      reply = `I updated the slide with a high-impact 4-metric KPI dashboard styled with **${getTheme(detectedTheme).name}** accents. Click **Apply to Slide** to update your presentation.`;
      suggestions.push("Change metric numbers", "Add comparison slide", "Make background dark gradient", "Export presentation to PDF");
    } else if (isComparison) {
      proposals.push({
        id: `proposal-comp-${Date.now()}`,
        title: "Market Comparison",
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: "Side-by-side competitive analysis",
        html: generateSlideHtml("comparison", detectedTheme, {
          title: "Competitive Analysis & Differentiation",
          subtitle: "Why our modern architectural foundation outperforms legacy solutions.",
        }),
        notes: "Detail the critical differences and explain why customers transition to us.",
      });
      reply = `I have generated a side-by-side comparative analysis highlighting our key differentiators against legacy approaches.`;
      suggestions.push("Add customer testimonials", "Show pricing tiers", "Add closing call to action");
    } else if (isFeatures) {
      proposals.push({
        id: `proposal-features-${Date.now()}`,
        title: "Key Features & Capabilities",
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: "3-card feature showcase with icons and descriptions",
        html: generateSlideHtml("features", detectedTheme, {
          title: "Key Capabilities & Architecture",
          subtitle: "Engineered for uncompromising speed, collaboration, and fidelity.",
        }),
        notes: "Present each feature pillar and answer technical architectural questions.",
      });
      reply = `I created a 3-column feature showcase card layout with clean modern spacing and badges.`;
      suggestions.push("Turn into metrics grid", "Add quote slide", "Change to Corporate Blue theme");
    } else if (isQuote) {
      proposals.push({
        id: `proposal-quote-${Date.now()}`,
        title: "Vision & Quote",
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: "Inspirational keynote quote slide",
        html: generateSlideHtml("quote", detectedTheme, {
          title: prompt.replace(/quote/gi, "").trim() || "The best way to predict the future is to build it collaboratively.",
          subtitle: "Founding Philosophy",
        }),
        notes: "Pause for audience reflection before moving into detailed execution.",
      });
      reply = `I crafted an elegant keynote quote slide designed to inspire your audience.`;
      suggestions.push("Add next steps slide", "Switch to Dark Modern theme", "Add summary slide");
    } else {
      // General slide modification or enhancement
      proposals.push({
        id: `proposal-custom-${Date.now()}`,
        title: "Enhanced Slide Design",
        targetSlideId: currentSlideId,
        isNewSlide: false,
        summary: `Enhanced design based on: "${prompt}"`,
        html: generateSlideHtml("two-column", detectedTheme, {
          title: "Accelerated Execution & Vision",
          subtitle: prompt,
        }),
        notes: "Custom slide refined based on user prompt instructions.",
      });
      reply = `I have refined your slide to match your prompt with enhanced visual hierarchy, premium card styling, and the **${getTheme(detectedTheme).name}** theme.`;
      suggestions.push("Make it a 3-card layout", "Turn into traction metrics", "Add executive quote");
    }

    return NextResponse.json({
      success: true,
      reply,
      thinking,
      proposals,
      suggestions,
    });
  } catch (err) {
    console.error("AI slide route error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process slide AI request" },
      { status: 500 }
    );
  }
}
