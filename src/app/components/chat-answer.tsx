"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * The assistant's reply.
 *
 * The system prompt asks the model for "tight bullet points", so it answers in
 * markdown. The palette used to print that source straight into a pre-wrap
 * div, which meant a **bolded** phrase reached the reader still wearing its
 * asterisks and a `-` list stayed a column of hyphens. This parses it.
 *
 * Imported through next/dynamic from ai-chatbox.tsx rather than statically.
 * The launcher is mounted in the root layout, so a static import would put the
 * markdown parser in the first-load bundle of every page on the site for a
 * feature most visitors never open. The chunk is fetched when the palette
 * opens, which is at least one network round trip before any answer exists.
 *
 * All of the styling lives in the `.cmdk-a` rules in globals.css, which reach
 * these elements as plain descendants. The only thing CSS cannot supply is the
 * link's target and rel, so that is the one override here.
 */
export default function ChatAnswer({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          // mailto: is the likely link here (the prompt hands out Melvin's
          // address), and a new tab for one of those leaves a blank window
          // behind after the mail client takes over.
          const external = /^https?:/i.test(href ?? "");
          return (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
