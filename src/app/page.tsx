// src/app/page.tsx
// ==========================================================================
// HOMEPAGE - LANDING PAGE COMPONENT
// ==========================================================================

// import { Metadata } from 'next';

import HomePage from '@/components/pages/HomePage/HomePage';

// export const metadata: Metadata = {
//   title: 'FIA Relationship Assessment | Discover Your Love Style',
//   description:
//     'Discover your relationship style through travel scenarios. Understand how you balance emotional connection, logical planning, and adventurous exploration in relationships.',
//   keywords:
//     'relationship assessment, compatibility test, travel scenarios, relationship dynamics, love language, personality test',
//   openGraph: {
//     title: 'FIA Relationship Assessment | Discover Your Love Style',
//     description:
//       'Take our unique travel-based assessment to discover your relationship archetype and understand your partnership style.',
//     type: 'website',
//     images: [
//       {
//         url: '/fia-logo.png',
//         width: 1200,
//         height: 630,
//         alt: 'FIA Relationship Assessment',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'FIA Relationship Assessment',
//     description: 'Discover your relationship style through travel scenarios',
//     images: ['/fia-logo.png'],
//   },
// };

export default function Page() {
  return <HomePage />;
}
