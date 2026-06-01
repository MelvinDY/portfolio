"use client"

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TeHeader from '../../components/te-header'
import { useTeEffects } from '../../lib/use-te-effects'
import { BlogPost } from '../../types/blog'

interface Props {
  post: BlogPost
  next: BlogPost | null
}

function processContent(raw: string): string {
  return raw
    .replace(/^#\s+.+\n\n?/, '')       // remove leading # Title (shown in hero)
    .replace(/\n\n—\s*Melvin\s*$/, '')  // remove trailing — Melvin (added styled below)
    .replace(/\n—\s*Melvin\s*$/, '')
    .trimEnd()
}

export default function BlogPostTE({ post, next }: Props) {
  useTeEffects()

  const content = post.content ? processContent(post.content) : null

  return (
    <div className="te-home">
      <TeHeader activePage="blog" />

      <main>
        <section className="bart-hero">
          <div className="wrap">
            <div className="crumb" data-reveal>
              <Link href="/">home</Link><span>/</span>
              <Link href="/blog">blog</Link><span>/</span>
              <span className="now">{post.id.replace(/-/g, ' ')}</span>
            </div>
            <div className="bart-meta" data-reveal data-reveal-delay="1">
              {post.date} <span className="dim">·</span> <span className="dim">{post.readTime}</span>
            </div>
            <h1 data-reveal data-reveal-delay="1">{post.title}</h1>
            <div className="bart-tags" data-reveal data-reveal-delay="2">
              {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </section>

        <article className="bart-body bp" data-reveal>
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // skip the h1 — already shown in the hero above
                h1: () => null,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                hr: () => <hr />,
                // unwrap <pre> — the code block div is rendered inside <code>
                pre: ({ children }) => <>{children}</>,
                code: ({ className, children }) => {
                  const lang = className?.replace('language-', '') || ''
                  if (lang) {
                    return (
                      <div className="codeblock">
                        <div className="cb-bar">
                          <span className="cb-dots"><i /><i /><i /></span>
                          <span className="cb-lang">{lang}</span>
                        </div>
                        <pre><code>{children}</code></pre>
                      </div>
                    )
                  }
                  return <code>{children}</code>
                },
                a: ({ href, children }) => (
                  <a
                    className="inl"
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p>{post.excerpt}</p>
          )}
          <p className="sign">— Melvin</p>
        </article>

        <nav className="bart-foot">
          {next ? (
            <Link href={`/blog/${next.id}`}>
              <div className="wrap inner">
                <div>
                  <div className="nx-lab">Next post</div>
                  <div className="nx-title">{next.title}</div>
                </div>
                <span className="nx-arrow">→</span>
              </div>
            </Link>
          ) : (
            <Link href="/blog">
              <div className="wrap inner">
                <div>
                  <div className="nx-lab">Back to writing</div>
                  <div className="nx-title">All posts</div>
                </div>
                <span className="nx-arrow">→</span>
              </div>
            </Link>
          )}
        </nav>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-bottom" style={{ border: 0, margin: 0, padding: 0 }}>
            <span>© 2026 Melvin Darial Yogiana</span>
            <span><Link href="/blog" style={{ color: 'var(--ink-dim)' }}>← All posts</Link></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
