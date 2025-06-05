// src/components/ui/AssessmentProgress/AssessmentProgress.tsx
'use client';

import { ChevronLeft, ChevronRight, Check, Circle, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from '../Button';
import { ProgressBar } from '../ProgressBar';

import styles from './AssessmentProgress.module.scss';

export interface AssessmentStep {
  /** Step number */
  id: number;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Whether step is completed */
  completed: boolean;
  /** Whether step is current */
  current: boolean;
  /** Whether step is accessible */
  accessible: boolean;
}

export interface AssessmentProgressProps {
  /** Current step number */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Array of step information */
  steps?: AssessmentStep[];
  /** Overall progress percentage */
  progress: number;
  /** Whether to show step details */
  showStepDetails?: boolean;
  /** Whether to show navigation buttons */
  showNavigation?: boolean;
  /** Whether previous button is enabled */
  canGoBack?: boolean;
  /** Whether next button is enabled */
  canGoNext?: boolean;
  /** Loading state for navigation */
  loading?: boolean;
  /** Callback for previous step */
  onPrevious?: () => void;
  /** Callback for next step */
  onNext?: () => void;
  /** Callback for step selection */
  onStepSelect?: (stepId: number) => void;
  /** Callback for restart */
  onRestart?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'compact' | 'detailed';
  /** Position of the component */
  position?: 'top' | 'bottom' | 'sidebar';
  /** Show restart button */
  showRestart?: boolean;
  /** Custom step labels */
  stepLabels?: string[];
  /** Assessment type for theming */
  assessmentType?: 'general' | 'relationship' | 'travel';
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  progress,
  showStepDetails = true,
  showNavigation = true,
  canGoBack = true,
  canGoNext = true,
  loading = false,
  onPrevious,
  onNext,
  onStepSelect,
  onRestart,
  className = '',
  variant = 'default',
  position = 'top',
  showRestart = false,
  stepLabels,
  assessmentType = 'relationship',
}) => {
  // Generate steps if not provided
  const generatedSteps: AssessmentStep[] = steps ?? Array.from({ length: totalSteps }, (_, index) => {
    const stepId = index + 1;
    return {
      id: stepId,
      title: stepLabels?.[index] ?? `Step ${stepId}`,
      description: `Question ${stepId} of ${totalSteps}`,
      completed: stepId < currentStep,
      current: stepId === currentStep,
      accessible: stepId <= currentStep,
    };
  });

  const currentStepData = generatedSteps.find(step => step.current);
  const completedSteps = generatedSteps.filter(step => step.completed).length;

  const progressClasses = [
    styles.assessmentProgress,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`],
    styles[`theme${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleStepClick = (stepId: number) => {
    const step = generatedSteps.find(s => s.id === stepId);
    if (step?.accessible && onStepSelect) {
      onStepSelect(stepId);
    }
  };

  return (
    <div className={progressClasses}>
      {/* Main Progress Bar */}
      <div className={styles.progressSection}>
        <ProgressBar
          value={progress}
          showPercentage={variant !== 'compact'}
          showSteps={variant === 'detailed'}
          currentStep={currentStep}
          totalSteps={totalSteps}
          size={variant === 'compact' ? 'small' : 'medium'}
          variant="primary"
          label={variant === 'detailed' ? 'Assessment Progress' : undefined}
        />
      </div>

      {/* Step Details */}
      {showStepDetails && currentStepData && (
        <div className={styles.stepDetails}>
          <div className={styles.stepInfo}>
            <span className={styles.stepNumber}>
              {currentStep} of {totalSteps}
            </span>
            <h3 className={styles.stepTitle}>{currentStepData.title}</h3>
            {currentStepData.description && (
              <p className={styles.stepDescription}>
                {currentStepData.description}
              </p>
            )}
          </div>
          
          {variant === 'detailed' && (
            <div className={styles.completionInfo}>
              <span className={styles.completedCount}>
                {completedSteps} completed
              </span>
              <span className={styles.remainingCount}>
                {totalSteps - currentStep} remaining
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step Indicators */}
      {variant === 'detailed' && (
        <div className={styles.stepIndicators}>
          {generatedSteps.map((step) => (
            <button
              key={step.id}
              className={`${styles.stepIndicator} ${
                step.completed ? styles.stepCompleted : ''
              } ${step.current ? styles.stepCurrent : ''} ${
                !step.accessible ? styles.stepInaccessible : ''
              }`}
              onClick={() => handleStepClick(step.id)}
              disabled={!step.accessible || loading}
              aria-label={`${step.title}${step.completed ? ' (completed)' : ''}${
                step.current ? ' (current)' : ''
              }`}
              title={step.title}
            >
              <div className={styles.stepIndicatorContent}>
                {step.completed ? (
                  <Check size={12} />
                ) : step.current ? (
                  <div className={styles.currentDot} />
                ) : (
                  <Circle size={12} />
                )}
              </div>
              {position === 'sidebar' && (
                <span className={styles.stepLabel}>{step.title}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Navigation Controls */}
      {showNavigation && (
        <div className={styles.navigationControls}>
          <div className={styles.navigationLeft}>
            {canGoBack && onPrevious && (
              <Button
                variant="secondary"
                size="medium"
                onClick={onPrevious}
                disabled={!canGoBack || loading}
                className={styles.navButton}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
            
            {showRestart && onRestart && (
              <Button
                variant="secondary"
                size="medium"
                onClick={onRestart}
                disabled={loading}
                className={styles.restartButton}
              >
                <RotateCcw size={16} />
                Restart
              </Button>
            )}
          </div>

          <div className={styles.navigationRight}>
            {canGoNext && onNext && (
              <Button
                variant="primary"
                size="medium"
                onClick={onNext}
                disabled={!canGoNext || loading}
                loading={loading}
                className={styles.navButton}
              >
                {currentStep === totalSteps ? 'Complete' : 'Next'}
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {variant === 'detailed' && position !== 'sidebar' && (
        <div className={styles.quickStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(progress)}%</span>
            <span className={styles.statLabel}>Complete</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedSteps}</span>
            <span className={styles.statLabel}>Finished</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalSteps - currentStep}</span>
            <span className={styles.statLabel}>Remaining</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for easier importing
export default AssessmentProgress;