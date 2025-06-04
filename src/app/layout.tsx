// src/app/layout.tsx
import { Inter } from 'next/font/google';
import '../styles/globals.scss';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: 'FIA Relationship Assessment',
  description: 'Discover your relationship style through travel scenarios. Understand how you balance emotional connection, logical planning, and adventurous exploration.',
  keywords: 'relationship assessment, compatibility test, travel scenarios, relationship dynamics',
  authors: [{ name: 'FIA' }],
  openGraph: {
    title: 'FIA Relationship Assessment',
    description: 'Discover your relationship style through travel scenarios',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}