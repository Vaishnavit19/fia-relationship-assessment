// src/components/ui/ResultsSummary/ResultsSummary.tsx
'use client';

import { Download, RefreshCw, Share2, Heart, Trophy, Sparkles } from 'lucide-react';
import React from 'react';

import { AssessmentResult, UserData, RelationshipArchetype } from '@/lib/types';

import { ArchetypeCard } from '../ArchetypeCard';
import { Button } from '../Button';
import { Card } from '../Card';
import { ScoreChart } from '../ScoreChart';

import styles from './ResultsSummary.module.scss';

export interface ResultsSummaryProps {
  /** Complete assessment results */
  result: AssessmentResult;
  /** User information */
  userData: UserData;
  /** All available archetypes for comparison */
  allArchetypes: RelationshipArchetype[];
  /** Show secondary archetypes */
  showSecondaryArchetypes?: boolean;
  /** Show detailed insights */
  showInsights?: boolean;
  /** Show action buttons */
  showActions?: boolean;
  /** Enable sharing functionality */
  enableSharing?: boolean;
  /** Callback for retaking assessment */
  onRetake?: () => void;
  /** Callback for sharing results */
  onShare?: () => void;
  /** Callback for downloading results */
  onDownload?: () => void;
  /** Additional CSS class */
  className?: string;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  userData,
  allArchetypes,
  showSecondaryArchetypes = true,
  showInsights = true,
  showActions = true,
  enableSharing = true,
  onRetake,
  onShare,
  onDownload,
  className = '',
}) => {
  // Calculate secondary archetypes
  const secondaryArchetypes = React.useMemo(() => {
    if (!showSecondaryArchetypes) return [];

    const { emotional, logical, exploratory } = result.totalScores;
    const scores = [
      { type: 'emotional', value: emotional },
      { type: 'logical', value: logical },
      { type: 'exploratory', value: exploratory },
    ];

    // Helper function to map score type to archetype ID
    const getArchetypeIdFromType = (type: string): string => {
      const mapping: Record<string, string> = {
        emotional: 'heartfelt',
        logical: 'strategic',
        exploratory: 'spontaneous',
      };
      return mapping[type] || '';
    };

    // Sort by score descending
    scores.sort((a, b) => b.value - a.value);

    // Get top 2 scores that aren't the primary
    const primaryId = result.archetype.id;
    const secondaryIds = scores
      .filter(score => {
        const archetypeId = getArchetypeIdFromType(score.type);
        return archetypeId !== primaryId && score.value > 0;
      })
      .slice(0, 2)
      .map(score => getArchetypeIdFromType(score.type));

    return allArchetypes.filter(archetype => secondaryIds.includes(archetype.id));
  }, [result, allArchetypes, showSecondaryArchetypes]);

  // Get score for archetype
  const getScoreForArchetype = (archetypeId: string): number => {
    const mapping: Record<string, keyof typeof result.totalScores> = {
      heartfelt: 'emotional',
      strategic: 'logical',
      spontaneous: 'exploratory',
    };
    const scoreKey = mapping[archetypeId];
    return scoreKey ? result.totalScores[scoreKey] : 0;
  };

  // Generate insights based on results
  const generateInsights = (): string[] => {
    const { emotional, logical, exploratory } = result.totalScores;
    const total = emotional + logical + exploratory;
    const insights: string[] = [];

    // Primary archetype insight
    insights.push(
      `Your primary relationship style is **${result.archetype.name}**, which means you ${result.archetype.description.toLowerCase()}`
    );

    // Score balance insight
    const highestScore = Math.max(emotional, logical, exploratory);
    const lowestScore = Math.min(emotional, logical, exploratory);
    const scoreRange = highestScore - lowestScore;

    if (scoreRange <= 2) {
      insights.push(
        'You have a remarkably balanced approach to relationships, drawing from emotional connection, logical planning, and spontaneous exploration in nearly equal measure.'
      );
    } else if (scoreRange >= 6) {
      insights.push(
        'You have a distinct relationship style with clear preferences, showing strong tendencies toward specific approaches in your relationships.'
      );
    }

    // Specific dimension insights
    if (emotional >= 8) {
      insights.push(
        "Your high emotional score indicates you prioritize deep connection and your partner's feelings when making decisions together."
      );
    }
    if (logical >= 8) {
      insights.push(
        'Your high logical score shows you value efficiency and practical planning in your relationship decisions.'
      );
    }
    if (exploratory >= 8) {
      insights.push(
        'Your high exploratory score reveals you thrive on spontaneity and new experiences with your partner.'
      );
    }

    return insights;
  };

  const insights = showInsights ? generateInsights() : [];

  const summaryClasses = [styles.resultsSummary, className].filter(Boolean).join(' ');

  return (
    <div className={summaryClasses}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.celebration}>
          <div className={styles.celebrationIcon}>{result.archetype.icon}</div>
          <h1 className={styles.title}>Congratulations, {userData.name}!</h1>
          <p className={styles.subtitle}>You&apos;ve discovered your relationship archetype</p>
        </div>

        <div className={styles.completionInfo}>
          <div className={styles.completionBadge}>
            <Trophy size={16} />
            <span>Assessment Complete</span>
          </div>
          <div className={styles.completionDate}>
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Primary Archetype */}
      <div className={styles.primarySection}>
        <h2 className={styles.sectionTitle}>
          <Heart size={20} />
          Your Relationship Archetype
        </h2>
        <ArchetypeCard
          archetype={result.archetype}
          score={getScoreForArchetype(result.archetype.id)}
          maxScore={12}
          isPrimary={true}
          showScore={true}
          showDetails={true}
          showTraits={true}
          variant="result"
          size="large"
          animated={true}
          primaryBadge="Your Type"
        />
      </div>

      {/* Score Breakdown */}
      <div className={styles.scoresSection}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={20} />
          Your Score Breakdown
        </h2>
        <ScoreChart
          scores={result.totalScores}
          maxScore={12}
          showValues={true}
          size="large"
          animationDelay={800}
          animated={true}
        />
      </div>

      {/* Insights Section */}
      {showInsights && insights.length > 0 && (
        <div className={styles.insightsSection}>
          <h2 className={styles.sectionTitle}>
            <Trophy size={20} />
            Your Personal Insights
          </h2>
          <Card variant="elevated" className={styles.insightsCard}>
            <div className={styles.insightsList}>
              {insights.map((insight, index) => (
                <div key={index} className={styles.insight}>
                  <div className={styles.insightNumber}>{index + 1}</div>
                  <div
                    className={styles.insightText}
                    dangerouslySetInnerHTML={{
                      __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Secondary Archetypes */}
      {showSecondaryArchetypes && secondaryArchetypes.length > 0 && (
        <div className={styles.secondarySection}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} />
            Your Secondary Influences
          </h2>
          <div className={styles.secondaryGrid}>
            {secondaryArchetypes.map((archetype, index) => (
              <ArchetypeCard
                key={archetype.id}
                archetype={archetype}
                score={getScoreForArchetype(archetype.id)}
                maxScore={12}
                isSecondary={index === 0}
                showScore={true}
                showDetails={false}
                showTraits={false}
                variant="compact"
                size="medium"
                animated={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions Section */}
      {showActions && (
        <div className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>What&apos;s Next?</h2>
          <div className={styles.actionsGrid}>
            {enableSharing && onShare && (
              <Button variant="cta" size="large" onClick={onShare} className={styles.actionButton}>
                <Share2 size={20} />
                Share Your Results
              </Button>
            )}

            {onDownload && (
              <Button
                variant="secondary"
                size="large"
                onClick={onDownload}
                className={styles.actionButton}
              >
                <Download size={20} />
                Download Report
              </Button>
            )}

            {onRetake && (
              <Button
                variant="secondary"
                size="large"
                onClick={onRetake}
                className={styles.actionButton}
              >
                <RefreshCw size={20} />
                Retake Assessment
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          Understanding your relationship style is just the beginning. Use these insights to
          strengthen communication, plan adventures, and deepen your connection with your partner.
        </p>
        <div className={styles.footerBranding}>
          <span>Powered by FIA Relationship Assessment</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
