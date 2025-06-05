// src/components/ui/Modal/Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlertTriangle, CheckCircle, Info, Settings, Heart } from 'lucide-react';
import React from 'react';
import { fn } from 'storybook/test';

import { Button } from '../Button';

import { Modal, ConfirmationModal, useModal } from './Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Modal component provides a flexible overlay system for displaying content above the main application. It includes comprehensive accessibility features, focus management, and multiple variants for different use cases.

## Features
- **Accessibility**: Full ARIA support, focus trapping, and keyboard navigation
- **Focus Management**: Automatic focus handling and restoration
- **Variants**: Default, confirmation, warning, error, success, and info styles
- **Sizes**: Multiple size options from small to fullscreen
- **Actions**: Primary and secondary action buttons with loading states
- **Responsive**: Mobile-optimized with slide-up animation
- **Customizable**: Flexible content area and extensive styling options

## Accessibility
- **ARIA Labels**: Proper modal, dialog, and button labeling
- **Focus Trap**: Keyboard navigation contained within modal
- **Escape Handling**: ESC key closes modal (configurable)
- **Screen Reader**: Descriptive content for assistive technologies
- **Backdrop**: Click-to-close functionality (configurable)

## Assessment Integration
Perfect for:
- Confirmation dialogs when leaving assessment
- Warning messages about losing progress
- Success notifications after completion
- Error handling and user feedback
- Settings and preferences overlays
- Information modals about archetypes

## Usage Patterns
- Import Modal for custom content
- Use ConfirmationModal for simple confirmations
- Leverage useModal hook for state management
- Combine with other components for complex interactions
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Whether the modal is currently open',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Size of the modal',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'confirmation', 'warning', 'error', 'success', 'info'],
      description: 'Visual variant of the modal',
    },
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Whether to show the X close button',
    },
    closeOnBackdropClick: {
      control: { type: 'boolean' },
      description: 'Whether clicking backdrop closes modal',
    },
    closeOnEscape: {
      control: { type: 'boolean' },
      description: 'Whether ESC key closes modal',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether modal is in loading state',
    },
    primaryActionDestructive: {
      control: { type: 'boolean' },
      description: 'Whether primary action is destructive',
    },
    primaryActionLoading: {
      control: { type: 'boolean' },
      description: 'Whether primary action is loading',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether to animate modal appearance',
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
    title: 'Modal Title',
    size: 'medium',
    variant: 'default',
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    isLoading: false,
    primaryActionDestructive: false,
    primaryActionLoading: false,
    animated: true,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <p>
          This is a basic modal with default styling. It can contain any content you need to display
          in an overlay.
        </p>
        <p>The modal is fully accessible with proper focus management and keyboard navigation.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default modal with basic content and standard styling.',
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    title: 'Confirm Your Action',
    primaryActionText: 'Confirm',
    secondaryActionText: 'Cancel',
    children: (
      <p>
        Are you sure you want to proceed with this action? This will save your current progress.
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with primary and secondary action buttons.',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    variant: 'warning',
    primaryActionText: 'Continue',
    secondaryActionText: 'Cancel',
    primaryActionDestructive: true,
    children: (
      <p>
        You are about to leave the assessment. Your progress will be lost if you haven&apos;t saved
        it. Are you sure you want to continue?
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning modal with destructive action styling.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    title: 'Error',
    variant: 'error',
    primaryActionText: 'Try Again',
    secondaryActionText: 'Cancel',
    children: (
      <div>
        <p>An error occurred while saving your assessment results.</p>
        <p>Please check your internet connection and try again.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error modal for handling failures and problems.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    title: 'Success!',
    variant: 'success',
    primaryActionText: 'View Results',
    children: (
      <div>
        <p>Your relationship assessment has been completed successfully!</p>
        <p>You can now view your detailed results and share them with your partner.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Success modal for positive confirmations and completions.',
      },
    },
  },
};

export const InfoModal: Story = {
  args: {
    title: 'About This Assessment',
    variant: 'info',
    primaryActionText: 'Got It',
    children: (
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>How It Works</h4>
        <p>This assessment uses travel scenarios to understand your relationship dynamics:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li>Answer 7 scenario-based questions</li>
          <li>Each choice reveals your decision-making style</li>
          <li>Get personalized insights about your relationship approach</li>
        </ul>
        <p>The assessment takes about 5-7 minutes to complete.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Info modal for educational content and explanations.',
      },
    },
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Relationship Settings',
    icon: <Settings size={24} />,
    primaryActionText: 'Save Changes',
    secondaryActionText: 'Cancel',
    children: (
      <div>
        <p>Customize your assessment experience:</p>
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" /> Save progress automatically
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" /> Share results with partner
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" /> Receive email notifications
          </label>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with custom icon in the header.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    title: 'Different Sizes',
    children: <p>This modal demonstrates different size options.</p>,
  },
  render: args => {
    const smallModal = useModal();
    const mediumModal = useModal();
    const largeModal = useModal();
    const fullscreenModal = useModal();

    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button onClick={smallModal.openModal}>Small Modal</Button>
        <Button onClick={mediumModal.openModal}>Medium Modal</Button>
        <Button onClick={largeModal.openModal}>Large Modal</Button>
        <Button onClick={fullscreenModal.openModal}>Fullscreen Modal</Button>

        <Modal
          {...args}
          isOpen={smallModal.isOpen}
          onClose={smallModal.closeModal}
          size="small"
          title="Small Modal"
        >
          <p>This is a small modal perfect for simple confirmations.</p>
        </Modal>

        <Modal
          {...args}
          isOpen={mediumModal.isOpen}
          onClose={mediumModal.closeModal}
          size="medium"
          title="Medium Modal"
        >
          <p>This is a medium modal suitable for most content.</p>
        </Modal>

        <Modal
          {...args}
          isOpen={largeModal.isOpen}
          onClose={largeModal.closeModal}
          size="large"
          title="Large Modal"
        >
          <div>
            <p>This is a large modal for extensive content.</p>
            <p>
              It provides more space for complex forms, detailed information, or rich media content.
            </p>
          </div>
        </Modal>

        <Modal
          {...args}
          isOpen={fullscreenModal.isOpen}
          onClose={fullscreenModal.closeModal}
          size="fullscreen"
          title="Fullscreen Modal"
        >
          <div>
            <p>This is a fullscreen modal that takes up most of the viewport.</p>
            <p>Perfect for immersive experiences or when you need maximum screen real estate.</p>
          </div>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of different modal sizes.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    title: 'Processing...',
    isLoading: true,
    showCloseButton: false,
    closeOnBackdropClick: false,
    closeOnEscape: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading modal that prevents user interaction while processing.',
      },
    },
  },
};

