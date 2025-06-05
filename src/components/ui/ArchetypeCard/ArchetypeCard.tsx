// src/components/ui/ArchetypeCard/ArchetypeCard.tsx
'use client';

import { Check, Star, Award, Heart, Brain, Compass } from 'lucide-react';
import React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';

import styles from './ArchetypeCard.module.scss';

export interface RelationshipArchetype {
  /** Unique identifier */
  id: string;
  /** Archetype name */
  name: string;
  /** Short title/tagline */
  title: string;
  /** Main description */
  description: string;
  /** List of key traits */
  traits: string[];
  /** Emoji icon */
  icon: string;
  /** Primary color */
  color: string;
  /** CSS gradient */
  gradient: string;
}

export interface ArchetypeCardProps {
  /** Archetype data */
  archetype: RelationshipArchetype;
  /** User's score for this archetype */
  score?: number;
  /** Maximum possible score */
  maxScore?: number;
  /** Whether this is the user's primary archetype */
  isPrimary?: boolean;
  /** Whether this is the user's secondary archetype */
  isSecondary?: boolean;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Whether to show score information */
  showScore?: boolean;
  /** Whether to show traits list */
  showTraits?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card variant */
  variant?: 'default' | 'detailed' | 'compact' | 'result';
  /** Card size */
  size?: 'small' | 'medium' | 'large';
  /** Whether card is interactive/clickable */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether to show action button */
  showAction?: boolean;
  /** Action button text */
  actionText?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Custom badge text for primary archetype */
  primaryBadge?: string;
  /** Whether to animate the card */
  animated?: boolean;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  score,
  maxScore = 12,
  isPrimary = false,
  isSecondary = false,
  showDetails = true,
  showScore = false,
  showTraits = true,
  className = '',
  variant = 'default',
  size = 'medium',
  interactive = false,
  onClick,
  showAction = false,
  actionText = 'Learn More',
  onAction,
  primaryBadge = 'Your Type',
  animated = true,
}) => {
  const percentage = score && maxScore ? Math.round((score / maxScore) * 100) : 0;
  
  const cardClasses = [
    styles.archetypeCard,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`archetype${archetype.id.charAt(0).toUpperCase() + archetype.id.slice(1)}`],
    isPrimary && styles.primary,
    isSecondary && styles.secondary,
    interactive && styles.interactive,
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (onClick) onClick();
    }
  };

  // Get archetype-specific icon
  const getArchetypeIcon = () => {
    switch (archetype.id) {
      case 'heartfelt':
        return <Heart size={24} />;
      case 'strategic':
        return <Brain size={24} />;
      case 'spontaneous':
        return <Compass size={24} />;
      default:
        return <Star size={24} />;
    }
  };

  return (
    <Card
      className={cardClasses}
      variant={variant === 'result' ? 'elevated' : 'default'}
      onClick={handleClick}
      onKeyDown={interactive ? handleKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? `Learn more about ${archetype.name}` : undefined}
    >
      {/* Primary Badge */}
      {isPrimary && (
        <div className={styles.primaryBadge}>
          <Award size={14} />
          <span>{primaryBadge}</span>
        </div>
      )}

      {/* Secondary Badge */}
      {isSecondary && !isPrimary && (
        <div className={styles.secondaryBadge}>
          <Star size={14} />
          <span>Secondary</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <span className={styles.emoji} role="img" aria-label={archetype.name}>
            {archetype.icon}
          </span>
          <div className={styles.iconOverlay}>
            {getArchetypeIcon()}
          </div>
        </div>

        <div className={styles.headerContent}>
          <h3 className={styles.name}>{archetype.name}</h3>
          <p className={styles.title}>{archetype.title}</p>
        </div>

        {/* Score Display */}
        {showScore && score !== undefined && (
          <div className={styles.scoreContainer}>
            <div className={styles.scoreValue}>
              {score}
              <span className={styles.maxScore}>/{maxScore}</span>
            </div>
            <div className={styles.scorePercentage}>
              {percentage}%
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {showDetails && (
        <div className={styles.description}>
          <p>{archetype.description}</p>
        </div>
      )}

      {/* Traits */}
      {showTraits && archetype.traits && archetype.traits.length > 0 && (
        <div className={styles.traits}>
          <h4 className={styles.traitsTitle}>Key Characteristics:</h4>
          <ul className={styles.traitsList}>
            {archetype.traits.map((trait, index) => (
              <li key={index} className={styles.trait}>
                <Check size={14} />
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score Bar */}
      {showScore && score !== undefined && (
        <div className={styles.scoreBar}>
          <div className={styles.scoreTrack}>
            <div 
              className={styles.scoreFill}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={styles.scoreLabel}>
            Match: {percentage}%
          </span>
        </div>
      )}

      {/* Action Button */}
      {showAction && onAction && (
        <div className={styles.actionContainer}>
          <Button
            variant={isPrimary ? 'cta' : 'secondary'}
            size={size === 'small' ? 'small' : 'medium'}
            onClick={onAction}
            className={styles.actionButton}
          >
            {actionText}
          </Button>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className={styles.gradientOverlay} />
    </Card>
  );
};

// Default export for easier importing
export default ArchetypeCard;