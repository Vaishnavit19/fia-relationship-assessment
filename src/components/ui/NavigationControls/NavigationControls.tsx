// src/components/ui/NavigationControls/NavigationControls.tsx
'use client';

import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  SkipBack, 
  SkipForward,
  RotateCcw,
  Home,
  Save,
  Check
} from 'lucide-react';
import React from 'react';

import { Button } from '../Button';

import styles from './NavigationControls.module.scss';

export interface NavigationAction {
  /** Action identifier */
  id: string;
  /** Button text */
  text: string;
  /** Button icon */
  icon?: React.ReactNode;
  /** Whether action is enabled */
  enabled: boolean;
  /** Whether action is loading */
  loading?: boolean;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'cta';
  /** Callback when clicked */
  onClick: () => void;
}

export interface NavigationControlsProps {
  /** Whether to show previous button */
  showPrevious?: boolean;
  /** Whether to show next button */
  showNext?: boolean;
  /** Whether previous is enabled */
  canGoBack?: boolean;
  /** Whether next is enabled */
  canGoNext?: boolean;
  /** Loading state for next action */
  nextLoading?: boolean;
  /** Loading state for previous action */
  previousLoading?: boolean;
  /** Custom text for previous button */
  previousText?: string;
  /** Custom text for next button */
  nextText?: string;
  /** Callback for previous action */
  onPrevious?: () => void;
  /** Callback for next action */
  onNext?: () => void;
  /** Additional custom actions */
  customActions?: NavigationAction[];
  /** Additional CSS classes */
  className?: string;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'spaced' | 'minimal';
  /** Alignment of controls */
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  /** Size of buttons */
  size?: 'small' | 'medium' | 'large';
  /** Icon style */
  iconStyle?: 'chevron' | 'arrow' | 'skip';
  /** Whether to show keyboard shortcuts */
  showShortcuts?: boolean;
  /** Context for button styling */
  context?: 'assessment' | 'form' | 'wizard' | 'general';
  /** Position in the flow */
  position?: 'first' | 'middle' | 'last';
  /** Progress information */
  progressInfo?: {
    current: number;
    total: number;
  };
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  showPrevious = true,
  showNext = true,
  canGoBack = true,
  canGoNext = true,
  nextLoading = false,
  previousLoading = false,
  previousText,
  nextText,
  onPrevious,
  onNext,
  customActions = [],
  className = '',
  variant = 'default',
  alignment = 'space-between',
  size = 'medium',
  iconStyle = 'chevron',
  showShortcuts = false,
  context = 'general',
  position = 'middle',
  progressInfo,
}) => {
  // Determine button text based on context and position
  const getButtonText = (type: 'previous' | 'next'): string => {
    if (type === 'previous') {
      if (previousText) return previousText;
      if (context === 'assessment') return 'Previous Question';
      if (position === 'first') return 'Back';
      return 'Previous';
    } else {
      if (nextText) return nextText;
      if (context === 'assessment' && position === 'last') return 'Complete Assessment';
      if (context === 'form' && position === 'last') return 'Submit';
      if (context === 'wizard' && position === 'last') return 'Finish';
      if (context === 'assessment') return 'Next Question';
      return 'Next';
    }
  };

  // Get appropriate icons based on style
  const getIcon = (type: 'previous' | 'next', iconSize = 16) => {
    const icons = {
      chevron: {
        previous: <ChevronLeft size={iconSize} />,
        next: <ChevronRight size={iconSize} />
      },
      arrow: {
        previous: <ArrowLeft size={iconSize} />,
        next: <ArrowRight size={iconSize} />
      },
      skip: {
        previous: <SkipBack size={iconSize} />,
        next: <SkipForward size={iconSize} />
      }
    };
    return icons[iconStyle][type];
  };

  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;

  const controlsClasses = [
    styles.navigationControls,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`alignment${alignment.charAt(0).toUpperCase() + alignment.slice(1).replace('-', '')}`],
    styles[`context${context.charAt(0).toUpperCase() + context.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!showShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === 'ArrowLeft' && canGoBack && onPrevious) {
        event.preventDefault();
        onPrevious();
      } else if (event.key === 'ArrowRight' && canGoNext && onNext) {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, canGoNext, onPrevious, onNext, showShortcuts]);

  return (
    <div className={controlsClasses}>
      {/* Left Side Actions */}
      <div className={styles.leftActions}>
        {showPrevious && onPrevious && (
          <Button
            variant="secondary"
            size={size}
            onClick={onPrevious}
            disabled={!canGoBack || previousLoading}
            loading={previousLoading}
            className={styles.previousButton}
          >
            {getIcon('previous', iconSize)}
            {variant !== 'minimal' && getButtonText('previous')}
            {showShortcuts && canGoBack && (
              <span className={styles.shortcut}>←</span>
            )}
          </Button>
        )}

        {/* Custom left actions */}
        {customActions
          .filter(action => action.id.includes('left') || action.id.includes('restart'))
          .map((action) => (
            <Button
              key={action.id}
              variant={action.variant ?? 'secondary'}
              size={size}
              onClick={action.onClick}
              disabled={!action.enabled || action.loading}
              loading={action.loading}
              className={styles.customAction}
            >
              {action.icon}
              {variant !== 'minimal' && action.text}
            </Button>
          ))}
      </div>

      {/* Center Content */}
      <div className={styles.centerContent}>
        {progressInfo && variant !== 'minimal' && (
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              {progressInfo.current} of {progressInfo.total}
            </span>
          </div>
        )}

        {/* Custom center actions */}
        {customActions
          .filter(action => action.id.includes('center') || action.id.includes('save'))
          .map((action) => (
            <Button
              key={action.id}
              variant={action.variant ?? 'secondary'}
              size={size}
              onClick={action.onClick}
              disabled={!action.enabled || action.loading}
              loading={action.loading}
              className={styles.customAction}
            >
              {action.icon}
              {variant !== 'minimal' && action.text}
            </Button>
          ))}
      </div>

      {/* Right Side Actions */}
      <div className={styles.rightActions}>
        {/* Custom right actions */}
        {customActions
          .filter(action => action.id.includes('right') && !action.id.includes('next'))
          .map((action) => (
            <Button
              key={action.id}
              variant={action.variant ?? 'secondary'}
              size={size}
              onClick={action.onClick}
              disabled={!action.enabled || action.loading}
              loading={action.loading}
              className={styles.customAction}
            >
              {action.icon}
              {variant !== 'minimal' && action.text}
            </Button>
          ))}

        {showNext && onNext && (
          <Button
            variant={position === 'last' ? 'cta' : 'primary'}
            size={size}
            onClick={onNext}
            disabled={!canGoNext || nextLoading}
            loading={nextLoading}
            className={styles.nextButton}
          >
            {variant !== 'minimal' && getButtonText('next')}
            {position === 'last' ? <Check size={iconSize} /> : getIcon('next', iconSize)}
            {showShortcuts && canGoNext && (
              <span className={styles.shortcut}>→</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// Predefined action creators for common use cases
export const createRestartAction = (onRestart: () => void, enabled = true): NavigationAction => ({
  id: 'left-restart',
  text: 'Restart',
  icon: <RotateCcw size={16} />,
  enabled,
  variant: 'secondary',
  onClick: onRestart,
});

export const createHomeAction = (onHome: () => void, enabled = true): NavigationAction => ({
  id: 'left-home',
  text: 'Home',
  icon: <Home size={16} />,
  enabled,
  variant: 'secondary',
  onClick: onHome,
});

export const createSaveAction = (onSave: () => void, enabled = true, loading = false): NavigationAction => ({
  id: 'center-save',
  text: 'Save Progress',
  icon: <Save size={16} />,
  enabled,
  loading,
  variant: 'secondary',
  onClick: onSave,
});

// Default export for easier importing
export default NavigationControls;