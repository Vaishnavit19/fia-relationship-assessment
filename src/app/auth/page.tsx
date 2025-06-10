// src/app/auth/page.tsx
// ==========================================================================
// AUTH PAGE - USER AUTHENTICATION ROUTE
// ==========================================================================

import { Metadata } from 'next';

import AuthPage from '@/components/pages/AuthPage/AuthPage';

export const metadata: Metadata = {
  title: 'Sign Up | FIA Relationship Assessment',
  description:
    'Sign up to start your personalized relationship assessment and discover your partnership style.',
  robots: 'noindex, nofollow', // Don't index auth pages
};

export default function Page() {
  return <AuthPage />;
}
