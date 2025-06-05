// ==========================================================================
// HOMEPAGE ORCHESTRATOR COMPONENT
// ==========================================================================

// src/components/pages/HomePage/HomePage.tsx
'use client';

import { ArrowRight, Users, Heart, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageLayout from '@/components/ui/PageLayout';
import { appConfig } from '@/lib/data';
import { useAssessmentStore } from '@/lib/store';

import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { isStarted, userData, resetAssessment } = useAssessmentStore();

  const handleStartAssessment = () => {
    // Reset any previous assessment data
    resetAssessment();
    router.push('/assessment');
  };

  const handleContinueAssessment = () => {
    router.push('/assessment');
  };

  const features = [
    {
      icon: <Users size={24} />,
      title: 'Travel-Based Scenarios',
      description:
        'Discover your relationship style through realistic travel situations and decision-making moments.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Three Relationship Archetypes',
      description:
        "Learn whether you're a Heartfelt Companion, Strategic Navigator, or Spontaneous Explorer.",
    },
    {
      icon: <Clock size={24} />,
      title: 'Quick & Insightful',
      description: `Complete the assessment in just ${appConfig.assessment.timeEstimate} and get detailed results.`,
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Science-Based Results',
      description:
        'Get personalized insights based on proven relationship psychology and behavioral patterns.',
    },
  ];

  const archetypes = [
    {
      icon: '💝',
      name: 'The Heartfelt Companion',
      description: 'Prioritizes emotional connection and togetherness above all else.',
      color: '#87ceeb',
    },
    {
      icon: '🧠',
      name: 'The Strategic Navigator',
      description: 'Approaches relationships with careful planning and practical thinking.',
      color: '#667eea',
    },
    {
      icon: '🌟',
      name: 'The Spontaneous Explorer',
      description: 'Embraces the unexpected and thrives on new experiences.',
      color: '#ffb347',
    },
  ];

  return (
    <PageLayout>
      <div className={styles.homepage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  Discover Your <span className={styles.highlightText}>Relationship Style</span>
                  <br />
                  Through Travel
                </h1>
                <p className={styles.heroSubtitle}>
                  Take our unique assessment to understand how you balance emotional connection,
                  logical planning, and adventurous exploration in relationships. Get personalized
                  insights in just {appConfig.assessment.timeEstimate}.
                </p>

                <div className={styles.heroActions}>
                  {isStarted && userData ? (
                    <div className={styles.continueSection}>
                      <p className={styles.welcomeBack}>
                        Welcome back, {userData.name}! Ready to continue your assessment?
                      </p>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="cta"
                          size="large"
                          onClick={handleContinueAssessment}
                          className={styles.primaryAction}
                        >
                          Continue Assessment
                          <ArrowRight size={20} />
                        </Button>
                        <Button variant="secondary" size="large" onClick={handleStartAssessment}>
                          Start Over
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="cta"
                      size="large"
                      onClick={handleStartAssessment}
                      className={styles.primaryAction}
                    >
                      Start Your Assessment
                      <ArrowRight size={20} />
                    </Button>
                  )}

                  <div className={styles.assessmentStats}>
                    <div className={styles.stat}>
                      <strong>{appConfig.assessment.totalScenarios}</strong> Questions
                    </div>
                    <div className={styles.stat}>
                      <strong>{appConfig.assessment.timeEstimate}</strong> Duration
                    </div>
                    <div className={styles.stat}>
                      <strong>{appConfig.assessment.resultTypes}</strong> Archetypes
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.archetypePreview}>
                  {archetypes.map((archetype, index) => (
                    <div
                      key={archetype.name}
                      className={styles.archetypeCard}
                      style={
                        {
                          '--archetype-color': archetype.color,
                          '--animation-delay': `${index * 0.2}s`,
                        } as React.CSSProperties
                      }
                    >
                      <div className={styles.archetypeIcon}>{archetype.icon}</div>
                      <h4 className={styles.archetypeName}>{archetype.name}</h4>
                      <p className={styles.archetypeDesc}>{archetype.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p className={styles.sectionSubtitle}>
                Our assessment uses realistic travel scenarios to reveal your relationship patterns
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {features.map(feature => (
                <Card key={feature.title} className={styles.featureCard} variant="default">
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Archetypes Overview */}
        <section className={styles.archetypes}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Three Relationship Archetypes</h2>
              <p className={styles.sectionSubtitle}>
                Discover which of these relationship styles resonates most with you
              </p>
            </div>

            <div className={styles.archetypesGrid}>
              {archetypes.map(archetype => (
                <Card
                  key={archetype.name}
                  className={styles.archetypeOverviewCard}
                  variant="default"
                >
                  <div className={styles.archetypeHeader}>
                    <div
                      className={styles.archetypeIconLarge}
                      style={{ '--archetype-color': archetype.color } as React.CSSProperties}
                    >
                      {archetype.icon}
                    </div>
                    <h3 className={styles.archetypeTitle}>{archetype.name}</h3>
                  </div>
                  <p className={styles.archetypeOverviewDesc}>{archetype.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className="container">
            <Card variant="elevated" className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>Ready to Discover Your Relationship Style?</h2>
                <p className={styles.ctaSubtitle}>
                  Join thousands who have discovered their relationship archetype and improved their
                  partnerships through better understanding.
                </p>
                <Button
                  variant="cta"
                  size="large"
                  onClick={handleStartAssessment}
                  className={styles.ctaButton}
                >
                  Take the Assessment Now
                  <ArrowRight size={20} />
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HomePage;
