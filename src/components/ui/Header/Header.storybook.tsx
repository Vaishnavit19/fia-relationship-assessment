// src/components/ui/Header/Header.storybook.tsx
'use client';

import { ArrowLeft, Heart, Home, Info } from 'lucide-react';
// import Link from 'next/link';
import React from 'react';

import styles from './Header.module.scss';

export interface HeaderStorybookProps {
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
  /** Progress value for Storybook */
  progress?: number;
  /** Assessment started state for Storybook */
  isStarted?: boolean;
  /** Assessment complete state for Storybook */
  isComplete?: boolean;
  /** Current pathname for Storybook */
  pathname?: string;
}

export const HeaderStorybook: React.FC<HeaderStorybookProps> = ({
  showProgress = 'auto',
  showBackButton = false,
  onBack,
  className = '',
  fixed = false,
  title,
  progress = 0,
  isStarted = false,
  isComplete = false,
  pathname = '/',
}) => {
  // Auto-detect if we should show progress based on current route
  const shouldShowProgress =
    showProgress === 'auto'
      ? isStarted && !isComplete && (pathname.includes('/assessment') || pathname.includes('/results'))
      : showProgress;

  // Auto-detect if we should show back button
  const shouldShowBackButton =
    showBackButton || (pathname.includes('/assessment') && isStarted);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Back button clicked (Storybook)');
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
            <div className={styles.logo}>
              <Heart size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>
                {title ?? 'FIA Assessment'}
              </span>
            </div>
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
            <div
              className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
              aria-label="Home"
            >
              <Home size={20} />
              <span className={styles.navText}>Home</span>
            </div>
            <div
              className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
              aria-label="About the assessment"
            >
              <Info size={20} />
              <span className={styles.navText}>About</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};