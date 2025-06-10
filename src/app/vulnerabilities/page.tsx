// src/app/vulnerabilities/page.tsx
// ==========================================================================
// VULNERABILITY CARDS PAGE - DETAILED VULNERABILITY ANALYSIS ROUTE
// ==========================================================================

import { Metadata } from 'next';

import VulnerabilityCardsPage from '@/components/pages/VulnerabilityCardsPage/VulnerabilityCardsPage';

export const metadata: Metadata = {
  title: 'Vulnerability Assessment | FIA Relationship Assessment',
  description:
    'Detailed vulnerability awareness and persona analysis based on your relationship archetype.',
  robots: 'noindex, nofollow', // Don't index vulnerability pages
};

export default function Page() {
  return <VulnerabilityCardsPage />;
}
