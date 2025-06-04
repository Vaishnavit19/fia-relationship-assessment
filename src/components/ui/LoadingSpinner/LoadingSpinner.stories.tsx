// src/components/ui/LoadingSpinner/LoadingSpinner.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';
import { Card } from '../Card';
import { Button } from '../Button';

const meta = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# LoadingSpinner Component

A versatile loading indicator component with multiple animation types, sizes, and color variants for the FIA Relationship Assessment.

## Features
- **Four animation types**: Spinner, Dots, Pulse, and Bars
- **Four sizes**: Small, Medium, Large, and XLarge
- **Four color variants**: Primary, Secondary, Accent, and White
- **Text support**: Optional loading text with the spinner
- **Overlay mode**: Full-screen or container overlay options
- **Accessibility**: Proper ARIA labels and reduced motion support

## Usage
Perfect for indicating loading states during assessment transitions, form submissions, and data processing.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
      description: 'Size of the loading spinner',
      table: {
        defaultValue: { summary: 'medium' },
        type: { summary: 'small | medium | large | xlarge' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'white'],
      description: 'Color variant of the spinner',
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | secondary | accent | white' },
      },
    },
    type: {
      control: 'select',
      options: ['spinner', 'dots', 'pulse', 'bars'],
      description: 'Animation type of the loading indicator',
      table: {
        defaultValue: { summary: 'spinner' },
        type: { summary: 'spinner | dots | pulse | bars' },
      },
    },
    text: {
      control: 'text',
      description: 'Optional text to display below the spinner',
      table: {
        type: { summary: 'string' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'Centers the spinner in its container',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    overlay: {
      control: 'boolean',
      description: 'Shows as a full-screen overlay',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Types
export const Spinner: Story = {
  args: {
    type: 'spinner',
  },
  parameters: {
    docs: {
      description: {
        story: 'Classic rotating spinner using Lucide React icon with smooth rotation animation.',
      },
    },
  },
};

export const Dots: Story = {
  args: {
    type: 'dots',
  },
  parameters: {
    docs: {
      description: {
        story: 'Three bouncing dots animation with staggered timing for a playful loading effect.',
      },
    },
  },
};

export const Pulse: Story = {
  args: {
    type: 'pulse',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pulsing circle animation with expanding ring effect for subtle loading indication.',
      },
    },
  },
};

export const Bars: Story = {
  args: {
    type: 'bars',
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated bars with varying heights creating a rhythm-like loading pattern.',
      },
    },
  },
};

// Size Variants
export const Small: Story = {
  args: {
    size: 'small',
    text: 'Loading...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size perfect for inline loading states or compact areas.',
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    text: 'Processing your answer...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size - the default for most loading scenarios.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    text: 'Calculating your results...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size for prominent loading states and important processes.',
      },
    },
  },
};

export const XLarge: Story = {
  args: {
    size: 'xlarge',
    text: 'Generating your relationship profile...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Extra large size for major loading states like assessment completion.',
      },
    },
  },
};

// Color Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    text: 'Primary color variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary color variant matching the main accent color of the application.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'Secondary color variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary color variant using the secondary accent color.',
      },
    },
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    text: 'Accent color variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accent color variant using the success/emotional accent color.',
      },
    },
  },
};

export const White: Story = {
  args: {
    variant: 'white',
    text: 'White color variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'White variant perfect for dark backgrounds or colored overlays.',
      },
    },
    backgrounds: { default: 'dark' },
  },
};

// Text Examples
export const WithText: Story = {
  args: {
    text: 'Loading your assessment...',
    size: 'large',
  },
  parameters: {
    docs: {
      description: {
        story: 'Spinner with descriptive text for better user experience and context.',
      },
    },
  },
};

export const WithoutText: Story = {
  args: {
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple spinner without text for minimal loading indication.',
      },
    },
  },
};

// Layout Examples
export const Centered: Story = {
  args: {
    centered: true,
    text: 'Centered in container',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Centered spinner that fills and centers within its container.',
      },
    },
  },
};

export const InlineSpinner: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span>Processing</span>
      <LoadingSpinner size="small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline spinner for use within text or alongside other content.',
      },
    },
  },
};

// Assessment-Specific Examples
export const AssessmentStarting: Story = {
  args: {
    size: 'large',
    text: 'Preparing your assessment...',
    type: 'pulse',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Loading state when starting the assessment.',
      },
    },
  },
};

export const CalculatingResults: Story = {
  args: {
    size: 'xlarge',
    text: 'Analyzing your responses...',
    type: 'spinner',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Major loading state when calculating final results.',
      },
    },
  },
};

export const QuestionTransition: Story = {
  args: {
    size: 'medium',
    text: 'Loading next question...',
    type: 'dots',
    variant: 'accent',
  },
  parameters: {
    docs: {
      description: {
        story: '**Assessment Example**: Quick loading between assessment questions.',
      },
    },
  },
};

// Interactive Examples
export const InCard: Story = {
  render: () => (
    <Card size="large" padding="large">
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner 
          size="large" 
          text="Loading your relationship insights..." 
          type="pulse"
        />
      </div>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner inside a card component for contained loading states.',
      },
    },
  },
};

export const WithButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <Button loading>Processing Answer...</Button>
      <LoadingSpinner text="Please wait while we save your response" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner used alongside button loading states for comprehensive feedback.',
      },
    },
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '30px', textAlign: 'center' }}>
      <div>
        <LoadingSpinner type="spinner" />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>Spinner</p>
      </div>
      <div>
        <LoadingSpinner type="dots" />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>Dots</p>
      </div>
      <div>
        <LoadingSpinner type="pulse" />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>Pulse</p>
      </div>
      <div>
        <LoadingSpinner type="bars" />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>Bars</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All four animation types displayed for easy comparison and selection.',
      },
    },
  },
};

export const AssessmentFlow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', maxWidth: '400px' }}>
      <Card padding="large" style={{ width: '100%', textAlign: 'center' }}>
        <LoadingSpinner 
          size="large" 
          text="Starting your journey..." 
          type="pulse"
          variant="primary"
        />
      </Card>
      
      <Card padding="large" style={{ width: '100%', textAlign: 'center' }}>
        <LoadingSpinner 
          size="medium" 
          text="Loading question 3 of 7..." 
          type="dots"
          variant="accent"
        />
      </Card>
      
      <Card padding="large" style={{ width: '100%', textAlign: 'center' }}>
        <LoadingSpinner 
          size="xlarge" 
          text="Calculating your relationship style..." 
          type="spinner"
          variant="secondary"
        />
      </Card>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: '**Complete Assessment Flow**: Different loading states throughout the assessment journey.',
      },
    },
  },
};