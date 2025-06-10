// src/app/results/page.tsx
// ==========================================================================
// RESULTS PAGE - TABBED RESULTS INTERFACE ROUTE
// ==========================================================================

import { Metadata } from 'next';

import TabbedResultsPage from '@/components/pages/TabbedResultsPage/TabbedResultsPage';

export const metadata: Metadata = {
  title: 'Results | FIA Relationship Assessment',
  description:
    'Your comprehensive relationship assessment results including archetypes, vulnerability patterns, and attraction insights.',
  robots: 'noindex, nofollow', // Don't index results pages for privacy
};

export default function Page() {
  return <TabbedResultsPage initialTab="archetypes" showAnalytics={true} />;
}
