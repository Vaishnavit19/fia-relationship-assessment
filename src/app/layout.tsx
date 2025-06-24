// src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '../styles/globals.scss';
import { sitemetadata } from './seo-metadata';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = sitemetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-D5Y2D2SQ3Y" />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
