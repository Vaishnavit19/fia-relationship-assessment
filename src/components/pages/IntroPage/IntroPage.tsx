'use client';

// src/components/pages/IntroPage/IntroPage.tsx
// ==========================================================================
// INTRO PAGE - TRAVEL STORY INTRODUCTION
// ==========================================================================

import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import React from 'react';

import Card from '@/components/ui/Card';
import PageLayout from '@/components/ui/PageLayout';

import styles from './IntroPage.module.scss';

interface IntroPageProps {
  className?: string;
  /** Callback when quiz is started */
  onClick: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ className = '', onClick }) => {
  // const router = useRouter();

  const handleStartAssessment = () => {
    onClick();
  };

  return (
    <div className={`${styles.introPage} ${className}`}>
      <div className={styles.container}>
        {/* Final CTA */}
        <div className={styles.finalCta}>
          <div className={styles.airportIcon}>✈️</div>
          <h2 className={styles.ctaQuestion}>Who do you become when you travel?</h2>
          <p className={styles.ctaSubtitle}>
            Discover your relationship style through the choices you make on your journey
          </p>
          <button className={styles.ctaButton} onClick={handleStartAssessment} type="button">
            <span>✈️</span>
            Let&apos;s Find Out
          </button>
        </div>
        <Card className={styles.introContainer}>
          {/* <div className={styles.introContainer}> */}
          {/* <div className={styles.cardBadge}>✈️ Your Journey Begins</div> */}
          <h1 className={styles.cardTitle}>The airport is buzzing</h1>
          <p className={styles.cardText}>
            Golden hour light streams through massive windows. Two boarding passes in hand, your
            heart races with anticipation. You&apos;re stepping into a story.
          </p>
          {/* </div> */}
        </Card>
        <div className={styles.storyGrid}>
          {/* Hero Card - Spans 2 columns */}
          {/* <div className={`${styles.storyCard} ${styles.heroCard}`}>
              <div className={styles.cardImage}>
                <Image
                  width={432}
                  height={432}
                  src="/images/intro/departures.webp"
                  alt="Airport departures scene with golden hour lighting"
                  className={styles.imageBackground}
                />
              </div>
              <div className={styles.cardOverlay}>
                <div className={styles.cardBadge}>✈️ Your Journey Begins</div>
                <h1 className={styles.cardTitle}>
                  The airport is <span className={styles.highlightText}>buzzing</span>
                </h1>
                <p className={styles.cardText}>
                  Golden hour light streams through massive windows. Two boarding passes in hand,
                  your heart races with anticipation. You&apos;re stepping into a story.
                </p>
              </div>
            </div> */}

          {/* Square Card 1: Departures */}
          <div className={styles.storyCard}>
            <div className={styles.cardImage}>
              <Image
                width={432}
                height={432}
                src="/images/intro/departures.webp"
                alt="Airport departures board"
                className={styles.imageBackground}
              />
            </div>
            <div className={styles.cardOverlay}>
              <div className={styles.cardBadge}>🎫 The Choice</div>
              <h2 className={styles.cardTitle}>Every journey begins</h2>
              <p className={styles.cardText}>
                Travelers rush past with rolling suitcases, each heading toward their own adventure.
              </p>
            </div>
          </div>

          {/* Square Card 2: Arrivals */}
          <div className={styles.storyCard}>
            <div className={styles.cardImage}>
              <Image
                width={432}
                height={432}
                src="/images/intro/arrivals.webp"
                alt="Airport arrivals terminal"
                className={styles.imageBackground}
              />
            </div>
            <div className={styles.cardOverlay}>
              <div className={styles.cardBadge}>🌍 New Destinations</div>
              <h2 className={styles.cardTitle}>Where will you land?</h2>
              <p className={styles.cardText}>
                Each destination promises to reveal something different about who you become.
              </p>
            </div>
          </div>

          {/* Square Card 3: London */}
          <div className={styles.storyCard}>
            <div className={styles.cardImage}>
              <Image
                width={432}
                height={432}
                src="/images/intro/london.webp"
                alt="London skyline with Big Ben"
                className={styles.imageBackground}
              />
            </div>
            <div className={styles.cardOverlay}>
              <div className={styles.cardBadge}>✨ London Awaits</div>
              <h2 className={styles.cardTitle}>Royal heritage calls</h2>
              <p className={styles.cardText}>
                Big Ben&apos;s chimes echo across the Thames. History&apos;s grandeur or hidden pub
                conversations?
              </p>
            </div>
          </div>

          {/* Square Card 4: Paris */}
          <div className={styles.storyCard}>
            <div className={styles.cardImage}>
              <img
                src="/images/intro/paris.webp"
                alt="Paris skyline with Eiffel Tower"
                className={styles.imageBackground}
              />
            </div>
            <div className={styles.cardOverlay}>
              <div className={styles.cardBadge}>💫 Bonjour Paris!</div>
              <h2 className={styles.cardTitle}>City of Light beckons</h2>
              <p className={styles.cardText}>
                The Eiffel Tower sparkles as evening falls. Romance or authentic local experience?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
