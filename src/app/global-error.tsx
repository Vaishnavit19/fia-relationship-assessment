
// ==========================================================================
// GLOBAL ERROR PAGE
// ==========================================================================

// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang='en'>
      <head>
        <title>Something went wrong | FIA Relationship Assessment</title>
      </head>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e8e5ff 0%, #f4f2ff 50%, #faf9ff 100%)',
        }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '1.5rem',
            boxShadow: '0 0.5rem 1.875rem rgba(139, 124, 255, 0.08)',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '1rem',
            }}>
              Something went wrong!
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              marginBottom: '2rem',
            }}>
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 0.375rem 1.5625rem rgba(255, 107, 157, 0.3)',
              }}
              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
