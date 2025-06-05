// src/components/ui/Header/Header.tsx
'use client';

import { ArrowLeft, Heart, Home, Info } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useAssessmentData } from '@/lib/store';

import styles from './Header.module.scss';

export interface HeaderProps {
  /** Whether to show the assessment progress bar */
  showProgress?: boolean | 'auto';
  /** Whether to show the back button */
  showBackButton?: boolean;
  /** Custom back button handler */
  onBack?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use a fixed position header */
  fixed?: boolean;
  /** Custom title to override default branding */
  title?: string;
  /** Override progress value (for Storybook) */
  progressOverride?: number;
  /** Override assessment started state (for Storybook) */
  isStartedOverride?: boolean;
  /** Override assessment complete state (for Storybook) */
  isCompleteOverride?: boolean;
  /** Override current pathname (for Storybook) */
  pathnameOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showProgress = 'auto',
  showBackButton = false,
  onBack,
  className = '',
  fixed = false,
  title,
  progressOverride,
  isStartedOverride,
  isCompleteOverride,
  pathnameOverride,
}) => {
  // Always call hooks unconditionally - React Hook rules
  const pathname = usePathname();
  const assessmentData = useAssessmentData();

  // Use overrides if provided (for Storybook), otherwise use hook data
  const currentPathname = pathnameOverride ?? pathname ?? '/';
  const progress = progressOverride ?? assessmentData.progress ?? 0;
  const isStarted = isStartedOverride ?? assessmentData.isStarted ?? false;
  const isComplete = isCompleteOverride ?? assessmentData.isComplete ?? false;

  // Auto-detect if we should show progress based on current route
  const shouldShowProgress =
    showProgress === 'auto'
      ? isStarted && !isComplete && ((currentPathname?.includes('/assessment') ?? false) || (currentPathname?.includes('/results') ?? false))
      : showProgress;

  // Auto-detect if we should show back button
  const shouldShowBackButton =
    showBackButton || ((currentPathname?.includes('/assessment') ?? false) && isStarted);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined') {
      // Default back behavior - check if window exists (SSR safety)
      window.history.back();
    }
  };

  const headerClasses = [
    styles.header,
    fixed && styles.headerFixed,
    shouldShowProgress && styles.headerWithProgress,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses}>
      <div className={styles.container}>
        {/* Left section - Back button or logo */}
        <div className={styles.leftSection}>
          {shouldShowBackButton ? (
            <button
              onClick={handleBackClick}
              className={styles.backButton}
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft size={20} />
              <span className={styles.backText}>Back</span>
            </button>
          ) : (
            <Link href="/" className={styles.logo}>
              <Heart size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>
                {title ?? 'FIA Assessment'}
              </span>
            </Link>
          )}
        </div>

        {/* Center section - Progress or title */}
        <div className={styles.centerSection}>
          {shouldShowProgress ? (
            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span className={styles.progressText}>
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Assessment progress: ${Math.round(progress)}% complete`}
                />
              </div>
            </div>
          ) : (
            <h1 className={styles.pageTitle}>
              {title ?? 'Relationship Assessment'}
            </h1>
          )}
        </div>

        {/* Right section - Navigation */}
        <div className={styles.rightSection}>
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navLink} ${currentPathname === '/' ? styles.navLinkActive : ''}`}
              aria-label="Home"
            >
              <Home size={20} />
              <span className={styles.navText}>Home</span>
            </Link>
            <Link
              href="/about"
              className={`${styles.navLink} ${currentPathname === '/about' ? styles.navLinkActive : ''}`}
              aria-label="About the assessment"
            >
              <Info size={20} />
              <span className={styles.navText}>About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Default export for easier importing
export default Header;