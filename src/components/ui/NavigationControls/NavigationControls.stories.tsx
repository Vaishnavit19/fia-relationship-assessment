// src/components/ui/NavigationControls/NavigationControls.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { fn } from 'storybook/test';

import {
  NavigationControls,
  createRestartAction,
  createHomeAction,
  createSaveAction,
} from './NavigationControls';

const meta = {
  title: 'UI/NavigationControls',
  component: NavigationControls,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The NavigationControls component provides flexible navigation buttons and actions for multi-step processes, assessments, forms, and wizards. It offers intelligent button states, keyboard shortcuts, and contextual styling.

## Features
- **Flexible Button Layout**: Previous, next, and custom action buttons with intelligent positioning
- **Context Awareness**: Different styling and behavior for assessments, forms, wizards, and general use
- **Keyboard Shortcuts**: Optional arrow key navigation with visual indicators
- **Custom Actions**: Support for additional buttons like restart, home, save progress
- **Responsive Design**: Adapts to mobile with touch-friendly buttons and stacked layouts
- **Smart Button States**: Automatic text changes based on position (first, middle, last)
- **Multiple Variants**: Default, compact, spaced, and minimal layouts

## Usage Context
- Assessment question navigation
- Multi-step form progression
- Wizard-style interfaces
- Page-to-page navigation
- Progress-based workflows

## Assessment Integration
Specifically designed for the relationship assessment with:
- Question-to-question navigation
- Completion-aware button text ("Complete Assessment")
- Progress information display
- Restart and home actions
- Integration with assessment state
        `,
      },
    },
  },
  argTypes: {
    showPrevious: {
      control: { type: 'boolean' },
      description: 'Whether to show the previous button',
    },
    showNext: {
      control: { type: 'boolean' },
      description: 'Whether to show the next button',
    },
    canGoBack: {
      control: { type: 'boolean' },
      description: 'Whether the previous button is enabled',
    },
    canGoNext: {
      control: { type: 'boolean' },
      description: 'Whether the next button is enabled',
    },
    nextLoading: {
      control: { type: 'boolean' },
      description: 'Loading state for the next button',
    },
    previousLoading: {
      control: { type: 'boolean' },
      description: 'Loading state for the previous button',
    },
    previousText: {
      control: { type: 'text' },
      description: 'Custom text for the previous button',
    },
    nextText: {
      control: { type: 'text' },
      description: 'Custom text for the next button',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'spaced', 'minimal'],
      description: 'Layout variant of the controls',
    },
    alignment: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'space-between'],
      description: 'Alignment of the navigation controls',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the navigation buttons',
    },
    iconStyle: {
      control: { type: 'select' },
      options: ['chevron', 'arrow', 'skip'],
      description: 'Style of navigation icons',
    },
    context: {
      control: { type: 'select' },
      options: ['assessment', 'form', 'wizard', 'general'],
      description: 'Context for styling and behavior',
    },
    position: {
      control: { type: 'select' },
      options: ['first', 'middle', 'last'],
      description: 'Position in the flow for smart button text',
    },
    showShortcuts: {
      control: { type: 'boolean' },
      description: 'Whether to show keyboard shortcuts',
    },
  },
  args: {
    showPrevious: true,
    showNext: true,
    canGoBack: true,
    canGoNext: true,
    nextLoading: false,
    previousLoading: false,
    variant: 'default',
    alignment: 'space-between',
    size: 'medium',
    iconStyle: 'chevron',
    context: 'general',
    position: 'middle',
    showShortcuts: false,
    onPrevious: fn(),
    onNext: fn(),
  },
} satisfies Meta<typeof NavigationControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default navigation controls with previous and next buttons.',
      },
    },
  },
};

export const AssessmentContext: Story = {
  args: {
    context: 'assessment',
    position: 'middle',
    progressInfo: {
      current: 3,
      total: 7,
    },
    previousText: 'Previous Question',
    nextText: 'Next Question',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation controls styled for assessment context with progress information.',
      },
    },
  },
};

export const FirstStep: Story = {
  args: {
    context: 'assessment',
    position: 'first',
    canGoBack: false,
    showShortcuts: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'First step navigation with disabled previous button and keyboard shortcuts.',
      },
    },
  },
};

export const LastStep: Story = {
  args: {
    context: 'assessment',
    position: 'last',
    nextText: 'Complete Assessment',
    progressInfo: {
      current: 7,
      total: 7,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Final step navigation with completion-style next button.',
      },
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    context: 'assessment',
    customActions: [createRestartAction(fn()), createSaveAction(fn(), true, false)],
    progressInfo: {
      current: 4,
      total: 7,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation with custom actions like restart and save progress.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    nextLoading: true,
    canGoNext: false,
    context: 'assessment',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation controls in loading state during step transition.',
      },
    },
  },
};

export const Variants: Story = {
  args: {
    context: 'assessment',
    progressInfo: { current: 3, total: 7 },
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Default</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} variant="default" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Compact</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} variant="compact" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Spaced</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} variant="spaced" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Minimal</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} variant="minimal" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different layout variants for various spacing and density needs.',
      },
    },
  },
};

export const Alignments: Story = {
  args: {
    size: 'medium',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Space Between (Default)</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} alignment="space-between" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Left Aligned</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} alignment="left" showNext={false} />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Center Aligned</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls
            {...args}
            alignment="center"
            showPrevious={false}
            showNext={false}
            customActions={[createSaveAction(fn(), true)]}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Right Aligned</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} alignment="right" showPrevious={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different alignment options for various layout requirements.',
      },
    },
  },
};

export const IconStyles: Story = {
  args: {
    showShortcuts: true,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Chevron Icons</h4>
        <NavigationControls {...args} iconStyle="chevron" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Arrow Icons</h4>
        <NavigationControls {...args} iconStyle="arrow" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Skip Icons</h4>
        <NavigationControls {...args} iconStyle="skip" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different icon styles for navigation buttons with keyboard shortcuts.',
      },
    },
  },
};

export const Contexts: Story = {
  args: {
    progressInfo: { current: 2, total: 5 },
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Assessment Context</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} context="assessment" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Form Context</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} context="form" position="last" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Wizard Context</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} context="wizard" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>General Context</h4>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <NavigationControls {...args} context="general" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different context styles for various use cases and applications.',
      },
    },
  },
};

export const KeyboardShortcuts: Story = {
  args: {
    showShortcuts: true,
    context: 'assessment',
    progressInfo: { current: 3, total: 7 },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Navigation controls with keyboard shortcuts enabled. Use arrow keys to navigate (when not focused on input fields).',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {},
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const totalSteps = 7;

    const handleNext = () => {
      if (currentStep < totalSteps) {
        setLoading(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setLoading(false);
        }, 1000);
      }
    };

    const handlePrevious = () => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    };

    const handleRestart = () => {
      setCurrentStep(1);
    };

    const getPosition = () => {
      if (currentStep === 1) return 'first';
      if (currentStep === totalSteps) return 'last';
      return 'middle';
    };

    return (
      <div>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
            Assessment Question {currentStep}
          </h3>
          <p style={{ margin: 0, color: '#718096' }}>
            This is a demo of interactive navigation controls.
          </p>
        </div>

        <NavigationControls
          context="assessment"
          position={getPosition()}
          canGoBack={currentStep > 1}
          canGoNext={currentStep <= totalSteps}
          nextLoading={loading}
          showShortcuts={true}
          progressInfo={{
            current: currentStep,
            total: totalSteps,
          }}
          customActions={[createRestartAction(handleRestart, currentStep > 1)]}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing real navigation behavior with state management and loading states.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    context: 'assessment',
    variant: 'compact',
    progressInfo: { current: 3, total: 7 },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized navigation controls with touch-friendly buttons.',
      },
    },
  },
};
