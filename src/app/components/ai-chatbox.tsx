"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

interface Exchange {
  q: string;
  a: string;
}

const SUGGESTIONS = [
  "What's his data stack?",
  "Tell me about his experience",
  "What are his best projects?",
  "What awards has he won?",
  "How can I reach him?",
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AiChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number>(5);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const animsRef = useRef<Animation[]>([]);

  const showSuggestions = exchanges.length === 0 && !isLoading;

  // FLIP morph: animate the palette between the trigger's box and its own
  const runMorph = useCallback((dir: "in" | "out") => {
    const pal = paletteRef.current;
    const trig = triggerRef.current;
    if (!pal || !trig) return Promise.resolve();
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];

    const t = trig.getBoundingClientRect();
    const p = pal.getBoundingClientRect();
    if (!p.width || !p.height) return Promise.resolve();

    // transform that maps the palette onto the trigger (origin: top-left)
    const collapsed = {
      transform: `translate(${t.left - p.left}px, ${t.top - p.top}px) scale(${Math.max(
        t.width / p.width,
        0.02
      )}, ${Math.max(t.height / p.height, 0.02)})`,
      borderRadius: "12px",
    };
    const expanded = { transform: "none", borderRadius: "16px" };
    const timing: KeyframeAnimationOptions = {
      duration: 340,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    };
    pal.style.transformOrigin = "top left";

    const shell = pal.animate(
      dir === "in" ? [collapsed, expanded] : [expanded, collapsed],
      timing
    );
    // content stays hidden while the shell is small, then fades in
    const content = pal.querySelectorAll<HTMLElement>(
      ".cmdk-row, .cmdk-body, .cmdk-foot"
    );
    const contentAnims = Array.from(content).map((el) =>
      el.animate(
        dir === "in"
          ? [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }]
          : [{ opacity: 1 }, { opacity: 0 }],
        { duration: 340, easing: "ease", fill: "both" }
      )
    );
    animsRef.current = [shell, ...contentAnims];
    return shell.finished.catch(() => {});
  }, []);

  const open = useCallback(() => {
    setActiveIndex(0);
    setIsOpen(true); // morph fires from the layout effect below
  }, []);

  const close = useCallback(() => {
    if (prefersReduced()) {
      setIsOpen(false);
      return;
    }
    // reverse the morph, then unmount the overlay
    runMorph("out").then(() => setIsOpen(false));
  }, [runMorph]);

  // play the open morph once the overlay is laid out
  useIsomorphicLayoutEffect(() => {
    if (isOpen && !prefersReduced()) runMorph("in");
  }, [isOpen, runMorph]);

  // ⌘K / Ctrl+K toggles, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      } else if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close]);

  // focus input + lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [exchanges, isLoading]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || isLoading || remaining === 0) return;

    setInput("");
    setExchanges((prev) => [...prev, { q: question, a: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setExchanges((prev) =>
            prev.map((ex, i) =>
              i === prev.length - 1
                ? { ...ex, a: data.message || "You've reached the daily question limit. Please check back tomorrow." }
                : ex
            )
          );
          setRemaining(0);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      setExchanges((prev) =>
        prev.map((ex, i) => (i === prev.length - 1 ? { ...ex, a: data.message } : ex))
      );
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch (error) {
      console.error("Error:", error);
      setExchanges((prev) =>
        prev.map((ex, i) =>
          i === prev.length - 1
            ? { ...ex, a: "Something went wrong reaching the assistant. Please try again." }
            : ex
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    } else if (showSuggestions) {
      sendMessage(SUGGESTIONS[activeIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % SUGGESTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
    }
  };

  return (
    <>
      {/* Trigger chip */}
      <button
        ref={triggerRef}
        onClick={open}
        className={`cmdk-trigger${isOpen ? " is-hidden" : ""}`}
        aria-label="Ask the AI assistant (Ctrl or Cmd + K)"
      >
        <span className="cmdk-kbd">⌘K</span>
        Ask AI
      </button>

      {/* Overlay + palette */}
      <div
        className="cmdk-overlay"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="cmdk" ref={paletteRef} role="dialog" aria-label="Ask about Melvin" aria-modal="true">
          {/* Input row */}
          <form className="cmdk-row" onSubmit={handleSubmit}>
            <span className="cmdk-row-ico" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              ref={inputRef}
              className="cmdk-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={remaining > 0 ? "Ask about Melvin…" : "Daily limit reached — email him instead"}
              disabled={isLoading || remaining === 0}
              autoComplete="off"
            />
            <span className="cmdk-esc" aria-hidden="true">ESC</span>
          </form>

          {/* Body */}
          <div className="cmdk-body" ref={bodyRef}>
            {showSuggestions ? (
              <>
                <div className="cmdk-hint">Suggested</div>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    className="cmdk-sug"
                    data-active={i === activeIndex ? "true" : "false"}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => sendMessage(s)}
                  >
                    <span className="cmdk-sug-ico" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
                      </svg>
                    </span>
                    {s}
                    <span className="cmdk-sug-arrow" aria-hidden="true">↵</span>
                  </button>
                ))}
              </>
            ) : (
              <div className="cmdk-conv">
                {exchanges.map((ex, i) => (
                  <div key={i}>
                    <div className="cmdk-q">
                      <span className="cmdk-q-mark" aria-hidden="true">›</span>
                      <span>{ex.q}</span>
                    </div>
                    {ex.a ? (
                      <div className="cmdk-a" style={{ marginTop: 8 }}>{ex.a}</div>
                    ) : (
                      isLoading && i === exchanges.length - 1 && (
                        <div className="cmdk-typing" style={{ marginTop: 8 }} aria-label="Thinking">
                          <span className="cmdk-dot" />
                          <span className="cmdk-dot" />
                          <span className="cmdk-dot" />
                        </div>
                      )
                    )}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="cmdk-foot">
            <div className="cmdk-foot-keys">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> ask</span>
              <span><kbd>esc</kbd> close</span>
            </div>
            <span>{remaining} / 5 today</span>
          </div>
        </div>
      </div>
    </>
  );
}
