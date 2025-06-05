// src/components/ui/UserInfoForm/UserInfoForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from '@storybook/test';

import { UserInfoForm } from './UserInfoForm';

const meta = {
  title: 'UI/UserInfoForm',
  component: UserInfoForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The UserInfoForm component handles initial user data collection before the assessment begins. It provides a clean, accessible interface for gathering essential information and user consents.

## Features
- **Clean Interface**: Welcoming design with clear visual hierarchy
- **Comprehensive Validation**: Real-time validation with user-friendly error messages
- **Flexible Configuration**: Optional fields, consent checkboxes, and customizable content
- **Accessibility**: Full keyboard navigation, screen reader support, and proper labeling
- **Responsive Design**: Optimized for all screen sizes with touch-friendly inputs
- **Privacy Focused**: Built-in consent management and privacy policy integration

## Usage Context
- First step in the assessment flow
- User onboarding and data collection
- Lead generation with optional email capture
- Consent management for privacy compliance
- Personalization setup

## Assessment Integration
The component integrates with the assessment flow by:
- Collecting user name for personalized results
- Optional email for results delivery
- Consent tracking for privacy compliance
- Smooth transition to assessment questions
- State management integration ready
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Custom title for the form',
    },
    description: {
      control: { type: 'text' },
      description: 'Description text explaining the form purpose',
    },
    requireEmail: {
      control: { type: 'boolean' },
      description: 'Whether email field is required',
    },
    showPrivacyConsent: {
      control: { type: 'boolean' },
      description: 'Whether to show privacy consent checkbox',
    },
    showEmailConsent: {
      control: { type: 'boolean' },
      description: 'Whether to show email consent checkbox',
    },
    submitText: {
      control: { type: 'text' },
      description: 'Text for the submit button',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'welcome'],
      description: 'Visual variant of the form',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether form is in loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message to display',
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Whether to auto-focus the name field',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    title: 'Welcome to Your Relationship Assessment',
    description: 'We need just a few details to personalize your experience and share your results.',
    requireEmail: false,
    showPrivacyConsent: true,
    showEmailConsent: true,
    submitText: 'Start Assessment',
    variant: 'default',
    loading: false,
    autoFocus: true,
    onSubmit: fn(),
  },
} satisfies Meta<typeof UserInfoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default user info form with optional email and consent checkboxes.',
      },
    },
  },
};

export const RequiredEmail: Story = {
  args: {
    requireEmail: true,
    title: 'Create Your Assessment Profile',
    description: 'Please provide your name and email to receive your personalized relationship insights.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with required email field for result delivery.',
      },
    },
  },
};

export const MinimalVariant: Story = {
  args: {
    variant: 'minimal',
    title: 'Quick Setup',
    description: 'Just your name to get started.',
    showEmailConsent: false,
    showPrivacyConsent: false,
    submitText: 'Continue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal variant with reduced visual elements and no consent checkboxes.',
      },
    },
  },
};

export const WelcomeVariant: Story = {
  args: {
    variant: 'welcome',
    title: 'Discover Your Relationship Style',
    description: 'Take our comprehensive assessment to understand how you and your partner navigate relationships together.',
    submitText: 'Begin Journey',
  },
  parameters: {
    docs: {
      description: {
        story: 'Welcome variant with enhanced styling for landing page use.',
      },
    },
  },
};

export const WithInitialData: Story = {
  args: {
    initialData: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      consentToContact: true,
    },
    title: 'Complete Your Profile',
    description: 'Please review and complete your information.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Form pre-populated with initial data for editing or completion.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    submitText: 'Creating Profile...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Form in loading state after submission.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    error: 'Unable to create profile. Please check your information and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Form displaying a general error message.',
      },
    },
  },
};

export const NoConsents: Story = {
  args: {
    showPrivacyConsent: false,
    showEmailConsent: false,
    title: 'Assessment Setup',
    description: 'Enter your details to begin the relationship assessment.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Form without any consent checkboxes for simple data collection.',
      },
    },
  },
};

export const CustomContent: Story = {
  args: {
    title: 'Join Our Research Study',
    description: 'Help us understand relationship dynamics by participating in our comprehensive travel scenario assessment.',
    submitText: 'Join Study',
    requireEmail: true,
    showEmailConsent: false,
    showPrivacyConsent: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with custom content for research or study participation.',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {},
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h3 style={{ margin: '0 0 2rem 0', color: '#2d3748', textAlign: 'center' }}>Default Variant</h3>
        <UserInfoForm {...args} />
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 2rem 0', color: '#2d3748', textAlign: 'center' }}>Minimal Variant</h3>
        <UserInfoForm 
          {...args} 
          variant="minimal"
          title="Quick Setup"
          description="Just your name to get started."
          showEmailConsent={false}
          showPrivacyConsent={false}
        />
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 2rem 0', color: '#2d3748', textAlign: 'center' }}>Welcome Variant</h3>
        <UserInfoForm 
          {...args} 
          variant="welcome"
          title="Discover Your Style"
          description="Begin your relationship journey with us."
          submitText="Begin Journey"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All form variants displayed together for comparison.',
      },
    },
  },
};

export const ValidationDemo: Story = {
  args: {
    title: 'Form Validation Example',
    description: 'Try submitting without filling required fields to see validation in action.',
    requireEmail: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing form validation behavior and error states.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    title: 'Mobile Experience',
    description: 'Optimized for touch interaction and small screens.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Form optimized for mobile devices with touch-friendly inputs.',
      },
    },
  },
};