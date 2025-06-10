// src/components/pages/EnhancedAssessmentPage/EnhancedAssessmentPage.tsx
'use client';

import { Check, ChevronLeft, ChevronRight, MapPin, Clock, Heart, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  getExtendedScenarioById,
  isMultiSelectScenario,
  getMultiSelectRequirements,
} from '../../../lib/data';
import useEnhancedAssessmentStore from '../../../lib/store';
import { ExtendedScenario, ExtendedAnswerOption, UserData } from '../../../lib/types';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import PageLayout from '../../ui/PageLayout';
import { ProgressBar } from '../../ui/ProgressBar';
import UserInfoForm from '../../ui/UserInfoForm';

import styles from './EnhancedAssessmentPage.module.scss';

// Helper function to safely convert date-like values to Date objects
// This fixes the issue where Zustand persistence deserializes Date objects as strings,
// causing "getTime is not a function" errors when trying to call Date methods
const ensureDate = (dateValue: Date | string | number | null | undefined): Date => {
  if (!dateValue) return new Date();

  // If it's already a Date object, return it
  if (dateValue instanceof Date) {
    // Check if it's a valid date
    if (!isNaN(dateValue.getTime())) {
      return dateValue;
    }
    return new Date();
  }

  // If it's a string or number, try to parse it
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Fallback to current time
  return new Date();
};

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
  const router = useRouter();

  // ==========================================================================
  // STORE STATE & ACTIONS
  // ==========================================================================

  const {
    // Core state
    currentScenario,
    answers,
    scores,
    estimatedProgress,
    userPath,
    isComplete,
    isStarted,
    userData,
    // Multi-select state
    isMultiSelectMode,
    currentMultiSelectState,
    multiSelectError,
    // Actions
    setUserData,
    startAssessment,
    submitAnswer,
    submitMultiSelectAnswer,
    goToNextScenario,
    goToPreviousScenario,
    initializeMultiSelect,
    toggleMultiSelectOption,
    validateMultiSelectState,
    clearMultiSelectError,
    getIsCurrentScenarioMultiSelect,
    completeAssessment,
  } = useEnhancedAssessmentStore();

  // ==========================================================================
  // LOCAL STATE
  // ==========================================================================

  // For single select scenarios
  const [selectedOption, setSelectedOption] = useState<ExtendedAnswerOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScenarioData, setCurrentScenarioData] = useState<ExtendedScenario | null>(null);

  // Local multi-select state to work around store bug
  const [localMultiSelectOptions, setLocalMultiSelectOptions] = useState<ExtendedAnswerOption[]>(
    []
  );

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const isCurrentMultiSelect = currentScenarioData?.minSelection
    ? currentScenarioData.minSelection > 1
    : false;
  const multiSelectRequirements = isCurrentMultiSelect
    ? getMultiSelectRequirements(currentScenario)
    : null;

  // Check if we can proceed (different logic for single vs multi-select)
  const canProceed = isCurrentMultiSelect
    ? multiSelectRequirements
      ? localMultiSelectOptions.length >= multiSelectRequirements.minSelections
      : false
    : selectedOption !== null;

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  const canGoBack = answers.length > 0;
  const canGoNext = canProceed && !isSubmitting;

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
  // EFFECTS
  // ==========================================================================

  // Load current scenario data when scenario changes
  useEffect(() => {
    const scenarioData = getExtendedScenarioById(currentScenario);
    setCurrentScenarioData(scenarioData || null);

    // Reset selections when scenario changes
    setSelectedOption(null);
    setLocalMultiSelectOptions([]);

    // Initialize multi-select mode if needed (still call this for store consistency)
    if (scenarioData && isMultiSelectScenario(currentScenario)) {
      initializeMultiSelect(scenarioData);
    }
  }, [currentScenario, initializeMultiSelect]);

  // Handle assessment completion
  useEffect(() => {
    if (isComplete) {
      router.push('/results');
      onComplete?.();
    }
  }, [isComplete, router, onComplete]);

  // Fix: Ensure date fields are always proper Date objects on mount/hydration
  // This prevents the "getTime is not a function" error that occurs when Zustand
  // persistence deserializes Date objects as strings
  useEffect(() => {
    useEnhancedAssessmentStore.setState(state => ({
      lastActivityTime: ensureDate(state.lastActivityTime),
      startTime: ensureDate(state.startTime),
    }));
  }, []);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  // Handle user registration
  const handleUserSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for user registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserData(data);

      // Fix: Ensure date fields are properly initialized before starting assessment
      const now = new Date();
      useEnhancedAssessmentStore.setState(state => ({
        lastActivityTime: now,
        startTime: now,
      }));

      startAssessment();

      // Log user data for backend integration
      console.log('User registered:', data);
    } catch (err) {
      setError('Failed to start assessment. Please try again.');
      console.error('User registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleOptionSelect = (option: ExtendedAnswerOption) => {
    if (isSubmitting) return;
    setSelectedOption(option);
    clearMultiSelectError();
  };

  const handleMultiOptionToggle = (option: ExtendedAnswerOption) => {
    if (isSubmitting) return;

    const isSelected = localMultiSelectOptions.some(selected => selected.letter === option.letter);

    if (isSelected) {
      // Remove the option
      setLocalMultiSelectOptions(prev =>
        prev.filter(selected => selected.letter !== option.letter)
      );
    } else {
      // Add the option
      setLocalMultiSelectOptions(prev => [...prev, option]);
    }
  };

  const handleNext = async () => {
    if (!canGoNext) return;

    setIsSubmitting(true);

    try {
      // Fix: Ensure lastActivityTime is a proper Date object before submitting
      // This works around the Zustand persistence issue where Dates become strings
      const currentState = useEnhancedAssessmentStore.getState();
      const lastActivityTime = ensureDate(currentState.lastActivityTime);
      const startTime = ensureDate(currentState.startTime);

      useEnhancedAssessmentStore.setState(state => ({
        lastActivityTime,
        startTime,
      }));

      if (isCurrentMultiSelect) {
        // Handle multi-select submission using local state
        if (localMultiSelectOptions.length > 0) {
          await submitMultiSelectAnswer(localMultiSelectOptions);
        }
      } else {
        // Handle single-select submission
        if (selectedOption) {
          await submitAnswer(selectedOption);
        }
      }

      // NOTE: submitAnswer and submitMultiSelectAnswer already handle navigation
      // No need to call goToNextScenario() here
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (!canGoBack || isSubmitting) return;

    // Fix: Ensure date fields are proper Date objects before navigation
    const currentState = useEnhancedAssessmentStore.getState();
    useEnhancedAssessmentStore.setState(state => ({
      lastActivityTime: ensureDate(currentState.lastActivityTime),
      startTime: ensureDate(currentState.startTime),
    }));

    goToPreviousScenario();
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
    const context = getScenarioContext(currentScenario);

    return (
      <div className={styles.scenarioHeader}>
        <div className={styles.scenarioMeta}>
          {getScenarioTypeIcon(currentScenario)}
          <div className={styles.scenarioInfo}>
            <span className={styles.scenarioNumber}>Question {answers.length + 1}</span>
            {context && (
              <span className={styles.scenarioContext}>
                {context.city || context.location} • {context.situation}
              </span>
            )}
          </div>
          {isCurrentMultiSelect && multiSelectRequirements && (
            <span className={styles.multiSelectBadge}>
              Select {multiSelectRequirements.minSelections} options
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderScenarioContent = () => {
    if (!currentScenarioData) return null;

    return (
      <Card className={styles.scenarioCard}>
        <div className={styles.scenarioText}>
          <h2>{currentScenarioData.text}</h2>
          {isCurrentMultiSelect && multiSelectRequirements && (
            <p className={styles.multiSelectInstructions}>
              Please select exactly {multiSelectRequirements.minSelections} option
              {multiSelectRequirements.minSelections > 1 ? 's' : ''} that best represent your
              approach.
            </p>
          )}
        </div>

        {renderOptions()}
        {renderMultiSelectStatus()}

        {/* Error Display */}
        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </Card>
    );
  };

  const renderOptions = () => {
    if (!currentScenarioData) return null;

    return (
      <div className={styles.optionsContainer}>
        {currentScenarioData.options.map(option => {
          let isSelected = false;

          if (isCurrentMultiSelect) {
            isSelected = localMultiSelectOptions.some(
              selected => selected.letter === option.letter
            );
          } else {
            isSelected = selectedOption?.letter === option.letter;
          }

          return (
            <button
              key={option.letter}
              className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                if (isCurrentMultiSelect) {
                  handleMultiOptionToggle(option);
                } else {
                  handleSingleOptionSelect(option);
                }
              }}
              disabled={isSubmitting}
            >
              <div className={styles.optionLetter}>
                {isSelected ? <Check className={styles.checkIcon} /> : option.letter}
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
          );
        })}
      </div>
    );
  };

  const renderMultiSelectStatus = () => {
    if (!isCurrentMultiSelect || !multiSelectRequirements) return null;

    const selectedCount = localMultiSelectOptions.length;
    const required = multiSelectRequirements.minSelections;
    const isValid = selectedCount >= required;

    return (
      <div className={styles.multiSelectStatus}>
        <div className={`${styles.selectionCounter} ${isValid ? styles.valid : styles.invalid}`}>
          <span>
            {selectedCount} of {required} selected
          </span>
          {isValid && <Check className={styles.validIcon} />}
        </div>

        {multiSelectError && (
          <div className={styles.errorMessage}>
            <AlertCircle className={styles.errorIcon} />
            <span>{multiSelectError}</span>
          </div>
        )}
      </div>
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
        disabled={!canGoNext}
        loading={isSubmitting}
        className={styles.nextButton}
      >
        {isCurrentMultiSelect ? 'Submit Selections' : 'Next Question'}
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
        <div className={styles.debugInfo}>
          <p>Current Scenario: {currentScenario}</p>
          <p>Is Multi-Select: {isCurrentMultiSelect ? 'Yes' : 'No'}</p>
          {isCurrentMultiSelect && multiSelectRequirements && (
            <>
              <p>Required Selections: {multiSelectRequirements.minSelections}</p>
              <p>Selected Options: {localMultiSelectOptions.map(opt => opt.letter).join(', ')}</p>
            </>
          )}
        </div>
      </Card>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  // Show completion screen
  if (isComplete) {
    return (
      <PageLayout
        maxWidth="md"
        centered
        background="gradient"
        footerProps={{
          minimal: true,
        }}
      >
        <div className={`${styles.completionContainer} ${className}`}>
          <Card className={styles.completionCard}>
            <div className={styles.completionContent}>
              <Check className={styles.completionIcon} />
              <h2>Assessment Complete!</h2>
              <p>Calculating your relationship archetype and vulnerability assessment...</p>
              <div className={styles.completionProgress}>
                <div className={styles.loadingSpinner}></div>
                <span>Redirecting to results...</span>
              </div>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  // Show initial user info form if not started
  if (!isStarted || !userData) {
    return (
      <PageLayout maxWidth="md" centered background="gradient">
        <div className={`${styles.assessmentPage} ${className}`}>
          <div className={styles.welcomeContainer}>
            <Card className={styles.welcomeCard}>
              <div className={styles.welcomeContent}>
                <h1>Enhanced Relationship Assessment</h1>
                <p>
                  Discover your partnership style and vulnerability patterns through travel
                  scenarios. This assessment takes about 8-12 minutes and provides personalized
                  insights across multiple dimensions of relationship dynamics.
                </p>
              </div>

              <UserInfoForm onSubmit={handleUserSubmit} loading={isLoading} error={error} />
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Loading state for scenario data
  if (!currentScenarioData) {
    return (
      <PageLayout
        maxWidth="lg"
        centered
        background="gradient"
        footerProps={{
          minimal: true,
        }}
      >
        <div className={`${styles.assessmentPage} ${className}`}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p>Loading assessment...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Main assessment interface
  return (
    <PageLayout
      maxWidth="lg"
      background="gradient"
      footerProps={{
        minimal: true,
      }}
    >
      <div className={`${styles.assessmentPage} ${className}`}>
        <div className={styles.questionnaireContainer}>
          {renderProgressSection()}
          {renderScenarioHeader()}

          <div className={styles.mainContent}>
            {renderScenarioContent()}
            {renderCurrentScores()}
          </div>

          {renderNavigation()}
        </div>
      </div>
    </PageLayout>
  );
};

export default EnhancedAssessmentPage;
