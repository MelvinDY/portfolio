import type { Metadata } from 'next'
import ResumeSheet from './resume-sheet'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume for Melvin Darial Yogiana, a data analyst and full-stack developer in Sydney. Experience at Foresight Analytics and UNSW with Atlassian, selected projects, and a Computer Science degree from UNSW.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'Resume, Melvin Darial Yogiana',
    description: 'Data analyst and full-stack developer in Sydney. Experience, selected projects and education.',
    url: '/resume',
  },
}

export default function ResumePage() {
  return <ResumeSheet />
}
