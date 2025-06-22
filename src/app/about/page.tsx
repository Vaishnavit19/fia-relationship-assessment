// ==========================================================================
// AboutPAGE ORCHESTRATOR COMPONENT - ENHANCED ASSESSMENT SYSTEM
// ==========================================================================

// src/app/about/page.tsx
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
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageLayout from '@/components/ui/PageLayout';
import { appConfig } from '@/lib/data';
import useEnhancedAssessmentStore, {
  useEnhancedAssessmentActions,
  useEnhancedAssessmentData,
} from '@/lib/store';

import styles from './AboutPage.module.scss';

export const AboutPage: React.FC = () => {
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
      description: `Complete in 10 questions (${appConfig.assessment.timeEstimate}) with intelligent branching that personalizes your journey.`,
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Science-Based Analysis',
      description:
        'Built on mathematical proximity algorithms and weighted selection systems for accurate, reliable results.',
    },
  ];

  const archetypes = [
    {
      icon: '🎯',
      name: 'The Achiever',
      description:
        'Goal-oriented and success-driven, building relationships through shared ambitions.',
      color: '#ff6b9d',
    },
    {
      icon: '🧠',
      name: 'The Intellectual',
      description: 'Values deep conversations and mental connection above all else.',
      color: '#667eea',
    },
    {
      icon: '👑',
      name: 'The Leader',
      description: 'Takes charge naturally and creates structure in relationships.',
      color: '#764ba2',
    },
    {
      icon: '🌟',
      name: 'The Explorer',
      description: 'Seeks adventure and growth through new experiences together.',
      color: '#ffb347',
    },
    {
      icon: '🕊️',
      name: 'The Peacemaker',
      description: 'Maintains harmony and prevents conflict through understanding.',
      color: '#87ceeb',
    },
    {
      icon: '💭',
      name: 'The Dreamer',
      description: 'Builds relationships around shared visions and creative possibilities.',
      color: '#dda0dd',
    },
    {
      icon: '⚡',
      name: 'The Rebel',
      description: 'Values authenticity and freedom, challenging conventional relationship norms.',
      color: '#ff8c00',
    },
    {
      icon: '💝',
      name: 'The Caregiver',
      description: 'Nurtures and supports, finding fulfillment in caring for others.',
      color: '#98fb98',
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

        {/* Features Section */}
        <section className={styles.features}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Revolutionary Assessment Experience</h2>
              <p className={styles.sectionSubtitle}>
                Our enhanced system combines travel psychology with advanced algorithms to provide
                comprehensive relationship insights
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

        {/* System Features */}
        <section className={styles.systemFeatures}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Advanced Technology</h2>
              <p className={styles.sectionSubtitle}>
                Built with cutting-edge algorithms and psychological insights
              </p>
            </div>

            <div className={styles.systemFeaturesGrid}>
              {systemFeatures.map(feature => (
                <Card key={feature.title} className={styles.systemFeatureCard} variant="outlined">
                  <div className={styles.systemFeatureIcon}>{feature.icon}</div>
                  <h3 className={styles.systemFeatureTitle}>{feature.title}</h3>
                  <p className={styles.systemFeatureDescription}>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Three-Part Results System */}
        <section className={styles.resultsSystem}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Comprehensive Three-Part Results</h2>
              <p className={styles.sectionSubtitle}>
                Your results span three integrated areas for complete relationship awareness
              </p>
            </div>

            <div className={styles.resultsGrid}>
              <Card className={styles.resultCard} variant="elevated">
                <div className={styles.resultIcon}>
                  <Brain size={32} />
                </div>
                <h3 className={styles.resultTitle}>Archetype Analysis</h3>
                <p className={styles.resultDescription}>
                  Detailed ranking of all 8 archetypes with confidence percentages, mathematical
                  proximity scores, and personalized insights into your relationship patterns.
                </p>
                <div className={styles.resultFeatures}>
                  <span className={styles.resultFeature}>• Mathematical ranking system</span>
                  <span className={styles.resultFeature}>• Confidence percentages</span>
                  <span className={styles.resultFeature}>• Detailed trait analysis</span>
                </div>
              </Card>

              <Card className={styles.resultCard} variant="elevated">
                <div className={styles.resultIcon}>
                  <Shield size={32} />
                </div>
                <h3 className={styles.resultTitle}>Vulnerability Assessment</h3>
                <p className={styles.resultDescription}>
                  Educational awareness of manipulation patterns specific to your personality type,
                  with 3-8 personalized persona cards and red flag recognition training.
                </p>
                <div className={styles.resultFeatures}>
                  <span className={styles.resultFeature}>• Personalized persona cards</span>
                  <span className={styles.resultFeature}>• Red flag recognition</span>
                  <span className={styles.resultFeature}>• Protection strategies</span>
                </div>
              </Card>

              <Card className={styles.resultCard} variant="elevated">
                <div className={styles.resultIcon}>
                  <Heart size={32} />
                </div>
                <h3 className={styles.resultTitle}>Attraction Patterns</h3>
                <p className={styles.resultDescription}>
                  Coming soon: Deep analysis of your attraction triggers, compatibility insights,
                  and relationship dynamics to help you build healthier connections.
                </p>
                <div className={styles.resultFeatures}>
                  <span className={styles.resultFeature}>• Attraction triggers</span>
                  <span className={styles.resultFeature}>• Compatibility insights</span>
                  <span className={styles.resultFeature}>• Relationship dynamics</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced Process */}
        <section className={styles.howItWorks}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How FIA Relationship Assessment Works</h2>
              <p className={styles.sectionSubtitle}>
                Advanced branching logic adapts to your responses for personalized insights
              </p>
            </div>

            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Dynamic Branching Scenarios</h3>
                  <p className={styles.stepDescription}>
                    Choose between London and Paris travel experiences. Your decisions create a
                    unique path through 20+ possible scenarios.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Mathematical Analysis</h3>
                  <p className={styles.stepDescription}>
                    Advanced algorithms calculate your proximity to all 8 archetypes using Euclidean
                    distance formulas for precise matching.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Personalized Results</h3>
                  <p className={styles.stepDescription}>
                    Receive comprehensive insights across three areas: archetypes, vulnerability
                    patterns, and attraction dynamics (coming soon).
                  </p>
                </div>
              </div>
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

export default AboutPage;
