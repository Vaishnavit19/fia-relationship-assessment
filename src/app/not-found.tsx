// src/app/not-found.tsx
// ==========================================================================
// 404 PAGE - NOT FOUND ERROR PAGE
// ==========================================================================

import { Metadata } from 'next';

import { NotFoundPage } from '@/components/pages/ErrorPage';

export const metadata: Metadata = {
  title: '404 - Page Not Found | FIA Relationship Assessment',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return <NotFoundPage />;
}
