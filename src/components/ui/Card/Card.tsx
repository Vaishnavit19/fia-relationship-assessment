// src/components/ui/Card/Card.tsx
import React from 'react';

import styles from './Card.module.scss';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-selected'?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  hover = false,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  style,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-selected': ariaSelected,
  ...props
}) => {
  const isInteractive = onClick ?? variant === 'interactive';

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    styles[`padding-${padding}`],
    hover && styles.hover,
    selected && styles.selected,
    disabled && styles.disabled,
    isInteractive && styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardProps = {
    className: cardClasses,
    style,
    role: role ?? (isInteractive ? 'button' : undefined),
    tabIndex: tabIndex ?? (isInteractive && !disabled ? 0 : undefined),
    'aria-label': ariaLabel,
    'aria-selected': ariaSelected,
    'aria-disabled': disabled,
    onClick: isInteractive ? handleClick : undefined,
    onKeyDown: isInteractive ? handleKeyDown : undefined,
    ...props,
  };

  return <div {...cardProps}>{children}</div>;
};

export default Card;
