// ==========================================================================
// ASSESSMENT PAGE ORCHESTRATOR COMPONENT
// ==========================================================================

// src/components/pages/AssessmentPage/AssessmentPage.tsx
'use client';

import { ArrowLeft, ArrowRight, Home, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import AssessmentProgress from '@/components/ui/AssessmentProgress';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import NavigationControls from '@/components/ui/NavigationControls';
import OptionButton from '@/components/ui/OptionButton';
import PageLayout from '@/components/ui/PageLayout';
import QuestionCard from '@/components/ui/QuestionCard';
import UserInfoForm from '@/components/ui/UserInfoForm';
import { getScenarioById } from '@/lib/data';
import { useAssessmentPage } from '@/lib/store';
import type { AnswerOption, UserData } from '@/lib/types';

import styles from './AssessmentPage.module.scss';

export const AssessmentPage: React.FC = () => {
  const router = useRouter();
  const {
    isStarted,
    isComplete,
    userData,
    currentScenario,
    currentQuestion,
    progress,
    answers,
    setUserData,
    startAssessment,
    addAnswer,
    goToNextScenario,
    goToPreviousQuestion,
    canGoBack,
    resetAssessment,
  } = useAssessmentPage();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle assessment completion
  useEffect(() => {
    if (isComplete) {
      router.push('/results');
    }
  }, [isComplete, router]);

  // Load current question when scenario changes
  useEffect(() => {
    if (isStarted && !currentQuestion && currentScenario) {
      const question = getScenarioById(currentScenario);
      if (!question) {
        setError('Question not found. Please restart the assessment.');
      }
    }
  }, [isStarted, currentQuestion, currentScenario]);

  // Handle user registration
  const handleUserSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for user registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserData(data);
      startAssessment();

      // Log user data for backend integration
      console.log('User registered:', data);
    } catch (err) {
      setError('Failed to start assessment. Please try again.');
      console.error('User registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (option: AnswerOption) => {
    if (isLoading) return;

    setSelectedOption(option);
    setError(null);
  };

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (!selectedOption || !currentQuestion || isLoading) return;

    setIsLoading(true);

    try {
      // Add answer to store
      addAnswer(currentQuestion.id, selectedOption);

      // Log answer for backend integration
      console.log('Answer submitted:', {
        scenarioId: currentQuestion.id,
        selectedOption,
        timestamp: new Date(),
      });

      // Navigate to next question
      goToNextScenario(selectedOption.next);

      // Reset selection for next question
      setSelectedOption(null);
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error('Answer submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle going back
  const handleGoBack = () => {
    if (canGoBack()) {
      goToPreviousQuestion();
      setSelectedOption(null);
      setError(null);
    }
  };

  // Handle exit confirmation
  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = () => {
    resetAssessment();
    router.push('/');
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  // Error state
  if (error && !currentQuestion) {
    return (
      <PageLayout>
        <div className={styles.errorContainer}>
          <Card variant="elevated" className={styles.errorCard}>
            <div className={styles.errorContent}>
              <AlertCircle size={48} className={styles.errorIcon} />
              <h2 className={styles.errorTitle}>Something went wrong</h2>
              <p className={styles.errorMessage}>{error}</p>
              <div className={styles.errorActions}>
                <Button variant="cta" onClick={() => router.push('/')}>
                  Return Home
                </Button>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className={styles.assessmentPage}>
        {/* Progress Bar */}
        {isStarted && (
          <div className={styles.progressContainer}>
            <AssessmentProgress
              currentStep={answers.length + 1}
              totalSteps={7}
              progress={progress}
              canGoBack={canGoBack()}
              onPrevious={handleGoBack}
              onRestart={handleExit}
              showRestart={true}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={styles.content}>
          {!isStarted ? (
            // User Registration Form
            <div className={styles.registrationSection}>
              <Card variant="elevated" className={styles.registrationCard}>
                <div className={styles.registrationHeader}>
                  <h1 className={styles.registrationTitle}>Let&apos;s Get Started</h1>
                  <p className={styles.registrationSubtitle}>
                    Tell us a bit about yourself to personalize your assessment experience.
                  </p>
                </div>

                <UserInfoForm
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={handleUserSubmit}
                  loading={isLoading}
                  error={error}
                />
              </Card>
            </div>
          ) : currentQuestion ? (
            // Assessment Question
            <div className={styles.questionSection}>
              <div className={styles.questionContainer}>
                <QuestionCard
                  question={currentQuestion.text}
                  options={currentQuestion.options.map(option => ({
                    letter: option.letter,
                    text: option.text,
                    selected: selectedOption?.letter === option.letter,
                    disabled: isLoading,
                  }))}
                  selectedOption={selectedOption?.letter}
                  onOptionSelect={(optionLetter: string) => {
                    const option = currentQuestion.options.find(opt => opt.letter === optionLetter);
                    if (option) handleAnswerSelect(option);
                  }}
                  onContinue={handleAnswerSubmit}
                  showContinue={!!selectedOption}
                  continueText="Continue"
                  loading={isLoading}
                  questionNumber={answers.length + 1}
                  totalQuestions={7}
                  className={styles.questionCard}
                  error={error}
                />

                {/* Answer Options */}
                {/* <div className={styles.optionsContainer}>
                  {currentQuestion.options.map(option => (
                    <OptionButton
                      key={option.letter}
                      // option={option}
                      selected={selectedOption?.letter === option.letter}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isLoading}
                      className={styles.optionButton}
                      text={'dunno what text'}
                    />
                  ))}
                </div> */}

                {/* Error Display */}
                {error && (
                  <div className={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className={styles.navigationContainer}>
                  <NavigationControls
                    canGoBack={canGoBack()}
                    canGoNext={!!selectedOption}
                    onPrevious={handleGoBack}
                    onNext={handleAnswerSubmit}
                    nextLoading={isLoading}
                    previousLoading={isLoading}
                    nextText="Continue"
                  />
                </div>
              </div>

              {/* Question Info Sidebar */}
              <div className={styles.sidebar}>
                <Card className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Your Progress</h3>
                  <div className={styles.progressStats}>
                    <div className={styles.progressStat}>
                      <strong>{answers.length + 1}</strong>
                      <span>of 7 questions</span>
                    </div>
                    <div className={styles.progressStat}>
                      <strong>{Math.round(progress)}%</strong>
                      <span>complete</span>
                    </div>
                  </div>
                </Card>

                <Card className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>About This Assessment</h3>
                  <p className={styles.infoText}>
                    Each scenario reveals how you approach relationships through decision-making,
                    communication, and problem-solving in travel situations.
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            // Loading State
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="large" />
              <p className={styles.loadingText}>Preparing your assessment...</p>
            </div>
          )}
        </div>

        {/* Exit Confirmation Modal */}
        <Modal
          isOpen={showExitModal}
          onClose={handleExitCancel}
          title="Exit Assessment?"
          className={styles.exitModal}
        >
          <div className={styles.exitModalContent}>
            <p className={styles.exitModalText}>
              Are you sure you want to exit? Your progress will be lost and you&apos;ll need to
              start over.
            </p>
            <div className={styles.exitModalActions}>
              <Button variant="secondary" onClick={handleExitCancel}>
                Continue Assessment
              </Button>
              <Button variant="primary" onClick={handleExitConfirm}>
                <Home size={16} />
                Exit to Home
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default AssessmentPage;
