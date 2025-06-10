// src/components/pages/EnhancedAssessmentPage/EnhancedAssessmentPage.tsx
'use client';

import { Check, ChevronLeft, ChevronRight, MapPin, Clock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ADDED: Import router for navigation
import React, { useEffect, useState } from 'react';

import { getExtendedScenarioById } from '../../../lib/data';
import useEnhancedAssessmentStore from '../../../lib/store';
import { ExtendedScenario, ExtendedAnswerOption } from '../../../lib/types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ProgressBar } from '../../ui/ProgressBar';

import styles from './EnhancedAssessmentPage.module.scss';

export interface EnhancedAssessmentPageProps {
  /** Callback when assessment is completed */
  onComplete?: () => void;
  /** Show debug information */
  debug?: boolean;
  /** Custom styling */
  className?: string;
}

export const EnhancedAssessmentPage: React.FC<EnhancedAssessmentPageProps> = ({
  onComplete,
  debug = false,
  className = '',
}) => {
  const router = useRouter(); // ADDED: Router for navigation

  // ==========================================================================
  // STORE STATE & ACTIONS
  // ==========================================================================

  const {
    currentScenario,
    answers,
    scores,
    estimatedProgress,
    userPath,
    isComplete,
    addAnswer,
    goToNextScenario,
    goToPreviousQuestion,
    completeAssessment,
  } = useEnhancedAssessmentStore();

  // ==========================================================================
  // LOCAL STATE
  // ==========================================================================

  const [selectedOption, setSelectedOption] = useState<ExtendedAnswerOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScenarioData, setCurrentScenarioData] = useState<ExtendedScenario | null>(null);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Load current scenario data when scenario changes
  useEffect(() => {
    const scenarioData = getExtendedScenarioById(currentScenario);
    setCurrentScenarioData(scenarioData || null);
    setSelectedOption(null); // Reset selection when scenario changes
  }, [currentScenario]);

  // Handle assessment completion
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // ADDED: Handle assessment completion and navigation
  useEffect(() => {
    if (isComplete) {
      if (onComplete) {
        // Call the onComplete callback if provided
        onComplete();
      } else {
        // Navigate to results page after a short delay
        const timer = setTimeout(() => {
          router.push('/results');
        }, 2500); // 2.5 second delay to show the completion message

        return () => clearTimeout(timer);
      }
    }
  }, [isComplete, onComplete, router]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleOptionSelect = (option: ExtendedAnswerOption) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (!selectedOption || !currentScenarioData) return;

    setIsSubmitting(true);

    try {
      // Add answer to store
      await addAnswer(currentScenarioData.id, selectedOption);

      // Determine next scenario
      const nextScenarioId = selectedOption.next;

      // FIXED: Check for all possible completion indicators
      if (
        nextScenarioId === 'complete' ||
        nextScenarioId === 'end' ||
        nextScenarioId === null ||
        nextScenarioId === undefined
      ) {
        await completeAssessment();
      } else {
        await goToNextScenario(nextScenarioId);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const canGoBack = answers.length > 0;
  const canGoNext = selectedOption !== null;

  const getScenarioTypeIcon = (scenarioId: number | string) => {
    const id = scenarioId.toString();
    if (id.includes('3')) return <MapPin className={styles.scenarioIcon} />;
    if (id.includes('4')) return <Clock className={styles.scenarioIcon} />;
    return <Heart className={styles.scenarioIcon} />;
  };

  const getScenarioContext = (scenarioId: number | string) => {
    const id = scenarioId.toString();
    if (id === '3.1') return { city: 'London', situation: 'Partner Delayed' };
    if (id === '3.2') return { city: 'Paris', situation: 'Partner Delayed' };
    if (id === '4.1') return { location: 'Airport Hotel', situation: 'Waiting Together' };
    if (id === '4.2') return { location: 'City Center', situation: 'Solo Exploration' };
    return null;
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const renderProgressSection = () => (
    <div className={styles.progressSection}>
      <ProgressBar
        current={estimatedProgress}
        total={100}
        showPercentage
        className={styles.progressBar}
      />
      <div className={styles.progressText}>
        <span>{Math.round(estimatedProgress)}% Complete</span>
        {debug && userPath && (
          <small className={styles.debugInfo}>
            Path Steps: {userPath.totalSteps} | Branching: {userPath.branchingPoints}
          </small>
        )}
      </div>
    </div>
  );

  const renderScenarioHeader = () => {
    if (!currentScenarioData) return null;

    const context = getScenarioContext(currentScenarioData.id);
    const typeIcon = getScenarioTypeIcon(currentScenarioData.id);

    return (
      <div className={styles.scenarioHeader}>
        <div className={styles.scenarioMeta}>
          {typeIcon}
          <span>Travel Scenario {currentScenarioData.id}</span>
          {context && (
            <div className={styles.scenarioContext}>
              {context.city && <span className={styles.cityTag}>{context.city}</span>}
              {context.location && <span className={styles.locationTag}>{context.location}</span>}
              <span className={styles.situationTag}>{context.situation || context.situation}</span>
            </div>
          )}
        </div>
        {debug && (
          <div className={styles.debugMeta}>
            <small>
              Scenario ID: {currentScenarioData.id} | Options: {currentScenarioData.options.length}
            </small>
          </div>
        )}
      </div>
    );
  };

  const renderScenarioContent = () => {
    if (!currentScenarioData) return null;

    return (
      <Card className={styles.questionCard}>
        <div className={styles.questionContent}>
          <h2 className={styles.questionText}>{currentScenarioData.text}</h2>

          <div className={styles.optionsContainer}>
            {currentScenarioData.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  selectedOption?.letter === option.letter ? styles.selected : ''
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={isSubmitting}
              >
                <div className={styles.optionLetter}>
                  {selectedOption?.letter === option.letter ? (
                    <Check className={styles.checkIcon} />
                  ) : (
                    option.letter
                  )}
                </div>
                <div className={styles.optionContent}>
                  <span className={styles.optionText}>{option.text}</span>
                  {debug && (
                    <div className={styles.optionDebug}>
                      <small>
                        Scores: L:{option.scores.logical} E:{option.scores.emotional} Ex:
                        {option.scores.exploratory} → Next: {option.next}
                      </small>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderNavigation = () => (
    <div className={styles.navigationSection}>
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={!canGoBack || isSubmitting}
        className={styles.backButton}
      >
        <ChevronLeft className={styles.navIcon} />
        Previous
      </Button>

      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!canGoNext || isSubmitting}
        loading={isSubmitting}
        className={styles.nextButton}
      >
        Next Question
        <ChevronRight className={styles.navIcon} />
      </Button>
    </div>
  );

  const renderCurrentScores = () => {
    if (!debug) return null;

    return (
      <Card className={styles.scoresCard}>
        <h4>Current Scores</h4>
        <div className={styles.scoresGrid}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Emotional</span>
            <span className={styles.scoreValue}>{scores.emotional}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Logical</span>
            <span className={styles.scoreValue}>{scores.logical}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Exploratory</span>
            <span className={styles.scoreValue}>{scores.exploratory}</span>
          </div>
        </div>
      </Card>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (isComplete) {
    return (
      <div className={`${styles.completionContainer} ${className}`}>
        <Card className={styles.completionCard}>
          <div className={styles.completionContent}>
            <Check className={styles.completionIcon} />
            <h2>Assessment Complete!</h2>
            <p>Calculating your relationship archetype and vulnerability assessment...</p>
            {/* ADDED: Enhanced completion UI */}
            <div className={styles.completionProgress}>
              <div className={styles.loadingSpinner}></div>
              <span>Redirecting to results...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${styles.questionnaireContainer} ${className}`}>
      {renderProgressSection()}
      {renderScenarioHeader()}

      <div className={styles.mainContent}>
        {renderScenarioContent()}
        {renderCurrentScores()}
      </div>

      {renderNavigation()}
    </div>
  );
};

export default EnhancedAssessmentPage;
