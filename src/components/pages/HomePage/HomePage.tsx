// ==========================================================================
// HOMEPAGE ORCHESTRATOR COMPONENT - ENHANCED ASSESSMENT SYSTEM
// ==========================================================================

// src/components/pages/HomePage/HomePage.tsx
'use client';

import {
  ArrowRight,
  Users,
  Heart,
  Clock,
  CheckCircle,
  Brain,
  Shield,
  Target,
  TrendingUp,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageLayout from '@/components/ui/PageLayout';
import archetypes from '@/data/archetypes-homepage.json';
import { appConfig } from '@/lib/data';
import useEnhancedAssessmentStore, {
  useEnhancedAssessmentActions,
  useEnhancedAssessmentData,
} from '@/lib/store';

import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const router = useRouter();
  // FIXED: Use enhanced store hooks
  const { isStarted } = useEnhancedAssessmentData();
  const { resetAssessment } = useEnhancedAssessmentActions();

  // FIXED: Get userData directly from store since it's not in useEnhancedAssessmentData
  const userData = useEnhancedAssessmentStore(state => state.userData);

  const handleStartAssessment = () => {
    // Reset any previous assessment data
    resetAssessment();
    // Route to auth page instead of directly to assessment
    router.push('/assessment');
  };

  const handleContinueAssessment = () => {
    // If user is already authenticated, go directly to assessment
    // Otherwise, go to auth page
    // if (userData?.name) {
    //   router.push('/assessment');
    // } else {
    //   router.push('/auth');
    // }
    router.push('/assessment');
  };

  const features = [
    {
      icon: <Users size={24} />,
      title: 'Dynamic Travel Scenarios',
      description:
        'Experience 20+ branching travel situations that adapt based on your choices and reveal deep relationship patterns.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Eight Personality Archetypes',
      description:
        'Discover your unique blend among Achiever, Intellectual, Leader, Explorer, Peacemaker, Dreamer, Rebel, and Caregiver.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Vulnerability Assessment',
      description:
        'Learn to recognize manipulation patterns and develop awareness of relationship red flags for your personality type.',
    },
    {
      icon: <Target size={24} />,
      title: 'Personalized Insights',
      description:
        'Get tailored educational content based on your unique archetype blend and confidence gaps.',
    },
    {
      icon: <Clock size={24} />,
      title: 'Adaptive & Efficient',
      description: `Complete in 8-12 questions (${appConfig.assessment.timeEstimate}) with intelligent branching that personalizes your journey.`,
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Science-Based Analysis',
      description:
        'Built on mathematical proximity algorithms and weighted selection systems for accurate, reliable results.',
    },
  ];

  const systemFeatures = [
    {
      icon: <TrendingUp size={20} />,
      title: 'Advanced Path Tracking',
      description:
        'Sophisticated analytics track your decision patterns and predict optimal outcomes.',
    },
    {
      icon: <Target size={20} />,
      title: 'Mathematical Precision',
      description: 'Euclidean distance calculations ensure accurate archetype matching.',
    },
    {
      icon: <Shield size={20} />,
      title: 'Educational Protection',
      description:
        'Learn to recognize 17 different manipulation patterns with pop culture examples.',
    },
    {
      icon: <Star size={20} />,
      title: 'Confidence Scoring',
      description:
        'Weighted algorithms provide confidence percentages and tie-handling for nuanced results.',
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
                  Discover Your <span className={styles.highlightText}>Relationship Archetype</span>
                  <br />
                  Through Advanced Travel Psychology
                </h1>
                <p className={styles.heroSubtitle}>
                  Experience our revolutionary assessment system that combines branching travel
                  scenarios with psychological profiling to reveal your relationship patterns,
                  vulnerability awareness, and attraction dynamics. Get comprehensive insights in
                  just {appConfig.assessment.timeEstimate}.
                </p>

                <div className={styles.heroActions}>
                  {isStarted && userData ? (
                    <div className={styles.continueSection}>
                      <p className={styles.welcomeBack}>
                        Welcome back, {userData.name}! Ready to continue your enhanced assessment?
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
                      Start Your Enhanced Assessment
                      <ArrowRight size={20} />
                    </Button>
                  )}

                  <div className={styles.assessmentStats}>
                    <div className={styles.stat}>
                      <strong>26</strong> Branching Scenarios
                    </div>
                    <div className={styles.stat}>
                      <strong>10</strong> Adaptive Questions
                    </div>
                    <div className={styles.stat}>
                      <strong>8</strong> Personality Archetypes
                    </div>
                    <div className={styles.stat}>
                      <strong>17</strong> Vulnerability Patterns
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className={styles.heroVisual}>
                <div className={styles.archetypePreview}>
                  {archetypes.slice(0, 4).map((archetype, index) => (
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
              </div> */}
            </div>
          </div>
        </section>

        {/* Enhanced Archetypes Overview */}
        <section className={styles.archetypes}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Eight Comprehensive Archetypes</h2>
              <p className={styles.sectionSubtitle}>
                Discover your unique personality blend among our scientifically-backed relationship
                archetypes
              </p>
            </div>

            <div className={styles.archetypesGrid}>
              {archetypes.map(archetype => (
                <Card
                  key={archetype.name}
                  className={styles.archetypeOverviewCard}
                  variant="default"
                  padding="none"
                >
                  <Image src={archetype.image} alt="" height={250} width={250} quality={80}></Image>
                  <div className={styles.archetypeDetails}>
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
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className={styles.cta}>
          <div className="container">
            <Card variant="elevated" className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>
                  Ready to Discover Your Complete Relationship Profile?
                </h2>
                <p className={styles.ctaSubtitle}>
                  Join the enhanced assessment experience that combines travel psychology,
                  mathematical analysis, and vulnerability awareness to provide unprecedented
                  insights into your relationship patterns and protection strategies.
                </p>
                <div className={styles.ctaStats}>
                  <div className={styles.ctaStat}>
                    <strong>20+</strong> Dynamic Scenarios
                  </div>
                  <div className={styles.ctaStat}>
                    <strong>8</strong> Personality Archetypes
                  </div>
                  <div className={styles.ctaStat}>
                    <strong>17</strong> Vulnerability Patterns
                  </div>
                </div>
                <Button
                  variant="cta"
                  size="large"
                  onClick={handleStartAssessment}
                  className={styles.ctaButton}
                >
                  Start Enhanced Assessment Now
                  <ArrowRight size={20} />
                </Button>
                <p className={styles.ctaDisclaimer}>
                  Complete in 8-12 adaptive questions • Comprehensive educational results •
                  Science-based psychological insights
                </p>
              </div>
            </Card>
          </div>
        </section> */}
      </div>
    </PageLayout>
  );
};

export default HomePage;
