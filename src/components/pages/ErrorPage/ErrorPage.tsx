
// ==========================================================================
// ERROR PAGE ORCHESTRATOR COMPONENT
// ==========================================================================

// src/components/pages/ErrorPage/ErrorPage.tsx
'use client';

import { 
  AlertTriangle, 
  Home, 
  RefreshCw, 
  Search,
  ArrowLeft,
  Bug 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageLayout from '@/components/ui/PageLayout';

import styles from './ErrorPage.module.scss';



interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  type?: 'not-found' | 'error' | 'maintenance';
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  reset,
  type = 'not-found',
  title,
  message,
  showBackButton = true,
}) => {
  const router = useRouter();

  // Get error details based on type
  const getErrorDetails = () => {
    switch (type) {
      case 'not-found':
        return {
          icon: <Search size={64} />,
          title: title ?? '404 - Page Not Found',
          message: message ?? 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved, deleted, or the URL might be incorrect.',
          suggestions: [
            'Check the URL for any typing errors',
            'Go back to the previous page',
            'Visit our homepage to start fresh',
            'Take the relationship assessment',
          ],
        };
      case 'error':
        return {
          icon: <AlertTriangle size={64} />,
          title: title ?? 'Something Went Wrong',
          message: message ?? 'We encountered an unexpected error. Don\'t worry, our team has been notified and we\'re working to fix it.',
          suggestions: [
            'Try refreshing the page',
            'Clear your browser cache',
            'Check your internet connection',
            'Try again in a few minutes',
          ],
        };
      case 'maintenance':
        return {
          icon: <Bug size={64} />,
          title: title ?? 'Under Maintenance',
          message: message ?? 'We\'re currently performing scheduled maintenance to improve your experience. Please check back soon.',
          suggestions: [
            'Try again in a few minutes',
            'Follow us on social media for updates',
            'Contact support if this persists',
          ],
        };
      default:
        return {
          icon: <AlertTriangle size={64} />,
          title: 'Unknown Error',
          message: 'An unknown error occurred.',
          suggestions: ['Try refreshing the page'],
        };
    }
  };

  const errorDetails = getErrorDetails();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <PageLayout>
      <div className={styles.errorPage}>
        <div className="container">
          <div className={styles.errorContainer}>
            <Card variant="elevated" className={styles.errorCard}>
              <div className={styles.errorContent}>
                {/* Error Icon */}
                <div className={styles.errorIcon}>
                  {errorDetails.icon}
                </div>

                {/* Error Text */}
                <div className={styles.errorText}>
                  <h1 className={styles.errorTitle}>
                    {errorDetails.title}
                  </h1>
                  <p className={styles.errorMessage}>
                    {errorDetails.message}
                  </p>
                </div>

                {/* Error Details (for development) */}
                {error && process.env.NODE_ENV === 'development' && (
                  <details className={styles.errorDetails}>
                    <summary className={styles.errorDetailsSummary}>
                      Technical Details (Development Only)
                    </summary>
                    <div className={styles.errorDetailsContent}>
                      <p><strong>Error:</strong> {error.message}</p>
                      {error.stack && (
                        <pre className={styles.errorStack}>
                          {error.stack}
                        </pre>
                      )}
                      {error.digest && (
                        <p><strong>Error ID:</strong> {error.digest}</p>
                      )}
                    </div>
                  </details>
                )}

                {/* Suggestions */}
                {errorDetails.suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    <h3 className={styles.suggestionsTitle}>
                      What you can try:
                    </h3>
                    <ul className={styles.suggestionsList}>
                      {errorDetails.suggestions.map((suggestion, index) => (
                        <li key={index} className={styles.suggestion}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.errorActions}>
                  {type === 'error' && reset && (
                    <Button
                      variant="cta"
                      onClick={handleRefresh}
                      className={styles.primaryAction}
                    >
                      <RefreshCw size={16} />
                      Try Again
                    </Button>
                  )}
                  
                  <Link href="/" passHref>
                    <Button
                      variant={type === 'error' ? 'secondary' : 'cta'}
                      className={styles.homeAction}
                    >
                      <Home size={16} />
                      Go Home
                    </Button>
                  </Link>

                  {showBackButton && (
                    <Button
                      variant="secondary"
                      onClick={handleGoBack}
                      className={styles.backAction}
                    >
                      <ArrowLeft size={16} />
                      Go Back
                    </Button>
                  )}

                  {type === 'not-found' && (
                    <Link href="/assessment" passHref>
                      <Button
                        variant="secondary"
                        className={styles.assessmentAction}
                      >
                        Take Assessment
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Help */}
            <div className={styles.helpSection}>
              <Card className={styles.helpCard}>
                <h3 className={styles.helpTitle}>Need More Help?</h3>
                <p className={styles.helpText}>
                  If you continue to experience issues, please don&apos;t hesitate to reach out to our support team.
                </p>
                <div className={styles.helpActions}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      const subject = encodeURIComponent(`Error Report: ${errorDetails.title}`);
                      const body = encodeURIComponent(
                        `I encountered an error on the FIA Relationship Assessment:\n\n` +
                        `Error Type: ${type}\n` +
                        `Page URL: ${typeof window !== 'undefined' ? window.location.href : 'Unknown'}\n` +
                        `Timestamp: ${new Date().toISOString()}\n\n` +
                        `Additional Details:\n` +
                        `${error ? error.message : 'No additional error details'}\n\n` +
                        `Please help me resolve this issue.`
                      );
                      window.location.href = `mailto:support@fia.com?subject=${subject}&body=${body}`;
                    }}
                  >
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Specific error page components
export const NotFoundPage: React.FC = () => (
  <ErrorPage type="not-found" />
);

export const MaintenancePage: React.FC = () => (
  <ErrorPage type="maintenance" />
);

export default ErrorPage;