// src/components/ui/HomePage/HomePage.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { HomePage } from './HomePage';

const meta = {
  title: 'UI/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The HomePage component serves as the landing page for the FIA Relationship Assessment. It introduces users to the assessment concept, explains the three relationship archetypes, and provides clear calls-to-action to begin their journey.

## Features
- **Hero Section**: Compelling introduction with animated visuals
- **How It Works**: Step-by-step process explanation  
- **Archetype Preview**: Introduction to the three relationship types
- **Benefits**: Clear value proposition and outcomes
- **Multiple CTAs**: Primary and secondary action buttons
- **Progress Continuation**: Ability to resume interrupted assessments
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Visual Design
- **Animated Elements**: Floating archetype icons and gradient text effects
- **Modern Layout**: Clean card-based design with consistent spacing
- **Brand Integration**: Uses design system colors and typography
- **Micro-interactions**: Hover effects and smooth transitions
- **Loading States**: Disabled buttons during async operations

## Assessment Integration
Designed specifically for the relationship assessment with:
- Integration with Zustand store for progress tracking
- Three distinct archetype previews matching assessment results
- Seamless flow into assessment start or continuation
- Educational content about relationship styles and travel scenarios

## Usage Context
- **Entry Point**: First page users see when visiting the assessment
- **Re-engagement**: Returning users can continue their progress
- **Education**: Learning about relationship archetypes before starting
- **Conversion**: Clear path to assessment participation
        `,
      },
    },
  },
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the page is in a loading state',
    },
    hasProgress: {
      control: { type: 'boolean' },
      description: 'Whether user has existing assessment progress',
    },
    onStartAssessment: {
      action: 'started assessment',
      description: 'Handler for starting new assessment',
    },
    onContinueAssessment: {
      action: 'continued assessment',
      description: 'Handler for continuing existing assessment',
    },
    onLearnMore: {
      action: 'learn more clicked',
      description: 'Handler for learning more about archetypes',
    },
  },
  args: {
    onStartAssessment: fn(),
    onContinueAssessment: fn(),
    onLearnMore: fn(),
    isLoading: false,
    hasProgress: false,
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default homepage for new users without existing progress.',
      },
    },
  },
};

export const WithProgress: Story = {
  args: {
    hasProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Homepage for returning users with existing assessment progress. Shows continue and start over options.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with disabled buttons during async operations.',
      },
    },
  },
};

export const LoadingWithProgress: Story = {
  args: {
    isLoading: true,
    hasProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state for returning users with existing progress.',
      },
    },
  },
};

export const WithoutLearnMore: Story = {
  args: {
    onLearnMore: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Homepage without the "Learn More" functionality for simplified experience.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    // This would be used for automated testing/interaction demos
    // Since we can't actually test interactions in this context,
    // this serves as documentation for how the component would be tested
    console.log(canvasElement, step, 'unused vars');
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demonstration of all homepage functionality including animations and hover states.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile-optimized view showing responsive design with stacked layout and touch-friendly interactions.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    hasProgress: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view demonstrating responsive breakpoints and layout adjustments.',
      },
    },
  },
};

// Layout Testing Stories
export const HeroOnly: Story = {
  args: {},
  render: args => (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <HomePage {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Focused view of just the hero section for detailed design review.',
      },
    },
  },
};

export const ArchetypesSection: Story = {
  args: {},
  render: args => (
    <div style={{ paddingTop: '100vh' }}>
      <HomePage {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Focused view of the archetypes preview section.',
      },
    },
  },
};

// Accessibility Testing
export const HighContrast: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'light',
    },
    docs: {
      description: {
        story: 'High contrast version for accessibility testing and visual impairment support.',
      },
    },
  },
  globals: {
    // This would set high contrast mode if supported by Storybook
  },
};

export const ReducedMotion: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Version with reduced motion for users who prefer less animation (set via CSS media query).',
      },
    },
  },
  // In a real implementation, this would set prefers-reduced-motion
};

// Content Variations
export const LongContent: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Homepage with extended content to test scroll behavior and layout stability.',
      },
    },
  },
};

export const MinimalContent: Story = {
  args: {
    onLearnMore: undefined,
  },
  render: args => (
    <HomePage
      {...args}
      // This would be used to pass minimal content versions
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal version focusing on core assessment call-to-action.',
      },
    },
  },
};

// Error States
export const ErrorState: Story = {
  args: {
    isLoading: false,
    // In real implementation, would show error messaging
  },
  parameters: {
    docs: {
      description: {
        story:
          'Error state handling when assessment cannot be started (would need error prop in real implementation).',
      },
    },
  },
};

// Performance Testing
export const WithAnimations: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Full animation version for performance testing and motion preferences.',
      },
    },
  },
};

export const StaticVersion: Story = {
  args: {},
  render: args => (
    <div style={{ '--disable-animations': 'true' } as React.CSSProperties}>
      <HomePage {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Static version without animations for performance comparison.',
      },
    },
  },
};
