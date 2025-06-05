// src/app/assessment/page.tsx
// ==========================================================================
// ASSESSMENT PAGE - ASSESSMENT FLOW ROUTE
// ==========================================================================

import { Metadata } from 'next';

import AssessmentPage from '@/components/pages/AssessmentPage/AssessmentPage';


export const metadata: Metadata = {
  title: 'Assessment | FIA Relationship Assessment',
  description: 'Take the relationship assessment through travel scenarios to discover your partnership style.',
  robots: 'noindex, nofollow', // Don't index assessment pages
};

export default function Page() {
  return <AssessmentPage />;
}