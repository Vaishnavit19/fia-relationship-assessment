// src/components/ui/OptionButton/OptionButton.tsx
'use client';

import { Check, ChevronRight } from 'lucide-react';
import React from 'react';

import styles from './OptionButton.module.scss';

export interface OptionButtonProps {
  /** Option text content */
  text: string;
  /** Option letter/identifier (A, B, C, etc.) */
  letter?: string;
  /** Optional description or subtitle */
  description?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'compact' | 'card' | 'minimal';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Selection style */
  selectionStyle?: 'radio' | 'checkbox' | 'highlight';
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Whether to show selection indicator */
  showIndicator?: boolean;
  /** Color variant for different contexts */
  color?: 'default' | 'emotional' | 'logical' | 'exploratory';
  /** Loading state */
  loading?: boolean;
  /** Value for form integration */
  value?: string;
  /** Name for form integration */
  name?: string;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  text,
  letter,
  description,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  variant = 'default',
  size = 'medium',
  selectionStyle = 'radio',
  icon,
  showIndicator = true,
  color = 'default',
  loading = false,
  value,
  name,
}) => {
  const buttonClasses = [
    styles.optionButton,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`],
    selected && styles.selected,
    disabled && styles.disabled,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled && !loading) {
      event.preventDefault();
      if (onClick) onClick();
    }
  };

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      role={selectionStyle === 'checkbox' ? 'checkbox' : 'radio'}
      aria-checked={selected}
      aria-disabled={disabled}
      value={value}
      name={name}
      type="button"
    >
      <div className={styles.content}>
        {/* Letter/Identifier */}
        {letter && (
          <div className={styles.letter}>
            <span className={styles.letterText}>
              {letter}
            </span>
            {selected && selectionStyle === 'radio' && (
              <div className={styles.letterSelected}>
                <Check size={12} />
              </div>
            )}
          </div>
        )}

        {/* Custom Icon */}
        {icon && (
          <div className={styles.iconContainer}>
            {icon}
          </div>
        )}

        {/* Main Content */}
        <div className={styles.textContent}>
          <span className={styles.mainText}>
            {text}
          </span>
          {description && (
            <span className={styles.description}>
              {description}
            </span>
          )}
        </div>

        {/* Selection Indicator */}
        {showIndicator && (
          <div className={styles.indicator}>
            {selectionStyle === 'checkbox' && (
              <div className={styles.checkbox}>
                {selected && <Check size={14} />}
              </div>
            )}
            {selectionStyle === 'radio' && selected && (
              <div className={styles.radioSelected}>
                <ChevronRight size={16} />
              </div>
            )}
            {selectionStyle === 'highlight' && selected && (
              <div className={styles.highlightIndicator}>
                <Check size={16} />
              </div>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>

      {/* Selection Overlay */}
      {selected && (
        <div className={styles.selectionOverlay} />
      )}
    </button>
  );
};

// Default export for easier importing
export default OptionButton;