import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Shared prose renderer for blog posts.

 *
 * Two things the old renderer did that this drops. Code blocks lose their fake
 * terminal chrome, the three coloured traffic-light dots, which is the same
 * banned pattern as a fake browser frame: the code is real, it does not need a
 * pretend window to look like software. The language label stays, because that
 * is genuine information.
 *
 * Measure is held near 68 characters. Long-form body sits at 17px on a 1.75
 * leading, which is a step up from the 15px used across the index pages,
 * because this is the one place on the site where someone reads for minutes
 * rather than seconds.
 */

const mono = { fontFamily: 'var(--font-mono), ui-monospace, monospace' } as const

/** Strips the leading H1 (shown in the page header) and the sign-off, which
 *  the shell renders itself. */
export function processContent(raw: string): string {
  return raw
    .replace(/^#\s+.+\n\n?/, '')
    .replace(/\n\n[—-]\s*Melvin\s*$/, '')
    .replace(/\n[—-]\s*Melvin\s*$/, '')
    .trimEnd()
}

/** Section headings, for the variant that offers a table of contents. */
export function headings(raw: string): { id: string; text: string }[] {
  return [...raw.matchAll(/^##\s+(.+)$/gm)].map(m => {
    const text = m[1].replace(/[*_`]/g, '').trim()
    return { id: slug(text), text }
  })
}

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="text-[17px] leading-[1.75] text-[#1F1C18]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: () => null,
          h2: ({ children }) => (
            <h2
              id={slug(String(children))}
              className="mt-14 scroll-mt-24 text-[clamp(1.4rem,2.4vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[#14120F]"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 text-[1.15rem] font-semibold tracking-[-0.015em] text-[#14120F]">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-5 max-w-[68ch]">{children}</p>,
          ul: ({ children }) => <ul className="mt-5 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-[#8A8378]">{children}</ul>,
          ol: ({ children }) => <ol className="mt-5 max-w-[68ch] list-decimal space-y-2 pl-5 marker:text-[#8A8378]">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-7 max-w-[62ch] border-l-2 border-[#ff5e1f] pl-5 text-[#5A544C] [&>p]:mt-0">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold text-[#14120F]">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="mt-12 border-0 border-t border-[#14120F]/15" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="border-b border-[#C13E00]/40 text-[#C13E00] transition-colors hover:border-[#C13E00]"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="mt-7 overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-[#14120F] px-3 py-2 text-left text-[11px] font-normal uppercase tracking-[0.14em] text-[#8A8378]" style={mono}>
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-b border-[#14120F]/15 px-3 py-2 align-top">{children}</td>,
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const lang = className?.replace('language-', '') || ''
            if (!lang) {
              return (
                <code className="rounded-none bg-[#EAEAE6] px-1.5 py-0.5 text-[0.88em] text-[#14120F]" style={mono}>
                  {children}
                </code>
              )
            }
            return (
              <figure className="m-0 mt-7">
                <figcaption
                  className="flex items-center justify-between border border-b-0 border-[#14120F]/15 bg-[#EAEAE6] px-4 py-2 text-[10.5px] uppercase tracking-[0.14em] text-[#8A8378]"
                  style={mono}
                >
                  {lang}
                </figcaption>
                <pre className="overflow-x-auto border border-[#14120F]/15 bg-[#EAEAE6] p-4">
                  <code className="text-[13px] leading-[1.7] text-[#14120F]" style={mono}>{children}</code>
                </pre>
              </figure>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
