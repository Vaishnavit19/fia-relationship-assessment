'use client';

// src/components/ui/Button/Button.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cta';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <span className={styles.spinnerInner}></span>
        </span>
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={styles.iconLeft} size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      )}
      
      <span className={styles.content}>
        {children}
      </span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={styles.iconRight} size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      )}
    </button>
  );
};

export default Button;