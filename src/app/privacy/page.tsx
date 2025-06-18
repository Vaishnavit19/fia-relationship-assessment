// src/app/privacy/page.tsx
import { Metadata } from 'next';

import PrivacyPolicy from '@/components/pages/PrivacyPolicy/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | FIA Relationship Assessment',
  description:
    'Privacy Policy for FIA Relationship Assessment - Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow',
  openGraph: {
    title: 'Privacy Policy | FIA Relationship Assessment',
    description:
      'Privacy Policy for FIA Relationship Assessment - Learn how we collect, use, and protect your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicy showLastUpdated={true} printFriendly={false} />;
}
