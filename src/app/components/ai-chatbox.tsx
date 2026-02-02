"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Melvin's AI assistant.\n\nI can help you learn about:\n• Work Experience & Leadership\n• Technical Skills & Stack\n• Projects & Achievements\n• Education @ UNSW\n• Contact & Availability\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.message || "Daily question limit reached.",
            },
          ]);
          setRemainingQuestions(0);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (typeof data.remaining === "number") {
        setRemainingQuestions(data.remaining);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-primary/20 hover:scale-105 hover:border-primary/30 flex items-center justify-center group"
        aria-label="Toggle chat"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isOpen ? (
          <X className="h-5 w-5 text-foreground/70 transition-all group-hover:text-foreground group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-5 w-5 text-foreground/70 transition-all group-hover:text-foreground group-hover:scale-110" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[480px] rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 shadow-2xl group">
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

          {/* Terminal Header */}
          <div className="relative bg-muted/50 backdrop-blur-sm border-b border-white/10 px-4 py-2.5 flex items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                aria-label="Close"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-muted-foreground font-mono text-xs">ai-assistant</span>
            </div>
            <div className="w-[52px]" /> {/* Spacer for centering */}
          </div>

          {/* Status Bar */}
          <div className="relative border-b border-white/10 px-4 py-2 bg-background/30">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-muted-foreground">status: online</span>
              </div>
              <div className="text-muted-foreground">
                quota: <span className={remainingQuestions > 0 ? "text-green-500" : "text-red-500"}>{remainingQuestions}/5</span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="font-mono text-xs leading-relaxed">
                {message.role === "user" ? (
                  <div className="flex gap-2">
                    <span className="text-primary shrink-0">{">"}</span>
                    <span className="text-foreground">{message.content}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-green-500">$</span>
                      <span>assistant</span>
                    </div>
                    <div className="ml-4 pl-3 border-l border-white/10 text-muted-foreground whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="font-mono text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-green-500">$</span>
                  <span>assistant</span>
                </div>
                <div className="ml-4 pl-3 border-l border-white/10 flex items-center gap-1 text-muted-foreground">
                  <span className="animate-pulse">processing</span>
                  <span className="flex gap-0.5">
                    <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                    <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                    <span className="animate-bounce">.</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative border-t border-white/10 bg-background/30 p-3">
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono text-xs">{">"}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={remainingQuestions > 0 ? "ask something..." : "limit reached"}
                className="flex-1 bg-transparent text-foreground font-mono text-xs focus:outline-none placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || remainingQuestions === 0}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || remainingQuestions === 0}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-primary/10"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
    </>
  );
}
