// src/components/pages/AuthPage/AuthPage.tsx
'use client';

import { ArrowLeft, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import PageLayout from '@/components/ui/PageLayout';
import UserInfoForm from '@/components/ui/UserInfoForm';
import useEnhancedAssessmentStore from '@/lib/store';
import type { UserData } from '@/lib/types';

import styles from './AuthPage.module.scss';

export interface AuthPageProps {
  /** Custom styling */
  className?: string;
  /** Callback after successful authentication */
  onAuthSuccess?: (userData: UserData) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ className = '', onAuthSuccess }) => {
  const router = useRouter();
  const { setUserData } = useEnhancedAssessmentStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle going back to home
  const handleBackToHome = () => {
    router.push('/');
  };

  // Handle user registration/authentication
  const handleUserSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call for user registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data in global state
      setUserData(data);

      // Show success state briefly
      setSuccess(true);

      // Log user data for backend integration
      console.log('User registered:', data);

      // Call callback if provided
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }

      // Navigate to assessment after brief success display
      setTimeout(() => {
        router.push('/assessment');
      }, 500);
    } catch (err) {
      setError('Failed to start assessment. Please try again.');
      console.error('User registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={`${styles.authPage} ${className}`}>
        {/* Header with back button */}
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className={styles.backButton}
            disabled={isLoading}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </div>

        {/* Main content card */}
        <Card className={styles.authCard}>
          {/* Progress indicator */}
          <div className={styles.progressSection}>
            <div className={styles.progressIndicator}>
              <div className={`${styles.step} ${styles.active}`}>1</div>
              <div className={styles.progressLine}></div>
              <div className={styles.step}>2</div>
              <div className={styles.progressLine}></div>
              <div className={styles.step}>3</div>
            </div>
            <p className={styles.progressText}>Step 1 of 3 - Getting Started</p>
          </div>

          {/* Success message */}
          {success && (
            <div className={styles.successMessage}>
              <CheckCircle size={20} />
              <span>Welcome! Redirecting to your assessment...</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* User Info Form */}
          <UserInfoForm
            onSubmit={handleUserSubmit}
            loading={isLoading}
            error={error}
            title="Welcome to Your Relationship Assessment"
            description="We need just a few details to personalize your experience and share your results with you."
            submitText="Start Assessment"
            variant="welcome"
            autoFocus={true}
            requireEmail={false}
            showPrivacyConsent={true}
            showEmailConsent={true}
            className={styles.userForm}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <LoadingSpinner size="lg" />
              <p>Setting up your personalized assessment...</p>
            </div>
          )}
        </Card>

        {/* Footer info */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            <Heart size={16} />
            Your privacy is important to us. We use your information only to personalize your
            assessment experience.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuthPage;
