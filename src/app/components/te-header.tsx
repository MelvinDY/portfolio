import Link from 'next/link'

interface TeHeaderProps {
  activePage?: 'data' | 'software' | 'blog' | 'about'
}

export default function TeHeader({ activePage }: TeHeaderProps) {
  return (
    <header className="site-head">
      <div className="wrap">
        <Link className="brand" href="/">
          <span className="dot" />
          <b>MELVIN</b><span className="slash">/</span><span className="dim">m3lv1n</span>
        </Link>
        <nav className="nav">
          <Link href="/projects/data" className={activePage === 'data' ? 'active' : ''}>Data</Link>
          <Link href="/projects/software" className={activePage === 'software' ? 'active' : ''}>Software</Link>
          <Link href="/blog" className={activePage === 'blog' ? 'active' : ''}>Blog</Link>
          <Link href="/about" className={activePage === 'about' ? 'active' : ''}>About</Link>
          <span className="sep" />
          <Link href="/#contact" className="acid-text">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
