// src/components/ui/AssessmentProgress/AssessmentProgress.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { fn } from 'storybook/test';

import { AssessmentProgress } from './AssessmentProgress';

// Sample step data
const sampleSteps = [
  {
    id: 1,
    title: 'Trip Planning',
    description: 'How do you decide on trip duration?',
    completed: true,
    current: false,
    accessible: true,
  },
  {
    id: 2,
    title: 'Destination Choice',
    description: 'What drives your destination decisions?',
    completed: true,
    current: false,
    accessible: true,
  },
  {
    id: 3,
    title: 'Travel Delays',
    description: 'How do you handle unexpected delays?',
    completed: false,
    current: true,
    accessible: true,
  },
  {
    id: 4,
    title: 'Solo Exploration',
    description: 'Your approach to independent activities',
    completed: false,
    current: false,
    accessible: false,
  },
  {
    id: 5,
    title: 'Communication',
    description: 'Staying connected during travel',
    completed: false,
    current: false,
    accessible: false,
  },
  {
    id: 6,
    title: 'Unexpected Moments',
    description: 'Handling spontaneous opportunities',
    completed: false,
    current: false,
    accessible: false,
  },
  {
    id: 7,
    title: 'Final Scenario',
    description: 'Balancing priorities and choices',
    completed: false,
    current: false,
    accessible: false,
  },
];

const customStepLabels = [
  'Welcome',
  'Personal Info',
  'Travel Style',
  'Decision Making',
  'Communication',
  'Adaptability',
  'Results',
];

