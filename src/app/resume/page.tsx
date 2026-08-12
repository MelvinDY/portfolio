import type { Metadata } from 'next'
import ResumeSheet, { VARIANTS, type Variant } from './resume-sheet'

/* Next 16 hands searchParams over as a promise, the same shape blog/[slug]
   already awaits for its params. Resolving the variant on the server keeps both
   versions real URLs with their own metadata, and means the toggle is two links
   rather than a client component. */
type Props = { searchParams: Promise<{ for?: string }> }

const resolve = (raw?: string): Variant => (raw === 'engineer' ? 'engineer' : 'data')

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const variant = resolve((await searchParams).for)
  const v = VARIANTS[variant]

  /* Distinct titles and descriptions so the two URLs do not read as duplicate
     content, and canonical points at the version being viewed. */
  return {
    title: `Resume, ${v.label}`,
    description: `${v.role} resume for Melvin Darial Yogiana, Sydney. Experience at Foresight Analytics and UNSW with Atlassian, selected projects, and a Computer Science degree from UNSW.`,
    alternates: { canonical: v.href },
    openGraph: {
      title: `Melvin Darial Yogiana, ${v.label} resume`,
      description: v.summary,
      url: v.href,
    },
  }
}

export default async function ResumePage({ searchParams }: Props) {
  return <ResumeSheet variant={resolve((await searchParams).for)} />
}
