// src/components/ui/ProgressBar/ProgressBar.tsx
'use client';

import React from 'react';

import styles from './ProgressBar.module.scss';

export interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Show step indicators (e.g., "3 of 7") */
  showSteps?: boolean;
  /** Current step number */
  currentStep?: number;
  /** Total number of steps */
  totalSteps?: number;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'emotional' | 'logical' | 'exploratory';
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Show animated shimmer effect */
  animated?: boolean;
  /** Custom color override */
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showPercentage = false,
  showSteps = false,
  currentStep,
  totalSteps,
  size = 'medium',
  variant = 'primary',
  className = '',
  label,
  animated = true,
  color,
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);

  // Calculate step information
  const stepText = showSteps && currentStep && totalSteps 
    ? `${currentStep} of ${totalSteps}` 
    : null;

  const progressClasses = [
    styles.progressContainer,
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const progressBarId = React.useId();
  const labelId = React.useId();

  return (
    <div className={progressClasses}>
      {/* Progress Info */}
      {(showPercentage || showSteps || label) && (
        <div className={styles.progressInfo}>
          {label && (
            <span 
              id={labelId} 
              className={styles.progressLabel}
            >
              {label}
            </span>
          )}
          <div className={styles.progressText}>
            {showPercentage && (
              <span className={styles.percentage}>
                {percentage}%
              </span>
            )}
            {stepText && (
              <span className={styles.steps}>
                {stepText}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ 
            width: `${percentage}%`,
            ...(color && { background: color })
          }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? `Progress: ${percentage}% complete` : undefined}
          id={progressBarId}
        />
        
        {animated && (
          <div className={styles.shimmer} />
        )}
      </div>

      {/* Step Indicators (dots) */}
      {showSteps && totalSteps && (
        <div className={styles.stepIndicators}>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep ? stepNumber <= currentStep : false;
            const isCurrent = currentStep === stepNumber;
            
            return (
              <div
                key={stepNumber}
                className={`${styles.stepDot} ${
                  isCompleted ? styles.stepCompleted : ''
                } ${isCurrent ? styles.stepCurrent : ''}`}
                aria-label={`Step ${stepNumber}${isCompleted ? ' completed' : ''}${isCurrent ? ' current' : ''}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Default export for easier importing
export default ProgressBar;