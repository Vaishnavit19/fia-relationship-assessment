// src/components/ui/ProgressBar/ProgressBar.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ProgressBar component provides visual feedback for assessment completion and multi-step processes. It supports various display modes and assessment-specific styling.

## Features
- **Flexible Progress Display**: Percentage, steps, or custom labels
- **Assessment Integration**: Special variants for emotional, logical, and exploratory scores
- **Step Indicators**: Visual dots showing progress through multi-step flows
- **Responsive Design**: Adapts to different screen sizes and contexts
- **Accessibility**: Full ARIA support and screen reader compatibility
- **Animations**: Optional shimmer effect and smooth transitions

## Usage Context
- Assessment progress tracking throughout the evaluation
- Multi-step form progression
- Score visualization in results
- Loading states and completion feedback

## Assessment Integration
The component includes special variants that match the assessment's three scoring dimensions:
- **Emotional**: Light blue gradient matching heartfelt companion archetype
- **Logical**: Purple gradient matching strategic navigator archetype  
- **Exploratory**: Yellow gradient matching spontaneous explorer archetype
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Current progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1, max: 200, step: 1 },
      description: 'Maximum value (defaults to 100)',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Show percentage text display',
    },
    showSteps: {
      control: { type: 'boolean' },
      description: 'Show step indicators and step count',
    },
    currentStep: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Current step number',
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Total number of steps',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Progress bar size variant',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'emotional', 'logical', 'exploratory'],
      description: 'Color variant including assessment-specific options',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Show animated shimmer effect',
    },
    color: {
      control: { type: 'color' },
      description: 'Custom color override',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    value: 45,
    max: 100,
    showPercentage: false,
    showSteps: false,
    size: 'medium',
    variant: 'primary',
    animated: true,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic progress bar with default styling and no additional text.',
      },
    },
  },
};

export const WithPercentage: Story = {
  args: {
    value: 67,
    showPercentage: true,
    label: 'Assessment Progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with percentage display and accessible label.',
      },
    },
  },
};

export const WithSteps: Story = {
  args: {
    value: 60,
    showSteps: true,
    currentStep: 3,
    totalSteps: 5,
    label: 'Question Progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with step indicators showing current position in a multi-step process.',
      },
    },
  },
};

export const AssessmentProgress: Story = {
  args: {
    value: 43,
    showPercentage: true,
    showSteps: true,
    currentStep: 3,
    totalSteps: 7,
    label: 'Assessment Completion',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete assessment progress display with both percentage and step indicators.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    value: 75,
    showPercentage: true,
    label: 'Size Demonstration',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Small</h4>
        <ProgressBar {...args} size="small" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Medium</h4>
        <ProgressBar {...args} size="medium" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Large</h4>
        <ProgressBar {...args} size="large" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants of the progress bar for various UI contexts.',
      },
    },
  },
};

export const AssessmentVariants: Story = {
  args: {
    value: 80,
    showPercentage: true,
    animated: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>💝 Emotional Score</h4>
        <ProgressBar {...args} variant="emotional" label="Heartfelt Companion traits" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>🧠 Logical Score</h4>
        <ProgressBar {...args} variant="logical" label="Strategic Navigator traits" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>🌟 Exploratory Score</h4>
        <ProgressBar {...args} variant="exploratory" label="Spontaneous Explorer traits" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Assessment-specific color variants matching the three relationship archetypes.',
      },
    },
  },
};

export const ColorVariants: Story = {
  args: {
    value: 60,
    showPercentage: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ProgressBar {...args} variant="primary" label="Primary" />
      <ProgressBar {...args} variant="success" label="Success" />
      <ProgressBar {...args} variant="warning" label="Warning" />
      <ProgressBar {...args} color="#e53e3e" label="Custom Red" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variants including custom color override option.',
      },
    },
  },
};

export const StepProgression: Story = {
  args: {
    showSteps: true,
    totalSteps: 7,
    showPercentage: true,
    label: 'Assessment Questions',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Step 1 of 7</h4>
        <ProgressBar {...args} value={14} currentStep={1} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Step 3 of 7</h4>
        <ProgressBar {...args} value={43} currentStep={3} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Step 5 of 7</h4>
        <ProgressBar {...args} value={71} currentStep={5} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Complete!</h4>
        <ProgressBar {...args} value={100} currentStep={7} variant="success" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progression through assessment steps showing how step indicators update.',
      },
    },
  },
};

export const NoAnimation: Story = {
  args: {
    value: 75,
    showPercentage: true,
    animated: false,
    label: 'Static Progress Bar',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar without animations for reduced motion preferences or static displays.',
      },
    },
  },
};

export const CustomMaxValue: Story = {
  args: {
    value: 6,
    max: 10,
    showPercentage: true,
    label: 'Custom Scale (0-10)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with custom maximum value, useful for scores or custom scales.',
      },
    },
  },
};