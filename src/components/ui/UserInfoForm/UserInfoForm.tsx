// src/components/ui/UserInfoForm/UserInfoForm.tsx
'use client';

import { User, Mail, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '../Button';
import { Card } from '../Card';

import styles from './UserInfoForm.module.scss';

export interface UserData {
  name: string;
  email?: string;
  consentToContact?: boolean;
  privacyConsent?: boolean;
}

export interface UserInfoFormProps {
  /** Initial user data */
  initialData?: Partial<UserData>;
  /** Callback when form is submitted */
  onSubmit: (userData: UserData) => void;
  /** Whether form is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether email is required */
  requireEmail?: boolean;
  /** Custom title for the form */
  title?: string;
  /** Custom description text */
  description?: string;
  /** Whether to show privacy consent checkbox */
  showPrivacyConsent?: boolean;
  /** Whether to show email consent checkbox */
  showEmailConsent?: boolean;
  /** Custom submit button text */
  submitText?: string;
  /** Form variant */
  variant?: 'default' | 'minimal' | 'welcome';
  /** Error message */
  error: string | null;
  /** Whether to auto-focus the name field */
  autoFocus?: boolean;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({
  initialData = {},
  onSubmit,
  loading = false,
  className = '',
  requireEmail = false,
  title = 'Welcome to Your Relationship Assessment',
  description = 'We need just a few details to personalize your experience and share your results.',
  showPrivacyConsent = true,
  showEmailConsent = true,
  submitText = 'Start Assessment',
  variant = 'default',
  error,
  autoFocus = true,
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: initialData.name ?? '',
    email: initialData.email ?? '',
    consentToContact: initialData.consentToContact ?? false,
    privacyConsent: initialData.privacyConsent ?? false,
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UserData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserData, boolean>>>({});

  console.log('unused', autoFocus);

  const validateField = (field: keyof UserData, value: string | boolean): string => {
    switch (field) {
      case 'name':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          return 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (requireEmail && (!value || typeof value !== 'string' || value.trim() === '')) {
          return 'Email is required';
        }
        if (value && typeof value === 'string' && value.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address';
          }
        }
        break;
      case 'privacyConsent':
        if (showPrivacyConsent && !value) {
          return 'You must accept the privacy policy to continue';
        }
        break;
    }
    return '';
  };

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof UserData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const value = formData[field] ?? (typeof formData[field] === 'boolean' ? false : '');
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UserData, string>> = {};
    let isValid = true;

    // Validate all fields
    (Object.keys(formData) as (keyof UserData)[]).forEach(field => {
      const value = formData[field] ?? (typeof formData[field] === 'boolean' ? false : '');
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setFieldErrors(errors);
    setTouched({
      name: true,
      email: true,
      privacyConsent: showPrivacyConsent,
      consentToContact: showEmailConsent,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formClasses = [
    styles.userInfoForm,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasErrors = Object.values(fieldErrors).some(error => error !== '');
  const isFormValid =
    formData.name.trim().length >= 2 &&
    (!requireEmail || (formData.email && formData.email.trim() !== '')) &&
    (!showPrivacyConsent || formData.privacyConsent) &&
    !hasErrors;

  return (
    <Card className={formClasses} variant="elevated">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Heart size={32} className={styles.headerIcon} />
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <div className={styles.fields}>
          {/* Name Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              <User size={16} />
              Name *
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.input} ${fieldErrors.name && touched.name ? styles.inputError : ''}`}
              placeholder="Enter your first name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              disabled={loading}
              // autoFocus={autoFocus}
              autoComplete="given-name"
              required
            />
            {fieldErrors.name && touched.name && (
              <span className={styles.fieldError}>{fieldErrors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={16} />
              Email {requireEmail ? '*' : '(Optional)'}
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${fieldErrors.email && touched.email ? styles.inputError : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={loading}
              autoComplete="email"
              required={requireEmail}
            />
            {fieldErrors.email && touched.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
            {!requireEmail && (
              <span className={styles.fieldHint}>We&apos;ll email your results if provided</span>
            )}
          </div>
        </div>

        {/* Consent Checkboxes */}
        {(showEmailConsent || showPrivacyConsent) && (
          <div className={styles.consents}>
            {showEmailConsent && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.consentToContact}
                  onChange={e => handleInputChange('consentToContact', e.target.checked)}
                  disabled={loading}
                />
                <span className={styles.checkboxText}>
                  I&apos;d like to receive my results and relationship insights via email
                </span>
              </label>
            )}

            {showPrivacyConsent && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={`${styles.checkbox} ${fieldErrors.privacyConsent && touched.privacyConsent ? styles.checkboxError : ''}`}
                  checked={formData.privacyConsent}
                  onChange={e => handleInputChange('privacyConsent', e.target.checked)}
                  onBlur={() => handleBlur('privacyConsent')}
                  disabled={loading}
                  required
                />
                <span className={styles.checkboxText}>
                  I agree to the{' '}
                  <a href="/privacy" target="_blank" className={styles.link}>
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" target="_blank" className={styles.link}>
                    Terms of Service
                  </a>{' '}
                  *
                </span>
              </label>
            )}
            {fieldErrors.privacyConsent && touched.privacyConsent && (
              <span className={styles.fieldError}>{fieldErrors.privacyConsent}</span>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <Button
            type="submit"
            variant="cta"
            size="large"
            loading={loading}
            disabled={!isFormValid || loading}
            className={styles.submitButton}
          >
            {submitText}
            {!loading && <ArrowRight size={20} />}
          </Button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Your information is secure and will only be used for this assessment.
          </p>
        </div>
      </form>
    </Card>
  );
};

// Default export for easier importing
export default UserInfoForm;
