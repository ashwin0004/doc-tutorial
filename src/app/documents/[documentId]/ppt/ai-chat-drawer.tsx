"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, SlideProposal } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Send,
  X,
  Check,
  Eye,
  Settings2,
  Bot,
  User,
  ArrowRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlideId: string;
  currentSlideHtml: string;
  onApplyProposal: (proposal: SlideProposal) => void;
  onPreviewProposal: (proposal: SlideProposal | null) => void;
  previewedProposalId?: string | null;
  onApplyTheme: (themeId: string) => void;
}

const STARTER_PROMPTS = [
  "Create a 3-slide launch deck for an AI product",
  "Turn this slide into key metrics and KPIs",
  "Add side-by-side competitor comparison",
  "Make this slide feel more modern and premium",
  "Change theme to Cyber Neon with glowing gradients",
];

const MODELS = [
  { id: "gemini-3-flash", name: "Gemini 3 Flash" },
  { id: "gpt-4o-mini", name: "GPT-4o mini" },
  { id: "claude-haiku-4.5", name: "Claude 3.5 Haiku" },
  { id: "deepseek-r1", name: "DeepSeek R1" },
];

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  currentSlideId,
  currentSlideHtml,
  onApplyProposal,
  onPreviewProposal,
  previewedProposalId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hello! I am your AI Presentation Assistant. I can generate full pitch decks, format slides, update metrics, or transform designs. Ask me anything or click one of the suggested prompts below.",
      timestamp: Date.now(),
      suggestions: STARTER_PROMPTS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [customApiKey, setCustomApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    setInput("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          currentSlideId,
          currentSlideHtml,
          model: selectedModel,
          apiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI response");
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I have generated the slide updates according to your instructions.",
        timestamp: Date.now(),
        thinking: data.thinking,
        proposals: data.proposals || [],
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "AI request failed");
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an issue fulfilling that request. Please try again or verify your settings.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 shrink-0 bg-white dark:bg-slate-900 border-l border-border flex flex-col h-full shadow-xl select-none z-10 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none">AI Slide Co-Pilot</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Realtime generative presentations</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="size-7 text-muted-foreground hover:text-foreground"
            title="Model & Key Settings"
          >
            <Settings2 className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="size-7 text-muted-foreground hover:text-foreground"
            title="Close Assistant"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Model & Settings Drawer */}
      {showSettings && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-border space-y-2 text-xs">
          <div>
            <label className="font-semibold block mb-1">AI Model Engine</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full h-8 px-2 rounded border border-border bg-white dark:bg-slate-900 text-xs"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Custom API Key (Optional)</label>
            <Input
              type="password"
              placeholder="sk-... (Leave empty to use built-in engine)"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="h-8 text-xs bg-white dark:bg-slate-900"
            />
          </div>
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <div className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="size-6 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-orange-600 text-white font-medium"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {/* Thinking step preview if present */}
                {msg.thinking && (
                  <div className="mb-2 p-2 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] text-muted-foreground italic">
                    💭 {msg.thinking}
                  </div>
                )}
                <div>{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="size-3.5" />
                </div>
              )}
            </div>

            {/* Generated Slide Proposals (Liveblocks style) */}
            {msg.proposals && msg.proposals.length > 0 && (
              <div className="pl-8 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Layers className="size-3" />
                  Generated Slide Proposals ({msg.proposals.length})
                </span>
                {msg.proposals.map((proposal) => {
                  const isPreviewing = previewedProposalId === proposal.id;

                  return (
                    <div
                      key={proposal.id}
                      className="p-3 rounded-lg border border-orange-200 dark:border-orange-950 bg-orange-50/60 dark:bg-orange-950/20 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-orange-900 dark:text-orange-200">
                          {proposal.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-200/80 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 font-mono">
                          {proposal.isNewSlide ? "+ New Slide" : "Replace Current"}
                        </span>
                      </div>
                      {proposal.summary && (
                        <p className="text-[11px] text-muted-foreground">{proposal.summary}</p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPreviewProposal(isPreviewing ? null : proposal)}
                          className={`h-7 text-xs flex-1 gap-1 ${
                            isPreviewing
                              ? "bg-blue-50 text-blue-600 border-blue-300"
                              : "bg-white dark:bg-slate-800"
                          }`}
                        >
                          <Eye className="size-3" />
                          {isPreviewing ? "Exit Preview" : "Preview"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            onApplyProposal(proposal);
                            toast.success(proposal.isNewSlide ? "Slide added to deck!" : "Slide updated!");
                          }}
                          className="h-7 text-xs flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold gap-1"
                        >
                          <Check className="size-3" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Suggestion Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="pl-8 pt-1 flex flex-wrap gap-1.5">
                {msg.suggestions.map((suggestion, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-[11px] px-2 py-1 rounded-full border border-border bg-slate-50 dark:bg-slate-800 hover:border-orange-400 hover:text-orange-600 transition-colors text-left flex items-center gap-1"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="size-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-orange-600 animate-pulse pl-8">
            <Sparkles className="size-3.5 animate-spin" />
            <span>AI is architecting 16:9 presentation slide...</span>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-border bg-slate-50 dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to design or modify slides..."
            disabled={isLoading}
            className="h-9 text-xs bg-white dark:bg-slate-800"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="size-9 shrink-0 bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
