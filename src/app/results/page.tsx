// src/app/results/page.tsx
// ==========================================================================
// RESULTS PAGE - RESULTS DISPLAY ROUTE
// ==========================================================================

import { Metadata } from 'next';

import { ResultsPage } from '@/components/pages/ResultsPage';

export const metadata: Metadata = {
  title: 'Your Results | FIA Relationship Assessment',
  description: 'Discover your relationship archetype and understand your partnership style through detailed results.',
  robots: 'noindex, nofollow', // Don't index results pages
};

export default function Page() {
  return <ResultsPage />;
}
