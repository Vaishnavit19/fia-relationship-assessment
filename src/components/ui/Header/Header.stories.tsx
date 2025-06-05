// src/components/ui/Header/Header.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';

import Header from './Header';
import { HeaderStorybook } from './Header.storybook';

const meta = {
  title: 'UI/Header',
  component: HeaderStorybook,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Header component provides navigation and branding for the assessment application. It intelligently shows progress during assessments and adapts its layout based on the current page context.

## Features
- **Responsive Design**: Adapts from desktop to mobile with appropriate navigation
- **Assessment Integration**: Shows progress bar when in assessment mode
- **Smart Navigation**: Context-aware back button and navigation links
- **Accessibility**: Full keyboard navigation and screen reader support
- **Flexible Layout**: Can be fixed or static positioning

## Usage Context
- Used across all pages as the primary navigation
- Integrates with Zustand store for assessment progress
- Automatically detects assessment state and current route

## Storybook Note
This version is specifically designed for Storybook without Next.js router dependencies.
        `,
      },
    },
  },
  argTypes: {
    showProgress: {
      control: { type: 'select' },
      options: [true, false, 'auto'],
      description: 'Whether to show the assessment progress bar',
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    showBackButton: {
      control: { type: 'boolean' },
      description: 'Whether to show the back button instead of logo',
    },
    fixed: {
      control: { type: 'boolean' },
      description: 'Whether to use fixed positioning',
    },
    title: {
      control: { type: 'text' },
      description: 'Custom title to override default branding',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Progress value for Storybook',
    },
    isStarted: {
      control: { type: 'boolean' },
      description: 'Assessment started state',
    },
    isComplete: {
      control: { type: 'boolean' },
      description: 'Assessment complete state',
    },
    pathname: {
      control: { type: 'text' },
      description: 'Current pathname',
    },
  },
  args: {
    showProgress: 'auto',
    showBackButton: false,
    fixed: false,
    className: '',
    progress: 0,
    isStarted: false,
    isComplete: false,
    pathname: '/',
  },
} satisfies Meta<typeof HeaderStorybook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default header state shown on the homepage and general pages.',
      },
    },
  },
};

export const WithBackButton: Story = {
  args: {
    showBackButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with back button shown during assessment navigation.',
      },
    },
  },
};

export const WithProgress: Story = {
  args: {
    showProgress: true,
    progress: 65,
    isStarted: true,
    isComplete: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header showing assessment progress. The progress bar includes a subtle shimmer animation.',
      },
    },
  },
};

export const AssessmentInProgress: Story = {
  args: {
    showBackButton: true,
    showProgress: true,
    progress: 45,
    isStarted: true,
    isComplete: false,
    pathname: '/assessment',
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete assessment header with both back button and progress display.',
      },
    },
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Travel Compatibility Quiz',
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with custom title override for specific contexts.',
      },
    },
  },
};

export const Fixed: Story = {
  args: {
    fixed: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fixed positioning header that stays at the top during scroll. Includes shadow for depth.',
      },
    },
  },
};

export const ProgressStates: Story = {
  args: {
    showProgress: true,
    progress: 60,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Just Started (15%)</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <HeaderStorybook {...args} progress={15} isStarted={true} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Mid Progress (45%)</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <HeaderStorybook {...args} progress={45} isStarted={true} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Nearly Complete (85%)</h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <HeaderStorybook {...args} progress={85} isStarted={true} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different progress states showing how the progress bar fills during assessment completion.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  args: {
    showBackButton: true,
    showProgress: true,
    progress: 60,
    isStarted: true,
    pathname: '/assessment',
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Desktop View</h3>
        <div
          style={{
            width: '1200px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Header {...args} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Tablet View</h3>
        <div
          style={{
            width: '768px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Header {...args} />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Mobile View</h3>
        <div
          style={{
            width: '375px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Header {...args} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Responsive behavior across different screen sizes. Note how text labels hide on mobile and touch targets remain accessible.',
      },
    },
  },
};