const meta = {
  title: 'UI/AssessmentProgress',
  component: AssessmentProgress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The AssessmentProgress component provides comprehensive progress tracking and navigation for multi-step assessments. It displays current position, completion status, and provides intuitive navigation controls.

## Features
- **Visual Progress Tracking**: Progress bar with percentage and step indicators
- **Detailed Step Information**: Current step details with completion statistics
- **Interactive Navigation**: Previous/Next buttons with intelligent enabling/disabling
- **Step Indicators**: Clickable step dots showing completion status
- **Multiple Variants**: Default, compact, and detailed display modes
- **Flexible Positioning**: Top, bottom, or sidebar placement options
- **Assessment Theming**: Special styling for relationship and travel contexts

## Usage Context
- Assessment flow navigation and progress tracking
- Multi-step form completion indicators
- Wizard-style interface progress display
- User journey visualization and control
- Progress persistence and state management

## Assessment Integration
Specifically designed for the relationship assessment with:
- 7-step travel scenario progression
- Intelligent step accessibility (can't skip ahead)
- Completion tracking and statistics
- Restart functionality for retaking assessment
- Integration with assessment state management
        `,
      },
    },
  },
  argTypes: {
    currentStep: {
      control: { type: 'range', min: 1, max: 7, step: 1 },
      description: 'Current step number (1-based)',
    },
    totalSteps: {
      control: { type: 'range', min: 3, max: 10, step: 1 },
      description: 'Total number of steps',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Overall progress percentage',
    },
    showStepDetails: {
      control: { type: 'boolean' },
      description: 'Whether to show detailed step information',
    },
    showNavigation: {
      control: { type: 'boolean' },
      description: 'Whether to show navigation buttons',
    },
    canGoBack: {
      control: { type: 'boolean' },
      description: 'Whether previous button is enabled',
    },
    canGoNext: {
      control: { type: 'boolean' },
      description: 'Whether next button is enabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state for navigation',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the component',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'sidebar'],
      description: 'Position of the component',
    },
    showRestart: {
      control: { type: 'boolean' },
      description: 'Whether to show restart button',
    },
    assessmentType: {
      control: { type: 'select' },
      options: ['general', 'relationship', 'travel'],
      description: 'Assessment type for theming',
    },
  },
  args: {
    currentStep: 3,
    totalSteps: 7,
    progress: 43,
    showStepDetails: true,
    showNavigation: true,
    canGoBack: true,
    canGoNext: true,
    loading: false,
    variant: 'default',
    position: 'top',
    showRestart: false,
    assessmentType: 'relationship',
    onPrevious: fn(),
    onNext: fn(),
    onStepSelect: fn(),
    onRestart: fn(),
  },
} satisfies Meta<typeof AssessmentProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default assessment progress component showing current step, progress bar, and navigation controls.',
      },
    },
  },
};

export const WithCustomSteps: Story = {
  args: {
    steps: sampleSteps,
    currentStep: 3,
    progress: 43,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress component with custom step data including titles and descriptions.',
      },
    },
  },
};

export const Detailed: Story = {
  args: {
    variant: 'detailed',
    steps: sampleSteps,
    currentStep: 3,
    progress: 43,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Detailed variant showing step indicators, completion stats, and enhanced navigation.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    currentStep: 5,
    progress: 71,
    showStepDetails: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant with minimal space usage, perfect for mobile or sidebar placement.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    currentStep: 4,
    progress: 57,
    canGoNext: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress component in loading state while processing step transition.',
      },
    },
  },
};

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    progress: 14,
    canGoBack: false,
    stepLabels: customStepLabels,
  },
  parameters: {
    docs: {
      description: {
        story: 'First step state with disabled previous button and custom step labels.',
      },
    },
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 7,
    progress: 100,
    canGoNext: true,
    showRestart: true,
    stepLabels: customStepLabels,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Final step showing completion state with restart option and "Complete" button text.',
      },
    },
  },
};

export const WithRestart: Story = {
  args: {
    currentStep: 4,
    progress: 57,
    showRestart: true,
    variant: 'detailed',
    steps: sampleSteps,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress component with restart functionality for retaking the assessment.',
      },
    },
  },
};

export const Positions: Story = {
  args: {
    currentStep: 3,
    progress: 43,
    steps: sampleSteps.slice(0, 5),
    totalSteps: 5,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Top Position (Default)</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <AssessmentProgress {...args} position="top" />
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Bottom Position</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <AssessmentProgress {...args} position="bottom" />
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Sidebar Position</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            gap: '2rem',
          }}
        >
          <AssessmentProgress {...args} position="sidebar" variant="detailed" />
          <div
            style={{
              flex: 1,
              padding: '2rem',
              background: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#718096',
            }}
          >
            Main Content Area
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different positioning options for various layout contexts.',
      },
    },
  },
};

export const ProgressStates: Story = {
  args: {
    variant: 'detailed',
    stepLabels: customStepLabels,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Just Started (14%)</h4>
        <AssessmentProgress {...args} currentStep={1} progress={14} canGoBack={false} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Mid Progress (57%)</h4>
        <AssessmentProgress {...args} currentStep={4} progress={57} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Nearly Complete (86%)</h4>
        <AssessmentProgress {...args} currentStep={6} progress={86} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Completed (100%)</h4>
        <AssessmentProgress {...args} currentStep={7} progress={100} showRestart={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different progress states throughout the assessment journey.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    variant: 'detailed',
    steps: sampleSteps,
  },
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(3);
    const [loading, setLoading] = React.useState(false);

    const progress = Math.round((currentStep / 7) * 100);
    const canGoBack = currentStep > 1;
    const canGoNext = currentStep < 7;

    const handleNext = () => {
      if (canGoNext) {
        setLoading(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setLoading(false);
        }, 1000);
      }
    };

    const handlePrevious = () => {
      if (canGoBack) {
        setCurrentStep(prev => prev - 1);
      }
    };

    const handleStepSelect = (stepId: number) => {
      if (stepId <= currentStep) {
        setCurrentStep(stepId);
      }
    };

    const handleRestart = () => {
      setCurrentStep(1);
    };

    // Update step states based on current step
    const updatedSteps = sampleSteps.map(step => ({
      ...step,
      completed: step.id < currentStep,
      current: step.id === currentStep,
      accessible: step.id <= currentStep,
    }));

    return (
      <div>
        <AssessmentProgress
          currentStep={currentStep}
          totalSteps={7}
          progress={progress}
          steps={updatedSteps}
          variant="detailed"
          showStepDetails={true}
          showNavigation={true}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          loading={loading}
          showRestart={currentStep === 7}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepSelect={handleStepSelect}
          onRestart={handleRestart}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing real navigation behavior with loading states and step selection.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    variant: 'compact',
    currentStep: 3,
    progress: 43,
    showNavigation: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view with compact variant and touch-friendly navigation.',
      },
    },
  },
};

export const AssessmentThemes: Story = {
  args: {
    variant: 'detailed',
    currentStep: 4,
    progress: 57,
    stepLabels: [
      'Setup',
      'Travel Style',
      'Decision Making',
      'Communication',
      'Flexibility',
      'Values',
      'Results',
    ],
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Relationship Theme</h4>
        <AssessmentProgress {...args} assessmentType="relationship" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Travel Theme</h4>
        <AssessmentProgress {...args} assessmentType="travel" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>General Theme</h4>
        <AssessmentProgress {...args} assessmentType="general" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different theme variations for various assessment types.',
      },
    },
  },
};
