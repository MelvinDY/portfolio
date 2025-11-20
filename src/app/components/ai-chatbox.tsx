"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "$ ai_assistant initialized\n\nHi! I'm Melvin's AI assistant. Ask me about:\n- Experience & Skills\n- Projects (OnlyCode, etc.)\n- Education (UNSW)\n- Contact information\n\nType your question below to get started.",
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

    // Add user message
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
        // Handle rate limit error
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

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      // Update remaining questions
      if (typeof data.remaining === "number") {
        setRemainingQuestions(data.remaining);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Terminal Header */}
          <div className="bg-muted border-b border-border px-4 py-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-foreground font-mono text-sm">melvin@ai-assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted-foreground/20 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Status Bar */}
          <div className="bg-background border-b border-border px-4 py-2">
            <div className="text-xs font-mono text-muted-foreground">
              {remainingQuestions > 0 ? (
                <span>
                  $ quota --remaining: <span className="text-green-500">{remainingQuestions}/5</span> questions today
                </span>
              ) : (
                <span className="text-red-500">$ quota --status: limit_reached</span>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((message, index) => (
              <div
                key={index}
                className="font-mono text-sm leading-relaxed"
              >
                {message.role === "user" ? (
                  <div className="text-foreground">
                    <span className="text-primary">{'>'} user:</span> {message.content}
                  </div>
                ) : (
                  <div className="text-foreground">
                    <span className="text-green-500">$ ai_assistant:</span>
                    <div className="ml-4 mt-1 text-muted-foreground whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-green-500">$ ai_assistant:</span>
                <div className="ml-4 mt-1">
                  <span className="animate-pulse">[processing...]</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border bg-background p-4"
          >
            <div className="font-mono text-sm">
              <div className="text-muted-foreground mb-2">$ ask_question:</div>
              <div className="flex items-center gap-2">
                <span className="text-primary">{'>'}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={remainingQuestions > 0 ? "type your question..." : "limit reached"}
                  className="flex-1 bg-transparent border-0 border-b border-border text-foreground font-mono focus:border-primary focus:outline-none p-0 pb-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || remainingQuestions === 0}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || remainingQuestions === 0}
                  className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1 font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  {isLoading ? "[ ... ]" : "[ send ]"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
