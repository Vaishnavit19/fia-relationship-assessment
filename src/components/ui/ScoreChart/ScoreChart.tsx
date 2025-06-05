// src/components/ui/ScoreChart/ScoreChart.tsx
'use client';

import React from 'react';

import { ScoreData } from '@/lib/types';

import styles from './ScoreChart.module.scss';

export interface ScoreChartProps {
  /** User's assessment scores */
  scores: ScoreData;
  /** Maximum possible score for normalization */
  maxScore?: number;
  /** Show score values on bars */
  showValues?: boolean;
  /** Chart size variant */
  size?: 'small' | 'medium' | 'large';
  /** Animation delay in milliseconds */
  animationDelay?: number;
  /** Additional CSS class */
  className?: string;
  /** Whether to animate the chart */
  animated?: boolean;
  /** Show chart footer with max score info */
  showFooter?: boolean;
}

const SCORE_DIMENSIONS = [
  {
    key: 'emotional' as keyof ScoreData,
    label: 'Emotional',
    icon: '💝',
    color: 'emotional',
    description: 'Connection & Feelings',
  },
  {
    key: 'logical' as keyof ScoreData,
    label: 'Logical', 
    icon: '🧠',
    color: 'logical',
    description: 'Planning & Efficiency',
  },
  {
    key: 'exploratory' as keyof ScoreData,
    label: 'Exploratory',
    icon: '🌟', 
    color: 'exploratory',
    description: 'Adventure & Spontaneity',
  },
] as const;

export const ScoreChart: React.FC<ScoreChartProps> = ({
  scores,
  maxScore = 12,
  showValues = true,
  size = 'medium',
  animationDelay = 0,
  className = '',
  animated = true,
  showFooter = true,
}) => {
  const scoreData = SCORE_DIMENSIONS.map((dimension, index) => {
    const score = scores[dimension.key];
    const percentage = Math.round((score / maxScore) * 100);
    
    return {
      ...dimension,
      score,
      percentage,
      animationDelay: animated ? index * 200 : 0,
    };
  });

  const chartClasses = [
    styles.scoreChart,
    styles[size],
    animated && styles.animated,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div 
      className={chartClasses}
      style={{ 
        '--base-animation-delay': `${animationDelay}ms` 
      } as React.CSSProperties}
    >
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Your Relationship Style Breakdown</h3>
        <p className={styles.chartSubtitle}>
          See how you balance emotional connection, logical planning, and adventurous exploration
        </p>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.barsContainer}>
          {scoreData.map((item) => (
            <div 
              key={item.key}
              className={`${styles.barGroup} ${styles[item.color]}`}
              style={{ 
                '--bar-delay': `${item.animationDelay}ms`,
                '--bar-height': `${item.percentage}%`
              } as React.CSSProperties}
            >
              <div className={styles.barContainer}>
                <div 
                  className={styles.bar}
                  role="progressbar"
                  aria-valuenow={item.score}
                  aria-valuemin={0}
                  aria-valuemax={maxScore}
                  aria-label={`${item.label} score: ${item.score} out of ${maxScore}`}
                />
                {showValues && (
                  <div className={styles.barValue}>
                    {item.score}
                  </div>
                )}
              </div>
              
              <div className={styles.labelContainer}>
                <div 
                  className={styles.labelIcon}
                  role="img"
                  aria-label={item.label}
                >
                  {item.icon}
                </div>
                <div className={styles.labelText}>
                  <div className={styles.labelTitle}>{item.label}</div>
                  <div className={styles.labelDescription}>{item.description}</div>
                </div>
                <div className={styles.labelScore}>
                  {item.score}/{maxScore}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showFooter && (
          <div className={styles.chartFooter}>
            <div className={styles.maxScoreIndicator}>
              Maximum Score: {maxScore} points per dimension
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreChart;