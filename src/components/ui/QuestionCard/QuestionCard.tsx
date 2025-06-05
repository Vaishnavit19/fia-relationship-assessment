// src/components/ui/QuestionCard/QuestionCard.tsx
'use client';

import { ChevronRight, HelpCircle } from 'lucide-react';
import React from 'react';

import { Button } from '../Button';

import styles from './QuestionCard.module.scss';

export interface QuestionOption {
  /** Option identifier (A, B, C, etc.) */
  letter: string;
  /** Option text content */
  text: string;
  /** Optional description or subtitle */
  description?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface QuestionCardProps {
  /** Question text */
  question: string;
  /** Optional question description or context */
  description?: string;
  /** Array of answer options */
  options: QuestionOption[];
  /** Currently selected option letter */
  selectedOption?: string;
  /** Callback when an option is selected */
  onOptionSelect: (optionLetter: string) => void;
  /** Callback when continue/next is clicked */
  onContinue?: () => void;
  /** Whether to show the continue button */
  showContinue?: boolean;
  /** Continue button text */
  continueText?: string;
  /** Whether the continue button is loading */
  loading?: boolean;
  /** Question number for display */
  questionNumber?: number;
  /** Total number of questions */
  totalQuestions?: number;
  /** Additional CSS classes */
  className?: string;
  /** Card variant style */
  variant?: 'default' | 'elevated' | 'bordered';
  /** Whether to show option letters */
  showOptionLetters?: boolean;
  /** Custom icon for the question */
  icon?: React.ReactNode;
  /** Whether options are in single or multi-select mode */
  multiSelect?: boolean;
  /** Error message to display */
  error?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  description,
  options,
  selectedOption,
  onOptionSelect,
  onContinue,
  showContinue = true,
  continueText = 'Continue',
  loading = false,
  questionNumber,
  totalQuestions,
  className = '',
  variant = 'default',
  showOptionLetters = true,
  icon,
  multiSelect = false,
  error,
}) => {
  const cardClasses = [
    styles.questionCard,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasSelection = selectedOption && options.some(opt => opt.letter === selectedOption);
  const canContinue = hasSelection && !loading;

  const handleOptionClick = (optionLetter: string) => {
    if (options.find(opt => opt.letter === optionLetter)?.disabled) {
      return;
    }
    onOptionSelect(optionLetter);
  };

  const handleKeyDown = (event: React.KeyboardEvent, optionLetter: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(optionLetter);
    }
  };

  return (
    <div className={cardClasses}>
      {/* Question Header */}
      <div className={styles.questionHeader}>
        {(questionNumber ?? totalQuestions) && (
          <div className={styles.questionMeta}>
            <span className={styles.questionNumber}>
              {questionNumber && totalQuestions 
                ? `Question ${questionNumber} of ${totalQuestions}`
                : questionNumber 
                ? `Question ${questionNumber}`
                : ''
              }
            </span>
          </div>
        )}
        
        <div className={styles.questionContent}>
          <div className={styles.questionTitle}>
            {icon && (
              <div className={styles.questionIcon}>
                {icon}
              </div>
            )}
            <h2 className={styles.questionText}>
              {question}
            </h2>
          </div>
          
          {description && (
            <p className={styles.questionDescription}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Options List */}
      <div className={styles.optionsList}>
        {options.map((option) => {
          const isSelected = selectedOption === option.letter;
          const isDisabled = option.disabled;
          
          const optionClasses = [
            styles.option,
            isSelected && styles.optionSelected,
            isDisabled && styles.optionDisabled,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={option.letter}
              className={optionClasses}
              onClick={() => handleOptionClick(option.letter)}
              onKeyDown={(e) => handleKeyDown(e, option.letter)}
              role={multiSelect ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
            >
              <div className={styles.optionContent}>
                {showOptionLetters && (
                  <div className={styles.optionLetter}>
                    {option.letter}
                  </div>
                )}
                
                <div className={styles.optionText}>
                  <span className={styles.optionMain}>
                    {option.text}
                  </span>
                  {option.description && (
                    <span className={styles.optionDescription}>
                      {option.description}
                    </span>
                  )}
                </div>
                
                <div className={styles.optionIndicator}>
                  {isSelected && (
                    <div className={styles.selectedIndicator}>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <HelpCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Continue Button */}
      {showContinue && (
        <div className={styles.continueSection}>
          <Button
            variant="cta"
            size="large"
            onClick={onContinue}
            disabled={!canContinue}
            loading={loading}
            className={styles.continueButton}
          >
            {continueText}
            {!loading && <ChevronRight size={20} />}
          </Button>
        </div>
      )}
    </div>
  );
};

// Default export for easier importing
export default QuestionCard;