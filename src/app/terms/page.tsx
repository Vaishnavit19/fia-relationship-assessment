// src/app/terms/page.tsx
import { Metadata } from 'next';

import TermsOfService from '@/components/pages/TermsOfService/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service | FIA Relationship Assessment',
  description:
    'Terms of Service for FIA Relationship Assessment - Understand your rights and responsibilities when using our service.',
  robots: 'index, follow',
  openGraph: {
    title: 'Terms of Service | FIA Relationship Assessment',
    description:
      'Terms of Service for FIA Relationship Assessment - Understand your rights and responsibilities when using our service.',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsOfService showLastUpdated={true} printFriendly={false} />;
}
