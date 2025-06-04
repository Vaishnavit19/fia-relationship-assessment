// src/components/ui/LoadingSpinner/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';
import React from 'react';

import styles from './LoadingSpinner.module.scss';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'primary' | 'secondary' | 'accent' | 'white';
  type?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  centered?: boolean;
  overlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  type = 'spinner',
  text,
  centered = false,
  overlay = false,
  className = '',
  style,
  'aria-label': ariaLabel = 'Loading...',
  ...props
}) => {
  const spinnerClasses = [
    styles.loading,
    styles[size],
    styles[variant],
    styles[type],
    centered && styles.centered,
    overlay && styles.overlay,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderSpinner = () => {
    switch (type) {
      case 'spinner':
        return (
          <Loader2 
            className={styles.spinnerIcon} 
            size={size === 'small' ? 16 : size === 'large' ? 32 : size === 'xlarge' ? 48 : 24}
          />
        );
      
      case 'dots':
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={styles.pulseContainer}>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseCore}></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className={styles.barsContainer}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );
      
      default:
        return (
          <Loader2 
            className={styles.spinnerIcon} 
            size={size === 'small' ? 16 : size === 'large' ? 32 : size === 'xlarge' ? 48 : 24}
          />
        );
    }
  };

  const content = (
    <div className={spinnerClasses} style={style} {...props}>
      <div className={styles.spinnerWrapper} role="status" aria-label={ariaLabel}>
        {renderSpinner()}
        {text && (
          <div className={styles.loadingText}>
            {text}
          </div>
        )}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className={styles.overlayContainer}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;