export const ActionLoading: Story = {
  args: {
    title: 'Save Assessment Results',
    primaryActionText: 'Save',
    secondaryActionText: 'Cancel',
    primaryActionLoading: true,
    children: <p>Your assessment results will be saved to your account for future reference.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal with loading state on the primary action button.',
      },
    },
  },
};

export const ConfirmationModalExample: Story = {
  render: () => {
    const modal = useModal();

    return (
      <div>
        <Button onClick={modal.openModal}>Delete Assessment</Button>
        <ConfirmationModal
          isOpen={modal.isOpen}
          onClose={modal.closeModal}
          title="Delete Assessment"
          message="Are you sure you want to delete this assessment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => console.log('Confirmed deletion')}
          isDestructive={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Convenience ConfirmationModal component for simple yes/no dialogs.',
      },
    },
  },
};

export const AssessmentExitWarning: Story = {
  render: () => {
    const modal = useModal();

    return (
      <div>
        <Button onClick={modal.openModal}>Leave Assessment</Button>
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.closeModal}
          title="Leave Assessment?"
          variant="warning"
          primaryActionText="Leave"
          secondaryActionText="Stay"
          primaryActionDestructive={true}
          onPrimaryAction={() => {
            console.log('User left assessment');
            modal.closeModal();
          }}
          onSecondaryAction={modal.closeModal}
        >
          <div>
            <p>You&apos;re about to leave the relationship assessment.</p>
            <p>
              <strong>Your progress will be saved</strong> and you can continue later from where you
              left off.
            </p>
            <p>Are you sure you want to leave?</p>
          </div>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Assessment-specific modal for handling user navigation away from the assessment.',
      },
    },
  },
};

export const ArchetypeInfoModal: Story = {
  render: () => {
    const modal = useModal();

    return (
      <div>
        <Button onClick={modal.openModal}>Learn About The Heartfelt Companion</Button>
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.closeModal}
          title="The Heartfelt Companion"
          variant="info"
          icon={<Heart size={24} />}
          size="large"
          primaryActionText="Start Assessment"
          secondaryActionText="Close"
          onPrimaryAction={() => {
            console.log('Starting assessment');
            modal.closeModal();
          }}
        >
          <div>
            <div style={{ textAlign: 'center', margin: '0 0 2rem 0' }}>
              <div style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>💝</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#87ceeb' }}>
                Connection-Focused Partner
              </h3>
            </div>

            <p>
              You prioritize emotional connection and togetherness above all else. Your
              partner&apos;s happiness is your happiness, and you create deep bonds through shared
              experiences.
            </p>

            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: '#2d3748' }}>Key Characteristics:</h4>
            <ul style={{ margin: '0 0 1.5rem 1.5rem', lineHeight: '1.6' }}>
              <li>Puts partner&apos;s feelings first</li>
              <li>Values shared experiences over individual adventures</li>
              <li>Creates emotional safety and connection</li>
              <li>Sacrifices personal preferences for relationship harmony</li>
              <li>Thrives on intimate moments and deep conversations</li>
            </ul>

            <p>
              If this sounds like you, take the assessment to see how you balance emotional
              connection with logical planning and adventurous exploration in your relationships.
            </p>
          </div>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed archetype information modal as it might appear in the assessment app.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    title: 'Mobile Modal',
    primaryActionText: 'Continue',
    secondaryActionText: 'Cancel',
    children: (
      <div>
        <p>
          This modal is optimized for mobile devices with slide-up animation and full-width action
          buttons.
        </p>
        <p>The layout adapts to smaller screens while maintaining usability.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized modal with slide-up animation and responsive layout.',
      },
    },
  },
};

export const UseModalHook: Story = {
  render: () => {
    const modal = useModal();

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={modal.openModal}>Open Modal</Button>
        <Button onClick={modal.toggleModal}>Toggle Modal</Button>
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.closeModal}
          title="useModal Hook Demo"
          primaryActionText="Close"
          onPrimaryAction={modal.closeModal}
        >
          <p>This modal is managed using the useModal hook for convenient state management.</p>
          <p>The hook provides openModal, closeModal, and toggleModal functions.</p>
        </Modal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of the useModal hook for managing modal state.',
      },
    },
  },
};
