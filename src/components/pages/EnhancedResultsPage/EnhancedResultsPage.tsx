// src/components/pages/EnhancedResultsPage/EnhancedResultsPage.tsx
'use client';

import {
  Trophy,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Info,
  Download,
  Share2,
  RefreshCw,
  Home,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { formatArchetypeResultsForDisplay } from '../../../lib/resultsEngine';
import useEnhancedAssessmentStore, { useAssessmentStore } from '../../../lib/store';
import { ArchetypeMatch, ArchetypeResults } from '../../../lib/types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import PageLayout from '../../ui/PageLayout';

import styles from './EnhancedResultsPage.module.scss';

export interface EnhancedResultsPageProps {
  /** Debug mode for development */
  debug?: boolean;
  /** Show advanced analytics */
  showAnalytics?: boolean;
  /** Custom styling */
  className?: string;
}

export const EnhancedResultsPage: React.FC<EnhancedResultsPageProps> = ({
  debug = false,
  showAnalytics = true,
  className = '',
}) => {
  const router = useRouter();

  // ==========================================================================
  // STORE STATE & COMPUTED VALUES
  // ==========================================================================

  const {
    isComplete,
    userData,
    archetypeResults,
    scores,
    answers,
    userPath,
    resetAssessment,
    getAssessmentResult,
  } = useEnhancedAssessmentStore();

  // ==========================================================================
  // LOCAL STATE
  // ==========================================================================

  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeMatch | null>(null);
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const formattedResults = archetypeResults
    ? formatArchetypeResultsForDisplay(archetypeResults)
    : null;
  const assessmentResult = getAssessmentResult();

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isComplete || !archetypeResults || !userData) {
        router.push('/');
      } else {
        setIsLoading(false);
        // Auto-select the top archetype
        setSelectedArchetype(archetypeResults.topMatches[0] || null);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isComplete, archetypeResults, userData, router]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleRetakeAssessment = () => {
    resetAssessment();
    router.push('/assessment');
  };

  const handleDownloadResults = async () => {
    setIsDownloading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Results downloaded:', assessmentResult);
      // In real implementation, trigger PDF download
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Relationship Assessment Results',
        text: `I discovered I'm ${selectedArchetype?.archetype.name || 'learning about myself'} through this relationship assessment!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification in real implementation
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <Card className={styles.loadingCard}>
        <div className={styles.loadingContent}>
          <LoadingSpinner size="lg" />
          <h2>Calculating Your Results...</h2>
          <p>Analyzing your responses using advanced mathematical algorithms</p>
        </div>
      </Card>
    </div>
  );

  const renderScoresSummary = () => {
    if (!scores) return null;

    const totalScore = scores.emotional + scores.logical + scores.exploratory;
    const maxPossibleScore = answers.length * 2; // Each answer can score 0-2 per dimension

    return (
      <Card className={styles.scoresCard}>
        <div className={styles.scoresHeader}>
          <BarChart3 className={styles.scoresIcon} />
          <h3>Your Decision-Making Profile</h3>
        </div>

        <div className={styles.scoresGrid}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreBar}>
              <div
                className={`${styles.scoreProgress} ${styles.emotional}`}
                style={{ width: `${(scores.emotional / maxPossibleScore) * 100}%` }}
              />
            </div>
            <div className={styles.scoreDetails}>
              <span className={styles.scoreLabel}>Emotional Focus</span>
              <span className={styles.scoreValue}>{scores.emotional}</span>
            </div>
          </div>

          <div className={styles.scoreItem}>
            <div className={styles.scoreBar}>
              <div
                className={`${styles.scoreProgress} ${styles.logical}`}
                style={{ width: `${(scores.logical / maxPossibleScore) * 100}%` }}
              />
            </div>
            <div className={styles.scoreDetails}>
              <span className={styles.scoreLabel}>Logical Planning</span>
              <span className={styles.scoreValue}>{scores.logical}</span>
            </div>
          </div>

          <div className={styles.scoreItem}>
            <div className={styles.scoreBar}>
              <div
                className={`${styles.scoreProgress} ${styles.exploratory}`}
                style={{ width: `${(scores.exploratory / maxPossibleScore) * 100}%` }}
              />
            </div>
            <div className={styles.scoreDetails}>
              <span className={styles.scoreLabel}>Adventurous Spirit</span>
              <span className={styles.scoreValue}>{scores.exploratory}</span>
            </div>
          </div>
        </div>

        {debug && (
          <div className={styles.debugScores}>
            <small>
              Total: {totalScore}/{maxPossibleScore * 3} | Questions: {answers.length} | Path:{' '}
              {userPath?.branchingPoints || 0} branches
            </small>
          </div>
        )}
      </Card>
    );
  };

  const renderArchetypeRankings = () => {
    if (!formattedResults) return null;

    return (
      <Card className={styles.rankingsCard}>
        <div className={styles.rankingsHeader}>
          <Trophy className={styles.rankingsIcon} />
          <h3>Your Archetype Matches</h3>
          {formattedResults.hasTies && (
            <div className={styles.tieIndicator}>
              <Info className={styles.tieIcon} />
              <span>Close matches detected</span>
            </div>
          )}
        </div>

        <div className={styles.archetypesList}>
          {formattedResults.topMatches.map((match, index) => (
            <button
              key={match.archetype.id}
              className={`${styles.archetypeItem} ${
                selectedArchetype?.archetype.id === match.archetype.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedArchetype(match)}
            >
              <div className={styles.archetypeRank}>
                {index === 0 ? <Award className={styles.rankIcon} /> : match.rank}
              </div>

              <div className={styles.archetypeInfo}>
                <h4 className={styles.archetypeName}>{match.archetype.name}</h4>
                <p className={styles.archetypeTitle}>{match.archetype.title}</p>
              </div>

              <div className={styles.confidenceSection}>
                <div className={styles.confidenceBar}>
                  <div
                    className={styles.confidenceProgress}
                    style={{ width: `${match.confidence}%` }}
                  />
                </div>
                <span className={styles.confidenceValue}>{match.confidence}%</span>
              </div>

              <ChevronRight className={styles.selectIcon} />

              {debug && (
                <div className={styles.debugInfo}>
                  <small>Distance: {match.distance.toFixed(2)}</small>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className={styles.confidenceExplanation}>
          <button
            className={styles.confidenceToggle}
            onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
          >
            <Target className={styles.confidenceIcon} />
            How are confidence scores calculated?
          </button>

          {showConfidenceDetails && (
            <div className={styles.confidenceDetails}>
              <p>
                Confidence scores are calculated using mathematical proximity analysis. Your
                responses are compared to each archetype's ideal profile using Euclidean distance
                calculations across emotional, logical, and exploratory dimensions.
              </p>
              <ul>
                <li>
                  <strong>Higher scores</strong> indicate closer alignment with that archetype
                </li>
                <li>
                  <strong>Close scores</strong> suggest balanced personality traits
                </li>
                <li>
                  <strong>Large gaps</strong> indicate strong archetype alignment
                </li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderSelectedArchetypeDetails = () => {
    if (!selectedArchetype) return null;

    return (
      <Card className={styles.detailsCard}>
        <div className={styles.detailsHeader}>
          <div className={styles.archetypeIcon}>
            <Users />
          </div>
          <div className={styles.archetypeHeading}>
            <h2>{selectedArchetype.archetype.name}</h2>
            <p className={styles.archetypeSubtitle}>{selectedArchetype.archetype.title}</p>
            <div className={styles.confidenceBadge}>{selectedArchetype.confidence}% Match</div>
          </div>
        </div>

        <div className={styles.archetypeDescription}>
          <p>{selectedArchetype.archetype.description}</p>
        </div>

        <div className={styles.traitsSection}>
          <h4>Key Traits</h4>
          <div className={styles.traitsList}>
            {selectedArchetype.archetype.traits.map((trait, index) => (
              <span key={index} className={styles.traitTag}>
                {trait}
              </span>
            ))}
          </div>
        </div>

        {selectedArchetype.archetype.vulnerabilities && (
          <div className={styles.vulnerabilitiesPreview}>
            <h4>Awareness Areas</h4>
            <p className={styles.vulnerabilityHint}>
              Understanding your personality profile helps identify potential relationship dynamics.
              <span className={styles.continueHint}>Continue to see personalized insights.</span>
            </p>
          </div>
        )}
      </Card>
    );
  };

  const renderAnalytics = () => {
    if (!showAnalytics || !userPath || !assessmentResult) return null;

    return (
      <Card className={styles.analyticsCard}>
        <div className={styles.analyticsHeader}>
          <TrendingUp className={styles.analyticsIcon} />
          <h3>Assessment Analytics</h3>
        </div>

        <div className={styles.analyticsGrid}>
          <div className={styles.analyticItem}>
            <span className={styles.analyticLabel}>Questions Answered</span>
            <span className={styles.analyticValue}>{answers.length}</span>
          </div>

          <div className={styles.analyticItem}>
            <span className={styles.analyticLabel}>Branching Points</span>
            <span className={styles.analyticValue}>{userPath.branchingPoints}</span>
          </div>

          <div className={styles.analyticItem}>
            <span className={styles.analyticLabel}>Time Taken</span>
            <span className={styles.analyticValue}>
              {Math.round(assessmentResult.assessmentDuration / 60)}m
            </span>
          </div>

          <div className={styles.analyticItem}>
            <span className={styles.analyticLabel}>Path Taken</span>
            <span className={styles.analyticValue}>
              {userPath.pathSequence.slice(-2).join(' → ')}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  const renderActionButtons = () => (
    <div className={styles.actionsSection}>
      <div className={styles.primaryActions}>
        <Button
          variant="cta"
          size="lg"
          onClick={() => router.push('/vulnerabilities')}
          className={styles.continueButton}
        >
          Continue to Vulnerability Assessment
          <ChevronRight />
        </Button>
      </div>

      <div className={styles.secondaryActions}>
        <Button
          variant="outline"
          onClick={handleDownloadResults}
          loading={isDownloading}
          disabled={isDownloading}
        >
          <Download />
          Download Results
        </Button>

        <Button variant="outline" onClick={handleShareResults}>
          <Share2 />
          Share Results
        </Button>

        <Button variant="secondary" onClick={handleRetakeAssessment}>
          <RefreshCw />
          Retake Assessment
        </Button>

        <Button variant="secondary" onClick={() => router.push('/')}>
          <Home />
          Home
        </Button>
      </div>
    </div>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (isLoading) {
    return (
      <PageLayout maxWidth="lg" centered>
        {renderLoadingState()}
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl" className={className}>
      <div className={styles.resultsContainer}>
        <header className={styles.resultsHeader}>
          <h1>Your Relationship Profile Results</h1>
          <p>Based on mathematical analysis of your travel scenario responses</p>
        </header>

        <div className={styles.resultsContent}>
          <div className={styles.mainResults}>
            {renderScoresSummary()}
            {renderArchetypeRankings()}
            {renderSelectedArchetypeDetails()}
            {renderAnalytics()}
          </div>
        </div>

        {renderActionButtons()}
      </div>
    </PageLayout>
  );
};

export default EnhancedResultsPage;
