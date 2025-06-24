import type { Metadata } from 'next';

export const sitemetadata: Metadata = {
  title: 'FIA Relationship Assessment | Discover Your Love Style',
  description:
    'Discover your relationship style through 20+ branching travel scenarios. Learn about 8 personality archetypes (Achiever, Intellectual, Leader, Explorer, Peacemaker, Dreamer, Rebel, Caregiver), assess vulnerability patterns, and understand how you balance emotional connection, logical planning, and adventurous exploration in relationships.',
  keywords: [
    'relationship assessment',
    'compatibility test',
    'travel scenarios',
    'relationship dynamics',
    'love language',
    'personality test',
    'relationship archetype',
    'vulnerability assessment',
    'relationship red flags',
    'manipulation patterns',
    'dating safety',
    'relationship education',
    'achiever personality',
    'intellectual personality',
    'leader personality',
    'explorer personality',
    'peacemaker personality',
    'dreamer personality',
    'rebel personality',
    'caregiver personality',
    'London vs Paris',
    'travel-based personality',
    'relationship compatibility quiz',
    'dating assessment',
    'partnership styles',
    'relationship psychology',
    'emotional intelligence',
    'logical planning',
    'adventurous exploration',
    'branching questionnaire',
    'mathematical matching',
    'proximity algorithm',
    'relationship science',
    'travel psychology',
    'romantic compatibility',
    'relationship patterns',
  ],
  authors: [{ name: 'FIA' }],
  creator: 'FIA',
  publisher: 'FIA',

  // Enhanced favicon setup
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },

  // Open Graph for social sharing
  openGraph: {
    title: 'FIA Relationship Assessment | Discover Your Love Style',
    description:
      'Take our comprehensive 8-12 minute assessment with 20+ branching travel scenarios. Discover your relationship archetype among 8 types, learn about vulnerability patterns, and get personalized insights for healthier relationships.',
    url: 'https://fia-relationship-assessment.vercel.app',
    siteName: 'FIA Relationship Assessment',
    images: [
      {
        url: '/og-image.png', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'FIA Relationship Assessment - 8 Archetypes, Vulnerability Assessment, and Travel-Based Psychology',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'FIA Relationship Assessment | 8 Archetypes & Vulnerability Assessment',
    description:
      '20+ branching travel scenarios reveal your relationship archetype. Learn about vulnerability patterns and discover your unique blend of emotional, logical, and exploratory traits.',
    creator: '@FIA', // Add your Twitter handle if you have one
    images: ['/og-image.png'],
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Web app manifest
  manifest: '/site.webmanifest',

  // Verification (add these if you have them)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },

  // Category for app stores
  category: 'lifestyle',
};
