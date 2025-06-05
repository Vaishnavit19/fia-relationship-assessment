// ==========================================================================
// RESULTS PAGE ORCHESTRATOR COMPONENT
// ==========================================================================

// src/components/pages/ResultsPage/ResultsPage.tsx
'use client';

import {
  Download,
  RefreshCw,
  Share2,
  Home,
  Trophy,
  BarChart3,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { ArchetypeCard } from '@/components/ui/ArchetypeCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import PageLayout from '@/components/ui/PageLayout';
import ResultsSummary from '@/components/ui/ResultsSummary';
import ScoreChart from '@/components/ui/ScoreChart';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { archetypes } from '@/lib/data';
import { useResultsPage } from '@/lib/store';
// import type { AssessmentResult } from '@/lib/types';

import styles from './ResultsPage.module.scss';

export const ResultsPage: React.FC = () => {
  const router = useRouter();
  const { results, userData, resetAssessment } = useResultsPage();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check if results exist and redirect if not
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!results || !userData) {
        router.push('/');
      } else {
        setIsLoading(false);

        // Log results for backend integration
        console.log('Assessment completed:', {
          userData,
          results,
          completedAt: new Date(),
        });
      }
    }, 1000); // Small delay for better UX

    return () => clearTimeout(timer);
  }, [results, userData, router]);

  // Handle retaking assessment
  const handleRetakeAssessment = () => {
    resetAssessment();
    router.push('/assessment');
  };

  // Handle sharing
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!results || !userData) return;

    setIsDownloading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Log download request for backend integration
      console.log('PDF download requested:', {
        userData,
        results,
        requestedAt: new Date(),
      });

      // In real implementation, this would trigger PDF generation
      alert('PDF download feature coming soon!');
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle home navigation
  const handleGoHome = () => {
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <h2 className={styles.loadingTitle}>Calculating Your Results</h2>
          <p className={styles.loadingText}>
            We&apos;re analyzing your responses and preparing your personalized relationship
            insights...
          </p>
        </div>
      </PageLayout>
    );
  }

  // Error state - no results
  if (!results || !userData) {
    return (
      <PageLayout>
        <div className={styles.errorContainer}>
          <Card variant="elevated" className={styles.errorCard}>
            <div className={styles.errorContent}>
              <AlertCircle size={48} className={styles.errorIcon} />
              <h2 className={styles.errorTitle}>No Results Found</h2>
              <p className={styles.errorMessage}>
                It looks like you haven&apos;t completed the assessment yet. Take the assessment to
                discover your relationship archetype.
              </p>
              <div className={styles.errorActions}>
                <Button variant="cta" onClick={() => router.push('/assessment')}>
                  Take Assessment
                </Button>
                <Button variant="secondary" onClick={handleGoHome}>
                  <Home size={16} />
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Get secondary archetypes for comparison
  const primaryArchetype = results.archetype;
  const secondaryArchetypes = archetypes
    .filter(a => a.id !== primaryArchetype.id)
    .map(archetype => {
      const scoreKey =
        archetype.id === 'heartfelt'
          ? 'emotional'
          : archetype.id === 'strategic'
            ? 'logical'
            : 'exploratory';
      return {
        archetype,
        score: results.totalScores[scoreKey as keyof typeof results.totalScores],
      };
    })
    .sort((a, b) => b.score - a.score);

  const primaryScore = Math.max(
    results.totalScores.emotional,
    results.totalScores.logical,
    results.totalScores.exploratory
  );

  return (
    <PageLayout>
      <div className={styles.resultsPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className="container">
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                <h1 className={styles.headerTitle}>Your Assessment Results</h1>
                <p className={styles.headerSubtitle}>
                  Congratulations, {userData.name}! Here&apos;s your personalized relationship
                  profile.
                </p>
              </div>

              <div className={styles.headerActions}>
                <Button variant="secondary" onClick={handleShare} className={styles.actionButton}>
                  <Share2 size={16} />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  onClick={void handleDownloadPDF}
                  disabled={isDownloading}
                  className={styles.actionButton}
                >
                  {isDownloading ? <LoadingSpinner size="small" /> : <Download size={16} />}
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <div className="container">
            <div className={styles.contentGrid}>
              {/* Primary Result */}
              <section className={styles.primarySection}>
                <div className={styles.sectionHeader}>
                  <Trophy className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Your Primary Archetype</h2>
                </div>

                <ArchetypeCard
                  archetype={primaryArchetype}
                  score={primaryScore}
                  maxScore={12}
                  isPrimary={true}
                  showScore={true}
                  showDetails={true}
                  showTraits={true}
                  variant="result"
                  size="large"
                  primaryBadge="Your Primary Type"
                  animated={true}
                  className={styles.primaryArchetypeCard}
                />
              </section>

              {/* Score Breakdown */}
              <section className={styles.scoresSection}>
                <div className={styles.sectionHeader}>
                  <BarChart3 className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Score Breakdown</h2>
                </div>

                <ScoreChart
                  scores={results.totalScores}
                  maxScore={12}
                  animated={true}
                  className={styles.scoreChart}
                />
              </section>

              {/* Detailed Results Summary */}
              <section className={styles.summarySection}>
                <ResultsSummary
                  result={results}
                  userData={userData}
                  allArchetypes={archetypes} // <- Add this line
                  className={styles.resultsSummary}
                />
              </section>

              {/* Secondary Archetypes */}
              <section className={styles.secondarySection}>
                <div className={styles.sectionHeader}>
                  <Users className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Other Relationship Styles</h2>
                  <p className={styles.sectionSubtitle}>
                    See how you scored on other relationship archetypes
                  </p>
                </div>

                <div className={styles.secondaryGrid}>
                  {secondaryArchetypes.map(({ archetype, score }, index) => (
                    <ArchetypeCard
                      key={archetype.id}
                      archetype={archetype}
                      score={score}
                      maxScore={12}
                      isSecondary={index === 0}
                      showScore={true}
                      showDetails={false}
                      showTraits={false}
                      variant="compact"
                      size="medium"
                      animated={true}
                      className={styles.secondaryArchetypeCard}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className="container">
            <div className={styles.actionBarContent}>
              <div className={styles.actionBarText}>
                <h3 className={styles.actionBarTitle}>
                  Want to explore more or share your results?
                </h3>
                <p className={styles.actionBarSubtitle}>
                  Retake the assessment or share your archetype with friends and family.
                </p>
              </div>

              <div className={styles.actionBarButtons}>
                <Button
                  variant="secondary"
                  onClick={handleRetakeAssessment}
                  className={styles.actionBarButton}
                >
                  <RefreshCw size={16} />
                  Retake Assessment
                </Button>
                <Button variant="cta" onClick={handleGoHome} className={styles.actionBarButton}>
                  <Home size={16} />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareButtons
            shareData={{
              title: `I'm a ${primaryArchetype.name}! Discover your relationship archetype.`,
              text: `Take the FIA Relationship Assessment to discover your unique partnership style.`,
              url: typeof window !== 'undefined' ? window.location.href : '',
            }}
            className={styles.shareModal}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default ResultsPage;
