"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BOOT_LINES = [
  "MELVIN-OS v2.6 — terminal bios 06.2026",
  "memory check ............. 640K OK",
  "mounting /portfolio ...... OK",
  "loading personality ...... OK",
  "dialing mainframe ........ CONNECTED",
  "quota daemon ............. 5 questions / day",
];

const WELCOME =
  "Hi! I'm Melvin's AI assistant.\n\nI can help you learn about:\n• Work Experience & Leadership\n• Technical Skills & Stack\n• Projects & Achievements\n• Education @ UNSW\n• Contact & Availability\n\nHow can I help you today?";

export default function AiChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [booted, setBooted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, bootStep, booted, isLoading]);

  // boot sequence — runs once, line by line, the first time the terminal opens
  useEffect(() => {
    if (!isOpen || booted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBootStep(BOOT_LINES.length);
      setBooted(true);
      return;
    }
    if (bootStep >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        setBooted(true);
        inputRef.current?.focus();
      }, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootStep((s) => s + 1), bootStep === 0 ? 350 : 280);
    return () => clearTimeout(t);
  }, [isOpen, bootStep, booted]);

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
          content: "SIGNAL LOST. Check the line and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating power button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="crt-btn fixed bottom-6 right-6 z-50 h-12 px-4 rounded-lg font-mono text-[13px] tracking-widest transition-all duration-300 flex items-center gap-1.5"
        aria-label="Toggle AI terminal"
      >
        {isOpen ? (
          <span className="crt-acc">[×]</span>
        ) : (
          <>
            <span className="crt-text">AI</span>
            <span className="crt-cursor" />
          </>
        )}
      </button>

      {/* Terminal window */}
      {isOpen && (
        <div className="crt-window crt-on fixed bottom-24 right-6 z-50 w-[360px] h-[500px] flex flex-col font-mono">
          {/* Title bar */}
          <div className="relative z-[5] flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,140,60,0.25)] bg-[rgba(255,120,40,0.05)]">
            <span className="crt-acc text-[11px] tracking-[0.18em]">MELVIN-OS ▸ TTY1</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="crt-dim">
                QUOTA <span className={remainingQuestions > 0 ? "crt-text" : "crt-acc"}>{remainingQuestions}/5</span>
              </span>
              <button onClick={() => setIsOpen(false)} className="crt-text crt-link text-[12px]" aria-label="Close">
                [×]
              </button>
            </div>
          </div>

          {/* Screen */}
          <div className="crt-screen relative z-[2] flex-1 overflow-y-auto px-4 py-3 text-[12px] leading-relaxed">
            {/* boot scrollback */}
            <div className="space-y-0.5 mb-3">
              {BOOT_LINES.slice(0, bootStep).map((line, i) => (
                <div key={i} className={i === 0 ? "crt-bright" : "crt-dim"}>{line}</div>
              ))}
              {!booted && bootStep > 0 && <span className="crt-cursor" />}
              {booted && (
                <div className="crt-acc mt-2">READY — ASK ME ABOUT MELVIN.</div>
              )}
            </div>

            {/* conversation */}
            {booted && (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    {message.role === "user" ? (
                      <div className="flex gap-2">
                        <span className="crt-acc shrink-0">C:\&gt;</span>
                        <span className="crt-bright">{message.content}</span>
                      </div>
                    ) : (
                      <div>
                        <div className="crt-dim text-[10px] tracking-[0.18em] mb-1">MELVIN.AI ::</div>
                        <div className="crt-text whitespace-pre-wrap pl-3 border-l border-[rgba(255,140,60,0.25)]">
                          {message.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div>
                    <div className="crt-dim text-[10px] tracking-[0.18em] mb-1">MELVIN.AI ::</div>
                    <div className="crt-text pl-3 border-l border-[rgba(255,140,60,0.25)]">
                      processing<span className="crt-cursor" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt line */}
          <form
            onSubmit={handleSubmit}
            className="relative z-[5] flex items-center gap-2 px-4 py-3 border-t border-[rgba(255,140,60,0.25)] bg-[rgba(255,120,40,0.04)] text-[12px]"
          >
            <span className="crt-acc">C:\&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!booted ? "booting..." : remainingQuestions > 0 ? "type a question_" : "limit reached"}
              className="crt-bright flex-1 bg-transparent focus:outline-none placeholder:text-[rgba(255,179,119,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!booted || isLoading || remainingQuestions === 0}
            />
            <button
              type="submit"
              disabled={!booted || isLoading || !input.trim() || remainingQuestions === 0}
              className="crt-text crt-link text-[11px] tracking-[0.14em] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              [↵]
            </button>
          </form>
        </div>
      )}
    </>
  );
}
