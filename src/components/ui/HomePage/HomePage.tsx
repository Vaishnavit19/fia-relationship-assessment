// src/components/ui/HomePage/HomePage.tsx
'use client';

import { ArrowRight, Clock, Users, Heart, Brain, Compass, Star, CheckCircle } from 'lucide-react';
import React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';

import styles from './HomePage.module.scss';

export interface HomePageProps {
  /** Handler for starting the assessment */
  onStartAssessment: () => void;
  /** Handler for learning more about archetypes */
  onLearnMore?: () => void;
  /** Whether to show the loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether user has existing progress */
  hasProgress?: boolean;
  /** Handler for continuing existing assessment */
  onContinueAssessment?: () => void;
}

const features = [
  {
    icon: <Clock size={24} />,
    title: '5-7 Minutes',
    description: 'Quick assessment based on travel scenarios'
  },
  {
    icon: <Users size={24} />,
    title: '3 Archetypes',
    description: 'Discover your unique relationship style'
  },
  {
    icon: <Star size={24} />,
    title: 'Personalized Results',
    description: 'Detailed insights into your dynamics'
  }
];

const archetypes = [
  {
    id: 'heartfelt',
    icon: '💝',
    name: 'The Heartfelt Companion',
    description: 'Prioritizes emotional connection and togetherness',
    color: '#87ceeb'
  },
  {
    id: 'strategic',
    icon: '🧠',
    name: 'The Strategic Navigator',
    description: 'Approaches relationships with careful planning',
    color: '#667eea'
  },
  {
    id: 'spontaneous',
    icon: '🌟',
    name: 'The Spontaneous Explorer',
    description: 'Embraces unexpected adventures and experiences',
    color: '#ffb347'
  }
];

const benefits = [
  'Understand your relationship decision-making style',
  'Learn how you balance emotion, logic, and adventure',
  'Discover insights through relatable travel scenarios',
  'Get personalized recommendations for your type',
  'Share results with your partner for deeper connection'
];

export const HomePage: React.FC<HomePageProps> = ({
  onStartAssessment,
  onLearnMore,
  isLoading = false,
  className = '',
  hasProgress = false,
  onContinueAssessment,
}) => {
  const handleStartClick = () => {
    if (!isLoading) {
      onStartAssessment();
    }
  };

  const handleContinueClick = () => {
    if (!isLoading && onContinueAssessment) {
      onContinueAssessment();
    }
  };

  const handleLearnMoreClick = () => {
    if (onLearnMore) {
      onLearnMore();
    }
  };

  return (
    <div className={`${styles.homePage} ${className}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Your
              <span className={styles.gradientText}> Relationship Style</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Through travel scenarios that reveal how you balance emotional connection, 
              logical planning, and adventurous exploration in your relationships.
            </p>
            
            {/* CTA Buttons */}
            <div className={styles.ctaContainer}>
              {hasProgress ? (
                <>
                  <Button
                    variant="cta"
                    size="large"
                    onClick={handleContinueClick}
                    disabled={isLoading}
                    className={styles.primaryCta}
                  >
                    {isLoading ? 'Loading...' : 'Continue Assessment'}
                    <ArrowRight size={20} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={handleStartClick}
                    disabled={isLoading}
                  >
                    Start Over
                  </Button>
                </>
              ) : (
                <Button
                  variant="cta"
                  size="large"
                  onClick={handleStartClick}
                  disabled={isLoading}
                  className={styles.primaryCta}
                >
                  {isLoading ? 'Loading...' : 'Start Assessment'}
                  <ArrowRight size={20} />
                </Button>
              )}
            </div>

            {/* Features */}
            <div className={styles.features}>
              {features.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualContainer}>
              {/* Floating Archetype Icons */}
              {archetypes.map((archetype, index) => (
                <div
                  key={archetype.id}
                  className={`${styles.floatingIcon} ${styles[`floating${index + 1}`]}`}
                  style={{ '--archetype-color': archetype.color } as React.CSSProperties}
                >
                  <span className={styles.archetypeEmoji} role="img" aria-label={archetype.name}>
                    {archetype.icon}
                  </span>
                </div>
              ))}
              
              {/* Central Visual */}
              <div className={styles.centralVisual}>
                <div className={styles.innerCircle}>
                  <Heart className={styles.centralIcon} size={48} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Simple travel scenarios reveal deep relationship insights
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Answer Travel Questions</h3>
              <p className={styles.stepDescription}>
                Navigate through 7 realistic travel scenarios with your partner
              </p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Discover Your Archetype</h3>
              <p className={styles.stepDescription}>
                See how you balance emotional, logical, and exploratory approaches
              </p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Get Personalized Insights</h3>
              <p className={styles.stepDescription}>
                Receive detailed analysis and recommendations for your relationship style
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Archetypes Preview */}
      <section className={styles.archetypesPreview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The Three Relationship Archetypes</h2>
          <p className={styles.sectionSubtitle}>
            Which one resonates most with your approach to relationships?
          </p>
        </div>

        <div className={styles.archetypeCards}>
          {archetypes.map((archetype) => (
            <Card key={archetype.id} className={styles.archetypeCard} variant="elevated">
              <div className={styles.archetypeHeader}>
                <div 
                  className={styles.archetypeIcon}
                  style={{ '--archetype-color': archetype.color } as React.CSSProperties}
                >
                  <span className={styles.archetypeEmoji} role="img" aria-label={archetype.name}>
                    {archetype.icon}
                  </span>
                </div>
                <h3 className={styles.archetypeName}>{archetype.name}</h3>
              </div>
              <p className={styles.archetypeDescription}>{archetype.description}</p>
            </Card>
          ))}
        </div>

        {onLearnMore && (
          <div className={styles.learnMoreContainer}>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleLearnMoreClick}
            >
              Learn More About Each Type
            </Button>
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What You&apos;ll Discover</h2>
        </div>

        <Card className={styles.benefitsCard} variant="elevated">
          <div className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefit}>
                <CheckCircle className={styles.benefitIcon} size={20} />
                <span className={styles.benefitText}>{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <Card className={styles.ctaCard} variant="elevated">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Discover Your Relationship Style?</h2>
            <p className={styles.ctaDescription}>
              Take the assessment now and gain insights into how you approach relationships through travel decisions.
            </p>
            <Button
              variant="cta"
              size="large"
              onClick={handleStartClick}
              disabled={isLoading}
              className={styles.finalCtaButton}
            >
              {isLoading ? 'Loading...' : 'Start Your Journey'}
              <ArrowRight size={20} />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

// Default export for easier importing
export default HomePage;