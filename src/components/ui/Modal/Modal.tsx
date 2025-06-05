/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// src/components/ui/Modal/Modal.tsx
'use client';

import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

import { Button } from '../Button';
import { Card } from '../Card';

import styles from './Modal.module.scss';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler for closing the modal */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children?: React.ReactNode;
  /** Modal size */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Modal variant */
  variant?: 'default' | 'confirmation' | 'warning' | 'error' | 'success' | 'info';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing escape closes modal */
  closeOnEscape?: boolean;
  /** Custom close button aria label */
  closeButtonLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether modal is loading */
  isLoading?: boolean;
  /** Primary action button text */
  primaryActionText?: string;
  /** Primary action handler */
  onPrimaryAction?: () => void;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Secondary action handler */
  onSecondaryAction?: () => void;
  /** Whether primary action is destructive */
  primaryActionDestructive?: boolean;
  /** Whether primary action is loading */
  primaryActionLoading?: boolean;
  /** Icon to display in modal header */
  icon?: React.ReactNode;
  /** Whether to animate modal appearance */
  animated?: boolean;
  /** Z-index for modal */
  zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  closeButtonLabel = 'Close modal',
  className = '',
  isLoading = false,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  primaryActionDestructive = false,
  primaryActionLoading = false,
  icon,
  animated = true,
  zIndex = 1000,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the modal
      const modalElement = modalRef.current;
      if (modalElement) {
        modalElement.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const modalElement = modalRef.current;
      if (!modalElement) return;

      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryAction = () => {
    if (onPrimaryAction && !primaryActionLoading) {
      onPrimaryAction();
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction && !primaryActionLoading) {
      onSecondaryAction();
    }
  };

  // Get variant icon
  const getVariantIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'warning':
        return <AlertTriangle size={24} />;
      case 'error':
        return <AlertCircle size={24} />;
      case 'success':
        return <CheckCircle size={24} />;
      case 'info':
        return <Info size={24} />;
      default:
        return null;
    }
  };

  const modalClasses = [
    styles.modal,
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    animated && styles.animated,
    isLoading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby="modal-content"
    >
      <div className={modalClasses} ref={modalRef} tabIndex={-1} role="document">
        <Card className={styles.modalCard} variant="elevated">
          {/* Header */}
          {((title ?? showCloseButton) || getVariantIcon()) && (
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {getVariantIcon() && <div className={styles.iconContainer}>{getVariantIcon()}</div>}
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label={closeButtonLabel}
                  disabled={isLoading}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div id="modal-content" className={styles.content}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <p className={styles.loadingText}>Loading...</p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Actions */}
          {(primaryActionText ?? secondaryActionText) && !isLoading && (
            <div className={styles.actions}>
              {secondaryActionText && (
                <Button
                  variant="secondary"
                  onClick={handleSecondaryAction}
                  disabled={primaryActionLoading}
                  className={styles.secondaryAction}
                >
                  {secondaryActionText}
                </Button>
              )}

              {primaryActionText && (
                <Button
                  variant={primaryActionDestructive ? 'secondary' : 'primary'}
                  onClick={handlePrimaryAction}
                  disabled={primaryActionLoading}
                  className={styles.primaryAction}
                >
                  {primaryActionLoading ? 'Loading...' : primaryActionText}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// Convenience hook for modal state management
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

// Confirmation modal convenience component
export interface ConfirmationModalProps extends Omit<ModalProps, 'variant' | 'children'> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
  onClose,
  ...modalProps
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      {...modalProps}
      variant={isDestructive ? 'warning' : 'confirmation'}
      onClose={onClose}
      primaryActionText={confirmText}
      onPrimaryAction={handleConfirm}
      secondaryActionText={cancelText}
      onSecondaryAction={handleCancel}
      primaryActionDestructive={isDestructive}
      size="small"
    >
      <p className={styles.confirmationMessage}>{message}</p>
    </Modal>
  );
};

// Default export for easier importing
export default Modal;
