// src/app/assessment/page.tsx
// ==========================================================================
// ASSESSMENT PAGE - ENHANCED ASSESSMENT FLOW ROUTE
// ==========================================================================

import { Metadata } from 'next';

import EnhancedAssessmentPage from '@/components/pages/EnhancedAssessmentPage/EnhancedAssessmentPage';

export const metadata: Metadata = {
  title: 'Assessment | FIA Relationship Assessment',
  description:
    'Take the enhanced relationship assessment through travel scenarios to discover your partnership style and vulnerability patterns.',
  robots: 'noindex, nofollow', // Don't index assessment pages
};

export default function Page() {
  return <EnhancedAssessmentPage debug={process.env.NODE_ENV === 'development'} />;
}
